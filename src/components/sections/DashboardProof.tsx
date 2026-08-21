import { Container, Eyebrow, SplitHeading } from "@/components/ui/Layout";
import { Card } from "@/components/ui/Card";
import {
  KpiBlock,
  LineChart,
  MetricBar,
  ScoreGauge,
} from "@/components/ui/DataViz";

/**
 * Signature pattern 3 — dashboard proof.
 * Light gray background, real UI cards in a 2+1 grid. Show real product UI
 * as proof rather than abstract illustration.
 */
export function DashboardProof() {
  return (
    <section id="product" className="bg-fynd-gray py-12 md:py-16 lg:py-24">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>The dashboard</Eyebrow>
          <SplitHeading
            className="mt-3 text-h1"
            line1="Every review, every listing."
            line2="One screen."
          />
          <p className="measure mt-4 text-body text-ink-soft">
            Track your reputation score, review velocity, and where new
            customers are finding you — updated daily, across every surface
            that matters.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <Card size="lg" className="flex flex-col items-center justify-center">
            <p className="mb-6 self-start text-h3 text-ink">Reputation score</p>
            <ScoreGauge score={87} label="Excellent" delta="12% vs. last month" />
          </Card>

          <Card size="lg" className="lg:col-span-2">
            <div className="flex items-baseline justify-between">
              <p className="text-h3 text-ink">Review impressions</p>
              <span className="text-small text-ink-muted">Last 6 months</span>
            </div>
            <KpiBlock
              className="mt-5"
              name="Total impressions"
              value="24.5K"
              delta="18%"
            />
            <LineChart
              className="mt-6 h-32"
              data={[12, 18, 16, 26, 31, 38, 44, 52]}
              ariaLabel="Review impressions rising from 12 to 52 thousand over six months"
            />
          </Card>

          <Card size="lg" className="lg:col-span-2">
            <p className="text-h3 text-ink">Where reviews came from</p>
            <div className="mt-6 flex flex-col gap-5">
              <MetricBar label="Google" value="1,284" percent={78} index={0} />
              <MetricBar label="SMS request" value="612" percent={48} index={1} />
              <MetricBar label="Email request" value="341" percent={28} index={2} />
              <MetricBar label="QR / in-store" value="188" percent={16} index={0} />
            </div>
          </Card>

          <Card size="lg" className="flex flex-col justify-center gap-8">
            <KpiBlock name="New reviews" value="412" delta="24%" />
            <KpiBlock name="Avg. rating" value="4.8" delta="0.3" />
          </Card>
        </div>
      </Container>
    </section>
  );
}
