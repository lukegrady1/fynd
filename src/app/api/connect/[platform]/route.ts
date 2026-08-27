import { NextResponse } from "next/server";

import { oauthConfig } from "@/lib/connect";
import { platformById } from "@/lib/onboarding";

/**
 * OAuth kickoff for a booking platform.
 *
 * Generic on purpose — every endpoint, credential and scope comes from env, so
 * adding a platform is configuration rather than a new route. Nothing is
 * provisioned today, which means this currently always takes the "unavailable"
 * branch; the form never links here unless `oauthReadiness()` says otherwise.
 *
 * There is no callback handler yet. Whoever builds it owns the token exchange
 * and must verify `state` against the cookie set below before trusting the
 * code — this route only gets the owner to the platform's consent screen.
 */
export const GET = async (
  request: Request,
  { params }: { params: Promise<{ platform: string }> },
) => {
  const { platform: id } = await params;
  const platform = platformById(id);
  const origin = new URL(request.url).origin;

  const back = (reason: string) =>
    NextResponse.redirect(
      `${origin}/start/welcome?connect=${encodeURIComponent(reason)}`,
      { status: 302 },
    );

  if (!platform || platform.connect !== "oauth") return back("unsupported");

  const config = oauthConfig(platform.id);
  if (!config) {
    console.warn(`[connect] no OAuth config for ${platform.id}`);
    return back("unavailable");
  }

  // Opaque, single-use, and mirrored into an httpOnly cookie so the callback
  // can prove the response belongs to the browser that started the flow.
  const state = crypto.randomUUID();

  const url = new URL(config.authorizeUrl);
  url.searchParams.set("client_id", config.clientId);
  url.searchParams.set("redirect_uri", config.redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("state", state);
  if (config.scope) url.searchParams.set("scope", config.scope);

  const response = NextResponse.redirect(url.toString(), { status: 302 });
  response.cookies.set(`fynd_oauth_state_${platform.id}`, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 600,
  });
  return response;
};
