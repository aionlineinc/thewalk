/** Reserved `IlmMedia.title` values — not shown as captions on the public page. */
export const ILM_MEDIA_TITLE_PROFILE = "__ilm_profile__";
export const ILM_MEDIA_TITLE_BANNER = "__ilm_banner__";

export function isGalleryPhotoTitle(title: string | null | undefined) {
  if (!title) return true;
  return title !== ILM_MEDIA_TITLE_PROFILE && title !== ILM_MEDIA_TITLE_BANNER;
}

export function galleryCaption(title: string | null | undefined): string | null {
  if (!title) return null;
  if (title === ILM_MEDIA_TITLE_PROFILE || title === ILM_MEDIA_TITLE_BANNER) return null;
  return title;
}
