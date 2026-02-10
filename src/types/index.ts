import React from 'react';

export interface Therapist {
    id: string;
    name: string;
    photo: string;
    specialization: string;
}

export interface Symptom {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
}

export interface FAQ {
    id: string;
    question: string;
    answer: string;
}

export interface Benefit {
    id: string;
    title: string;
    description: string;
    icon: string;
}
