/**
 * Website Copy for C.N.S. Paramedical and Nursing College
 * Lakhaiyamau, Gursahaiganj Road, Samdhan, Kannauj, Uttar Pradesh – 209735
 * 
 * Rules:
 * - Simple, clear, scannable English.
 * - Short optional Hindi taglines for local cultural resonance.
 * - No fake statistics, rankings, placement records, or unconfirmed affiliation claims.
 * - All unconfirmed items marked strictly with [TO_CONFIRM].
 */

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FacilityCopy {
  id: string;
  title: string;
  taglineHindi?: string;
  shortDescription: string;
  keyFeatures: string[];
}

export interface CourseCopy {
  id: string;
  code: string;
  title: string;
  hindiTagline?: string;
  overview: string;
  duration: string;
  eligibility: string;
  seats: string;
  fees: string;
  approvalStatus: string;
  curriculumHighlights: string[];
  careerOptions: string[];
  faqs: FAQItem[];
}

export interface WebsiteCopy {
  institute: {
    name: string;
    tagline: string;
    hindiTagline: string;
    establishedYear: number;
    locationSummary: string;
    aboutSummary: string;
    aboutParagraphs: string[];
    missionStatement: string;
    missionPoints: string[];
    coreValues: { title: string; description: string }[];
  };
  facilities: FacilityCopy[];
  courses: Record<'anm' | 'gnm' | 'bscNursing', CourseCopy>;
}

export const websiteCopy: WebsiteCopy = {
  institute: {
    name: 'C.N.S. Paramedical and Nursing College',
    tagline: 'Committed to Professional Healthcare Education, Discipline, and Patient Care',
    hindiTagline: 'स्वास्थ्य सेवा में समर्पण, शिक्षा में उत्कृष्टता',
    establishedYear: 2022,
    locationSummary: 'Lakhaiyamau, Gursahaiganj Road, Samdhan, Kannauj, Uttar Pradesh (Pin 209735)',
    aboutSummary:
      'Established in 2022, C.N.S. Paramedical and Nursing College provides focused education in nursing and healthcare sciences. Located along Gursahaiganj Road in Samdhan, Kannauj, our campus offers a calm learning atmosphere, practical clinical laboratories, and dedicated faculty.',
    aboutParagraphs: [
      'C.N.S. Paramedical and Nursing College was founded in 2022 to meet the growing need for trained, ethical healthcare professionals in Kannauj and surrounding districts of Uttar Pradesh.',
      'Our academic curriculum combines classroom theory with hands-on practice in specialized laboratories. Students learn essential bedside care, clinical procedures, and community health principles under faculty guidance.',
      'We believe in discipline, empathy, and professional integrity. Our students are prepared to work effectively in hospitals, clinics, community health centers, and rural healthcare initiatives.',
    ],
    missionStatement:
      'To provide accessible, high-quality nursing and healthcare education that equips students with real clinical skills, professional ethics, and a sincere commitment to community health.',
    missionPoints: [
      'Deliver clear, practical instruction in nursing and medical sciences.',
      'Instill compassionate, patient-first care ethics in every student.',
      'Provide well-equipped laboratories for safe, hands-on procedure training.',
      'Prepare graduates for dependable service in primary and secondary healthcare setups.',
    ],
    coreValues: [
      {
        title: 'Compassion (सहानुभूति)',
        description: 'Treating every patient with kindness, dignity, and attentive care.',
      },
      {
        title: 'Clinical Skill (व्यावहारिक दक्षता)',
        description: 'Focusing on repeated, hands-on training for error-free patient care.',
      },
      {
        title: 'Integrity & Ethics (सत्यनिष्ठा)',
        description: 'Following transparent medical guidelines and strict nursing discipline.',
      },
      {
        title: 'Community Commitment (सामुदायिक सेवा)',
        description: 'Serving rural and semi-urban populations with genuine dedication.',
      },
    ],
  },

  facilities: [
    {
      id: 'library',
      title: 'Central Medical Library',
      taglineHindi: 'ज्ञान एवं अध्ययन केंद्र',
      shortDescription:
        'A quiet, organized reading hall containing essential nursing textbooks, reference volumes, medical journals, and study tables.',
      keyFeatures: [
        'Curated textbooks for ANM, GNM, and B.Sc. Nursing syllabi.',
        'Reference manuals on human anatomy, pharmacology, and patient care.',
        'Quiet study desks for individual study and examination revision.',
        'Digital station for accessing permitted educational databases.',
      ],
    },
    {
      id: 'laboratory',
      title: 'Clinical Skill Laboratories',
      taglineHindi: 'व्यावहारिक प्रशिक्षण प्रयोगशाला',
      shortDescription:
        'Dedicated training labs equipped with patient care manikins, medical instruments, and simulation setups for guided practical learning.',
      keyFeatures: [
        'Nursing Foundation Lab with hospital beds, IV stands, and injection models.',
        'Anatomy & Physiology Lab with full-size skeletons and organ models.',
        'Maternal & Child Health (MCH) setup for delivery and newborn care drills.',
        'Sterilization, dressing, and emergency first-aid practice stations.',
      ],
    },
    {
      id: 'classrooms',
      title: 'Ventilated Lecture Classrooms',
      taglineHindi: 'आधुनिक व्याख्यान कक्ष',
      shortDescription:
        'Spacious, well-lit, and well-ventilated classrooms designed for focused lecture sessions and multimedia presentations.',
      keyFeatures: [
        'Ergonomic student desk seating arranged for clear visibility.',
        'Blackboards, whiteboards, and audio-visual presentation equipment.',
        'Natural lighting and ventilation supporting comfortable study hours.',
        'Distraction-free environment fostering active student-teacher interaction.',
      ],
    },
    {
      id: 'multipurpose-hall',
      title: 'Multipurpose Hall & Auditorium',
      taglineHindi: 'बहुउद्देशीय सभागार',
      shortDescription:
        'A spacious campus hall utilized for academic seminars, student oath ceremonies, health awareness workshops, and examinations.',
      keyFeatures: [
        'Venue for Florence Nightingale Lamp Lighting and student pledge events.',
        'Facility for guest lectures by visiting doctors and healthcare leaders.',
        'Examination hall setup with ample seating capacity.',
        'Community health workshop presentations and annual college programs.',
      ],
    },
  ],

  courses: {
    anm: {
      id: 'anm',
      code: 'ANM',
      title: 'Auxiliary Nurse Midwifery (ANM)',
      hindiTagline: 'मातृ एवं शिशु स्वास्थ्य सेवा का आधार',
      overview:
        'ANM is a 2-year diploma course that trains female healthcare workers in fundamental community health, maternal care, child immunization, and primary first aid. It is ideal for students who wish to begin a noble career in rural and primary healthcare.',
      duration: '2 Years (Full-time diploma)',
      eligibility:
        '10+2 passed from a recognized board (Arts, Science, or Commerce) with English. Minimum aggregate: 40% to 45% (as per regulatory criteria). Minimum age: 17 years on or before 31st December of the admission year.',
      seats: '[TO_CONFIRM: Approved Annual Intake]',
      fees: '[TO_CONFIRM: Approved Annual Fee Structure]',
      approvalStatus: '[TO_CONFIRM: Approved by U.P. State Medical Faculty / Indian Nursing Council]',
      curriculumHighlights: [
        'Community Health Nursing and sanitation awareness.',
        'Health promotion, balanced nutrition, and environmental hygiene.',
        'Primary healthcare nursing, infection prevention, and wound dressing.',
        'Maternal healthcare, antenatal check-ups, and normal delivery assistance.',
        'Child health, immunization schedules, and infant growth monitoring.',
        'Supervised clinical postings in health sub-centers and hospitals.',
      ],
      careerOptions: [
        'Healthcare Worker at Primary Health Centers (PHCs) and Sub-Centers.',
        'Community Health Worker under National Health Mission (NHM) schemes.',
        'Staff Nurse in maternity homes and private nursing clinics.',
        'Immunization and mother-child welfare field officer.',
      ],
      faqs: [
        {
          question: 'Can Arts or Commerce students apply for the ANM course?',
          answer:
            'Yes. Students who have passed 10+2 from any recognized stream (Arts, Commerce, or Science) with English are eligible for ANM admission, subject to meeting minimum percentage and age rules.',
        },
        {
          question: 'What is the minimum age required for ANM admission?',
          answer:
            'Candidates must be at least 17 years old on or before 31st December of the year in which admission is sought.',
        },
        {
          question: 'Does the ANM course include hospital and field training?',
          answer:
            'Yes. The curriculum includes mandatory practical sessions in the college skill lab as well as clinical and community postings in local healthcare centers.',
        },
        {
          question: 'What is the approved fee structure for ANM?',
          answer:
            'The fee structure follows government and regulatory guidelines. Please contact our admission office directly for the exact current fee breakdown [TO_CONFIRM: Official Fee Schedule].',
        },
      ],
    },

    gnm: {
      id: 'gnm',
      code: 'GNM',
      title: 'General Nursing and Midwifery (GNM)',
      hindiTagline: 'व्यापक नर्सिंग एवं नैदानिक देखभाल',
      overview:
        'GNM is a 3-year diploma program that prepares students for comprehensive bedside patient care, medical-surgical nursing, maternity services, and emergency hospital duties. It builds strong clinical competencies for multi-specialty healthcare environments.',
      duration: '3 Years (Full-time diploma with clinical internship)',
      eligibility:
        '10+2 passed with English and minimum 40% aggregate marks from a recognized board (Science with PCB preferred; other streams eligible as per regulatory guidelines). Minimum age: 17 years.',
      seats: '[TO_CONFIRM: Approved Annual Intake]',
      fees: '[TO_CONFIRM: Approved Annual Fee Structure]',
      approvalStatus: '[TO_CONFIRM: Approved by U.P. State Medical Faculty / Indian Nursing Council]',
      curriculumHighlights: [
        'Bio-sciences: Human Anatomy, Physiology, and Microbiology.',
        'Behavioral sciences: Applied Psychology and Sociology for patient care.',
        'Fundamentals of nursing, first aid, and patient hygiene protocols.',
        'Medical-Surgical Nursing for adult body disorders and post-operative care.',
        'Pediatric and mental health nursing rotations.',
        'Midwifery and gynecological nursing with hospital delivery duty.',
        'Mandatory rotatory clinical internship in affiliated hospital wards.',
      ],
      careerOptions: [
        'Staff Nurse in Government, semi-government, and private hospitals.',
        'Critical care, ICU, and emergency casualty nurse.',
        'Industrial and corporate health center nurse.',
        'Community health nurse in rural and urban healthcare units.',
        'Direct eligibility to advance to Post-Basic B.Sc. Nursing.',
      ],
      faqs: [
        {
          question: 'What is the key difference between ANM and GNM?',
          answer:
            'ANM is a 2-year diploma focused largely on primary, maternal, and community healthcare. GNM is a 3-year diploma with extensive hospital training covering medical-surgical care, ICU rotations, and advanced bedside nursing.',
        },
        {
          question: 'Are both male and female candidates eligible for GNM?',
          answer:
            'Eligibility depends on state medical faculty and council guidelines. Please check with our admission desk for current batch gender eligibility [TO_CONFIRM].',
        },
        {
          question: 'Can GNM diploma holders pursue a degree later?',
          answer:
            'Yes. After completing GNM and registering with the State Nursing Council, candidates can enrol in a 2-year Post-Basic B.Sc. Nursing program to earn a full degree.',
        },
        {
          question: 'Where do GNM students complete their practical training?',
          answer:
            'Students undergo practical training in our on-campus simulation laboratories followed by scheduled clinical rotations at affiliated hospitals.',
        },
      ],
    },

    bscNursing: {
      id: 'bsc-nursing',
      code: 'B.Sc. Nursing',
      title: 'Bachelor of Science in Nursing (B.Sc. Nursing)',
      hindiTagline: 'उच्च स्तरीय पेशेवर नर्सिंग डिग्री',
      overview:
        'B.Sc. Nursing is a 4-year undergraduate degree program that trains students in advanced clinical diagnosis, nursing research, patient safety, and healthcare administration. Graduates become Registered Nurses (RN) qualified for high-responsibility clinical and supervisory roles.',
      duration: '4 Years (8 Semesters, including rotatory clinical internship)',
      eligibility:
        '10+2 passed with Physics, Chemistry, Biology (PCB) and English. Minimum aggregate: 45% marks in PCB (40% for SC/ST/OBC candidates) from a recognized board. Minimum age: 17 years on or before 31st December of the admission year.',
      seats: '[TO_CONFIRM: Approved Annual Intake]',
      fees: '[TO_CONFIRM: Approved Annual Fee Structure]',
      approvalStatus: '[TO_CONFIRM: Affiliated with State Medical University / Approved by INC]',
      curriculumHighlights: [
        'Applied Anatomy, Physiology, Biochemistry, and Nutrition.',
        'Nursing Foundations, Clinical Pharmacology, and Pathology.',
        'Adult Health Nursing (Medical-Surgical) with hospital postings.',
        'Child Health (Pediatric) and Mental Health (Psychiatric) Nursing.',
        'Community Health Nursing and epidemiological field surveys.',
        'Nursing Management, Leadership, Teaching Methodology, and Research.',
        'Comprehensive 6-month integrated clinical internship across hospital specialties.',
      ],
      careerOptions: [
        'Nursing Officer in Central / State Government Hospitals (AIIMS, State Medical Colleges).',
        'Registered Nurse (RN) in corporate and NABH-accredited multi-specialty hospitals.',
        'Clinical Nurse Specialist in specialized units (Cardiology, Oncology, ICU, OT).',
        'Nurse Educator, Tutor, or Clinical Instructor in nursing colleges.',
        'Eligibility for Master of Science in Nursing (M.Sc. Nursing) and clinical research programs.',
      ],
      faqs: [
        {
          question: 'Is Biology mandatory in 10+2 for B.Sc. Nursing?',
          answer:
            'Yes. Physics, Chemistry, Biology (PCB), and English are mandatory subjects in 10+2 for B.Sc. Nursing admission under statutory council regulations.',
        },
        {
          question: 'Is B.Sc. Nursing recognized for government hospital jobs?',
          answer:
            'Yes. B.Sc. Nursing graduates are eligible to appear for Central and State Nursing Officer examinations (including AIIMS NORCET, state medical health service exams, and military nursing services).',
        },
        {
          question: 'What is the duration of the clinical internship?',
          answer:
            'The 4-year degree includes an intensive, supervised rotatory clinical internship in hospital wards during the final academic semesters.',
        },
        {
          question: 'What are the higher education prospects after B.Sc. Nursing?',
          answer:
            'Graduates can pursue M.Sc. Nursing in specialties like Medical-Surgical, Paediatrics, Obstetrics & Gynaecology, or Community Health, or transition into hospital administration (MHA) and public health (MPH).',
        },
      ],
    },
  },
};
