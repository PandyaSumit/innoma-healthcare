import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, UPCOMING_APPOINTMENTS, PAST_APPOINTMENTS } from '../data/appointments';

// Re-export the Appointment type for consumers
export type { Appointment };

interface AppointmentContextType {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Appointment;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  cancelAppointment: (id: string, reason?: string) => void;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => boolean;
  getAppointmentById: (id: string) => Appointment | undefined;
  getNextAppointment: () => Appointment | null;
  getTotalSessions: () => number;
  getTotalHours: () => number;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const AppointmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    // Try to restore from localStorage
    const stored = localStorage.getItem('innoma_appointments');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return [...UPCOMING_APPOINTMENTS, ...PAST_APPOINTMENTS];
      }
    }
    return [...UPCOMING_APPOINTMENTS, ...PAST_APPOINTMENTS];
  });

  // Persist to localStorage whenever appointments change
  useEffect(() => {
    localStorage.setItem('innoma_appointments', JSON.stringify(appointments));
  }, [appointments]);

  const upcomingAppointments = appointments
    .filter((apt) => apt.status === 'Upcoming' || apt.status === 'In Progress')
    .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());

  const pastAppointments = appointments
    .filter((apt) => apt.status === 'Completed' || apt.status === 'Cancelled')
    .sort((a, b) => new Date(b.date + 'T' + b.time).getTime() - new Date(a.date + 'T' + a.time).getTime());

  const addAppointment = (appointmentData: Omit<Appointment, 'id'>): Appointment => {
    const newAppointment: Appointment = {
      ...appointmentData,
      id: `apt-${Date.now()}`,
    };
    setAppointments((prev) => [...prev, newAppointment]);
    return newAppointment;
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === id ? { ...apt, ...updates } : apt))
    );
  };

  const cancelAppointment = (id: string, _reason?: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? { ...apt, status: 'Cancelled' as const, paymentStatus: apt.fee > 0 ? 'Refunded' as const : apt.paymentStatus }
          : apt
      )
    );
  };

  const rescheduleAppointment = (id: string, newDate: string, newTime: string): boolean => {
    const appointment = appointments.find((apt) => apt.id === id);
    if (!appointment || appointment.reschedulesLeft <= 0) {
      return false;
    }

    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id
          ? {
              ...apt,
              date: newDate,
              time: newTime,
              reschedulesLeft: apt.reschedulesLeft - 1,
            }
          : apt
      )
    );
    return true;
  };

  const getAppointmentById = (id: string) => {
    return appointments.find((apt) => apt.id === id);
  };

  const getNextAppointment = (): Appointment | null => {
    const now = new Date();
    const upcoming = appointments
      .filter((apt) => {
        const aptDate = new Date(apt.date + 'T' + apt.time);
        return apt.status === 'Upcoming' && aptDate > now;
      })
      .sort((a, b) => new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime());

    return upcoming[0] || null;
  };

  const getTotalSessions = () => {
    return appointments.filter((apt) => apt.status === 'Completed').length;
  };

  const getTotalHours = () => {
    const totalMinutes = appointments
      .filter((apt) => apt.status === 'Completed')
      .reduce((total, apt) => total + apt.duration, 0);
    return Math.round(totalMinutes / 60 * 10) / 10; // Round to 1 decimal
  };

  return (
    <AppointmentContext.Provider
      value={{
        appointments,
        upcomingAppointments,
        pastAppointments,
        addAppointment,
        updateAppointment,
        cancelAppointment,
        rescheduleAppointment,
        getAppointmentById,
        getNextAppointment,
        getTotalSessions,
        getTotalHours,
      }}
    >
      {children}
    </AppointmentContext.Provider>
  );
};

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};
