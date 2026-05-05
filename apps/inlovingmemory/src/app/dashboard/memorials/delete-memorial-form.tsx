"use client";

import { deleteMemorialFromForm } from "@/app/dashboard/memorials/actions";

export function DeleteMemorialForm({ memorialId }: { memorialId: string }) {
  return (
    <form
      action={deleteMemorialFromForm}
      onSubmit={(e) => {
        if (!confirm("Permanently delete this memorial? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
      className="inline"
    >
      <input type="hidden" name="__memorialId" value={memorialId} />
      <button
        type="submit"
        className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-900 shadow-sm transition hover:bg-red-50"
      >
        Delete memorial
      </button>
    </form>
  );
}
