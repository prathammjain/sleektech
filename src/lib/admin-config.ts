import { STATUS_OPTIONS, type AdminEntity } from "./types";

/**
 * Single source of truth for the admin dashboard. Each entity declares its
 * fields once; the table, the search/filter bar, the create/edit drawer and
 * the API write-whitelist are all derived from this config.
 */

export type FieldType =
  | "text"
  | "textarea"
  | "email"
  | "tel"
  | "url"
  | "date"
  | "datetime"
  | "select"
  | "relation";

export type FieldConfig = {
  key: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  relation?: AdminEntity;
  required?: boolean;
  table?: boolean; // show as a table column
  badge?: boolean; // status-style pill
  link?: boolean; // render value as an external link
  clamp?: boolean; // truncate long text in the table
  readOnly?: boolean; // never editable, never written
  placeholder?: string;
};

export type EntityConfig = {
  entity: AdminEntity;
  label: string; // plural
  singular: string;
  blurb: string;
  creatable: boolean;
  orderBy: string;
  statusKey?: string;
  searchKeys: string[];
  relations: AdminEntity[];
  fields: FieldConfig[];
};

const leads: EntityConfig = {
  entity: "leads",
  label: "Leads",
  singular: "Lead",
  blurb: "Project briefs and enquiries.",
  creatable: true,
  orderBy: "created_at",
  statusKey: "status",
  searchKeys: ["name", "email", "phone", "need", "message"],
  relations: [],
  fields: [
    { key: "name", label: "Name", type: "text", required: true, table: true },
    { key: "email", label: "Email", type: "email", table: true },
    { key: "phone", label: "Phone", type: "tel" },
    {
      key: "need",
      label: "Need",
      type: "select",
      options: ["automation", "website", "software", "other", "unsure"],
      table: true,
    },
    { key: "message", label: "Message", type: "textarea" },
    { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS.leads, badge: true, table: true },
    { key: "notes", label: "Internal notes", type: "textarea" },
    { key: "created_at", label: "Received", type: "datetime", readOnly: true, table: true },
  ],
};

const applications: EntityConfig = {
  entity: "applications",
  label: "Applications",
  singular: "Application",
  blurb: "Engineers applying to the collective.",
  creatable: false,
  orderBy: "created_at",
  statusKey: "status",
  searchKeys: ["name", "role", "github", "shipped", "message"],
  relations: [],
  fields: [
    { key: "name", label: "Name", type: "text", required: true, table: true },
    { key: "role", label: "Role", type: "select", options: ["fullstack", "ai", "devops", "other"], table: true },
    { key: "github", label: "GitHub", type: "url", link: true, table: true },
    { key: "linkedin", label: "LinkedIn", type: "url", link: true },
    { key: "shipped", label: "Shipped", type: "text", clamp: true },
    { key: "message", label: "Message", type: "textarea" },
    { key: "resume_url", label: "Resume", type: "text", readOnly: true },
    { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS.applications, badge: true, table: true },
    { key: "notes", label: "Internal notes", type: "textarea" },
    { key: "created_at", label: "Applied", type: "datetime", readOnly: true, table: true },
  ],
};

const clients: EntityConfig = {
  entity: "clients",
  label: "Clients",
  singular: "Client",
  blurb: "Companies you are building for.",
  creatable: true,
  orderBy: "created_at",
  statusKey: "status",
  searchKeys: ["name", "company", "contact"],
  relations: [],
  fields: [
    { key: "name", label: "Name", type: "text", required: true, table: true },
    { key: "company", label: "Company", type: "text", table: true },
    { key: "contact", label: "Contact", type: "text", table: true, placeholder: "email / phone" },
    { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS.clients, badge: true, table: true },
    { key: "notes", label: "Internal notes", type: "textarea" },
    { key: "created_at", label: "Since", type: "datetime", readOnly: true, table: true },
  ],
};

const projects: EntityConfig = {
  entity: "projects",
  label: "Projects",
  singular: "Project",
  blurb: "Active and upcoming builds.",
  creatable: true,
  orderBy: "created_at",
  statusKey: "status",
  searchKeys: ["title"],
  relations: ["clients"],
  fields: [
    { key: "title", label: "Project", type: "text", required: true, table: true },
    { key: "client_id", label: "Client", type: "relation", relation: "clients", table: true },
    { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS.projects, badge: true, table: true },
    { key: "start_date", label: "Start", type: "date", table: true },
    { key: "due_date", label: "Due", type: "date", table: true },
    { key: "notes", label: "Internal notes", type: "textarea" },
  ],
};

const deliverables: EntityConfig = {
  entity: "deliverables",
  label: "Deliverables",
  singular: "Deliverable",
  blurb: "Line items across every project.",
  creatable: true,
  orderBy: "created_at",
  statusKey: "status",
  searchKeys: ["title"],
  relations: ["projects"],
  fields: [
    { key: "title", label: "Deliverable", type: "text", required: true, table: true },
    { key: "project_id", label: "Project", type: "relation", relation: "projects", table: true },
    { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS.deliverables, badge: true, table: true },
    { key: "due_date", label: "Due", type: "date", table: true },
    { key: "notes", label: "Internal notes", type: "textarea" },
  ],
};

const calls: EntityConfig = {
  entity: "calls",
  label: "Calls",
  singular: "Call",
  blurb: "Client calls, scheduled and logged.",
  creatable: true,
  orderBy: "scheduled_at",
  statusKey: "status",
  searchKeys: ["purpose", "outcome"],
  relations: ["clients"],
  fields: [
    { key: "client_id", label: "Client", type: "relation", relation: "clients", table: true },
    { key: "scheduled_at", label: "When", type: "datetime", table: true },
    { key: "purpose", label: "Purpose", type: "text", table: true },
    { key: "outcome", label: "Outcome", type: "textarea", clamp: true },
    { key: "status", label: "Status", type: "select", options: STATUS_OPTIONS.calls, badge: true, table: true },
    { key: "notes", label: "Internal notes", type: "textarea" },
  ],
};

export const ENTITY_CONFIG: Record<AdminEntity, EntityConfig> = {
  leads,
  applications,
  clients,
  projects,
  deliverables,
  calls,
};

/** Columns Postgres manages for us — never written from the client. */
export const SYSTEM_COLUMNS = ["id", "created_at", "updated_at"];

/** Whitelist of writable columns for an entity (server-enforced). */
export function writableFields(entity: AdminEntity): string[] {
  return ENTITY_CONFIG[entity].fields
    .filter((f) => !f.readOnly && !SYSTEM_COLUMNS.includes(f.key))
    .map((f) => f.key);
}

export type RelationOption = { id: string; label: string };
export type RelationMap = Partial<Record<AdminEntity, RelationOption[]>>;
