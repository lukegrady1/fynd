# Testimonial drafts — for owner approval, not for the site

These are DRAFTS to send to each client. Nothing here renders anywhere. A
quote goes into `src/content/testimonials.ts` only once the owner has said
yes to it in writing (a text back saying "yep, use that" is enough), with any
edits they made. Keep the reply.

Suggested ask, by text:

> Hey — I'm putting a few client quotes on the Fynd page. Would you be OK
> with something like this under your business name? Change anything that
> doesn't sound like you, or just tell me what you'd say instead.

Do not add a star rating or a before/after number unless they give you one.

---

## Garabedian Plumbing

> "We're on jobs all day. Nobody had time to chase reviews, so we just
> didn't get many. Now the request goes out on its own after the job and the
> reviews show up without anyone on our end doing a thing."

Name and town if they're happy to be named.

## Pro Pressure Washing

> "Asking a customer for a review at the end of a job always felt awkward, so
> I mostly skipped it. Fynd asks for me. Customers get the text, they leave
> the review, I don't have to bring it up."

## Greg's Cuts

> "Clients would tell me they'd leave a review and forget by the time they
> got to the car. The text lands while they're still happy about the cut,
> and that's when they actually do it."

## MrDetails

> "The part I didn't expect was the bad-experience catch. If someone's not
> happy it comes to me first instead of going on Google. Everyone else gets
> pointed straight at the review page."

---

Once approved, each slot looks like:

```ts
{
  business: "Greg's Cuts",
  quote: "…their approved wording…",
  name: "Greg",        // only if they're happy to be named
  town: "Worcester",   // optional
  // rating: 5,        // only if they actually rated Fynd
}
```
