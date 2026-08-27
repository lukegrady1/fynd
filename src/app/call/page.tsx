import { redirect } from "next/navigation";
import type { SearchParams } from "@/lib/params";

/**
 * /call → /demo.
 *
 * There is one booking calendar again, so this route has nothing of its own to
 * show. It is a redirect rather than a deletion because the URL is already in
 * people's text messages: those links were always meant to reach a booking
 * page, and a 404 is a worse answer than the right calendar.
 *
 * The query string goes with it — ?fn=, ?phone= and ?email= are what prefill
 * the calendar, and dropping them here would make someone retype their details
 * on a phone keyboard.
 *
 * /call/confirmed is untouched: it is a sibling route, and GHL still redirects
 * there after a booking.
 */
export default async function CallPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") params.set(key, value);
    else if (Array.isArray(value) && value[0]) params.set(key, value[0]);
  }

  const query = params.toString();
  redirect(query ? `/demo?${query}` : "/demo");
}
