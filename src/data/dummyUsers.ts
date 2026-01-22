// Dummy user credentials for testing
export const DUMMY_USERS = {
  patient: {
    email: 'patient@innoma.com',
    password: 'Patient@123',
    role: 'patient',
    profile: {
      id: 'patient-001',
      name: 'Priya Sharma',
      email: 'patient@innoma.com',
      phone: '+91 98765 43210',
      dob: '1995-06-15',
      gender: 'Female',
      occupation: 'Software Engineer',
      age: 28,
      bloodGroup: 'O+',
      bio: 'Working professional seeking stress management and work-life balance support.',
      healthInterests: ['Anxiety', 'Stress Management', 'Work-Life Balance'],
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      memberSince: '2024-01-15',
    },
  },
  therapist: {
    email: 'therapist@innoma.com',
    password: 'Therapist@123',
    role: 'therapist',
    profile: {
      id: 'therapist-001',
      name: 'Dr. Anjali Mehta',
      email: 'therapist@innoma.com',
      phone: '+91 98765 54321',
      specialization: ['Anxiety', 'Depression', 'Trauma'],
      languages: ['English', 'Hindi', 'Gujarati'],
      experience: 12,
      qualifications: 'M.D. in Psychiatry, Ph.D. in Clinical Psychology',
      licenseNumber: 'MH-PSY-2012-45678',
      bio: 'Experienced mental health professional specializing in trauma-informed therapy with over 12 years of practice.',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400',
      rating: 4.8,
      totalPatients: 450,
      consultationFee: 2500,
      availability: {
        monday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        tuesday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        wednesday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        thursday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        friday: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00'],
        saturday: ['09:00', '10:00', '11:00'],
        sunday: [],
      },
    },
  },
};

export type UserRole = 'patient' | 'therapist';

export interface User {
  email: string;
  role: UserRole;
  profile: any;
}
