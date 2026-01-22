export interface Therapist {
  id: string;
  name: string;
  photo: string;
  qualifications: string;
  experience: number;
  specializations: string[];
  languages: string[];
  consultationFee: number;
  rating: number;
  reviewCount: number;
  bio: string;
  location: string;
  availability: 'Available Today' | 'Available This Week' | 'Next Week';
  responseTime: string;
  patientCount: number;
  approach: string;
  gender: 'Male' | 'Female' | 'Other';
  licenseNumber: string;
  testimonials: {
    id: string;
    rating: number;
    comment: string;
    author: string;
    date: string;
  }[];
}

export const THERAPISTS: Therapist[] = [
  {
    id: 'therapist-001',
    name: 'Dr. Anjali Mehta',
    photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    qualifications: 'M.D. Psychiatry, Ph.D. Clinical Psychology',
    experience: 12,
    specializations: ['Anxiety', 'Depression', 'Trauma', 'PTSD'],
    languages: ['English', 'Hindi', 'Gujarati'],
    consultationFee: 2500,
    rating: 4.8,
    reviewCount: 156,
    bio: 'Specialized in trauma-informed therapy with evidence-based approaches. Passionate about helping individuals overcome anxiety and build resilience.',
    location: 'Mumbai, Maharashtra',
    availability: 'Available Today',
    responseTime: '~2 hours',
    patientCount: 450,
    approach: 'Cognitive Behavioral Therapy (CBT) combined with mindfulness techniques',
    gender: 'Female',
    licenseNumber: 'MH-PSY-2012-45678',
    testimonials: [
      {
        id: 'rev-001',
        rating: 5,
        comment: 'Dr. Mehta helped me overcome my anxiety. Highly recommend!',
        author: 'Anonymous Patient',
        date: '2025-12-15',
      },
      {
        id: 'rev-002',
        rating: 5,
        comment: 'Professional and compassionate. Life-changing experience.',
        author: 'Anonymous Patient',
        date: '2025-11-28',
      },
      {
        id: 'rev-003',
        rating: 4,
        comment: 'Very patient and understanding. Great listener.',
        author: 'Anonymous Patient',
        date: '2025-11-10',
      },
    ],
  },
  {
    id: 'therapist-002',
    name: 'Dr. Rajesh Kumar',
    photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    qualifications: 'M.D. Psychiatry, Fellowship in Addiction Medicine',
    experience: 15,
    specializations: ['Addiction', 'Depression', 'Stress Management'],
    languages: ['English', 'Hindi', 'Tamil'],
    consultationFee: 3000,
    rating: 4.9,
    reviewCount: 203,
    bio: 'Expert in addiction recovery and stress management. Helping individuals reclaim their lives with holistic treatment approaches.',
    location: 'Bangalore, Karnataka',
    availability: 'Available Today',
    responseTime: '~1 hour',
    patientCount: 580,
    approach: 'Integrated approach combining medication management and psychotherapy',
    gender: 'Male',
    licenseNumber: 'KA-PSY-2009-12345',
    testimonials: [
      {
        id: 'rev-004',
        rating: 5,
        comment: 'Dr. Kumar helped me through my darkest times. Forever grateful.',
        author: 'Anonymous Patient',
        date: '2025-12-20',
      },
      {
        id: 'rev-005',
        rating: 5,
        comment: 'Outstanding professional. Changed my perspective on life.',
        author: 'Anonymous Patient',
        date: '2025-12-05',
      },
    ],
  },
  {
    id: 'therapist-003',
    name: 'Dr. Neha Desai',
    photo: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    qualifications: 'M.A. Clinical Psychology, Certified CBT Practitioner',
    experience: 8,
    specializations: ['Relationship Issues', 'Work Stress', 'Self-Esteem'],
    languages: ['English', 'Hindi', 'Marathi'],
    consultationFee: 2000,
    rating: 4.7,
    reviewCount: 98,
    bio: 'Compassionate therapist focusing on relationship dynamics and workplace wellness. Believer in the power of self-awareness.',
    location: 'Pune, Maharashtra',
    availability: 'Available This Week',
    responseTime: '~3 hours',
    patientCount: 320,
    approach: 'Person-centered therapy with CBT techniques',
    gender: 'Female',
    licenseNumber: 'MH-PSY-2016-78901',
    testimonials: [
      {
        id: 'rev-006',
        rating: 5,
        comment: 'Helped me navigate complex relationship issues with clarity.',
        author: 'Anonymous Patient',
        date: '2025-11-30',
      },
    ],
  },
  {
    id: 'therapist-004',
    name: 'Dr. Vikram Singh',
    photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    qualifications: 'M.D. Psychiatry, M.Phil. Psychology',
    experience: 10,
    specializations: ['OCD', 'Anxiety', 'Panic Disorders'],
    languages: ['English', 'Hindi', 'Punjabi'],
    consultationFee: 2800,
    rating: 4.6,
    reviewCount: 134,
    bio: 'Specialist in obsessive-compulsive and anxiety disorders. Using evidence-based interventions for lasting change.',
    location: 'Delhi, NCR',
    availability: 'Available This Week',
    responseTime: '~4 hours',
    patientCount: 410,
    approach: 'Exposure and Response Prevention (ERP) for OCD',
    gender: 'Male',
    licenseNumber: 'DL-PSY-2014-56789',
    testimonials: [
      {
        id: 'rev-007',
        rating: 5,
        comment: 'Dr. Singh\'s ERP approach worked wonders for my OCD.',
        author: 'Anonymous Patient',
        date: '2025-12-10',
      },
    ],
  },
  {
    id: 'therapist-005',
    name: 'Dr. Priya Patel',
    photo: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400',
    qualifications: 'M.A. Counseling Psychology, Certified EMDR Therapist',
    experience: 7,
    specializations: ['Trauma', 'PTSD', 'Grief Counseling'],
    languages: ['English', 'Hindi', 'Gujarati'],
    consultationFee: 2200,
    rating: 4.9,
    reviewCount: 87,
    bio: 'EMDR specialist helping individuals heal from traumatic experiences. Gentle and patient approach to complex trauma.',
    location: 'Ahmedabad, Gujarat',
    availability: 'Next Week',
    responseTime: '~5 hours',
    patientCount: 210,
    approach: 'Eye Movement Desensitization and Reprocessing (EMDR)',
    gender: 'Female',
    licenseNumber: 'GJ-PSY-2018-23456',
    testimonials: [
      {
        id: 'rev-008',
        rating: 5,
        comment: 'EMDR therapy changed my life. Thank you Dr. Patel!',
        author: 'Anonymous Patient',
        date: '2025-12-01',
      },
    ],
  },
  {
    id: 'therapist-006',
    name: 'Dr. Arjun Reddy',
    photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    qualifications: 'M.D. Psychiatry, Certified Sleep Specialist',
    experience: 9,
    specializations: ['Sleep Disorders', 'Depression', 'Burnout'],
    languages: ['English', 'Hindi', 'Telugu'],
    consultationFee: 2600,
    rating: 4.7,
    reviewCount: 112,
    bio: 'Sleep medicine expert addressing insomnia and burnout. Helping professionals find balance and restful sleep.',
    location: 'Hyderabad, Telangana',
    availability: 'Available Today',
    responseTime: '~2 hours',
    patientCount: 340,
    approach: 'Cognitive Behavioral Therapy for Insomnia (CBT-I)',
    gender: 'Male',
    licenseNumber: 'TS-PSY-2015-34567',
    testimonials: [
      {
        id: 'rev-009',
        rating: 4,
        comment: 'Finally sleeping better after years of insomnia.',
        author: 'Anonymous Patient',
        date: '2025-11-25',
      },
    ],
  },
  {
    id: 'therapist-007',
    name: 'Dr. Kavita Sharma',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400',
    qualifications: 'M.Phil. Clinical Psychology, Family Therapist',
    experience: 11,
    specializations: ['Family Therapy', 'Marriage Counseling', 'Parenting'],
    languages: ['English', 'Hindi'],
    consultationFee: 2400,
    rating: 4.8,
    reviewCount: 145,
    bio: 'Family and couples therapist fostering healthy relationships. Creating safe spaces for honest communication.',
    location: 'Jaipur, Rajasthan',
    availability: 'Available This Week',
    responseTime: '~3 hours',
    patientCount: 390,
    approach: 'Emotionally Focused Therapy (EFT) for couples',
    gender: 'Female',
    licenseNumber: 'RJ-PSY-2013-67890',
    testimonials: [
      {
        id: 'rev-010',
        rating: 5,
        comment: 'Saved our marriage. Forever grateful to Dr. Sharma.',
        author: 'Anonymous Patient',
        date: '2025-12-12',
      },
    ],
  },
  {
    id: 'therapist-008',
    name: 'Dr. Sameer Khan',
    photo: 'https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=400',
    qualifications: 'M.D. Psychiatry, Child & Adolescent Specialist',
    experience: 13,
    specializations: ['Child Psychology', 'ADHD', 'Behavioral Issues'],
    languages: ['English', 'Hindi', 'Urdu'],
    consultationFee: 2700,
    rating: 4.9,
    reviewCount: 167,
    bio: 'Pediatric mental health specialist with expertise in ADHD and developmental disorders. Parent-focused collaborative approach.',
    location: 'Chennai, Tamil Nadu',
    availability: 'Next Week',
    responseTime: '~4 hours',
    patientCount: 520,
    approach: 'Play therapy and parent coaching',
    gender: 'Male',
    licenseNumber: 'TN-PSY-2011-89012',
    testimonials: [
      {
        id: 'rev-011',
        rating: 5,
        comment: 'Dr. Khan is amazing with kids. My son loves his sessions.',
        author: 'Anonymous Patient',
        date: '2025-12-08',
      },
    ],
  },
];

export const SPECIALIZATIONS = [
  'Anxiety',
  'Depression',
  'Trauma',
  'PTSD',
  'OCD',
  'Addiction',
  'Stress Management',
  'Relationship Issues',
  'Work Stress',
  'Self-Esteem',
  'Panic Disorders',
  'Grief Counseling',
  'Sleep Disorders',
  'Burnout',
  'Family Therapy',
  'Marriage Counseling',
  'Parenting',
  'Child Psychology',
  'ADHD',
  'Behavioral Issues',
];

export const LANGUAGES = [
  'English',
  'Hindi',
  'Tamil',
  'Telugu',
  'Gujarati',
  'Marathi',
  'Punjabi',
  'Urdu',
  'Bengali',
  'Malayalam',
];

export const LOCATIONS = [
  'Mumbai, Maharashtra',
  'Delhi, NCR',
  'Bangalore, Karnataka',
  'Hyderabad, Telangana',
  'Chennai, Tamil Nadu',
  'Kolkata, West Bengal',
  'Pune, Maharashtra',
  'Ahmedabad, Gujarat',
  'Jaipur, Rajasthan',
  'Lucknow, Uttar Pradesh',
];
