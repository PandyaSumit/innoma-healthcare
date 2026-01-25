export interface Patient {
  id: string;
  name: string;
  photo: string;
  age: number;
  gender: string;
  occupation: string;
  email: string;
  phone: string;
  since: string;
  status: 'Active' | 'Inactive';
  lastVisit: string;
  upcomingSession?: string;
  diagnosis?: string[];
  notes?: string;
  totalSessions: number;
}

export interface Appointment {
  id: string;
  // Therapist Details (for Patient View)
  therapistId: string;
  therapistName: string;
  therapistPhoto: string;
  specialization: string;

  // Patient Details (for Therapist View)
  patientId?: string;
  patientName?: string;
  patientPhoto?: string;

  date: string; // ISO date string
  time: string;
  duration: number; // in minutes
  type: 'Assessment' | 'Consultation' | 'Follow-up';
  status: 'Upcoming' | 'Completed' | 'Cancelled' | 'In Progress';
  fee: number;
  meetingLink?: string;
  sessionNotes?: string;
  rating?: number;
  reschedulesLeft: number;
  paymentStatus: 'Paid' | 'Pending' | 'Refunded';
  invoiceNumber?: string;
}

export const MOCK_PATIENTS: Patient[] = [
  {
    id: 'patient-001',
    name: 'Priya Sharma',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    age: 28,
    gender: 'Female',
    occupation: 'Software Engineer',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    since: 'Jan 2024',
    status: 'Active',
    lastVisit: '2024-03-15',
    upcomingSession: '2024-03-22',
    diagnosis: ['Anxiety', 'Work Stress'],
    totalSessions: 8,
    notes: 'Patient is responding well to CBT. Focus on work-life boundaries.'
  },
  {
    id: 'patient-002',
    name: 'Rahul Verma',
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    age: 34,
    gender: 'Male',
    occupation: 'Marketing Manager',
    email: 'rahul.v@example.com',
    phone: '+91 98765 12345',
    since: 'Feb 2024',
    status: 'Active',
    lastVisit: '2024-03-10',
    upcomingSession: '2024-03-24',
    diagnosis: ['Depression', 'Insomnia'],
    totalSessions: 4,
    notes: 'Sleep patterns improving. Recommended mindfulness exercises before bed.'
  },
  {
    id: 'patient-003',
    name: 'Anonymous User',
    photo: 'https://ui-avatars.com/api/?name=Anonymous&background=random',
    age: 25,
    gender: 'Other',
    occupation: 'Student',
    email: 'anon@example.com',
    phone: '+91 98765 67890',
    since: 'Mar 2024',
    status: 'Inactive',
    lastVisit: '2024-03-01',
    totalSessions: 1,
    notes: 'Initial assessment completed. Not yet scheduled follow-up.'
  }
];

export const UPCOMING_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    therapistId: 'therapist-001',
    therapistName: 'Dr. Anjali Mehta',
    therapistPhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    specialization: 'Anxiety & Trauma',
    patientId: 'patient-001',
    patientName: 'Priya Sharma',
    patientPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    date: '2026-01-25',
    time: '14:00',
    duration: 50,
    type: 'Consultation',
    status: 'Upcoming',
    fee: 2500,
    meetingLink: 'https://zoom.us/j/123456789',
    reschedulesLeft: 2,
    paymentStatus: 'Paid',
    invoiceNumber: 'INN-2026-001',
  },
  {
    id: 'apt-002',
    therapistId: 'therapist-002',
    therapistName: 'Dr. Rajesh Kumar',
    therapistPhoto: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400',
    specialization: 'Stress Management',
    patientId: 'patient-002',
    patientName: 'Rahul Verma',
    patientPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    date: '2026-01-28',
    time: '10:00',
    duration: 50,
    type: 'Follow-up',
    status: 'Upcoming',
    fee: 3000,
    meetingLink: 'https://zoom.us/j/987654321',
    reschedulesLeft: 2,
    paymentStatus: 'Paid',
    invoiceNumber: 'INN-2026-002',
  },
  {
    id: 'apt-003',
    therapistId: 'therapist-006',
    therapistName: 'Dr. Arjun Reddy',
    therapistPhoto: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400',
    specialization: 'Sleep Disorders',
    patientId: 'patient-003',
    patientName: 'Anonymous User',
    patientPhoto: 'https://ui-avatars.com/api/?name=Anonymous&background=random',
    date: '2026-02-01',
    time: '16:00',
    duration: 50,
    type: 'Assessment',
    status: 'Upcoming',
    fee: 0, // Free assessment
    meetingLink: 'https://zoom.us/j/555666777',
    reschedulesLeft: 2,
    paymentStatus: 'Paid',
  },
];

export const PAST_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-004',
    therapistId: 'therapist-001',
    therapistName: 'Dr. Anjali Mehta',
    therapistPhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    specialization: 'Anxiety & Trauma',
    patientId: 'patient-001',
    patientName: 'Priya Sharma',
    patientPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    date: '2026-01-15',
    time: '14:00',
    duration: 50,
    type: 'Assessment',
    status: 'Completed',
    fee: 0,
    reschedulesLeft: 0,
    paymentStatus: 'Paid',
    rating: 5,
    sessionNotes: 'Patient showed significant improvement in anxiety management. Recommended continued CBT techniques and mindfulness practice.',
  },
  {
    id: 'apt-005',
    therapistId: 'therapist-003',
    therapistName: 'Dr. Neha Desai',
    therapistPhoto: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400',
    specialization: 'Work Stress',
    patientId: 'patient-002',
    patientName: 'Rahul Verma',
    patientPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    date: '2026-01-10',
    time: '11:00',
    duration: 50,
    type: 'Consultation',
    status: 'Completed',
    fee: 2000,
    reschedulesLeft: 0,
    paymentStatus: 'Paid',
    invoiceNumber: 'INN-2025-245',
    rating: 4,
    sessionNotes: 'Discussed work-life balance strategies. Patient practicing boundary-setting at workplace.',
  },
  {
    id: 'apt-006',
    therapistId: 'therapist-001',
    therapistName: 'Dr. Anjali Mehta',
    therapistPhoto: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
    specialization: 'Anxiety & Trauma',
    patientId: 'patient-001',
    patientName: 'Priya Sharma',
    patientPhoto: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    date: '2026-01-18',
    time: '14:00',
    duration: 50,
    type: 'Follow-up',
    status: 'Completed',
    fee: 2500,
    reschedulesLeft: 0,
    paymentStatus: 'Paid',
    invoiceNumber: 'INN-2026-003',
    rating: 5,
    sessionNotes: 'Patient making excellent progress. Panic attacks reduced from daily to twice per week. Continue current treatment plan.',
  },
  {
    id: 'apt-007',
    therapistId: 'therapist-004',
    therapistName: 'Dr. Vikram Singh',
    therapistPhoto: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400',
    specialization: 'OCD',
    patientId: 'patient-003',
    patientName: 'Anonymous User',
    patientPhoto: 'https://ui-avatars.com/api/?name=Anonymous&background=random',
    date: '2025-12-20',
    time: '15:00',
    duration: 50,
    type: 'Consultation',
    status: 'Completed',
    fee: 2800,
    reschedulesLeft: 0,
    paymentStatus: 'Paid',
    invoiceNumber: 'INN-2025-198',
  },
];
