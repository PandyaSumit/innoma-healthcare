import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';

const profileSchema = yup.object().shape({
  fullName: yup.string().required('Required'),
  email: yup.string().required('Required').email('Invalid email'),
  dob: yup.string().required('Required'),
  gender: yup.string().required('Required'),
  occupation: yup.string().required('Required'),
  whatsapp: yup.string().matches(/^[0-9+]{10,15}$/, 'Invalid WhatsApp number'),
  newPassword: yup.string().min(8, 'Min 8 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords must match'),
  bio: yup.string().max(500, 'Max 500 characters'),
});

const Profile = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'security' | 'display'>('details');

  const formik = useFormik({
    initialValues: {
      fullName: 'User name',
      email: 'user@innomahealthcare.com',
      dob: '1990-01-01',
      gender: 'Male',
      occupation: 'Testing',
      whatsapp: '+91 9876543210',
      newPassword: '',
      confirmPassword: '',
      bio: '',
      healthInterests: [] as string[],
      privacy: 'Private Only'
    },
    validationSchema: profileSchema,
    onSubmit: (values) => {
      console.log('Profile updated:', values);
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
    <div className="animate-fade-in pb-20 px-4 pt-6 space-y-8">
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
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-brand-blue/30">
                SP
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
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-md uppercase tracking-wider border border-emerald-100">Active</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-healthcare-text-muted">
            <span className="flex items-center gap-1.5">
              <span className="font-medium">ID:</span> #7239
            </span>
            <span className="text-healthcare-border">|</span>
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {formik.values.whatsapp}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-healthcare-border overflow-x-auto no-scrollbar">
        <div className="flex min-w-max">
          {[
            { id: 'details', label: 'Details' },
            { id: 'security', label: 'Security & Privacy'},
            { id: 'display', label: 'Profile Display' },
          ].map((tab) => (
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
      <div className="py-2">
        <form onSubmit={formik.handleSubmit}>
          {activeTab === 'details' && (
            <div className="space-y-12 animate-slide-up">
              {/* Personal Information */}
              <section className="space-y-6">
                <h3 className="text-base font-bold text-healthcare-text">Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8">
                  <InfoField label="Full Legal Name" isEditable>
                    <input
                      name="fullName"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="Phone Number" isEditable>
                    <input
                      name="whatsapp"
                      value={formik.values.whatsapp}
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
                  <InfoField label="Age">
                    <div className="px-4 py-2.5 rounded-lg border border-transparent bg-healthcare-surface/10 font-bold text-healthcare-text-muted">
                      35Y
                    </div>
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
                  <InfoField label="Email Address" isEditable>
                    <input
                      name="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="Occupation" isEditable>
                    <input
                      name="occupation"
                      value={formik.values.occupation}
                      onChange={formik.handleChange}
                      className="w-full px-4 py-2.5 rounded-lg border border-healthcare-border bg-healthcare-surface/30 font-bold text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/5 transition-all"
                    />
                  </InfoField>
                  <InfoField label="Blood Group">
                    <div className="px-4 py-2.5 rounded-lg border border-transparent bg-healthcare-surface/10 font-bold text-healthcare-text-muted">
                      O+
                    </div>
                  </InfoField>
                </div>
              </section>

              {/* <section className="space-y-6">
                <h3 className="text-base font-bold text-healthcare-text">Medical Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-8">
                  <InfoField label="Primary Specialist">
                    <div className="px-4 py-2.5 rounded-lg border border-transparent bg-blue-50/50 font-bold text-brand-blue">
                      Dr. Sarah Connor
                    </div>
                  </InfoField>
                  <InfoField label="Known Allergies">
                    <div className="px-4 py-2.5 rounded-lg border border-transparent bg-red-50/50 font-bold text-red-600">
                      Penicillin
                    </div>
                  </InfoField>
                  <InfoField label="Chronic Conditions">
                    <div className="px-4 py-2.5 rounded-lg border border-transparent bg-healthcare-surface/10 font-bold text-healthcare-text">
                      Hypertension (2022)
                    </div>
                  </InfoField>
                  <InfoField label="Current Medications">
                    <div className="px-4 py-2.5 rounded-lg border border-transparent bg-healthcare-surface/10 font-bold text-healthcare-text">
                      Atenolol 50mg
                    </div>
                  </InfoField>
                </div>
              </section> */}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-10 animate-slide-up">
              <div className="p-6 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl flex items-start gap-4">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-healthcare-text mb-1">Secure Account</h4>
                  <p className="text-xs text-healthcare-text-muted">Maintain a robust password to ensure your clinical records remain strictly confidential.</p>
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

          {activeTab === 'display' && (
            <div className="space-y-8 animate-slide-up">
              <InfoField label="Bio / About Me" isEditable>
                <textarea
                  name="bio"
                  value={formik.values.bio}
                  onChange={formik.handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-healthcare-border bg-healthcare-surface/20 font-medium text-healthcare-text outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all resize-none text-sm leading-relaxed"
                  placeholder="Describe your health goals..."
                />
              </InfoField>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-healthcare-text-muted uppercase tracking-wider">Care Focus / Interests</label>
                <div className="flex flex-wrap gap-2">
                  {['Anxiety', 'Depression', 'Trauma Recovery', 'Stress Management'].map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        const current = formik.values.healthInterests;
                        if (current.includes(tag)) {
                           formik.setFieldValue('healthInterests', current.filter(t => t !== tag));
                        } else {
                          formik.setFieldValue('healthInterests', [...current, tag]);
                        }
                      }}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                        formik.values.healthInterests.includes(tag)
                          ? 'bg-brand-blue/10 text-brand-blue border-brand-blue/20 shadow-sm translate-y-[-1px]'
                          : 'bg-white text-healthcare-text-muted border-healthcare-border hover:border-brand-blue/30'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
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
