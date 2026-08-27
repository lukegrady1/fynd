import "server-only";

import { platforms } from "@/content/onboarding";

/**
 * Which platform OAuth apps are actually provisioned in this environment.
 *
 * Read on the server and passed down as a prop rather than checked in the
 * component: these are private credentials, and a `NEXT_PUBLIC_` mirror of
 * them would be one refactor away from leaking a client id into the bundle
 * for every platform at once.
 *
 * A platform is "ready" only when all three of the client id, the platform's
 * authorize endpoint and our redirect URI are present. Requiring the whole set
 * is what keeps the OAuth branch honest: none of these are provisioned today,
 * so every platform currently resolves to the staff-invite path, and the
 * button cannot appear until a redirect exists that actually completes.
 */
const envKey = (id: string, suffix: string) =>
  `OAUTH_${id.toUpperCase().replace(/-/g, "_")}_${suffix}`;

export type OAuthConfig = {
  clientId: string;
  authorizeUrl: string;
  redirectUri: string;
  scope?: string;
};

export const oauthConfig = (id: string): OAuthConfig | null => {
  const clientId = process.env[envKey(id, "CLIENT_ID")];
  const authorizeUrl = process.env[envKey(id, "AUTHORIZE_URL")];
  const redirectUri = process.env[envKey(id, "REDIRECT_URI")];

  if (!clientId || !authorizeUrl || !redirectUri) return null;
  return {
    clientId,
    authorizeUrl,
    redirectUri,
    scope: process.env[envKey(id, "SCOPE")],
  };
};

export const oauthReadiness = (): Record<string, boolean> =>
  Object.fromEntries(
    platforms
      .filter((p) => p.connect === "oauth")
      .map((p) => [p.id, Boolean(oauthConfig(p.id))]),
  );

/**
 * The address an owner invites as a limited staff user.
 *
 * Returns null rather than a placeholder when unset. Showing a paying customer
 * a fake address to invite is worse than telling them one is coming — the
 * invite step degrades to "I'll email you the address" instead.
 */
export const inviteEmail = (): string | null =>
  process.env.FYND_INVITE_EMAIL?.trim() || null;
