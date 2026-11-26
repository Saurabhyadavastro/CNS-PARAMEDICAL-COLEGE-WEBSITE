import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Target, 
  MapPin, 
  CheckCircle2, 
  ShieldCheck, 
  HeartHandshake
} from 'lucide-react';
import { siteConfig } from '../content/siteConfig';
import { websiteCopy } from '../content/websiteCopy';
import { Section } from '../components/ui/Section';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';

export const About: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO
        title="About Us - Institute Profile & Mission"
        description="Learn about C.N.S. Paramedical and Nursing College, Kannauj. Established in 2022 to provide quality nursing education, ethical training, and community healthcare services."
      />

      {/* Page Header Banner */}
      <div className="bg-navy-dark text-white py-12 md:py-16 border-b-4 border-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge variant="accent" size="sm">
                About C.N.S.
              </Badge>
              <span className="text-accent text-xs sm:text-sm font-semibold tracking-wide">
                {websiteCopy.institute.hindiTagline}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Institute Profile & Educational Mission
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              {websiteCopy.institute.tagline}. Situated in Kannauj, Uttar Pradesh, our campus delivers grounded, hands-on nursing and paramedical training.
            </p>
          </div>
        </div>
      </div>

      {/* Institute Overview */}
      <Section
        id="overview"
        badge="Who We Are"
        title="Institution Overview & Background"
        subtitle="A dedicated center for healthcare education established in 2022."
        bgVariant="surface"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4 text-ink text-sm sm:text-base leading-relaxed">
            {websiteCopy.institute.aboutParagraphs.map((para, idx) => (
              <p key={idx} className={idx === 0 ? 'font-medium text-ink' : 'text-ink-muted'}>
                {para}
              </p>
            ))}

            <div className="pt-2">
              <div className="p-4 rounded-lg bg-surface-light border border-border-subtle flex items-start gap-3">
                <MapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                <div className="text-xs sm:text-sm">
                  <div className="font-bold text-ink">Campus Location:</div>
                  <div className="text-ink-muted">{siteConfig.contact.address.full}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-card border border-border-subtle bg-surface-muted">
            <img
              src="/images/campus/courtyard-aerial.jpg"
              alt="Aerial view of the academic buildings and central courtyard of C.N.S. Paramedical and Nursing College"
              className="w-full h-80 object-cover"
              loading="lazy"
            />
            <div className="p-5">
              <div className="text-xs uppercase tracking-wide font-bold text-brand mb-1">
                Central Quadrangle
              </div>
              <h3 className="text-base font-bold text-ink">
                Spacious Two-Storey Academic Wings & Lawns
              </h3>
              <p className="text-xs text-ink-muted mt-1">
                Dedicated wings for simulation laboratories, central library, and ventilated classrooms.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Mission & Core Values */}
      <Section
        id="vision-mission"
        badge="Our Purpose"
        title="Mission & Core Institutional Values"
        subtitle="Guiding principles that shape our clinical instruction and student community service."
        bgVariant="surface-light"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Mission Card (Spans 1 or 2 cols) */}
          <Card variant="default" className="border-t-4 border-t-brand lg:col-span-3" padding="lg">
            <CardHeader className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-md bg-brand-faint text-brand flex items-center justify-center">
                <Target className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Our Educational Mission</CardTitle>
                <span className="text-xs text-ink-light">हमारा शैक्षणिक उद्देश्य</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm md:text-base leading-relaxed text-ink font-medium mb-6">
                "{websiteCopy.institute.missionStatement}"
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {websiteCopy.institute.missionPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-lg bg-surface-light border border-border-subtle text-xs sm:text-sm text-ink">
                    <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Core Values 4-Col Grid */}
        <div>
          <h3 className="text-lg font-bold text-ink mb-4 flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-brand" aria-hidden="true" />
            <span>Core Institutional Pillars</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {websiteCopy.institute.coreValues.map((val, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl border border-border-subtle bg-surface shadow-xs flex flex-col justify-between"
              >
                <div>
                  <h4 className="font-bold text-ink text-sm sm:text-base mb-1.5">{val.title}</h4>
                  <p className="text-xs text-ink-muted leading-relaxed">{val.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Facilities Overview */}
      <Section
        id="campus-facilities"
        badge="Infrastructure"
        title="Campus Infrastructure & Facilities"
        subtitle="Designed from the ground up to support medical education and safe clinical skill training."
        bgVariant="surface"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {websiteCopy.facilities.map((fac) => (
            <div
              key={fac.id}
              className="rounded-xl border border-border-subtle bg-surface hover:shadow-card hover:border-brand/40 transition-all flex flex-col overflow-hidden"
            >
              <div className="w-full h-40 overflow-hidden bg-surface-muted relative border-b border-border-subtle">
                <img
                  src={
                    fac.id === 'library'
                      ? '/images/gallery/library/library-reading-hall.jpg'
                      : fac.id === 'laboratory'
                      ? '/images/gallery/laboratory/lab-nursing-foundation.jpg'
                      : fac.id === 'classrooms'
                      ? '/images/gallery/classrooms/classroom-lecture-hall-1.jpg'
                      : '/images/gallery/events/event-lamp-lighting.jpg'
                  }
                  alt={`${fac.title} facility at Indian nursing institution`}
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <div className="absolute top-2 right-2">
                  <Badge variant="navy">{fac.taglineHindi || fac.title}</Badge>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-ink text-base mb-2">{fac.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed mb-4 flex-1">
                  {fac.shortDescription}
                </p>
                
                <ul className="space-y-1.5 text-2xs text-ink border-t border-border-subtle pt-3">
                  {fac.keyFeatures.slice(0, 2).map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/gallery">
            <Button variant="secondary" size="md">
              View Detailed Facility Photos &rarr;
            </Button>
          </Link>
        </div>
      </Section>

      {/* Affiliation Section (Explicit Placeholder Values) */}
      <Section
        id="affiliation"
        badge="Statutory Regulatory Information"
        title="Accreditation & Approvals"
        subtitle="Our educational programs follow guidelines established by regulatory medical and nursing authorities."
        bgVariant="surface-light"
      >
        <div className="max-w-3xl mx-auto">
          <Card variant="surface-light" padding="lg" className="border-t-4 border-t-brand">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-border-subtle">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg bg-surface flex items-center justify-center p-1 border border-border-subtle shadow-xs shrink-0">
                  <img
                    src="/images/Logos/College Logo.png"
                    alt="C.N.S. College Official Crest"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-ink">
                    C.N.S. Paramedical & Nursing College
                  </h3>
                  <p className="text-xs text-ink-muted">
                    Lakhaiyamau, Gursahaiganj Road, Samdhan, Kannauj (U.P.)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-surface p-2.5 rounded-lg border border-border-subtle shrink-0">
                <img
                  src="/images/Logos/State Medical Faculty logo.jpg"
                  alt="Uttar Pradesh State Medical Faculty"
                  className="w-10 h-10 rounded object-contain shrink-0"
                />
                <div className="text-left">
                  <div className="text-2xs uppercase tracking-wide font-bold text-accent-ink">Recognizing Body</div>
                  <div className="text-xs font-bold text-ink">U.P. State Medical Faculty</div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck className="w-5 h-5 text-brand shrink-0" aria-hidden="true" />
              <h4 className="text-sm font-bold text-ink">
                Regulatory Affiliation & Approvals Record
              </h4>
            </div>
            
            <p className="text-xs sm:text-sm text-ink-muted leading-relaxed mb-6">
              In accordance with institutional transparency policy, the regulatory registration numbers and affiliating university codes for C.N.S. Paramedical and Nursing College are recorded below:
            </p>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 bg-surface rounded border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-ink">State Medical Council Approval:</span>
                <span className="text-brand font-mono text-xs">{siteConfig.accreditationStatus}</span>
              </div>

              <div className="p-3 bg-surface rounded border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-ink">Indian Nursing Council (INC) Code:</span>
                <span className="text-brand font-mono text-xs">[TO_CONFIRM: INC Institutional Code]</span>
              </div>

              <div className="p-3 bg-surface rounded border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-ink">Affiliated University:</span>
                <span className="text-brand font-mono text-xs">[TO_CONFIRM: State Medical University Affiliation Order]</span>
              </div>

              <div className="p-3 bg-surface rounded border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className="font-semibold text-ink">Hospital Clinical Tie-ups:</span>
                <span className="text-brand font-mono text-xs">[TO_CONFIRM: Affiliated 100+ Bed Teaching Hospital Tie-Up]</span>
              </div>
            </div>

            <p className="text-xs text-ink-light mt-4 italic">
              Official copies of affiliation gazettes and regulatory approvals are available for in-person review at the Principal's Office during working hours (Monday–Saturday, 9:30 AM – 4:30 PM).
            </p>
          </Card>
        </div>

        <div className="text-center mt-10">
          <Link to="/contact">
            <Button variant="primary" size="md">
              Schedule Campus Visit & Document Review
            </Button>
          </Link>
        </div>
      </Section>
    </div>
  );
};
