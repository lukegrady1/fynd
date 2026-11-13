/**
 * The $99 optimization's post-checkout page: the steps to add Fynd as a
 * Manager on the Google Business Profile, and nothing else. No chat (Luke,
 * Nov 13, 2026: "that page doesn't need an ai chat just needs those
 * instructions").
 */
type Props = {
  heading: string;
  intro: string;
  steps: string[];
  /** The address to invite; set in bold wherever a step contains it. */
  email: string;
  /** What happens once the invite is sent. */
  after: string;
};

/** A numbered list with the address to invite set in bold. */
export function SetupInstructions({ heading, intro, steps, email, after }: Props) {
  return (
    <div>
      <h1 className="text-h1 text-ink">{heading}</h1>
      <p className="mt-3 text-body text-ink-soft">{intro}</p>
      <ol className="mt-8 space-y-3">
        {steps.map((step, i) => {
          const at = step.indexOf(email);
          return (
            <li key={i} className="flex gap-3 text-body text-ink">
              <span
                aria-hidden="true"
                className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fynd-blue text-small font-semibold text-white"
              >
                {i + 1}
              </span>
              <span>
                {at === -1 ? (
                  step
                ) : (
                  <>
                    {step.slice(0, at)}
                    <strong className="font-semibold whitespace-nowrap text-fynd-blue">{email}</strong>
                    {step.slice(at + email.length)}
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="mt-8 rounded-md bg-fynd-gray p-5 text-body text-ink">{after}</p>
    </div>
  );
}

