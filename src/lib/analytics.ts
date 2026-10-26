type EventName =
  | "view_post"
  | "like_post"
  | "unlike_post"
  | "save_post"
  | "unsave_post"
  | "follow_user"
  | "unfollow_user"
  | "submit_comment";

export function track(
  event: EventName,
  props: Record<string, string | number | boolean> = {},
) {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    props,
    path: window.location.pathname,
    at: new Date().toISOString(),
  };

  if (process.env.NODE_ENV !== "production")
    console.debug("[analytics]", payload);

  const url = process.env.NEXT_PUBLIC_ANALYTICS_URL;
  if (url && "sendBeacon" in navigator) {
    try {
      navigator.sendBeacon(url, JSON.stringify(payload));
    } catch {
      // analytics tidak boleh mengganggu aplikasi
    }
  }
}
