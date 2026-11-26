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
  Camera
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
        <div className="absolute inset-0 bg-gradient-to-r from-navy-dark via-navy-dark/95 to-brand-dark/80 z-10" />
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity"
          style={{ backgroundImage: `url('/images/campus/courtyard-aerial.jpg')` }}
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
              <span className="text-xs text-slate-300 font-medium">
                Admissions Session 2026–2027 Open
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight mb-4">
              {siteConfig.collegeName}
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-200 leading-relaxed mb-6 font-normal">
              Empowering healthcare aspirants through patient-centered clinical practice, disciplined mentorship, and state-of-the-art medical education in rural and urban nursing.
            </p>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300 mb-8 bg-white/10 backdrop-blur-sm px-4 py-2.5 rounded-lg w-fit border border-white/10">
              <MapPin className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
              <span>{siteConfig.contact.address.full}</span>
            </div>

            {/* Primary Action Button: Opens Enquiry Modal */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                variant="accent"
                size="lg"
                onClick={() => openEnquiryModal()}
                rightIcon={<ArrowRight className="w-5 h-5" aria-hidden="true" />}
              >
                Apply / Enquire Now
              </Button>
              <Link to="/courses">
                <Button variant="secondary" size="lg">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
              src="/images/campus/gate.jpg"
              alt="C.N.S. Paramedical and Nursing College main campus entrance gate in Samdhan, Kannauj"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/90 via-transparent to-transparent flex items-end p-5">
              <div>
                <span className="text-xs uppercase font-bold text-accent tracking-wide">Campus Entrance</span>
                <p className="text-sm font-semibold text-white">Main Academic Gateway & Security Desk, Lakhaiyamau</p>
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
              className="flex flex-col h-full border-t-4 border-t-brand hover:border-t-brand-dark"
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="brand">{course.code}</Badge>
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
                  <p className="text-xs sm:text-sm text-ink-muted mb-4 leading-relaxed">
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
              className="p-6 rounded-xl border border-border-subtle bg-surface hover:shadow-card hover:border-brand/40 transition-all flex flex-col"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-faint text-brand flex items-center justify-center mb-4 shrink-0">
                {idx === 0 && <BookOpen className="w-6 h-6" aria-hidden="true" />}
                {idx === 1 && <FlaskConical className="w-6 h-6" aria-hidden="true" />}
                {idx === 2 && <Monitor className="w-6 h-6" aria-hidden="true" />}
                {idx === 3 && <Building2 className="w-6 h-6" aria-hidden="true" />}
              </div>
              <h3 className="font-bold text-ink text-base mb-2">{fac.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed flex-1">{fac.description}</p>
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
