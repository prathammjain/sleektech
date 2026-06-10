// Shared entity + status types for the admin dashboard.

export type ApplicationStatus = "new" | "reviewing" | "accepted" | "rejected";
export type LeadStatus = "new" | "contacted" | "qualified" | "won" | "lost";
export type ClientStatus = "active" | "paused" | "churned";
export type ProjectStatus =
  | "discovery"
  | "building"
  | "review"
  | "shipped"
  | "on_hold";
export type DeliverableStatus = "todo" | "in_progress" | "blocked" | "done";
export type CallStatus = "scheduled" | "completed" | "cancelled" | "no_show";

export type Application = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  role: string | null;
  linkedin: string | null;
  github: string | null;
  shipped: string | null;
  message: string | null;
  resume_url: string | null;
  status: ApplicationStatus;
  notes: string | null;
};

export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  email: string | null;
  phone: string | null;
  need: string | null;
  message: string | null;
  status: LeadStatus;
  notes: string | null;
};

export type Client = {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  company: string | null;
  contact: string | null;
  status: ClientStatus;
  lead_id: string | null;
  notes: string | null;
};

export type Project = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  client_id: string | null;
  status: ProjectStatus;
  start_date: string | null;
  due_date: string | null;
  notes: string | null;
};

export type Deliverable = {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  project_id: string | null;
  status: DeliverableStatus;
  due_date: string | null;
  notes: string | null;
};

export type Call = {
  id: string;
  created_at: string;
  updated_at: string;
  client_id: string | null;
  scheduled_at: string | null;
  purpose: string | null;
  outcome: string | null;
  status: CallStatus;
  notes: string | null;
};

// Admin entities that expose a PATCH-able status, keyed by URL segment.
export const STATUS_OPTIONS = {
  applications: ["new", "reviewing", "accepted", "rejected"],
  leads: ["new", "contacted", "qualified", "won", "lost"],
  clients: ["active", "paused", "churned"],
  projects: ["discovery", "building", "review", "shipped", "on_hold"],
  deliverables: ["todo", "in_progress", "blocked", "done"],
  calls: ["scheduled", "completed", "cancelled", "no_show"],
} as const;

export type AdminEntity = keyof typeof STATUS_OPTIONS;
