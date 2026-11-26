import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ChevronRight, 
  ExternalLink,
  Building
} from 'lucide-react';
import { siteConfig } from '../../content/siteConfig';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-dark text-slate-300 text-sm border-t-4 border-brand">
      {/* Upper Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: About Institution */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-lg bg-white flex items-center justify-center p-1 shadow-sm border border-navy-border shrink-0">
                <img
                  src="/images/Logos/College Logo.png"
                  alt="C.N.S. Paramedical & Nursing College Emblem"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-white font-extrabold text-base leading-tight">
                {siteConfig.collegeName}
              </span>
            </div>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4">
              {siteConfig.tagline}. Established in 2022 to provide comprehensive nursing education and paramedic training in Kannauj, Uttar Pradesh.
            </p>
            <div className="p-3 bg-navy-surface rounded-md border border-navy-border text-xs text-slate-300">
              <div className="flex items-center gap-2.5 text-accent font-semibold mb-1.5">
                <img
                  src="/images/Logos/State Medical Faculty logo.jpg"
                  alt="Uttar Pradesh State Medical Faculty Logo"
                  className="w-6 h-6 rounded object-contain bg-white p-0.5 shrink-0"
                />
                <span>U.P. State Medical Faculty Recognized</span>
              </div>
              <p className="text-slate-400 text-xs">
                Courses adhering to statutory state nursing & paramedic curriculum standards.
              </p>
            </div>
          </div>

          {/* Col 2: Academic Programs */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 pb-2 border-b border-navy-border">
              Academic Courses
            </h3>
            <ul className="space-y-2.5">
              {siteConfig.courses.map((course) => (
                <li key={course.id}>
                  <Link
                    to={course.path}
                    className="flex items-center gap-2 text-slate-300 hover:text-accent focus-ring-navy rounded py-0.5 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-brand shrink-0" aria-hidden="true" />
                    <span>{course.title}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/courses"
                  className="flex items-center gap-2 text-accent hover:underline focus-ring-navy rounded py-0.5 font-semibold text-xs mt-2"
                >
                  <ChevronRight className="w-4 h-4" aria-hidden="true" />
                  <span>View All Course Details & Syllabus</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 pb-2 border-b border-navy-border">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { label: 'About Our Institution', path: '/about' },
                { label: 'Faculty & Mentors', path: '/faculty' },
                { label: 'Campus Infrastructure & Labs', path: '/gallery' },
                { label: 'Notice Board & Notifications', path: '/notices' },
                { label: 'Admission Inquiry Form', path: '/contact' },
                { label: 'Staff & Administration Login', path: '/admin' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="flex items-center gap-2 text-slate-300 hover:text-white focus-ring-navy rounded py-0.5 transition-colors"
                  >
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0" aria-hidden="true" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Campus Office & Hours */}
          <div>
            <h3 className="text-white font-bold text-base mb-4 pb-2 border-b border-navy-border">
              Campus & Office
            </h3>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <span>{siteConfig.contact.address.full}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                <span>{siteConfig.contact.phone}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                <span>{siteConfig.contact.email}</span>
              </div>
              <div className="flex items-start gap-2.5 pt-2 border-t border-navy-border">
                <Clock className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <p className="text-white font-medium">{siteConfig.contact.hours.days}</p>
                  <p className="text-slate-400">{siteConfig.contact.hours.timing}</p>
                  <p className="text-slate-400 text-xs">({siteConfig.contact.hours.closedDays})</p>
                </div>
              </div>
              <div className="pt-2">
                <a
                  href={siteConfig.contact.mapDirectionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-brand-soft hover:text-white focus-ring-navy underline font-medium"
                >
                  <Building className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Get Driving Directions on Google Maps</span>
                  <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar: Copyright & Accessibility Notice */}
      <div className="bg-black/40 border-t border-navy-border py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.collegeName}. All rights reserved. Est. {siteConfig.establishedYear}.
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-slate-400">WCAG 2.2 AA Compliant</span>
            <span>·</span>
            <Link to="/contact" className="hover:text-white focus-ring-navy">
              Campus Visit
            </Link>
            <span>·</span>
            <Link to="/admin" className="hover:text-white focus-ring-navy">
              Administration Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
