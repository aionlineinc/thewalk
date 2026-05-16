"use client";

import { useState } from "react";
import { THEME_PRESETS, THEME_PRESET_LABELS, type ThemePreset } from "@/lib/ilm-theme";
import type { MemorialFormDefaults } from "@/app/dashboard/memorials/memorial-form-defaults";

export type { MemorialFormDefaults } from "@/app/dashboard/memorials/memorial-form-defaults";

const isPremium = (tier: string) => tier === "PREMIUM" || tier === "GENERATIONS";

export function MemorialForm({
  action,
  defaults,
  memorialIdForEdit,
  customBanners,
}: {
  action: (formData: FormData) => void | Promise<void>;
  defaults: MemorialFormDefaults;
  /** When set, posts hidden `__memorialId` so the server action does not rely on `.bind()`. */
  memorialIdForEdit?: string;
  customBanners?: Record<string, { label: string; url: string }>;
}) {
  const [bannerPreset, setBannerPreset] = useState(defaults.bannerPreset);
  const allBanners = customBanners ?? {};

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

      <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-earth-800">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            maxLength={100}
            defaultValue={defaults.country}
            placeholder="e.g. United States, Kenya"
            className="mt-2 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
          />
        </div>
        <div>
          <label htmlFor="parish" className="block text-sm font-medium text-earth-800">
            Parish / community
          </label>
          <input
            id="parish"
            name="parish"
            type="text"
            maxLength={100}
            defaultValue={defaults.parish}
            placeholder="e.g. St. Mary's, Nairobi Chapel"
            className="mt-2 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
          />
        </div>
      </div>

      {/* ── Resting place ── */}
      <fieldset className="space-y-5 rounded-xl border border-earth-200 bg-earth-50/40 px-4 py-5">
        <legend className="text-sm font-medium text-earth-800">Resting place</legend>

        <div>
          <label htmlFor="restingPlaceName" className="block text-sm font-medium text-earth-700">
            Cemetery / location name
          </label>
          <input
            id="restingPlaceName"
            name="restingPlaceName"
            type="text"
            maxLength={200}
            defaultValue={defaults.restingPlaceName}
            placeholder="e.g. Greenwood Memorial Park"
            className="mt-2 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="restingPlaceAddress" className="block text-sm font-medium text-earth-700">
            Address
          </label>
          <input
            id="restingPlaceAddress"
            name="restingPlaceAddress"
            type="text"
            maxLength={300}
            defaultValue={defaults.restingPlaceAddress}
            placeholder="Full address"
            className="mt-2 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="restingPlaceLat" className="block text-sm font-medium text-earth-700">
              Latitude <span className="font-normal text-earth-400">(optional)</span>
            </label>
            <input
              id="restingPlaceLat"
              name="restingPlaceLat"
              type="number"
              step="any"
              defaultValue={defaults.restingPlaceLat}
              placeholder="e.g. 32.7767"
              className="mt-2 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
            />
          </div>
          <div>
            <label htmlFor="restingPlaceLng" className="block text-sm font-medium text-earth-700">
              Longitude <span className="font-normal text-earth-400">(optional)</span>
            </label>
            <input
              id="restingPlaceLng"
              name="restingPlaceLng"
              type="number"
              step="any"
              defaultValue={defaults.restingPlaceLng}
              placeholder="e.g. -96.7970"
              className="mt-2 w-full rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
            />
          </div>
        </div>

        <div>
          <label htmlFor="restingPlaceMapUrl" className="block text-sm font-medium text-earth-700">
            Map link URL <span className="font-normal text-earth-400">(optional)</span>
          </label>
          <input
            id="restingPlaceMapUrl"
            name="restingPlaceMapUrl"
            type="url"
            maxLength={500}
            defaultValue={defaults.restingPlaceMapUrl}
            placeholder="https://maps.google.com/?q=..."
            className="mt-2 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
          />
        </div>
      </fieldset>

      {/* ── Theme ── */}
      <fieldset className="space-y-5 rounded-xl border border-earth-200 bg-earth-50/40 px-4 py-5">
        <legend className="text-sm font-medium text-earth-800">Page theme</legend>

        <div>
          <label htmlFor="themePreset" className="block text-sm font-medium text-earth-700">
            Color palette
          </label>
          <select
            id="themePreset"
            name="themePreset"
            defaultValue={defaults.themePreset}
            className="mt-2 w-full max-w-xl rounded-lg border border-earth-200 bg-white px-3 py-2 text-earth-900 shadow-sm outline-none ring-earth-400/30 transition focus:border-earth-400 focus:ring-2"
          >
            <option value="">Amber (default)</option>
            {(Object.keys(THEME_PRESETS) as ThemePreset[]).map((key) => (
              <option key={key} value={key}>
                {THEME_PRESET_LABELS[key]}
              </option>
            ))}
          </select>
        </div>

        {isPremium(defaults.tier) ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="primaryColor" className="block text-sm font-medium text-earth-700">
                Primary color
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="primaryColor"
                  name="primaryColor"
                  type="color"
                  defaultValue={defaults.primaryColor || THEME_PRESETS.amber.primary}
                  className="h-9 w-12 cursor-pointer rounded border border-earth-200 bg-white p-0.5"
                />
                <input
                  type="text"
                  value={defaults.primaryColor || THEME_PRESETS.amber.primary}
                  readOnly
                  className="w-28 rounded-lg border border-earth-200 bg-earth-50 px-2 py-2 text-xs font-mono text-earth-600"
                />
              </div>
            </div>
            <div>
              <label htmlFor="accentColor" className="block text-sm font-medium text-earth-700">
                Accent color
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="accentColor"
                  name="accentColor"
                  type="color"
                  defaultValue={defaults.accentColor || THEME_PRESETS.amber.accent}
                  className="h-9 w-12 cursor-pointer rounded border border-earth-200 bg-white p-0.5"
                />
                <input
                  type="text"
                  value={defaults.accentColor || THEME_PRESETS.amber.accent}
                  readOnly
                  className="w-28 rounded-lg border border-earth-200 bg-earth-50 px-2 py-2 text-xs font-mono text-earth-600"
                />
              </div>
            </div>
          </div>
        ) : (
          <p className="text-xs text-earth-500">
            Upgrade to Premium or Generations to pick custom colors for your page.
          </p>
        )}
      </fieldset>

      {/* ── Banner preset ── */}
      <fieldset className="space-y-4 rounded-xl border border-earth-200 bg-earth-50/40 px-4 py-5">
        <legend className="text-sm font-medium text-earth-800">Banner image</legend>
        <p className="text-sm text-earth-600">
          Choose a banner for the top of your memorial page.
          {isPremium(defaults.tier)
            ? " You can also upload a custom banner in Photos & media."
            : " Upgrade to Premium to upload a custom banner."}
        </p>
        <input type="hidden" name="bannerPreset" value={bannerPreset} />
        <div className="grid grid-cols-3 gap-3">
          <label
            className={`cursor-pointer overflow-hidden rounded-xl border-2 transition ${
              bannerPreset === "" ? "border-calm-500 shadow-md" : "border-transparent hover:border-earth-300"
            }`}
          >
            <input
              type="radio"
              name="_bannerPreset_none"
              checked={bannerPreset === ""}
              onChange={() => setBannerPreset("")}
              className="sr-only"
            />
            <div className="flex h-20 items-center justify-center bg-earth-100 text-xs font-medium text-earth-500">
              None
            </div>
          </label>
          {Object.entries(allBanners).map(([key, preset]) => (
            <label
              key={key}
              className={`cursor-pointer overflow-hidden rounded-xl border-2 transition ${
                bannerPreset === key ? "border-calm-500 shadow-md" : "border-transparent hover:border-earth-300"
              }`}
            >
              <input
                type="radio"
                name="_bannerPreset"
                checked={bannerPreset === key}
                onChange={() => setBannerPreset(key)}
                className="sr-only"
              />
              <img
                src={preset.url}
                alt={preset.label}
                className="h-20 w-full object-cover"
                loading="lazy"
              />
              <p className="truncate px-1.5 py-1 text-[10px] font-medium text-earth-600">{preset.label}</p>
            </label>
          ))}
        </div>
      </fieldset>

      <div>
        <span className="block text-sm font-medium text-earth-800">Privacy</span>
        <p className="mt-1 text-sm text-earth-600">
          Non-public pages still allow you (the page moderator) to preview when signed in.
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
