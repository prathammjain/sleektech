"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminEntity } from "@/lib/types";

/** Inline status dropdown that PATCHes the row and refreshes server data. */
export default function StatusSelect({
  entity,
  id,
  value,
  options,
}: {
  entity: AdminEntity;
  id: string;
  value: string;
  options: readonly string[];
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(value);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);

  const onChange = async (next: string) => {
    const prev = current;
    setCurrent(next);
    setSaving(true);
    setError(false);
    try {
      const res = await fetch(`/api/admin/${entity}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: next }),
      });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setCurrent(prev);
      setError(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      className={`admin-status admin-status--${current}`}
      data-error={error || undefined}
      value={current}
      disabled={saving}
      onChange={(e) => onChange(e.target.value)}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
