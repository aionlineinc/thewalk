"use client";

import type { IlmMemorialKind, IlmPrivacyLevel } from "@prisma/client";

export type MemorialFormDefaults = {
  displayName: string;
  kind: IlmMemorialKind;
  biography: string;
  birthDate: string;
  deathDate: string;
  privacyLevel: IlmPrivacyLevel;
  slug: string;
  hideFromDirectory: boolean;
  hideFromSearchEngines: boolean;
};

function isoDateForInput(d: Date | null | undefined) {
  if (!d) return "";
  return d.toISOString().slice(0, 10);
}

export function buildMemorialDefaults(row: {
  displayName: string;
  kind: IlmMemorialKind;
  biography: string | null;
  birthDate: Date | null;
  deathDate: Date | null;
  privacyLevel: IlmPrivacyLevel;
  slug: string;
  hideFromDirectory: boolean;
  hideFromSearchEngines: boolean;
}): MemorialFormDefaults {
  return {
    displayName: row.displayName,
    kind: row.kind,
    biography: row.biography ?? "",
    birthDate: isoDateForInput(row.birthDate),
    deathDate: isoDateForInput(row.deathDate),
    privacyLevel: row.privacyLevel,
    slug: row.slug,
    hideFromDirectory: row.hideFromDirectory,
    hideFromSearchEngines: row.hideFromSearchEngines,
  };
}

export function MemorialForm({
  action,
  defaults,
  memorialIdForEdit,
}: {
  action: (formData: FormData) => void;
  defaults: MemorialFormDefaults;
  /** When set, posts hidden `__memorialId` so the server action does not rely on `.bind()`. */
  memorialIdForEdit?: string;
}) {
  return (
    <form action={action} className="space-y-8">
      {memorialIdForEdit ? <input type="hidden" name="__memorialId" value={memorialIdForEdit} /> : null}
      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-earth-800">
          Display name
        </label>
        <input
          id="displayName"
          name="displayName"
          type="text"
          required
          maxLength={200}
          defaultValue={defaults.displayName}
          className="mt-2 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-earth-800">Page kind</span>
        <select
          id="kind"
          name="kind"
          defaultValue={defaults.kind}
          className="mt-2 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
        >
          <option value="MEMORIAL">Memorial</option>
          <option value="LIVING_LEGACY">Living legacy</option>
        </select>
      </div>

      <div>
        <label htmlFor="biography" className="block text-sm font-medium text-earth-800">
          Biography / story
        </label>
        <textarea
          id="biography"
          name="biography"
          rows={8}
          maxLength={50000}
          defaultValue={defaults.biography}
          className="mt-2 w-full max-w-2xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-earth-800">
            Birth date
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            defaultValue={defaults.birthDate}
            className="mt-2 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="deathDate" className="block text-sm font-medium text-earth-800">
            Death date
          </label>
          <input
            id="deathDate"
            name="deathDate"
            type="date"
            defaultValue={defaults.deathDate}
            className="mt-2 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
          />
        </div>
      </div>

      <div>
        <span className="block text-sm font-medium text-earth-800">Privacy</span>
        <p className="mt-1 text-sm text-earth-600">
          Non-public pages still allow you (the page keeper) to preview when signed in.
        </p>
        <select
          id="privacyLevel"
          name="privacyLevel"
          defaultValue={defaults.privacyLevel}
          className="mt-2 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
        >
          <option value="PUBLIC">Public</option>
          <option value="PASSWORD">Password protected</option>
          <option value="FAMILY_ONLY">Family only</option>
          <option value="INVITE_ONLY">Invite only</option>
        </select>
      </div>

      <fieldset className="space-y-4 rounded-xl border border-earth-200 bg-earth-50/40 px-4 py-5">
        <legend className="text-sm font-medium text-earth-800">Visibility</legend>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-earth-700">
          <input
            type="checkbox"
            name="hideFromDirectory"
            defaultChecked={defaults.hideFromDirectory}
            className="mt-1 rounded border-earth-300 text-earth-800 focus:ring-earth-500"
          />
          <span>
            Hide from public directory — direct link to this page still works for people you share it with.
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-earth-700">
          <input
            type="checkbox"
            name="hideFromSearchEngines"
            defaultChecked={defaults.hideFromSearchEngines}
            className="mt-1 rounded border-earth-300 text-earth-800 focus:ring-earth-500"
          />
          <span>Ask search engines not to index this page (robots noindex).</span>
        </label>
      </fieldset>

      <div className="flex flex-wrap items-center gap-4 border-t border-earth-200 pt-8">
        <button
          type="submit"
          className="rounded-lg bg-earth-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-earth-900"
        >
          Save
        </button>
      </div>

      <p className="text-xs text-earth-500">
        Public URL slug (set at creation): <span className="font-mono text-earth-700">{defaults.slug}</span>
      </p>
    </form>
  );
}
