import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/sections/Hero";
import { PillarRow } from "@/components/sections/PillarRow";
import { DashboardProof } from "@/components/sections/DashboardProof";
import { CtaCloser } from "@/components/sections/CtaCloser";
import { Card } from "@/components/ui/Card";
import { KpiBlock, ScoreGauge } from "@/components/ui/DataViz";
import { brand } from "@/lib/brand";
import { StatBar } from "@/components/sections/review/StatBar";
import { Testimonials } from "@/components/sections/review/Testimonials";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero
          eyebrow="Local visibility, handled"
          line1={brand.headline.line1}
          line2={brand.headline.line2}
          subcopy={brand.positioning}
          primary={{ label: "Book a Demo", href: "/#demo" }}
          secondary={{ label: "Watch Video", href: "/#video" }}
          aside={
            <Card tone="dark" size="lg" className="shadow-lg">
              <p className="text-micro uppercase text-white/72">Overview</p>
              <div className="mt-6 flex items-center gap-8">
                <div className="rounded-md bg-white p-4">
                  <ScoreGauge score={87} label="Excellent" />
                </div>
                <div className="flex flex-col gap-6">
                  <KpiBlock name="Impressions" value="24.5K" delta="18%" tone="dark" />
                  <KpiBlock name="New reviews" value="412" delta="24%" tone="dark" />
                </div>
              </div>
            </Card>
          }
        />

        <PillarRow />
        <DashboardProof />

        <StatBar />

        {/* Data-driven: renders nothing until real quotes exist in
            content/testimonials.ts. This band previously held three invented
            customers, which the funnel pages had already stopped doing. */}
        <Testimonials />

        <CtaCloser />
      </main>
      <Footer />
    </>
  );
}
