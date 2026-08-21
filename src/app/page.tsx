import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/sections/Hero";
import { PillarRow } from "@/components/sections/PillarRow";
import { DashboardProof } from "@/components/sections/DashboardProof";
import { CtaCloser } from "@/components/sections/CtaCloser";
import { Container } from "@/components/ui/Layout";
import { Card, TestimonialCard } from "@/components/ui/Card";
import { KpiBlock, ScoreGauge } from "@/components/ui/DataViz";
import { brand } from "@/lib/brand";

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

        {/* Signature pattern 4 — testimonial band */}
        <section className="bg-white py-12 md:py-16 lg:py-24">
          <Container>
            <div className="grid gap-6 md:grid-cols-3">
              <TestimonialCard
                quote="We went from 40 reviews to over 300 in five months. Customers actually find us now."
                name="Marisol Reyes"
                role="Owner, Reyes Auto Care"
                initials="MR"
              />
              <TestimonialCard
                quote="I stopped chasing reviews by hand. Fynd asks every customer, and the requests actually get answered."
                name="Dan Whitfield"
                role="Director, Whitfield Dental"
                initials="DW"
              />
              <TestimonialCard
                quote="Our listings were wrong on half the internet. One dashboard fixed all of it."
                name="Priya Nair"
                role="GM, Northline Fitness"
                initials="PN"
              />
            </div>
          </Container>
        </section>

        <CtaCloser />
      </main>
      <Footer />
    </>
  );
}
