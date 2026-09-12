import "server-only";

/**
 * The address the site is reached at, for URLs handed to third parties —
 * Stripe's success and cancel URLs, OAuth redirects.
 *
 * NOT `new URL(request.url).origin`. Inside a Netlify function that is the
 * *.netlify.app address the function was invoked on, not the custom domain,
 * so a customer who backed out of checkout on fynnd.co was returned to the
 * netlify.app copy of the page.
 *
 * Order: SITE_URL if set (an explicit value always wins), then Netlify's own
 * URL, which is the site's primary address including a custom domain, then
 * the request origin — which is only ever reached in local dev.
 */
export const siteOrigin = (request: Request): string => {
  const configured = process.env.SITE_URL ?? process.env.URL;
  if (configured) return configured.replace(/\/+$/, "");
  return new URL(request.url).origin;
};
