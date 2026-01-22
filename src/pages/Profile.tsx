import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../context/AuthContext';
import { SPECIALIZATIONS, LANGUAGES } from '../data/therapists';

const patientSchema = yup.object().shape({
  fullName: yup.string().required('Required'),
  email: yup.string().required('Required').email('Invalid email'),
  phone: yup.string().matches(/^[0-9+\s]{10,15}$/, 'Invalid phone number'),
  dob: yup.string().required('Required'),
  gender: yup.string().required('Required'),
  occupation: yup.string().required('Required'),
  bloodGroup: yup.string().required('Required'),
  newPassword: yup.string().min(8, 'Min 8 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match'),
  bio: yup.string().max(500, 'Max 500 characters'),
});

const therapistSchema = yup.object().shape({
  fullName: yup.string().required('Required'),
  email: yup.string().required('Required').email('Invalid email'),
  phone: yup.string().matches(/^[0-9+\s]{10,15}$/, 'Invalid phone number'),
  qualifications: yup.string().required('Required'),
  licenseNumber: yup.string().required('Required'),
  experience: yup.number().required('Required').min(0, 'Must be 0 or greater'),
  consultationFee: yup.number().required('Required').min(0, 'Must be 0 or greater'),
  newPassword: yup.string().min(8, 'Min 8 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match'),
  bio: yup.string().max(500, 'Max 500 characters'),
});

const Profile = () => {
  const { user } = useAuth();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const isTherapist = user?.role === 'therapist';
  const isPatient = user?.role === 'patient';

  // Set default tab based on user role
  const [activeTab, setActiveTab] = useState<'details' | 'security' | 'display' | 'professional'>(
    isTherapist ? 'professional' : 'details'
  );

  // Initialize form values based on user role
  const getInitialValues = () => {
    if (isTherapist) {
      return {
        fullName: user?.profile?.name || '',
        email: user?.profile?.email || '',
        phone: user?.profile?.phone || '',
        qualifications: user?.profile?.qualifications || '',
        licenseNumber: user?.profile?.licenseNumber || '',
        experience: user?.profile?.experience || 0,
        consultationFee: user?.profile?.consultationFee || 0,
        specializations: user?.profile?.specialization || [],
        languages: user?.profile?.languages || [],
        newPassword: '',
        confirmPassword: '',
        bio: user?.profile?.bio || '',
      };
    } else {
      return {
        fullName: user?.profile?.name || '',
        email: user?.profile?.email || '',
        phone: user?.profile?.phone || '',
        dob: user?.profile?.dob || '',
        gender: user?.profile?.gender || '',
        occupation: user?.profile?.occupation || '',
        bloodGroup: user?.profile?.bloodGroup || '',
        newPassword: '',
        confirmPassword: '',
        bio: user?.profile?.bio || '',
        healthInterests: user?.profile?.healthInterests || [],
      };
    }
  };

  const formik = useFormik({
    initialValues: getInitialValues(),
    validationSchema: isTherapist ? therapistSchema : patientSchema,
    onSubmit: (values) => {
      console.log('Profile updated:', values);
      // Update localStorage with new values
      if (user) {
        const updatedUser = {
          ...user,
          profile: {
            ...user.profile,
            ...values,
          },
        };
        localStorage.setItem('innoma_user', JSON.stringify(updatedUser));
      }
      alert('Profile updated successfully!');
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        alert('Only JPG and PNG are allowed');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="animate-fade-in h-full flex flex-col pb-20 px-4 pt-6 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-healthcare-text">Profile Details</h1>
        <button
          onClick={() => formik.handleSubmit()}
          className="px-6 py-2.5 bg-brand-blue text-white rounded-lg font-bold text-sm shadow-md hover:opacity-90 transition-all cursor-pointer border-none"
        >
          Save Changes
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="flex items-center gap-6 pb-6">
        <div className="relative group">
          <div className="w-20 h-20 rounded-full bg-healthcare-surface border-2 border-healthcare-border overflow-hidden">
            {avatarPreview || user?.profile?.avatar ? (
              <img src={avatarPreview || user?.profile?.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-brand-blue/30">
                {user?.profile?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <label className="absolute bottom-0 right-0 w-6 h-6 bg-brand-blue text-white rounded-full flex items-center justify-center shadow-md border border-white cursor-pointer hover:scale-110 transition-all">
            <svg className="w-3.4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleAvatarChange} />
          </label>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-healthcare-text">{formik.values.fullName}</h2>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md uppercase tracking-wider border border-emerald-100">
              {isTherapist ? 'Therapist' : 'Patient'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-healthcare-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="font-medium">ID:</span> {user?.profile?.id || 'N/A'}
            </span>
            <span className="text-healthcare-border">|</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {formik.values.phone}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-healthcare-border overflow-x-auto no-scrollbar">
        <div className="flex min-w-max">
          {(isTherapist
            ? [
                { id: 'professional', label: 'Professional Info' },
                { id: 'details', label: 'Specializations & Languages' },
                { id: 'display', label: 'Professional Bio' },
                { id: 'security', label: 'Security & Privacy' },
              ]
            : [
                { id: 'details', label: 'Personal Details' },
                { id: 'security', label: 'Security & Privacy' },
                { id: 'display', label: 'Profile Display' },
              ]
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-6 py-4 text-sm font-semibold transition-all border-b-2 bg-transparent cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-brand-blue border-brand-blue'
                  : 'text-healthcare-text-muted border-transparent hover:text-healthcare-text'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="py-2 flex-grow flex flex-col">
        <form onSubmit={formik.handleSubmit} className="h-full">
          {/* THERAPIST: Professional Info Tab */}
          {isTherapist && activeTab === 'professional' && (
            <div className="space-y-12 animate-slide-up min-h-[400px]">
              <section className="space-y-6">
                <h3 className="text-base font-bold text-healthcare-text">Professional Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-8">
                  <InfoField label="Full Name" isEditable>
                    <input
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="Email Address" isEditable>
                    <input
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="Phone Number" isEditable>
                    <input
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="Qualifications" isEditable>
                    <input
                      name="qualifications"
                      value={formik.values.qualifications}
                      onChange={formik.handleChange}
                      placeholder="e.g., M.D. Psychiatry, Ph.D."
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="License Number" isEditable>
                    <input
                      name="licenseNumber"
                      value={formik.values.licenseNumber}
                      onChange={formik.handleChange}
                      placeholder="e.g., MH-PSY-2012-45678"
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="Years of Experience" isEditable>
                    <input
                      type="number"
                      name="experience"
                      value={formik.values.experience}
                      onChange={formik.handleChange}
                      min="0"
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="Consultation Fee (₹)" isEditable>
                    <input
                      type="number"
                      name="consultationFee"
                      value={formik.values.consultationFee}
                      onChange={formik.handleChange}
                      min="0"
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                </div>
              </section>
            </div>
          )}

          {/* THERAPIST: Specializations & Languages Tab */}
          {isTherapist && activeTab === 'details' && (
            <div className="space-y-12 animate-slide-up min-h-[400px]">
              <section className="space-y-6">
                <h3 className="text-base font-bold text-healthcare-text">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {SPECIALIZATIONS.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => {
                        const current = formik.values.specializations || [];
                        if (current.includes(spec)) {
                          formik.setFieldValue('specializations', current.filter((s: string) => s !== spec));
                        } else {
                          formik.setFieldValue('specializations', [...current, spec]);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                        (formik.values.specializations || []).includes(spec)
                          ? 'bg-brand-blue text-white border-brand-blue shadow-md'
                          : 'bg-white text-healthcare-text-muted border-healthcare-border hover:border-brand-blue/50'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h3 className="text-base font-bold text-healthcare-text">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => {
                        const current = formik.values.languages || [];
                        if (current.includes(lang)) {
                          formik.setFieldValue('languages', current.filter((l: string) => l !== lang));
                        } else {
                          formik.setFieldValue('languages', [...current, lang]);
                        }
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${
                        (formik.values.languages || []).includes(lang)
                          ? 'bg-brand-blue text-white border-brand-blue shadow-md'
                          : 'bg-white text-healthcare-text-muted border-healthcare-border hover:border-brand-blue/50'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* PATIENT: Personal Details Tab */}
          {isPatient && activeTab === 'details' && (
            <div className="space-y-12 animate-slide-up min-h-[400px]">
              <section className="space-y-6">
                <h3 className="text-base font-bold text-healthcare-text">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8">
                  <InfoField label="Full Name" isEditable>
                    <input
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="Email Address" isEditable>
                    <input
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="Phone Number" isEditable>
                    <input
                      name="phone"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="Date of Birth" isEditable>
                    <input
                      type="date"
                      name="dob"
                      value={formik.values.dob}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="Gender" isEditable>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formik.values.gender}
                        onChange={formik.handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all appearance-none cursor-pointer"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-healthcare-text-muted">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </InfoField>
                  <InfoField label="Occupation" isEditable>
                    <input
                      name="occupation"
                      value={formik.values.occupation}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="Blood Group" isEditable>
                    <div className="relative">
                      <select
                        name="bloodGroup"
                        value={formik.values.bloodGroup}
                        onChange={formik.handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all appearance-none cursor-pointer"
                      >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-healthcare-text-muted">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </InfoField>
                </div>
              </section>
            </div>
          )}

          {/* SHARED: Security & Privacy Tab */}
          {activeTab === 'security' && (
            <div className="space-y-10 animate-slide-up min-h-[400px]">
              <div className="p-6 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-healthcare-text mb-1">Secure Account</h4>
                  <p className="text-xs text-healthcare-text-muted">Maintain a robust password to ensure your records remain strictly confidential.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InfoField label="New Password" isEditable>
                  <input
                    type="password"
                    name="newPassword"
                    value={formik.values.newPassword}
                    onChange={formik.handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                  />
                </InfoField>
                <InfoField label="Confirm Password" isEditable>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                  />
                </InfoField>
              </div>
            </div>
          )}

          {/* PATIENT: Profile Display Tab / THERAPIST: Professional Bio Tab */}
          {activeTab === 'display' && (
            <div className="space-y-8 animate-slide-up min-h-[400px]">
              <InfoField label={isTherapist ? 'Professional Bio' : 'Bio / About Me'} isEditable>
                <textarea
                  name="bio"
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border border-healthcare-border bg-healthcare-surface/20 font-medium text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all resize-none text-sm leading-relaxed"
                  placeholder={
                    isTherapist
                      ? 'Describe your professional background, approach to therapy, and areas of expertise...'
                      : 'Describe your health goals and what you hope to achieve through therapy...'
                  }
                />
              </InfoField>

              {isPatient && (
                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-healthcare-text-muted uppercase tracking-wider">
                    Health Interests
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Anxiety', 'Depression', 'Trauma Recovery', 'Stress Management', 'Work-Life Balance', 'Relationships'].map(
                      (tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            const current = formik.values.healthInterests || [];
                            if (current.includes(tag)) {
                              formik.setFieldValue(
                                'healthInterests',
                                current.filter((t: string) => t !== tag)
                              );
                            } else {
                              formik.setFieldValue('healthInterests', [...current, tag]);
                            }
                          }}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                            (formik.values.healthInterests || []).includes(tag)
                              ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20 shadow-sm'
                              : 'bg-white text-healthcare-text-muted border-healthcare-border hover:border-brand-blue/30'
                          }`}
                        >
                          {tag}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

const InfoField = ({ label, children, isEditable }: any) => (
  <div className="space-y-1.5 group">
    <div className="flex items-center justify-between px-0.5">
      <label className="text-[11px] font-bold text-healthcare-text-muted uppercase tracking-wider">{label}</label>
      {isEditable && (
        <span className="text-[10px] font-bold text-brand-blue/0 group-hover:text-brand-blue transition-all uppercase tracking-tighter">Edit Field</span>
      )}
    </div>
    <div className="text-sm">{children}</div>
  </div>
);

export default Profile;
