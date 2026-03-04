import { useState, useRef } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import {
  usePatientProfile,
  useUpdatePatientProfile,
  useUploadAvatar,
} from "../../hooks/usePatient";

type Tab = "personal" | "display" | "security" | "notifications";

const TABS: { id: Tab; label: string }[] = [
  { id: "personal", label: "Personal Details" },
  { id: "display", label: "Profile Display" },
  { id: "security", label: "Security & Privacy" },
  { id: "notifications", label: "Notifications" },
];

const personalSchema = yup.object({
  fullName: yup.string().required("Name is required"),
  email: yup.string().required("Email is required").email("Invalid email"),
  phone: yup.string().nullable(),
  dob: yup.string().nullable(),
  gender: yup.string().nullable(),
  occupation: yup.string().nullable(),
  bloodGroup: yup.string().nullable(),
  emergencyContact: yup.string().nullable(),
});

const securitySchema = yup.object({
  currentPassword: yup.string().required("Current password is required"),
  newPassword: yup
    .string()
    .required("New password is required")
    .min(8, "Minimum 8 characters"),
  confirmPassword: yup
    .string()
    .required("Confirm your new password")
    .oneOf([yup.ref("newPassword")], "Passwords do not match"),
});

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold text-healthcare-text mb-1">{children}</h2>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-healthcare-text ml-0.5">
        {label}
      </label>
      {children}
      {error && (
        <p className="text-red-500 text-xs font-bold ml-0.5">{error}</p>
      )}
    </div>
  );
}

const inputCls = (hasError?: boolean) =>
  `w-full px-4 py-2.5 rounded-lg border ${hasError ? "border-red-400" : "border-healthcare-neutral/20"} focus:border-brand-blue outline-none text-healthcare-text bg-white font-medium placeholder:text-healthcare-text-muted/40 text-sm`;

// ── Personal Tab ─────────────────────────────────────────────────────────────

function PersonalTab({ profile }: { profile: any }) {
  const update = useUpdatePatientProfile();

  const formik = useFormik({
    initialValues: {
      fullName: profile.name ?? "",
      email: profile.email ?? "",
      phone: profile.phone ?? "",
      dob: profile.dob ?? "",
      gender: profile.gender ?? "",
      occupation: profile.occupation ?? "",
      bloodGroup: profile.bloodGroup ?? "",
      emergencyContact: profile.emergencyContact ?? "",
    },
    validationSchema: personalSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const payload: any = { ...values };
      Object.keys(payload).forEach((k) => {
        if (payload[k] === "") payload[k] = null;
      });
      update.mutate(payload);
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field
          label="Full Name"
          error={
            formik.touched.fullName
              ? (formik.errors.fullName as string)
              : undefined
          }
        >
          <input
            name="fullName"
            value={formik.values.fullName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputCls(
              !!formik.touched.fullName && !!formik.errors.fullName,
            )}
            placeholder="John Doe"
          />
        </Field>
        <Field
          label="Email"
          error={
            formik.touched.email ? (formik.errors.email as string) : undefined
          }
        >
          <input
            type="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className={inputCls(
              !!formik.touched.email && !!formik.errors.email,
            )}
            placeholder="name@example.com"
          />
        </Field>
        <Field label="Phone">
          <input
            name="phone"
            value={formik.values.phone}
            onChange={formik.handleChange}
            className={inputCls()}
            placeholder="+1 234 567 8900"
          />
        </Field>
        <Field label="Date of Birth">
          <input
            type="date"
            name="dob"
            value={formik.values.dob}
            onChange={formik.handleChange}
            className={inputCls()}
          />
        </Field>
        <Field label="Gender">
          <select
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            className={inputCls()}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </Field>
        <Field label="Occupation">
          <input
            name="occupation"
            value={formik.values.occupation}
            onChange={formik.handleChange}
            className={inputCls()}
            placeholder="Your occupation"
          />
        </Field>
        <Field label="Blood Group">
          <select
            name="bloodGroup"
            value={formik.values.bloodGroup}
            onChange={formik.handleChange}
            className={inputCls()}
          >
            <option value="">Select</option>
            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Emergency Contact">
          <input
            name="emergencyContact"
            value={formik.values.emergencyContact}
            onChange={formik.handleChange}
            className={inputCls()}
            placeholder="+1 234 567 8900"
          />
        </Field>
      </div>
      <div className="pt-2">
        <button
          type="submit"
          disabled={update.isPending}
          className="px-6 py-2.5 bg-brand-blue text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
        >
          {update.isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

// ── Display Tab ───────────────────────────────────────────────────────────────

function DisplayTab({ profile }: { profile: any }) {
  const update = useUpdatePatientProfile();
  const uploadAvatar = useUploadAvatar();
  const fileRef = useRef<HTMLInputElement>(null);
  const [interests, setInterests] = useState<string[]>(
    profile.healthInterests ?? [],
  );
  const [newInterest, setNewInterest] = useState("");

  const formik = useFormik({
    initialValues: {
      bio: profile.bio ?? "",
      allergies: profile.allergies ?? "",
      medications: profile.medications ?? "",
    },
    enableReinitialize: true,
    onSubmit: (values) => {
      update.mutate({ ...values, healthInterests: interests });
    },
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadAvatar.mutate(file);
  };

  const addInterest = () => {
    const val = newInterest.trim();
    if (val && !interests.includes(val)) {
      setInterests([...interests, val]);
      setNewInterest("");
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      {/* Avatar */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center overflow-hidden border-2 border-healthcare-border flex-shrink-0">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-2xl font-bold text-brand-blue">
              {profile.name?.[0]?.toUpperCase() ?? "P"}
            </span>
          )}
        </div>
        <div>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploadAvatar.isPending}
            className="px-4 py-2 bg-white border border-healthcare-neutral/20 rounded-lg text-sm font-bold text-healthcare-text hover:bg-healthcare-surface transition-all cursor-pointer disabled:opacity-50"
          >
            {uploadAvatar.isPending ? "Uploading…" : "Change Photo"}
          </button>
          <p className="text-xs text-healthcare-text-muted mt-1">
            JPG, PNG or GIF. Max 2MB.
          </p>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
      </div>

      {/* Bio */}
      <Field label="Bio">
        <textarea
          name="bio"
          value={formik.values.bio}
          onChange={formik.handleChange}
          rows={3}
          className={inputCls() + " resize-none"}
          placeholder="A brief description about yourself…"
        />
      </Field>

      {/* Health Interests */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-healthcare-text ml-0.5">
          Health Interests
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {interests.map((item) => (
            <span
              key={item}
              className="flex items-center gap-1.5 px-3 py-1 bg-brand-blue/8 text-brand-blue text-xs font-bold rounded-full border border-brand-blue/20"
            >
              {item}
              <button
                type="button"
                onClick={() =>
                  setInterests(interests.filter((i) => i !== item))
                }
                className="text-brand-blue/60 hover:text-brand-blue transition-colors bg-transparent border-none cursor-pointer p-0"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), addInterest())
            }
            placeholder="Add interest…"
            className={inputCls() + " flex-1"}
          />
          <button
            type="button"
            onClick={addInterest}
            className="px-4 py-2.5 bg-healthcare-surface border border-healthcare-neutral/20 rounded-lg text-sm font-bold text-healthcare-text hover:bg-white transition-all cursor-pointer"
          >
            Add
          </button>
        </div>
      </div>

      {/* Allergies & Medications */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field label="Allergies">
          <textarea
            name="allergies"
            value={formik.values.allergies}
            onChange={formik.handleChange}
            rows={2}
            className={inputCls() + " resize-none"}
            placeholder="Known allergies…"
          />
        </Field>
        <Field label="Medications">
          <textarea
            name="medications"
            value={formik.values.medications}
            onChange={formik.handleChange}
            rows={2}
            className={inputCls() + " resize-none"}
            placeholder="Current medications…"
          />
        </Field>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={update.isPending}
          className="px-6 py-2.5 bg-brand-blue text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
        >
          {update.isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

// ── Security Tab ──────────────────────────────────────────────────────────────

function SecurityTab() {
  const update = useUpdatePatientProfile();

  const formik = useFormik({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: securitySchema,
    onSubmit: (values, helpers) => {
      update.mutate(
        {
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        },
        { onSuccess: () => helpers.resetForm() },
      );
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-5 max-w-md">
      <SectionTitle>Change Password</SectionTitle>
      <p className="text-sm text-healthcare-text-muted">
        Use a strong password that you don't use elsewhere.
      </p>
      {(["currentPassword", "newPassword", "confirmPassword"] as const).map(
        (field) => {
          const labels: Record<typeof field, string> = {
            currentPassword: "Current Password",
            newPassword: "New Password",
            confirmPassword: "Confirm New Password",
          };
          return (
            <Field
              key={field}
              label={labels[field]}
              error={formik.touched[field] ? formik.errors[field] : undefined}
            >
              <input
                type="password"
                name={field}
                value={formik.values[field]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="••••••••"
                className={inputCls(
                  !!formik.touched[field] && !!formik.errors[field],
                )}
              />
            </Field>
          );
        },
      )}
      <button
        type="submit"
        disabled={update.isPending}
        className="px-6 py-2.5 bg-brand-blue text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
      >
        {update.isPending ? "Updating…" : "Update Password"}
      </button>
    </form>
  );
}

// ── Notifications Tab ─────────────────────────────────────────────────────────

function NotificationsTab({ profile }: { profile: any }) {
  const update = useUpdatePatientProfile();
  const [prefs, setPrefs] = useState({
    notificationEmail: profile.notificationEmail ?? true,
    notificationSms: profile.notificationSms ?? false,
    marketingEmail: profile.marketingEmail ?? false,
    reminderFrequency: profile.reminderFrequency ?? "24h",
  });

  const toggle = (key: keyof typeof prefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
  };

  const save = () => update.mutate(prefs);

  return (
    <div className="space-y-6 max-w-lg">
      <SectionTitle>Notification Preferences</SectionTitle>
      {(
        [
          {
            key: "notificationEmail",
            label: "Email Notifications",
            desc: "Appointment reminders and updates via email",
          },
          {
            key: "notificationSms",
            label: "SMS Notifications",
            desc: "Text message reminders for upcoming sessions",
          },
          {
            key: "marketingEmail",
            label: "Marketing Emails",
            desc: "Tips, resources, and product announcements",
          },
        ] as const
      ).map(({ key, label, desc }) => (
        <div
          key={key}
          className="flex items-start justify-between gap-4 p-4 bg-healthcare-surface/40 rounded-xl border border-healthcare-border"
        >
          <div>
            <p className="text-sm font-bold text-healthcare-text">{label}</p>
            <p className="text-xs text-healthcare-text-muted mt-0.5">{desc}</p>
          </div>
          <button
            type="button"
            onClick={() => toggle(key)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 border-none cursor-pointer ${prefs[key] ? "bg-brand-blue" : "bg-healthcare-neutral/20"}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${prefs[key] ? "translate-x-6" : "translate-x-1"}`}
            />
          </button>
        </div>
      ))}

      <div className="space-y-2">
        <label className="block text-sm font-bold text-healthcare-text">
          Reminder Frequency
        </label>
        <select
          value={prefs.reminderFrequency}
          onChange={(e) =>
            setPrefs((p) => ({
              ...p,
              reminderFrequency: e.target.value as any,
            }))
          }
          className={inputCls()}
        >
          <option value="1h">1 hour before</option>
          <option value="6h">6 hours before</option>
          <option value="12h">12 hours before</option>
          <option value="24h">24 hours before</option>
          <option value="48h">48 hours before</option>
        </select>
      </div>

      <button
        onClick={save}
        disabled={update.isPending}
        className="px-6 py-2.5 bg-brand-blue text-white rounded-lg font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
      >
        {update.isPending ? "Saving…" : "Save Preferences"}
      </button>
    </div>
  );
}

// ── Main Profile Page ─────────────────────────────────────────────────────────

export default function PatientProfile() {
  const [activeTab, setActiveTab] = useState<Tab>("personal");
  const { data: profile, isLoading, error } = usePatientProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-brand-blue/20 border-t-brand-blue" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 font-medium">
        Failed to load profile. Please refresh the page.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-blue/10 flex items-center justify-center overflow-hidden border-2 border-healthcare-border flex-shrink-0">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-xl font-bold text-brand-blue">
              {profile.name?.[0]?.toUpperCase() ?? "P"}
            </span>
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-healthcare-text">
            {profile.name}
          </h1>
          <p className="text-sm text-healthcare-text-muted">{profile.email}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl shadow-clinical border border-healthcare-border overflow-hidden">
        <div className="flex border-b border-healthcare-border overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-4 text-sm font-bold whitespace-nowrap transition-all border-none cursor-pointer ${
                activeTab === tab.id
                  ? "text-brand-blue border-b-2 border-brand-blue bg-brand-blue/3"
                  : "text-healthcare-text-muted hover:text-healthcare-text bg-transparent"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "personal" && <PersonalTab profile={profile} />}
          {activeTab === "display" && <DisplayTab profile={profile} />}
          {activeTab === "security" && <SecurityTab />}
          {activeTab === "notifications" && (
            <NotificationsTab profile={profile} />
          )}
        </div>
      </div>
    </div>
  );
}
