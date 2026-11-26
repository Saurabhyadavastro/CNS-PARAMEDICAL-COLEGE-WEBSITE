import React from 'react';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ExternalLink,
  Building2
} from 'lucide-react';
import { siteConfig } from '../content/siteConfig';
import { Section } from '../components/ui/Section';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SEO } from '../components/common/SEO';
import { EnquiryForm } from '../components/common/EnquiryForm';

export const Contact: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO
        title="Contact & Admissions Desk"
        description="Contact C.N.S. Paramedical and Nursing College, Lakhaiyamau, Gursahaiganj Road, Samdhan, Kannauj, Uttar Pradesh – 209735. Hours: Mon–Sat, 9:30 AM – 4:30 PM. Submit an admission enquiry online."
      />

      {/* Header */}
      <div className="bg-navy-dark text-white py-12 md:py-16 border-b-4 border-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="accent" size="sm" className="mb-3">
              Admissions & Contact
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Get in Touch with Admissions Desk
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              We welcome prospective nursing candidates, parents, and visitors to our campus in Samdhan, Kannauj. Submit an inquiry or visit during official hours.
            </p>
          </div>
        </div>
      </div>

      <Section
        id="contact-section"
        badge="Direct Inquiries"
        title="Campus Office & Admission Helpdesk"
        bgVariant="surface"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Contact Cards & Campus Hours */}
          <div className="lg:col-span-5 space-y-6">
            <Card variant="surface-light" padding="md" className="border-t-4 border-t-brand">
              <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand" aria-hidden="true" />
                <span>Campus Location</span>
              </h2>
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-bold text-ink block">Official Postal Address:</span>
                    <p className="text-ink-muted leading-relaxed">{siteConfig.contact.address.full}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-border-subtle">
                  <Clock className="w-5 h-5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-bold text-ink block">Office Working Hours:</span>
                    <p className="text-ink">{siteConfig.contact.hours.days}</p>
                    <p className="text-brand font-semibold">{siteConfig.contact.hours.timing}</p>
                    <p className="text-xs text-ink-light">({siteConfig.contact.hours.closedDays})</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-border-subtle">
                  <Phone className="w-5 h-5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-bold text-ink block">Telephone Desk:</span>
                    <p className="text-ink">{siteConfig.contact.phone}</p>
                    <p className="text-xs text-ink-light">Admission Hotline: {siteConfig.contact.admissionHelpline}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-3 border-t border-border-subtle">
                  <Mail className="w-5 h-5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <span className="font-bold text-ink block">Official Email:</span>
                    <p className="text-ink">{siteConfig.contact.email}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border-subtle">
                <a
                  href={siteConfig.contact.mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand hover:text-brand-dark focus-ring underline"
                >
                  <span>Open in Google Maps for GPS Navigation</span>
                  <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                </a>
              </div>
            </Card>

            {/* Google Maps Embed */}
            <div className="rounded-xl overflow-hidden shadow-card border border-border-subtle bg-surface-muted aspect-[4/3] relative">
              <iframe
                title="C.N.S. Paramedical and Nursing College Location Map"
                src={siteConfig.contact.mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Right Column: Admission Inquiry Form */}
          <div className="lg:col-span-7">
            <Card variant="default" padding="lg" className="border-t-4 border-t-brand">
              <CardHeader>
                <Badge variant="accent" size="sm" className="mb-2">
                  Session 2026–27
                </Badge>
                <CardTitle className="text-2xl">
                  Student Admission Inquiry Form
                </CardTitle>
                <p className="text-xs sm:text-sm text-ink-muted mt-1">
                  Fill in your academic background. Our counselors will verify program eligibility and guide you regarding fee details and seat confirmation.
                </p>
              </CardHeader>

              <CardContent>
                <EnquiryForm />
              </CardContent>
            </Card>
          </div>

        </div>
      </Section>
    </div>
  );
};
