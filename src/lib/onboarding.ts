import { z } from "zod";

import {
  businessTypes,
  platforms,
  priorityByType,
  type ConnectMethod,
} from "@/content/onboarding";
import { emailSchema, phoneSchema } from "@/lib/params";

export type BusinessTypeId = (typeof businessTypes)[number]["id"];
export type PlatformId = (typeof platforms)[number]["id"];
export type Platform = (typeof platforms)[number];

const byId = new Map<string, Platform>(platforms.map((p) => [p.id, p]));

export const platformById = (id: string): Platform | undefined => byId.get(id);

/** The two answers that are always pinned to the bottom, in this order. */
const TERMINAL: readonly PlatformId[] = ["other", "none"];

const isTerminal = (id: string): boolean =>
  (TERMINAL as readonly string[]).includes(id);

/**
 * The platform list for a given vertical, split into what to show first and
 * what goes under the "More platforms" divider.
 *
 * Two rules that matter more than they look:
 *
 * 1. Ordering, never filtering. Every platform stays reachable no matter the
 *    vertical — a med spa running Mariana Tek must still be able to say so.
 * 2. "Other" and "I don't use booking software" are pinned last and are never
 *    promoted into the suggested group. They are escape hatches; putting them
 *    up top invites people to skip past a platform we actually support.
 */
export const orderPlatforms = (
  businessType: BusinessTypeId | null,
): { suggested: Platform[]; rest: Platform[] } => {
  const priority = businessType ? priorityByType[businessType] : [];

  const suggested = priority
    .map((id) => byId.get(id))
    .filter((p): p is Platform => Boolean(p) && !isTerminal(p!.id));

  const chosen = new Set(suggested.map((p) => p.id));

  const rest = platforms
    .filter((p) => !chosen.has(p.id) && !isTerminal(p.id))
    .slice()
    .sort((a, b) => a.name.localeCompare(b.name));

  const terminal = TERMINAL.map((id) => byId.get(id)).filter(
    (p): p is Platform => Boolean(p),
  );

  return { suggested, rest: [...rest, ...terminal] };
};

/**
 * Free-text search across the whole roster.
 *
 * Searching deliberately collapses the suggested/rest split — once someone
 * types, the vertical ordering is noise and they want the one row they are
 * looking for. "Other" survives every query so the escape hatch is reachable
 * even when nothing matches.
 */
export const searchPlatforms = (query: string): Platform[] => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return platforms.filter(
    (p) => p.name.toLowerCase().includes(q) || p.id === "other",
  );
};

/**
 * How a given platform should be connected, given which OAuth apps are
 * actually provisioned in this environment.
 *
 * A platform marked `oauth` in the catalog only *claims* a public OAuth flow
 * exists. If Fynd's app for it isn't configured, sending the owner to a dead
 * redirect is worse than showing the staff-invite path — so it degrades.
 */
export const resolveConnectMethod = (
  platform: Platform,
  oauthReady: Partial<Record<string, boolean>>,
): ConnectMethod => {
  if (platform.connect !== "oauth") return platform.connect;
  return oauthReady[platform.id] ? "oauth" : "invite";
};

/* ------------------------------------------------------------------ */

const businessTypeIds = businessTypes.map((b) => b.id) as [
  BusinessTypeId,
  ...BusinessTypeId[],
];
const platformIds = platforms.map((p) => p.id) as [PlatformId, ...PlatformId[]];

/**
 * Shared by the client (to gate "Continue") and the route handler (because a
 * client-side check is a UX affordance, not validation).
 *
 * `otherPlatform` is required only when the platform is "Other" — that string
 * is the whole point of the option, so an empty one is a failed answer, not an
 * optional extra.
 */
export const onboardingSchema = z
  .object({
    ownerName: z.string().trim().min(1).max(80),
    businessName: z.string().trim().min(1).max(120),
    email: emailSchema,
    phone: phoneSchema,
    businessType: z.enum(businessTypeIds),
    platform: z.enum(platformIds),
    otherPlatform: z.string().trim().max(80).optional(),
    /** Only collected on the `manual` path. */
    completionSignal: z.string().trim().max(400).optional(),
    /** Opaque GHL contact id, carried through from the funnel link. */
    cid: z.string().max(64).nullable().optional(),
  })
  .refine(
    (v) => v.platform !== "other" || Boolean(v.otherPlatform?.length),
    { path: ["otherPlatform"], message: "Required when platform is Other" },
  );

export type OnboardingInput = z.infer<typeof onboardingSchema>;

/** Second, smaller write once the owner acts on (or skips) the connect step. */
export const connectStatusSchema = z.object({
  cid: z.string().max(64).nullable().optional(),
  email: emailSchema,
  platform: z.enum(platformIds),
  status: z.enum(["oauth_started", "invite_sent", "manual", "skipped"]),
  completionSignal: z.string().trim().max(400).optional(),
});
