import { LeadModel } from "@/models/Lead";
import { USER_ROLES } from "@/types";

export const canAccessLead = async ({
  userId,
  role,
  leadId,
}: {
  userId: string;
  role: "admin" | "agent";
  leadId: string;
}) => {
  if (role === USER_ROLES.ADMIN) {
    return true;
  }

  const lead = await LeadModel.findById(leadId).select("assignedTo");
  if (!lead?.assignedTo) {
    return false;
  }

  return lead.assignedTo.toString() === userId;
};
