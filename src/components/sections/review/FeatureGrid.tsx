import {
  BarChart3,
  CreditCard,
  History,
  MessageSquare,
  Plug,
  Repeat,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { features } from "@/content/copy";
import { Container, Eyebrow } from "@/components/ui/Layout";
import { DeviceShell } from "./PhoneFrame";
import { Delta, MetricBar, ScoreGauge } from "@/components/ui/DataViz";
import { Reveal } from "./Reveal";

/**
 * Everything included, beside a mockup of the thing itself.
 *
 * The mockup is the real dashboard components (score gauge, metric bars)
 * rendered inside the shared phone shell — not a screenshot, so it can't go
 * stale and costs nothing to load.
 */
export function FeatureGrid() {
  return (
    <section className="bg-white py-14 lg:py-24">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-16">
          <div>
            <Reveal className="max-w-2xl">
              <Eyebrow>{features.eyebrow}</Eyebrow>
              <h2 className="mt-3 text-h1 text-ink">{features.heading}</h2>
              <p className="measure mt-3 text-body text-ink-soft">
                {features.sub}
              </p>
            </Reveal>

            <ul className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {features.items.map((item, i) => (
                <li key={item.title}>
                  <Reveal delay={i * 0.04}>
                    <FeatureIcon name={item.icon} />
                    <h3 className="mt-3 text-h3 text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-body text-ink-soft">
                      {item.body}
                    </p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>

          <Reveal className="lg:sticky lg:top-24">
            <DashboardMockup />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/** Outline icons only, 1.75px stroke, coloured by domain (design.md §7). */
function FeatureIcon({ name }: { name: string }) {
  const props = {
    strokeWidth: 1.75,
    className: "h-5 w-5",
    "aria-hidden": true as const,
  };

  const map: Record<string, { node: React.ReactNode; tone: string }> = {
    MessageSquare: { node: <MessageSquare {...props} />, tone: "text-fynd-green" },
    Plug: { node: <Plug {...props} />, tone: "text-fynd-orange" },
    ShieldCheck: { node: <ShieldCheck {...props} />, tone: "text-fynd-blue" },
    Repeat: { node: <Repeat {...props} />, tone: "text-fynd-blue" },
    Sparkles: { node: <Sparkles {...props} />, tone: "text-fynd-green" },
    History: { node: <History {...props} />, tone: "text-fynd-blue" },
    BarChart3: { node: <BarChart3 {...props} />, tone: "text-fynd-blue" },
    CreditCard: { node: <CreditCard {...props} />, tone: "text-fynd-orange" },
  };

  const entry = map[name] ?? map.ShieldCheck;

  return (
    <span
      className={`flex h-10 w-10 items-center justify-center rounded-full border border-line ${entry.tone}`}
    >
      {entry.node}
    </span>
  );
}

/** The Fynd dashboard, drawn with the real data-viz components. */
function DashboardMockup() {
  return (
    <DeviceShell statusTime="9:41">
      <div className="border-b border-line px-4 pb-2.5 pt-1.5">
        <p className="text-[13px] font-semibold text-ink">Overview</p>
        <p className="text-[10px] font-normal text-ink-soft">
          Reyes Auto Care · last 30 days
        </p>
      </div>

      <div className="flex flex-col gap-4 bg-fynd-gray px-3 py-4">
        <div className="rounded-md border border-line bg-white p-4">
          <p className="text-[11px] font-semibold text-ink">Reputation score</p>
          <div className="mt-2 flex justify-center">
            <ScoreGauge score={87} label="Excellent" />
          </div>
          <p className="mt-3 flex justify-center">
            <Delta value="12% vs. last month" />
          </p>
        </div>

        <div className="rounded-md border border-line bg-white p-4">
          <p className="text-[11px] font-semibold text-ink">
            Where reviews came from
          </p>
          <div className="mt-3 flex flex-col gap-3">
            <MetricBar label="Google" value="128" percent={78} index={0} />
            <MetricBar label="SMS" value="61" percent={48} index={1} />
            <MetricBar label="NFC card" value="18" percent={19} index={2} />
          </div>
        </div>
      </div>
    </DeviceShell>
  );
}
