import { NextRequest } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { apiSuccess } from "@/lib/api";
import { applyRoleRateLimit, requireRole } from "@/lib/request-helpers";
import { USER_ROLES } from "@/types";
import { LeadModel } from "@/models/Lead";

export async function GET(request: NextRequest) {
  const auth = requireRole(request, [USER_ROLES.ADMIN]);
  if (!auth.payload) {
    return auth.error;
  }

  const rateErr = applyRoleRateLimit({
    request,
    role: auth.payload.role,
    userId: auth.payload.sub,
  });
  if (rateErr) {
    return rateErr;
  }

  await connectToDatabase();

  const [totalLeads, statusDistribution, priorityDistribution, agentPerformance] =
    await Promise.all([
      LeadModel.countDocuments(),
      LeadModel.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      LeadModel.aggregate([
        { $group: { _id: "$score", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
      ]),
      LeadModel.aggregate([
        {
          $match: {
            assignedTo: { $ne: null },
          },
        },
        {
          $group: {
            _id: {
              agent: "$assignedTo",
              status: "$status",
            },
            count: { $sum: 1 },
          },
        },
        {
          $group: {
            _id: "$_id.agent",
            totalHandled: { $sum: "$count" },
            statuses: {
              $push: {
                status: "$_id.status",
                count: "$count",
              },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "agent",
          },
        },
        {
          $project: {
            _id: 0,
            agentId: "$_id",
            totalHandled: 1,
            statuses: 1,
            agentName: { $arrayElemAt: ["$agent.name", 0] },
            agentEmail: { $arrayElemAt: ["$agent.email", 0] },
          },
        },
        {
          $sort: {
            totalHandled: -1,
          },
        },
      ]),
    ]);

  return apiSuccess({
    totalLeads,
    statusDistribution: statusDistribution.map((item) => ({
      status: item._id,
      count: item.count,
    })),
    priorityDistribution: priorityDistribution.map((item) => ({
      priority: item._id,
      count: item.count,
    })),
    agentPerformance: agentPerformance.map((item) => ({
      ...item,
      agentId: item.agentId.toString(),
    })),
  });
}
