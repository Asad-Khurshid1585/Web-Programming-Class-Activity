import { ActivityLogModel } from "@/models/ActivityLog";
import type { ActivityType } from "@/types";

export const logLeadActivity = async ({
  leadId,
  actorId,
  type,
  description,
  metadata,
}: {
  leadId: string;
  actorId: string;
  type: ActivityType;
  description: string;
  metadata?: Record<string, unknown>;
}) => {
  return ActivityLogModel.create({
    leadId,
    actorId,
    type,
    description,
    metadata: metadata || {},
  });
};
