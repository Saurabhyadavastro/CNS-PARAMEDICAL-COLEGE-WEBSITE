import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  ArrowRight
} from 'lucide-react';
import { siteConfig } from '../content/siteConfig';
import { Section } from '../components/ui/Section';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';

export const Courses: React.FC = () => {
  return (
    <div className="flex flex-col">
      <SEO
        title="Courses & Programs"
        description="Explore approved healthcare diploma and degree programs at C.N.S. Paramedical and Nursing College, Kannauj: ANM, GNM, and B.Sc. Nursing with comprehensive clinical hospital rotations."
      />

      {/* Header */}
      <div className="bg-navy-dark text-white py-12 md:py-16 border-b-4 border-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Badge variant="accent" size="sm" className="mb-3">
              Academic Curriculum
            </Badge>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
              Nursing & Healthcare Programs
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed">
              Explore professional diplomas and undergraduate degree programs in nursing offered at C.N.S. Paramedical and Nursing College, Kannauj.
            </p>
          </div>
        </div>
      </div>

      {/* Program Cards */}
      <Section
        id="all-courses"
        badge="Our Offerings"
        title="Choose Your Nursing Career Pathway"
        subtitle="Curricula structured according to national and state nursing standards, pairing classroom didactic learning with affiliated hospital rotations."
        bgVariant="surface"
      >
        <div className="space-y-8">
          {siteConfig.courses.map((course) => (
            <Card
              key={course.id}
              variant="default"
              padding="lg"
              className="border-l-4 border-l-brand hover:shadow-card-hover transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
                <div className="lg:col-span-2">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <Badge variant="brand">{course.code}</Badge>
                    <span className="text-xs font-semibold text-ink-muted flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                      Duration: {course.duration}
                    </span>
                    <Badge variant="neutral">Full-Time Regular</Badge>
                  </div>

                  <h2 className="text-2xl font-bold text-ink mb-1">
                    {course.title}
                  </h2>
                  {course.hindiTagline && (
                    <p className="text-xs sm:text-sm font-semibold text-brand mb-2.5">
                      {course.hindiTagline}
                    </p>
                  )}
                  <p className="text-ink-muted text-sm md:text-base leading-relaxed mb-4">
                    {course.shortDescription}
                  </p>

                  <div className="bg-surface-light p-4 rounded-lg border border-border-subtle mb-4">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brand mb-1">
                      Eligibility Requirements
                    </h3>
                    <p className="text-xs sm:text-sm text-ink leading-normal">
                      {course.eligibility}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-ink mb-2">
                    {course.highlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Action & Metadata Panel */}
                <div className="p-5 bg-surface-muted rounded-lg border border-border-subtle flex flex-col justify-between h-full">
                  {course.image && (
                    <div className="w-full h-40 rounded-lg overflow-hidden border border-border-subtle mb-4 relative shadow-sm">
                      <img
                        src={course.image}
                        alt={`${course.title} clinical simulation and training`}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}

                  <div className="space-y-3 text-xs sm:text-sm">
                    <div>
                      <span className="text-ink-light block text-xs">Affiliation & Approval:</span>
                      <span className="font-semibold text-ink">{course.affiliation}</span>
                    </div>
                    <div>
                      <span className="text-ink-light block text-xs">Annual Intake:</span>
                      <span className="font-semibold text-ink">{course.seats}</span>
                    </div>
                    <div>
                      <span className="text-ink-light block text-xs">Annual Tuition Fee:</span>
                      <span className="font-semibold text-ink">{course.feesPerYear}</span>
                    </div>
                  </div>

                  <div className="pt-6 mt-4 border-t border-border-subtle flex flex-col gap-2.5">
                    <Link to={course.path} className="w-full">
                      <Button variant="primary" size="md" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}>
                        View Detailed Syllabus
                      </Button>
                    </Link>
                    <Link to="/contact" className="w-full">
                      <Button variant="secondary" size="md" className="w-full">
                        Inquire for Admission
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      {/* Comparison Matrix Table */}
      <Section
        id="comparison"
        badge="Course Matrix"
        title="Program Comparison at a Glance"
        subtitle="Summary of eligibility criteria, duration, and target qualifications."
        bgVariant="surface-light"
      >
        <div className="overflow-x-auto rounded-lg border border-border-subtle bg-surface shadow-sm">
          <table className="min-w-full divide-y divide-border-subtle text-left text-sm" aria-label="Course comparison matrix">
            <thead className="bg-navy-dark text-white text-xs uppercase tracking-wider">
              <tr>
                <th scope="col" className="px-6 py-4 font-semibold">Course Code</th>
                <th scope="col" className="px-6 py-4 font-semibold">Program Title</th>
                <th scope="col" className="px-6 py-4 font-semibold">Duration</th>
                <th scope="col" className="px-6 py-4 font-semibold">Min. Qualification</th>
                <th scope="col" className="px-6 py-4 font-semibold">Intake</th>
                <th scope="col" className="px-6 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle text-ink">
              {siteConfig.courses.map((course) => (
                <tr key={course.id} className="hover:bg-surface-light transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap font-bold text-brand">
                    {course.code}
                  </td>
                  <td className="px-6 py-4 font-medium text-ink">
                    {course.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-ink-muted">
                    {course.duration}
                  </td>
                  <td className="px-6 py-4 text-xs text-ink-muted max-w-xs">
                    {course.eligibility}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-xs text-ink-muted">
                    {course.seats}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link
                      to={course.path}
                      className="text-brand hover:text-brand-dark font-bold text-xs underline focus-ring"
                    >
                      Details &rarr;
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
};
