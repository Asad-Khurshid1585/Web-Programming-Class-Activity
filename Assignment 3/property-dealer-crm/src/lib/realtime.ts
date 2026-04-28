type RealtimeEvent = {
  id: string;
  type: "lead_created" | "lead_updated" | "lead_assigned" | "priority_changed";
  leadId: string;
  createdAt: string;
  message: string;
};

const globalStore = globalThis as typeof globalThis & {
  crmEvents?: RealtimeEvent[];
};

const events = globalStore.crmEvents || [];
globalStore.crmEvents = events;

export const publishEvent = (event: Omit<RealtimeEvent, "id" | "createdAt">) => {
  const next: RealtimeEvent = {
    ...event,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  events.push(next);

  if (events.length > 100) {
    events.shift();
  }

  return next;
};

export const getEventsSince = (since: string | null) => {
  if (!since) {
    return events.slice(-20);
  }

  const sinceTime = new Date(since).getTime();
  if (Number.isNaN(sinceTime)) {
    return events.slice(-20);
  }

  return events.filter((event) => new Date(event.createdAt).getTime() > sinceTime);
};
