import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  FlaskConical, 
  Monitor, 
  Building2, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Send,
  Eye,
  Camera,
  ShieldCheck
} from 'lucide-react';
import { siteConfig } from '../content/siteConfig';
import { featuredGalleryImages } from '../content/gallery';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Section } from '../components/ui/Section';
import { NoticeTicker } from '../components/home/NoticeTicker';
import { SEO } from '../components/common/SEO';
import { Lightbox } from '../components/common/Lightbox';
import { useEnquiryModal } from '../context/EnquiryModalContext';

export const Home: React.FC = () => {
  const { openEnquiryModal } = useEnquiryModal();
  const [previewLightboxIndex, setPreviewLightboxIndex] = useState<number>(-1);
  return (
    <div className="flex flex-col">
      <SEO
        title="Home"
        description="Official website for C.N.S. Paramedical and Nursing College, Lakhaiyamau, Gursahaiganj Road, Samdhan, Kannauj, Uttar Pradesh. Approved courses: ANM, GNM, and B.Sc. Nursing. Established 2022."
      />

      {/* Supabase Realtime/Polled Notice Ticker with Hover Pause and Reduced Motion */}
      <NoticeTicker />

      {/* Hero Section */}
      <section
        className="relative bg-navy-dark text-white py-16 md:py-24 lg:py-28 overflow-hidden"
        aria-label="Welcome banner"
      >
        {/* Full-Fidelity Campus Photo - Natural Color & High Visibility */}
        <div 
          className="absolute inset-0 bg-cover bg-center md:bg-[position:center_30%] scale-100 transition-transform duration-700 ease-out"
          style={{ backgroundImage: `url('/images/campus/courtyard-aerial.jpg')` }}
          aria-hidden="true"
        />

        {/* Directional Scrim Overlay: Strong contrast for text on the left, open and vibrant on the right */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-navy-dark via-navy-dark/85 to-navy-dark/40 md:bg-gradient-to-r md:from-navy-dark md:via-navy-dark/85 md:via-50% md:to-navy-dark/20 lg:to-transparent z-10" 
          aria-hidden="true"
        />

        {/* Subtle Top & Bottom Gradient to blend seamlessly with surrounding elements */}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-navy-dark/50 via-transparent to-navy-dark/90 z-10 pointer-events-none" 
          aria-hidden="true"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="accent" size="md">
                Established 2022
              </Badge>
              <Badge variant="navy" size="md">
                Kannauj, Uttar Pradesh
              </Badge>
              <span className="text-xs text-slate-200 font-semibold drop-shadow-xs">
                Admissions Session 2026–2027 Open
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4 drop-shadow-sm">
              {siteConfig.collegeName}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-100 leading-relaxed mb-6 font-normal drop-shadow-xs">
              Empowering healthcare aspirants through patient-centered clinical practice, disciplined mentorship, and state-of-the-art medical education in rural and urban nursing.
            </p>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-100 mb-8 bg-navy-dark/60 backdrop-blur-md px-4 py-2.5 rounded-lg w-fit border border-white/20 shadow-sm">
              <MapPin className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
              <span>{siteConfig.contact.address.full}</span>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="accent"
                size="lg"
                onClick={() => openEnquiryModal()}
                rightIcon={<ArrowRight className="w-5 h-5" aria-hidden="true" />}
                className="shadow-lg hover:shadow-xl"
              >
                Apply / Enquire Now
              </Button>
              <Link to="/courses">
                <Button variant="secondary" size="lg" className="shadow-md bg-white/95 hover:bg-white text-navy font-bold">
                  Explore Courses
                </Button>
              </Link>
            </div>

            {/* Campus Infrastructure Badge */}
            <div className="mt-8 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-200">
              <div className="flex items-center gap-2 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                <span>Admissions Active for 2026–2027 Academic Session</span>
              </div>
              <div className="hidden sm:flex items-center gap-2 bg-navy-dark/70 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white shadow-xs">
                <Building2 className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                <span className="font-medium">Campus View: Academic Complex & Quadrangle, Samdhan</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Accreditation & Institutional Trust Bar */}
      <div className="bg-surface-light border-y border-border-subtle py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center p-1 border border-border-subtle shadow-xs shrink-0">
              <img
                src="/images/Logos/College Logo.png"
                alt="C.N.S. Paramedical & Nursing College Emblem"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-2xs font-bold uppercase tracking-wider text-brand">Institutional Emblem</div>
              <div className="text-xs sm:text-sm font-extrabold text-navy-dark leading-tight">C.N.S. Paramedical & Nursing College</div>
              <div className="text-2xs text-ink-muted">Samdhan, Kannauj · Est. 2022</div>
            </div>
          </div>

          <div className="hidden md:block h-8 w-px bg-border-subtle" />

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center p-1 border border-border-subtle shadow-xs shrink-0">
              <img
                src="/images/Logos/State Medical Faculty logo.jpg"
                alt="Uttar Pradesh State Medical Faculty Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-2xs font-bold uppercase tracking-wider text-accent-ink">Regulatory Recognition</div>
              <div className="text-xs sm:text-sm font-extrabold text-navy-dark leading-tight">U.P. State Medical Faculty, Lucknow</div>
              <div className="text-2xs text-ink-muted">State Paramedical & Nursing Regulatory Body</div>
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs text-ink-muted bg-surface py-2 px-3 rounded-md border border-border-subtle">
            <ShieldCheck className="w-4 h-4 text-brand shrink-0" aria-hidden="true" />
            <span>Adhering to Indian Nursing Council & State Medical Faculty Norms</span>
          </div>
        </div>
      </div>

      {/* About Snippet Section */}
      <Section
        id="about-snippet"
        badge="About The Institute"
        title="Excellence in Nursing & Paramedical Education"
        subtitle="Dedicated to building skilled, compassionate, and ethical healthcare personnel in Uttar Pradesh."
        bgVariant="surface"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-4 text-ink text-base leading-relaxed">
            <p>
              Founded in <strong>2022</strong> at Lakhaiyamau on Gursahaiganj Road, Samdhan, Kannauj, <strong>C.N.S. Paramedical and Nursing College</strong> was established to meet the rising demand for qualified, compassionate healthcare professionals across hospitals, primary health centers, and emergency services.
            </p>
            <p className="text-ink-muted">
              The college provides a disciplined academic environment with hands-on clinical postings, dedicated faculty supervisors, and well-equipped simulation and anatomy laboratories for <strong>ANM</strong>, <strong>GNM</strong>, and <strong>B.Sc. Nursing</strong> students.
            </p>
            
            <div className="pt-2 flex flex-wrap gap-4 items-center">
              <Link to="/about">
                <Button variant="primary" size="md">
                  Read Full College Profile &rarr;
                </Button>
              </Link>
              <span className="text-xs text-ink-light flex items-center gap-1">
                <Clock className="w-4 h-4 text-brand" aria-hidden="true" />
                <span>Desk Hours: Mon–Sat, 9:30 AM – 4:30 PM</span>
              </span>
            </div>
          </div>

          <div className="rounded-xl overflow-hidden shadow-card border border-border-subtle bg-navy-dark relative aspect-video">
            <img
              src="/images/campus/courtyard-lawn.jpg"
              alt="C.N.S. Paramedical and Nursing College lush campus courtyard and academic block in Samdhan, Kannauj"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-transparent flex items-end p-5">
              <div>
                <span className="text-xs uppercase font-bold text-accent tracking-wide">Campus Grounds</span>
                <p className="text-sm font-semibold text-white">Lush Academic Courtyard & Main Institute Building, Lakhaiyamau</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* 3 Course Cards: ANM, GNM, B.Sc. Nursing */}
      <Section
        id="courses"
        badge="Academic Programs"
        title="Core Nursing Courses"
        subtitle="Approved curricula structured according to national and state nursing guidelines with intensive hospital rotations."
        bgVariant="surface-light"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {siteConfig.courses.map((course) => (
            <Card
              key={course.id}
              variant="interactive"
              className="flex flex-col h-full border-t-4 border-t-brand hover:border-t-brand-dark overflow-hidden"
            >
              {course.image && (
                <div className="w-full h-48 overflow-hidden relative border-b border-border-subtle bg-surface-muted">
                  <img
                    src={course.image}
                    alt={`${course.title} nursing and clinical training`}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge variant="navy">{course.code}</Badge>
                  </div>
                </div>
              )}
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-semibold text-brand font-mono">{course.code}</span>
                  <span className="text-xs font-semibold text-ink-muted flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                    {course.duration}
                  </span>
                </div>
                <CardTitle className="text-xl">
                  {course.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-ink-muted mb-4 leading-relaxed line-clamp-3">
                    {course.shortDescription}
                  </p>
                  
                  <div className="space-y-2 mb-6 text-xs text-ink">
                    <div className="font-semibold text-ink">Key Highlights:</div>
                    {course.highlights.slice(0, 3).map((hl, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand shrink-0 mt-0.5" aria-hidden="true" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
                  <Link
                    to={course.path}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-brand hover:text-brand-dark focus-ring rounded py-1"
                    aria-label={`View curriculum details for ${course.title}`}
                  >
                    <span>View Curriculum</span>
                    <ArrowRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openEnquiryModal(course.code as any)}
                  >
                    Enquire Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Facilities Strip: Library, Laboratory, Classrooms, Multipurpose Hall */}
      <Section
        id="facilities-strip"
        badge="Campus Infrastructure"
        title="Comprehensive Learning Facilities"
        subtitle="Our purpose-built campus provides clinical simulation setups, rich academic literature, and smart teaching technology."
        bgVariant="surface"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.facilities.map((fac, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-border-subtle bg-surface hover:shadow-card hover:border-brand/40 transition-all flex flex-col overflow-hidden"
            >
              {fac.image && (
                <div className="w-full h-36 overflow-hidden bg-surface-muted relative border-b border-border-subtle">
                  <img
                    src={fac.image}
                    alt={`${fac.title} facility at Indian nursing college`}
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute bottom-2 left-2 p-1.5 rounded-md bg-navy-dark/80 backdrop-blur-sm text-accent">
                    {idx === 0 && <BookOpen className="w-4 h-4" aria-hidden="true" />}
                    {idx === 1 && <FlaskConical className="w-4 h-4" aria-hidden="true" />}
                    {idx === 2 && <Monitor className="w-4 h-4" aria-hidden="true" />}
                    {idx === 3 && <Building2 className="w-4 h-4" aria-hidden="true" />}
                  </div>
                </div>
              )}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-ink text-base mb-2">{fac.title}</h3>
                <p className="text-xs text-ink-muted leading-relaxed flex-1">{fac.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Gallery Preview Section - 6 Selected Images */}
      <Section
        id="gallery-preview"
        badge="Visual Campus Tour"
        title="Inside Our Kannauj Campus & Facilities"
        subtitle="Explore purpose-built nursing laboratories, reference libraries, modern digital classrooms, and Multipurpose Hall event spaces."
        bgVariant="surface-light"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredGalleryImages.map((image, idx) => (
            <div
              key={image.id}
              className="bg-surface rounded-xl overflow-hidden shadow-card border border-border-subtle group hover:border-brand/40 hover:shadow-card-hover transition-all duration-300 flex flex-col"
            >
              <button
                type="button"
                onClick={() => setPreviewLightboxIndex(idx)}
                className="w-full relative aspect-[4/3] bg-navy-dark overflow-hidden focus-ring block text-left group-hover:cursor-pointer"
                aria-label={`Enlarge Photo: ${image.caption}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                <div className="absolute top-3 left-3 z-10" aria-hidden="true">
                  <Badge variant="accent" size="sm">
                    {image.categoryName}
                  </Badge>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-navy-dark/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4" aria-hidden="true">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-brand/90 px-3 py-1.5 rounded-md shadow-xs">
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                    Enlarge Photo
                  </span>
                  <span className="text-2xs font-semibold text-slate-300 bg-black/60 px-2 py-1 rounded">
                    4:3 Ratio
                  </span>
                </div>
              </button>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <h3 className="text-sm font-bold text-ink group-hover:text-brand transition-colors line-clamp-1">
                    {image.caption}
                  </h3>
                  <p className="text-xs text-ink-muted leading-relaxed mt-1 line-clamp-2">
                    {image.alt}
                  </p>
                </div>
                <div className="pt-3 mt-3 border-t border-border-subtle flex items-center justify-between text-2xs text-ink-muted">
                  <span className="capitalize">{image.category} Facility</span>
                  <button
                    type="button"
                    onClick={() => setPreviewLightboxIndex(idx)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand hover:text-brand-dark focus-ring rounded py-0.5 px-1"
                  >
                    <span>View</span>
                    <Eye className="w-3.5 h-3.5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/gallery">
            <Button variant="secondary" size="md" rightIcon={<Camera className="w-4 h-4" aria-hidden="true" />}>
              Explore All Campus Facility Tabs (12 Photos) &rarr;
            </Button>
          </Link>
          <Link to="/courses">
            <Button variant="ghost" size="md">
              View Available Medical Courses
            </Button>
          </Link>
        </div>
      </Section>

      {/* Accessible Home Lightbox for 6 Selected Images */}
      <Lightbox
        images={featuredGalleryImages}
        currentIndex={previewLightboxIndex}
        isOpen={previewLightboxIndex >= 0}
        onClose={() => setPreviewLightboxIndex(-1)}
        onNavigate={(newIdx) => setPreviewLightboxIndex(newIdx)}
      />

      {/* Enquiry CTA Band */}
      <section
        className="bg-navy-dark text-white py-14 px-4 sm:px-6 lg:px-8 border-y-4 border-brand relative overflow-hidden"
        aria-label="Admissions Call to Action"
      >
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div className="max-w-2xl">
            <Badge variant="accent" size="sm" className="mb-3">
              Admissions Open 2026–27
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
              Start Your Nursing Career with C.N.S. Paramedical College
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              Inquire online or visit our admissions office in Samdhan, Kannauj (Monday–Saturday, 9:30 AM – 4:30 PM). Our counselors are ready to answer your questions regarding seats, eligibility, and document submission.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Button
              variant="accent"
              size="lg"
              onClick={() => openEnquiryModal()}
              rightIcon={<Send className="w-4 h-4" aria-hidden="true" />}
            >
              Apply / Enquire Now
            </Button>
            <Link to="/courses">
              <Button variant="secondary" size="lg">
                View Syllabi
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
