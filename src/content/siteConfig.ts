/**
 * Centralized Single Source of Truth for C.N.S. Paramedical and Nursing College
 * 
 * STRICT RULE: Do not invent facts. Confirmed facts are strictly from official prompt and documents.
 * All unverified items are explicitly marked with '[TO_CONFIRM]'.
 */

import { websiteCopy, FAQItem } from './websiteCopy';

export interface CourseDetail {
  id: string;
  code: string;
  title: string;
  hindiTagline?: string;
  shortDescription: string;
  duration: string;
  eligibility: string;
  seats: string;
  feesPerYear: string;
  affiliation: string;
  highlights: string[];
  careerProspects: string[];
  faqs: FAQItem[];
  path: string;
}

export interface SiteConfig {
  collegeName: string;
  collegeShortName: string;
  tagline: string;
  hindiTagline: string;
  establishedYear: number;
  accreditationStatus: string;
  contact: {
    address: {
      line1: string;
      landmark: string;
      town: string;
      district: string;
      state: string;
      pincode: string;
      full: string;
    };
    phone: string;
    altPhone: string;
    email: string;
    admissionHelpline: string;
    hours: {
      days: string;
      timing: string;
      closedDays: string;
    };
    mapEmbedUrl: string;
    mapDirectionsUrl: string;
  };
  socialLinks: {
    facebook: string;
    twitter: string;
    instagram: string;
    youtube: string;
    linkedin: string;
  };
  administration: {
    principalName: string;
    principalDesignation: string;
    principalMessage: string;
    directorName: string;
  };
  courses: CourseDetail[];
  quickStats: {
    label: string;
    value: string;
    sublabel: string;
  }[];
  facilities: {
    id: string;
    title: string;
    taglineHindi?: string;
    description: string;
    icon: string;
    keyFeatures: string[];
  }[];
}

export const siteConfig: SiteConfig = {
  collegeName: websiteCopy.institute.name,
  collegeShortName: 'C.N.S. Paramedical College',
  tagline: websiteCopy.institute.tagline,
  hindiTagline: websiteCopy.institute.hindiTagline,
  establishedYear: websiteCopy.institute.establishedYear,
  accreditationStatus: '[TO_CONFIRM: UP State Medical Faculty / Indian Nursing Council Recognition]',
  
  contact: {
    address: {
      line1: 'Lakhaiyamau',
      landmark: 'Gursahaiganj Road',
      town: 'Samdhan',
      district: 'Kannauj',
      state: 'Uttar Pradesh',
      pincode: '209735',
      full: 'Lakhaiyamau, Gursahaiganj Road, Samdhan, Kannauj, Uttar Pradesh – 209735',
    },
    phone: '[TO_CONFIRM: Official Contact Number]',
    altPhone: '[TO_CONFIRM: Alternate Contact Number]',
    email: '[TO_CONFIRM: info@cnsparamedical.in]',
    admissionHelpline: '[TO_CONFIRM: Admission Desk Phone]',
    hours: {
      days: 'Monday – Saturday',
      timing: '9:30 AM – 4:30 PM',
      closedDays: 'Sunday & Gazetted Holidays',
    },
    mapEmbedUrl: 'https://maps.google.com/maps?q=Lakhaiyamau,+Gursahaiganj+Road,+Samdhan,+Kannauj,+Uttar+Pradesh+209735&t=&z=14&ie=UTF8&iwloc=&output=embed',
    mapDirectionsUrl: 'https://www.google.com/maps/search/?api=1&query=Lakhaiyamau+Gursahaiganj+Road+Samdhan+Kannauj+Uttar+Pradesh+209735',
  },

  socialLinks: {
    facebook: '[TO_CONFIRM: Facebook Page URL]',
    twitter: '[TO_CONFIRM: Twitter/X Profile URL]',
    instagram: '[TO_CONFIRM: Instagram Handle URL]',
    youtube: '[TO_CONFIRM: YouTube Channel URL]',
    linkedin: '[TO_CONFIRM: LinkedIn Profile URL]',
  },

  administration: {
    principalName: '[TO_CONFIRM: Principal / Dean Name]',
    principalDesignation: 'Principal, C.N.S. Paramedical and Nursing College',
    principalMessage: 'Welcome to C.N.S. Paramedical and Nursing College. Founded in 2022 in Kannauj, our institute prepares modern nursing and paramedic professionals equipped with rigorous clinical skills, ethical compassion, and dedicated community service.',
    directorName: '[TO_CONFIRM: Managing Director / Chairman Name]',
  },

  courses: [
    {
      id: websiteCopy.courses.anm.id,
      code: websiteCopy.courses.anm.code,
      title: websiteCopy.courses.anm.title,
      hindiTagline: websiteCopy.courses.anm.hindiTagline,
      shortDescription: websiteCopy.courses.anm.overview,
      duration: websiteCopy.courses.anm.duration,
      eligibility: websiteCopy.courses.anm.eligibility,
      seats: websiteCopy.courses.anm.seats,
      feesPerYear: websiteCopy.courses.anm.fees,
      affiliation: websiteCopy.courses.anm.approvalStatus,
      path: '/courses/anm',
      highlights: websiteCopy.courses.anm.curriculumHighlights,
      careerProspects: websiteCopy.courses.anm.careerOptions,
      faqs: websiteCopy.courses.anm.faqs,
    },
    {
      id: websiteCopy.courses.gnm.id,
      code: websiteCopy.courses.gnm.code,
      title: websiteCopy.courses.gnm.title,
      hindiTagline: websiteCopy.courses.gnm.hindiTagline,
      shortDescription: websiteCopy.courses.gnm.overview,
      duration: websiteCopy.courses.gnm.duration,
      eligibility: websiteCopy.courses.gnm.eligibility,
      seats: websiteCopy.courses.gnm.seats,
      feesPerYear: websiteCopy.courses.gnm.fees,
      affiliation: websiteCopy.courses.gnm.approvalStatus,
      path: '/courses/gnm',
      highlights: websiteCopy.courses.gnm.curriculumHighlights,
      careerProspects: websiteCopy.courses.gnm.careerOptions,
      faqs: websiteCopy.courses.gnm.faqs,
    },
    {
      id: websiteCopy.courses.bscNursing.id,
      code: websiteCopy.courses.bscNursing.code,
      title: websiteCopy.courses.bscNursing.title,
      hindiTagline: websiteCopy.courses.bscNursing.hindiTagline,
      shortDescription: websiteCopy.courses.bscNursing.overview,
      duration: websiteCopy.courses.bscNursing.duration,
      eligibility: websiteCopy.courses.bscNursing.eligibility,
      seats: websiteCopy.courses.bscNursing.seats,
      feesPerYear: websiteCopy.courses.bscNursing.fees,
      affiliation: websiteCopy.courses.bscNursing.approvalStatus,
      path: '/courses/bsc-nursing',
      highlights: websiteCopy.courses.bscNursing.curriculumHighlights,
      careerProspects: websiteCopy.courses.bscNursing.careerOptions,
      faqs: websiteCopy.courses.bscNursing.faqs,
    },
  ],

  quickStats: [
    { label: 'Established', value: '2022', sublabel: 'Modern Healthcare Campus' },
    { label: 'Campus Area', value: 'Spacious', sublabel: 'Lush Green Quadrangle & Lawns' },
    { label: 'Core Programs', value: '3 Courses', sublabel: 'ANM, GNM & B.Sc. Nursing' },
    { label: 'Working Hours', value: 'Mon – Sat', sublabel: '9:30 AM – 4:30 PM' },
  ],

  facilities: websiteCopy.facilities.map((fac) => ({
    id: fac.id,
    title: fac.title,
    taglineHindi: fac.taglineHindi,
    description: fac.shortDescription,
    keyFeatures: fac.keyFeatures,
    icon: fac.id === 'library' ? 'BookOpen' : fac.id === 'laboratory' ? 'FlaskConical' : fac.id === 'classrooms' ? 'Monitor' : 'Building2',
  })),
};
