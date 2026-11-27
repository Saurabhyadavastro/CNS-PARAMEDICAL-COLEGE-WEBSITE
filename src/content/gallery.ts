export type GalleryCategory = 'library' | 'laboratory' | 'classrooms' | 'events';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: GalleryCategory;
  categoryName: string;
  featured?: boolean;
}

export interface GalleryTabConfig {
  id: GalleryCategory;
  name: string;
  tabLabel: string;
  description: string;
}

export const galleryTabs: GalleryTabConfig[] = [
  {
    id: 'library',
    name: 'Library',
    tabLabel: 'Library',
    description: 'Curated repository of nursing, paramedical textbooks, clinical journals, e-learning terminals, and quiet study halls.',
  },
  {
    id: 'laboratory',
    name: 'Laboratory',
    tabLabel: 'Laboratory',
    description: 'Specialized clinical skill laboratories for hands-on nursing practice, human anatomy models, physiology, and maternal-child health.',
  },
  {
    id: 'classrooms',
    name: 'Classrooms',
    tabLabel: 'Classrooms',
    description: 'Spacious, well-ventilated tiered lecture halls equipped with modern audiovisual aids, interactive touch panels, and ergonomic seating.',
  },
  {
    id: 'events',
    name: 'Events',
    tabLabel: 'Events (Multipurpose Hall programs)',
    description: 'Vibrant academic convocations, lamp lighting ceremonies, induction oaths, cultural activities, and health outreach camps held in the Multipurpose Hall.',
  },
];

export const galleryImages: GalleryImage[] = [
  // Library Category
  {
    id: 'lib-01',
    src: '/images/gallery/library/library-reading-hall.jpg',
    alt: 'Central reading hall of C.N.S. Paramedical College library with study carrels and reference literature',
    caption: 'Central Medical Library & Quiet Reading Hall',
    category: 'library',
    categoryName: 'Library',
    featured: true,
  },
  {
    id: 'lib-02',
    src: '/images/gallery/library/library-reference-stack.jpg',
    alt: 'Comprehensive textbook and journal stacks covering nursing, pharmacology, and anatomy',
    caption: 'Paramedical Reference Stacks & Medical Journals',
    category: 'library',
    categoryName: 'Library',
  },
  {
    id: 'lib-03',
    src: '/images/gallery/library/library-digital-learning.jpg',
    alt: 'Digital e-library stations with dedicated computer terminals for medical research databases',
    caption: 'E-Library Portal & Computer Research Stations',
    category: 'library',
    categoryName: 'Library',
  },

  // Laboratory Category
  {
    id: 'lab-01',
    src: '/images/gallery/laboratory/lab-nursing-foundation.jpg',
    alt: 'Nursing foundation laboratory equipped with patient care manikins, hospital beds, and clinical tools',
    caption: 'Nursing Foundation & Skill Simulation Lab',
    category: 'laboratory',
    categoryName: 'Laboratory',
    featured: true,
  },
  {
    id: 'lab-02',
    src: '/images/gallery/laboratory/lab-anatomy-physiology.jpg',
    alt: 'Anatomy and physiology demonstration lab with Indian nursing students practicing on anatomical simulation models',
    caption: 'Anatomy & Physiology Demonstration Lab',
    category: 'laboratory',
    categoryName: 'Laboratory',
    featured: true,
  },
  {
    id: 'lab-03',
    src: '/images/gallery/laboratory/lab-maternal-child-health.jpg',
    alt: 'Maternal and child health laboratory featuring delivery simulators and neonatal care suites',
    caption: 'Maternal & Child Health (MCH) Simulation Lab',
    category: 'laboratory',
    categoryName: 'Laboratory',
  },

  // Classrooms Category
  {
    id: 'cls-01',
    src: '/images/gallery/classrooms/classroom-lecture-hall-1.jpg',
    alt: 'Tiered academic lecture hall with comfortable seating and acoustic sound conditioning',
    caption: 'Tiered Academic Lecture Hall',
    category: 'classrooms',
    categoryName: 'Classrooms',
  },
  {
    id: 'cls-02',
    src: '/images/gallery/classrooms/classroom-smart-interactive.jpg',
    alt: 'Smart interactive classroom with interactive digital board and multimedia teaching setup',
    caption: 'Smart Interactive Teaching Classroom',
    category: 'classrooms',
    categoryName: 'Classrooms',
    featured: true,
  },
  {
    id: 'cls-03',
    src: '/images/gallery/classrooms/classroom-audiovisual-theatre.jpg',
    alt: 'Audiovisual demonstration theatre for medical webinars and live clinical procedure lectures',
    caption: 'Audiovisual Clinical Demonstration Theatre',
    category: 'classrooms',
    categoryName: 'Classrooms',
  },

  // Events (Multipurpose Hall programs) Category
  {
    id: 'evt-01',
    src: '/images/gallery/events/event-lamp-lighting.jpg',
    alt: 'Florence Nightingale lamp lighting and oath ceremony with Indian nursing students in white uniform taking oath',
    caption: 'Nightingale Lamp Lighting & Oath Ceremony',
    category: 'events',
    categoryName: 'Events (Multipurpose Hall programs)',
    featured: true,
  },
  {
    id: 'evt-02',
    src: '/images/gallery/events/event-annual-day-conclave.jpg',
    alt: 'Annual college day convocation and student presentations held in the college Multipurpose Hall',
    caption: 'Annual College Day & Cultural Conclave',
    category: 'events',
    categoryName: 'Events (Multipurpose Hall programs)',
    featured: true,
  },
  {
    id: 'evt-03',
    src: '/images/gallery/events/event-community-health-camp.jpg',
    alt: 'Community health camp workshop and rural clinical screening outreach in Uttar Pradesh',
    caption: 'Community Health Camp & Outreach Symposium',
    category: 'events',
    categoryName: 'Events (Multipurpose Hall programs)',
  },
];

export const featuredGalleryImages = galleryImages.filter((img) => img.featured).slice(0, 6);
