import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Appointment } from '../data/appointments';
import { useAuth } from './AuthContext';

interface BookingDetails {
  therapist: {
    id: string;
    name: string;
    photo: string;
    specializations: string[];
    qualifications: string;
    rating: number;
  };
  package: {
    id: string;
    name: string;
    price: number;
    sessions: number;
    description: string;
  };
  date: string;
  time: string;
}

interface BookingContextType {
  // Current booking in progress
  currentBooking: BookingDetails | null;
  setCurrentBooking: (booking: BookingDetails | null) => void;

  // Booked appointments (persisted)
  bookedAppointments: Appointment[];
  addBookedAppointment: (appointment: Appointment) => void;

  // Get appointments for current user
  getUserAppointments: () => { upcoming: Appointment[]; past: Appointment[] };

  // Generate meeting link
  generateMeetingLink: () => string;

  // Generate invoice number
  generateInvoiceNumber: () => string;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

const STORAGE_KEY = 'innoma_booked_appointments';

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [currentBooking, setCurrentBooking] = useState<BookingDetails | null>(null);
  const [bookedAppointments, setBookedAppointments] = useState<Appointment[]>([]);

  // Load booked appointments from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBookedAppointments(parsed);
      } catch (error) {
        console.error('Failed to parse stored appointments:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Save appointments to localStorage whenever they change
  useEffect(() => {
    if (bookedAppointments.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bookedAppointments));
    }
  }, [bookedAppointments]);

  const generateMeetingLink = (): string => {
    const meetingId = Math.random().toString(36).substring(2, 11).toUpperCase();
    return `https://meet.innoma.health/session/${meetingId}`;
  };

  const generateInvoiceNumber = (): string => {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 5).toUpperCase();
    return `INN-${new Date().getFullYear()}-${timestamp}${random}`;
  };

  const addBookedAppointment = (appointment: Appointment) => {
    setBookedAppointments(prev => {
      const updated = [...prev, appointment];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const getUserAppointments = () => {
    const now = new Date();
    const upcoming: Appointment[] = [];
    const past: Appointment[] = [];

    bookedAppointments.forEach(apt => {
      const aptDate = new Date(`${apt.date}T${apt.time}`);

      // Filter based on user role
      if (user?.role === 'patient') {
        if (apt.patientId === user.profile?.id || apt.patientId === 'patient-001') {
          if (aptDate >= now) {
            upcoming.push(apt);
          } else {
            past.push(apt);
          }
        }
      } else if (user?.role === 'therapist') {
        if (apt.therapistId === user.profile?.id || apt.therapistId === 'therapist-001') {
          if (aptDate >= now) {
            upcoming.push(apt);
          } else {
            past.push(apt);
          }
        }
      }
    });

    // Sort by date
    upcoming.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    past.sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());

    return { upcoming, past };
  };

  return (
    <BookingContext.Provider
      value={{
        currentBooking,
        setCurrentBooking,
        bookedAppointments,
        addBookedAppointment,
        getUserAppointments,
        generateMeetingLink,
        generateInvoiceNumber,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};
