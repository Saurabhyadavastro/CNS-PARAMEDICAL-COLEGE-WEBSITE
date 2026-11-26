import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle2, 
  ArrowLeft, 
  FileText, 
  BookOpen, 
  Briefcase,
  Send,
  PhoneCall,
  HelpCircle
} from 'lucide-react';
import { siteConfig } from '../content/siteConfig';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { SEO } from '../components/common/SEO';
import { useEnquiryModal } from '../context/EnquiryModalContext';

interface CourseDetailProps {
  courseIdOverride?: string;
}

export const CourseDetail: React.FC<CourseDetailProps> = ({ courseIdOverride }) => {
  const { openEnquiryModal } = useEnquiryModal();
  const { courseId: paramCourseId } = useParams<{ courseId: string }>();
  const activeId = courseIdOverride || paramCourseId;

  const course = siteConfig.courses.find((c) => c.id === activeId);

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  // Course specific curriculum modules
  const curriculumMap: Record<string, { year: string; subjects: string[] }[]> = {
    anm: [
      {
        year: 'Year 1: Foundational Sciences & Community Health',
        subjects: [
          'Community Health Nursing & Environmental Sanitation',
          'Health Promotion (Nutrition, Mental Health, Hygiene)',
          'Primary Healthcare Nursing (Infection Control, First Aid)',
          'Child Health Nursing (Neonatal Care, Immunization)',
        ],
      },
      {
        year: 'Year 2: Maternal Health & Midwifery Practice',
        subjects: [
          'Midwifery & Antenatal/Intrapartum/Postpartum Care',
          'Health Center Management & Healthcare Records',
          'Mandatory 6-Month Supervised Clinical & Community Fieldwork',
        ],
      },
    ],
    gnm: [
      {
        year: 'Year 1: Bio-Sciences & Nursing Foundations',
        subjects: [
          'Bio-Sciences (Anatomy, Physiology & Microbiology)',
          'Behavioral Sciences (Psychology & Sociology)',
          'Nursing Foundations (Fundamentals of Nursing & First Aid)',
          'Community Health Nursing I & Environmental Sanitation',
        ],
      },
      {
        year: 'Year 2: Medical-Surgical & Specialty Nursing',
        subjects: [
          'Medical-Surgical Nursing I (Disorders of Body Systems)',
          'Medical-Surgical Nursing II (ENT, Ophthalmology, Oncology)',
          'Mental Health & Psychiatric Nursing',
          'Child Health Nursing & Pediatric Care',
        ],
      },
      {
        year: 'Year 3: Midwifery, Community & Nursing Management',
        subjects: [
          'Midwifery and Gynecological Nursing',
          'Community Health Nursing II',
          'Hospital Administration & Professional Trends',
          'Mandatory 6-Month Intensive Hospital Clinical Internship',
        ],
      },
    ],
    'bsc-nursing': [
      {
        year: 'Semester I & II: Foundational Nursing Sciences',
        subjects: [
          'General Science, Applied Anatomy & Applied Physiology',
          'Applied Sociology & Applied Psychology',
          'Nursing Foundation I & II (Theoretical Principles & Clinical Lab Practice)',
          'First Aid, Infection Control & Biomedical Waste Management',
        ],
      },
      {
        year: 'Semester III & IV: Clinical Pathologies & Medical Care',
        subjects: [
          'Applied Biochemistry & Applied Nutrition and Dietetics',
          'Pharmacology I & II, Pathology I & II, and Genetics',
          'Adult Health (Medical-Surgical) Nursing I with Comprehensive Hospital Postings',
          'Professional Values & Health Assessment',
        ],
      },
      {
        year: 'Semester V & VI: Maternal, Child & Mental Health',
        subjects: [
          'Child Health Nursing (Pediatrics) & Practical Clinical Rotations',
          'Mental Health Nursing (Psychiatry) & De-addiction Nursing',
          'Community Health Nursing I including Rural Kannauj Fieldwork',
          'Educational Technology & Nursing Pedagogy',
        ],
      },
      {
        year: 'Semester VII & VIII: Research, Leadership & Internship',
        subjects: [
          'Midwifery / Obstetrics & Gynecology (OBG) Nursing',
          'Nursing Research & Biostatistics',
          'Healthcare Management & Health Economics',
          'Mandatory 6-Month Full-Time Rotatory Clinical Internship',
        ],
      },
    ],
  };

  const curriculum = curriculumMap[course.id] || [];

  return (
    <div className="flex flex-col">
      <SEO
        title={`${course.title} (${course.code})`}
        description={`Admission and curriculum details for ${course.title} at C.N.S. Paramedical and Nursing College, Kannauj. Duration: ${course.duration}. Eligibility: ${course.eligibility}`}
      />

      {/* Breadcrumb & Hero */}
      <div className="bg-navy-dark text-white py-12 md:py-16 border-b-4 border-brand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white mb-4 focus-ring-navy rounded py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Back to All Courses</span>
          </Link>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="brand">{course.code}</Badge>
            <Badge variant="accent">Session 2026–27</Badge>
            <span className="text-xs text-slate-300 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
              {course.duration}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-2">
            {course.title}
          </h1>

          {course.hindiTagline && (
            <p className="text-accent text-sm md:text-base font-semibold mb-4">
              {course.hindiTagline}
            </p>
          )}

          <p className="text-slate-300 text-base md:text-lg max-w-3xl leading-relaxed">
            {course.shortDescription}
          </p>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Details & Syllabus */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Eligibility & Affiliation Card */}
            <Card variant="surface-light" padding="lg">
              <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-brand" aria-hidden="true" />
                <span>Eligibility Criteria & Academic Prerequisites</span>
              </h2>
              <div className="p-4 bg-surface rounded-md border border-border-subtle mb-4">
                <p className="text-sm md:text-base text-ink font-medium leading-relaxed">
                  {course.eligibility}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-3 bg-surface rounded border border-border-subtle">
                  <span className="text-ink-light block text-xs">Affiliated Body / Council:</span>
                  <span className="font-semibold text-ink">{course.affiliation}</span>
                </div>
                <div className="p-3 bg-surface rounded border border-border-subtle">
                  <span className="text-ink-light block text-xs">Annual Intake Capacity:</span>
                  <span className="font-semibold text-ink">{course.seats}</span>
                </div>
              </div>
            </Card>

            {/* Curriculum Breakdown */}
            <div>
              <h2 className="text-2xl font-bold text-ink mb-6 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-brand" aria-hidden="true" />
                <span>Curriculum & Program Structure</span>
              </h2>

              <div className="space-y-4">
                {curriculum.map((block, idx) => (
                  <Card key={idx} variant="default" padding="md">
                    <CardHeader className="mb-2">
                      <CardTitle className="text-base sm:text-lg text-brand font-bold">
                        {block.year}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 text-xs sm:text-sm text-ink">
                        {block.subjects.map((sub, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Career Opportunities */}
            <Card variant="default" padding="lg">
              <h2 className="text-xl font-bold text-ink mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-brand" aria-hidden="true" />
                <span>Career Scope & Employment Sectors</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                {course.careerProspects.map((prospect, idx) => (
                  <div key={idx} className="flex items-start gap-2 p-2.5 rounded bg-surface-light border border-border-subtle">
                    <CheckCircle2 className="w-4 h-4 text-status-success shrink-0 mt-0.5" aria-hidden="true" />
                    <span className="font-medium text-ink">{prospect}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Short FAQ Section */}
            {course.faqs && course.faqs.length > 0 && (
              <Card variant="surface-light" padding="lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-ink flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-brand" aria-hidden="true" />
                    <span>Frequently Asked Questions ({course.code})</span>
                  </h2>
                  <Badge variant="navy" size="sm">
                    {course.faqs.length} FAQs
                  </Badge>
                </div>
                <div className="space-y-3">
                  {course.faqs.map((faq, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg bg-surface border border-border-subtle"
                    >
                      <h3 className="text-xs sm:text-sm font-bold text-ink mb-1.5 flex items-start gap-2">
                        <span className="text-brand font-bold shrink-0">Q{idx + 1}.</span>
                        <span>{faq.question}</span>
                      </h3>
                      <p className="text-xs sm:text-sm text-ink-muted leading-relaxed pl-6">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            )}

          </div>

          {/* Right Column: Admission Card & Key Takeaways */}
          <div className="space-y-6">
            <Card variant="surface-light" padding="md" className="sticky top-28 border-t-4 border-t-brand">
              <CardHeader>
                <Badge variant="accent" size="sm" className="mb-2">
                  Admissions
                </Badge>
                <CardTitle className="text-lg">
                  Apply for {course.code}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-xs sm:text-sm">
                <div>
                  <span className="text-ink-light block text-xs">Course Duration:</span>
                  <span className="font-bold text-ink">{course.duration}</span>
                </div>
                <div>
                  <span className="text-ink-light block text-xs">Approved Annual Fee:</span>
                  <span className="font-semibold text-ink">{course.feesPerYear}</span>
                </div>
                <div>
                  <span className="text-ink-light block text-xs">Admissions Office:</span>
                  <span className="text-ink">Lakhaiyamau, Samdhan, Kannauj</span>
                </div>
                <div>
                  <span className="text-ink-light block text-xs">Desk Hours:</span>
                  <span className="text-ink">{siteConfig.contact.hours.days} ({siteConfig.contact.hours.timing})</span>
                </div>

                <div className="pt-4 border-t border-border-subtle flex flex-col gap-2">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    onClick={() => openEnquiryModal(course.code as any)}
                    rightIcon={<Send className="w-4 h-4" aria-hidden="true" />}
                  >
                    Submit Online Inquiry
                  </Button>
                  <a href={`tel:${siteConfig.contact.phone}`} className="w-full">
                    <Button variant="secondary" size="md" className="w-full" leftIcon={<PhoneCall className="w-4 h-4" aria-hidden="true" />}>
                      Call Admissions Desk
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Other Courses Links */}
            <Card variant="default" padding="md">
              <h3 className="font-bold text-sm text-ink mb-3">
                Other Nursing Programs
              </h3>
              <div className="flex flex-col gap-2">
                {siteConfig.courses
                  .filter((c) => c.id !== course.id)
                  .map((other) => (
                    <Link
                      key={other.id}
                      to={other.path}
                      className="p-2.5 rounded border border-border-subtle hover:bg-surface-light text-xs font-semibold text-brand flex items-center justify-between"
                    >
                      <span>{other.title}</span>
                      <span>&rarr;</span>
                    </Link>
                  ))}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};
