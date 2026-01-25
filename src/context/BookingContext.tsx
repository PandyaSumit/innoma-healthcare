import React, { createContext, useContext, useState, useEffect } from 'react';
import { Therapist } from '../data/therapists';

export type PackageType = 'single' | 'starter' | 'professional';

export interface BookingPackage {
  type: PackageType;
  name: string;
  price: number;
  sessions: number;
  pricePerSession: number;
}

export const PACKAGES: Record<PackageType, BookingPackage> = {
  single: {
    type: 'single',
    name: 'Single Session',
    price: 1999,
    sessions: 1,
    pricePerSession: 1999,
  },
  starter: {
    type: 'starter',
    name: 'Starter Package',
    price: 4999,
    sessions: 4,
    pricePerSession: 1250,
  },
  professional: {
    type: 'professional',
    name: 'Professional Package',
    price: 8999,
    sessions: 8,
    pricePerSession: 1125,
  },
};

export interface BookingState {
  therapist: Therapist | null;
  selectedPackage: BookingPackage | null;
  selectedDate: string | null;
  selectedTime: string | null;
  isAssessment: boolean;
}

interface BookingContextType {
  booking: BookingState;
  setTherapist: (therapist: Therapist | null) => void;
  setPackage: (packageType: PackageType) => void;
  setDateTime: (date: string, time: string) => void;
  setIsAssessment: (isAssessment: boolean) => void;
  clearBooking: () => void;
  getTotalAmount: () => number;
  getGSTAmount: () => number;
  getFinalAmount: () => number;
}

const initialBookingState: BookingState = {
  therapist: null,
  selectedPackage: null,
  selectedDate: null,
  selectedTime: null,
  isAssessment: false,
};

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [booking, setBooking] = useState<BookingState>(() => {
    // Try to restore from localStorage
    const stored = localStorage.getItem('innoma_booking');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return initialBookingState;
      }
    }
    return initialBookingState;
  });

  // Persist to localStorage whenever booking changes
  useEffect(() => {
    if (booking.therapist || booking.selectedPackage) {
      localStorage.setItem('innoma_booking', JSON.stringify(booking));
    }
  }, [booking]);

  const setTherapist = (therapist: Therapist | null) => {
    setBooking((prev) => ({ ...prev, therapist }));
  };

  const setPackage = (packageType: PackageType) => {
    setBooking((prev) => ({ ...prev, selectedPackage: PACKAGES[packageType] }));
  };

  const setDateTime = (date: string, time: string) => {
    setBooking((prev) => ({ ...prev, selectedDate: date, selectedTime: time }));
  };

  const setIsAssessment = (isAssessment: boolean) => {
    setBooking((prev) => ({ ...prev, isAssessment }));
  };

  const clearBooking = () => {
    setBooking(initialBookingState);
    localStorage.removeItem('innoma_booking');
  };

  const getTotalAmount = () => {
    if (booking.isAssessment) return 0;
    return booking.selectedPackage?.price || 0;
  };

  const getGSTAmount = () => {
    return Math.round(getTotalAmount() * 0.18);
  };

  const getFinalAmount = () => {
    return getTotalAmount() + getGSTAmount();
  };

  return (
    <BookingContext.Provider
      value={{
        booking,
        setTherapist,
        setPackage,
        setDateTime,
        setIsAssessment,
        clearBooking,
        getTotalAmount,
        getGSTAmount,
        getFinalAmount,
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
