import { colors } from "./brand";
import type { EmailContent } from "@/content/emails";

/**
 * Renders an onboarding email to HTML and plain text.
 *
 * Deliberately plain: one column, tables for layout, no images, no web
 * fonts, inline styles. Mail clients strip stylesheets and block remote
 * images by default, and a first-contact email that arrives as a broken
 * layout with a blocked logo reads as spam. The brand shows in the colors
 * (navy, Fynd Blue step labels, the green-text accent that passes contrast
 * on white) and the step rail, which is the welcome pages' shape.
 *
 * Poppins is the brand face but can't be loaded reliably in mail, so the
 * stack falls back through the system fonts; design.md's "no serif" still
 * holds.
 */

const FONT =
  "Poppins, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

const INK = colors.navy;
const INK_SOFT = "#5A6478";
const LINE = colors.line;

const escape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** Only http(s) links make it into an href; anything else is dropped. */
const safeHref = (href: string | undefined) =>
  href && /^https?:\/\//i.test(href) ? href : null;

export const renderEmail = (content: EmailContent): { html: string; text: string } => {
  const steps = content.steps
    .map((step) => {
      const href = safeHref(step.href);
      const link = href
        ? `<br /><a href="${escape(href)}" style="color:${colors.greenText};font-weight:600;text-decoration:underline;">${escape(step.linkLabel ?? href)}</a>`
        : "";
      return `
        <tr>
          <td valign="top" style="padding:14px 0;border-top:1px solid ${LINE};width:112px;font:600 13px/20px ${FONT};color:${colors.blue};">${escape(step.when)}</td>
          <td valign="top" style="padding:14px 0 14px 16px;border-top:1px solid ${LINE};font:500 15px/24px ${FONT};color:${INK};">${escape(step.body)}${link}</td>
        </tr>`;
    })
    .join("");

  const aside = content.aside
    ? `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:28px;background:${colors.gray};border-radius:12px;">
        <tr>
          <td style="padding:20px 24px;">
            <p style="margin:0 0 8px;font:600 15px/22px ${FONT};color:${INK};">${escape(content.aside.heading)}</p>
            <ul style="margin:0;padding-left:20px;">
              ${content.aside.items
                .map(
                  (item) =>
                    `<li style="margin:0 0 6px;font:500 15px/24px ${FONT};color:${INK};">${escape(item)}</li>`,
                )
                .join("")}
            </ul>
          </td>
        </tr>
      </table>`
    : "";

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="color-scheme" content="light" />
<title>${escape(content.subject)}</title>
</head>
<body style="margin:0;padding:0;background:#ffffff;">
  <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;overflow:hidden;">${escape(content.preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <tr>
            <td style="padding:0 0 24px;font:700 22px/28px ${FONT};color:${INK};letter-spacing:-0.01em;">Fynd</td>
          </tr>
          <tr>
            <td style="font:700 26px/32px ${FONT};color:${INK};letter-spacing:-0.01em;">${escape(content.heading)}</td>
          </tr>
          <tr>
            <td style="padding:18px 0 0;font:500 16px/26px ${FONT};color:${INK};">${escape(content.greeting)}</td>
          </tr>
          <tr>
            <td style="padding:8px 0 24px;font:500 16px/26px ${FONT};color:${INK_SOFT};">${escape(content.intro)}</td>
          </tr>
          <tr>
            <td>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-bottom:1px solid ${LINE};">
                ${steps}
              </table>
            </td>
          </tr>
          <tr>
            <td>${aside}</td>
          </tr>
          <tr>
            <td style="padding:28px 0 0;font:500 15px/24px ${FONT};color:${INK};">${escape(content.closing)}</td>
          </tr>
          <tr>
            <td style="padding:28px 0 0;font:400 13px/20px ${FONT};color:${INK_SOFT};border-top:1px solid ${LINE};margin-top:28px;">
              Fynd · <a href="https://fynnd.co" style="color:${INK_SOFT};text-decoration:underline;">fynnd.co</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    content.heading,
    "",
    content.greeting,
    "",
    content.intro,
    "",
    ...content.steps.flatMap((s) => {
      const href = safeHref(s.href);
      return [`${s.when}: ${s.body}${href ? `\n  ${href}` : ""}`, ""];
    }),
    ...(content.aside
      ? [content.aside.heading, ...content.aside.items.map((i) => `- ${i}`), ""]
      : []),
    content.closing,
    "",
    "Fynd · https://fynnd.co",
  ].join("\n");

  return { html, text };
};
