import { LEAD_PRIORITY, type LeadPriority } from "@/types";

export const getLeadPriority = (budget: number): LeadPriority => {
  if (budget > 20_000_000) {
    return LEAD_PRIORITY.HIGH;
  }

  if (budget >= 10_000_000) {
    return LEAD_PRIORITY.MEDIUM;
  }

  return LEAD_PRIORITY.LOW;
};
