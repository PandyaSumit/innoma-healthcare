import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from "sonner";
import {
  fetchAdminTherapist,
  createTherapist,
  updateTherapist,
} from "../../api/admin.api";
import AdminPageHeader from "../../components/admin/AdminPageHeader";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import alertIcon from "../../assets/svg/alert.svg";
import Modal from "../../components/ui/Model";
import { useState } from "react";

const schema = (isEdit: boolean) =>
  yup.object({
    fullname: yup.string().required("Name is required"),
    email: yup.string().required("Email is required").email("Invalid email"),
    phone: yup.string(),
    specialization: yup.string().required("Specialization is required"),
    experience: yup.number().required("Experience is required").min(0),
    bio: yup.string(),
    password: isEdit
      ? yup.string().min(8, "Min 8 characters")
      : yup
          .string()
          .required("Password is required")
          .min(8, "Min 8 characters"),
  });

const inputCls = (err?: boolean) =>
  `w-full px-5 py-3.5 rounded-md border ${err ? "border-red-400 bg-red-50/10" : "border-healthcare-border bg-healthcare-surface/20"} focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 outline-none text-healthcare-text font-medium text-sm transition-all placeholder:text-healthcare-text-muted/40`;

function Field({
  label,
  error,
  children,
  required,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm relative font-bold w-max  text-healthcare-text px-1 flex items-center gap-1">
        {label}
        {required && (
          <span className="text-red-500 text-lg absolute -right-2 top-0 ">
            *
          </span>
        )}
      </label>
      {children}
      {error && (
        <div className="flex items-center gap-1.5 px-1 animate-fade-in">
          <svg
            className="w-3.5 h-3.5 text-red-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-red-500 text-[11px] font-bold uppercase tracking-wider">
            {error}
          </p>
        </div>
      )}
    </div>
  );
}

const TherapistFormSkeleton = () => {
  return (
    <div className="bg-white rounded-md border border-healthcare-border p-6 animate-pulse">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <div className="h-3 w-24 bg-gray-200 rounded" />
          <div className="h-11 w-full bg-gray-200 rounded-md" />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="h-11 w-full bg-gray-200 rounded-md" />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="h-11 w-full bg-gray-200 rounded-md" />
        </div>

        {/* Experience */}
        <div className="space-y-2">
          <div className="h-3 w-36 bg-gray-200 rounded" />
          <div className="h-11 w-full bg-gray-200 rounded-md" />
        </div>

        {/* Specialization */}
        <div className="space-y-2">
          <div className="h-3 w-36 bg-gray-200 rounded" />
          <div className="h-11 w-full bg-gray-200 rounded-md" />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="h-3 w-32 bg-gray-200 rounded" />
          <div className="h-11 w-full bg-gray-200 rounded-md" />
        </div>

        {/* Bio */}
        <div className="sm:col-span-2 space-y-2">
          <div className="h-3 w-28 bg-gray-200 rounded" />
          <div className="h-28 w-full bg-gray-200 rounded-md" />
        </div>
      </div>

      {/* Info text */}
      <div className="h-3 w-64 bg-gray-200 rounded mt-6" />

      {/* Buttons */}
      <div className="grid sm:grid-cols-2 gap-4 pt-6 mt-4 border-t border-healthcare-border">
        <div className="h-12 bg-gray-200 rounded-md" />
        <div className="h-12 bg-gray-200 rounded-md" />
      </div>
    </div>
  );
};

export default function TherapistForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id && id !== "new";
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editconform, setEditconform] = useState(false);
  const { data: existing, isLoading } = useQuery({
    queryKey: ["admin", "therapist", id],
    queryFn: () => fetchAdminTherapist(id!),
    enabled: isEdit,
  });

  const create = useMutation({
    mutationFn: createTherapist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "therapists"] });
      toast.success("Therapist created.");
      navigate("/admin/therapists");
    },
    onError: (err: any) =>
      toast.error(err.message ?? "Failed to create therapist."),
  });

  const edit = useMutation({
    mutationFn: (payload: any) => updateTherapist(id!, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "therapists"] });
      qc.invalidateQueries({ queryKey: ["admin", "therapist", id] });
      toast.success("Therapist updated.");
      navigate("/admin/therapists");
    },
    onError: (err: any) =>
      toast.error(err.message ?? "Failed to update therapist."),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullname: existing?.name ?? "",
      email: existing?.email ?? "",
      phone: existing?.phone ?? "",
      qualifications: existing?.qualifications ?? "",
      license_number: existing?.license_number ?? "",
      experience: existing?.experience_years ?? 0,
      consultation_fee: existing?.consultation_fee ?? 0,
      specialization: existing?.specializations
        ? existing.specializations.join(", ")
        : "",
      languages: existing?.languages ? existing.languages.join(", ") : "",
      location: existing?.location ?? "",
      gender: existing?.gender ?? "",
      bio: existing?.bio ?? "",
      password: "",
    },
    validationSchema: schema(isEdit),
    onSubmit: (values) => {
      const payload: any = {
        fullName: values.fullname,
        email: values.email,
        phone: values.phone,
        qualifications: values.qualifications,
        licenseNumber: values.license_number,
        experience: values.experience,
        consultationFee: values.consultation_fee,
        location: values.location,
        gender: values.gender,
        bio: values.bio,

        specializations: values.specialization
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),

        languages: values.languages
          .split(",")
          .map((l) => l.trim())
          .filter(Boolean),
      };

      if (!values.phone) delete payload.phone;
      if (!values.bio) delete payload.bio;

      if (!isEdit) payload.password = values.password;

      if (isEdit) {
        edit.mutate(payload);
      } else {
        create.mutate(payload);
      }
    },
  });

  const isPending = create.isPending || edit.isPending;

  return (
    <>
      <div className="max-w-4xl space-y-2 animate-fade-in">
        <div className="flex items-start gap-4">
          <Link to="/admin/therapists" className="mt-2">
            <svg
              className="w-6 h-6 group-hover:-translate-x-0.5 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <div className="flex-1">
            <AdminPageHeader
              title={isEdit ? "Edit Therapist" : "New Therapist"}
              description={
                isEdit
                  ? `Modifying therapist: ${existing?.name}`
                  : "Onboard a new healthcare provider to the platform."
              }
            />
          </div>
        </div>

        {isEdit && isLoading ? (
          <TherapistFormSkeleton />
        ) : (
          <form
            onSubmit={formik.handleSubmit}
            className="bg-white rounded-md border border-healthcare-border  p-6 "
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
              <Field
                label="Full Name"
                required
                error={
                  formik.touched.fullname ? formik.errors.fullname : undefined
                }
              >
                <Input
                  name="fullname"
                  value={formik.values.fullname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Dr. Jane Smith"
                  className={inputCls(
                    !!formik.touched.fullname && !!formik.errors.fullname,
                  )}
                />
              </Field>
              <Field
                label="Professional Email"
                required
                error={formik.touched.email ? formik.errors.email : undefined}
              >
                <Input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="jane@clinic.com"
                  className={inputCls(
                    !!formik.touched.email && !!formik.errors.email,
                  )}
                />
              </Field>
              <Field label="Contact Number">
                <Input
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  placeholder="+1 (234) 567 8900"
                  className={inputCls()}
                />
              </Field>
              <Field
                label="Years of Experience"
                required
                error={
                  formik.touched.experience
                    ? formik.errors.experience
                    : undefined
                }
              >
                <Input
                  type="number"
                  name="experience"
                  value={formik.values.experience}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  min={0}
                  className={inputCls(
                    !!formik.touched.experience && !!formik.errors.experience,
                  )}
                />
              </Field>
              <Field
                label="Core Specialization"
                required
                error={
                  formik.touched.specialization
                    ? (formik.errors.specialization as string)
                    : undefined
                }
              >
                <Input
                  name="specialization"
                  value={formik.values.specialization}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter specialization "
                  className={inputCls(
                    !!formik.touched.specialization &&
                      !!formik.errors.specialization,
                  )}
                />
              </Field>
              <Field
                label={
                  isEdit ? "Update Password (optional)" : "Account Password"
                }
                required={!isEdit}
                error={
                  formik.touched.password ? formik.errors.password : undefined
                }
              >
                <Input
                  type="password"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="••••••••"
                  className={inputCls(
                    !!formik.touched.password && !!formik.errors.password,
                  )}
                />
              </Field>
              <Field label="Qualifications">
                <Input
                  name="qualifications"
                  value={formik.values.qualifications}
                  onChange={formik.handleChange}
                  placeholder="MBBS, MD Psychiatry"
                  className={inputCls()}
                />
              </Field>
              <Field label="License Number">
                <Input
                  name="license_number"
                  value={formik.values.license_number}
                  onChange={formik.handleChange}
                  placeholder="MCI-67890"
                  className={inputCls()}
                />
              </Field>

              <Field label="Consultation Fee">
                <Input
                  type="number"
                  name="consultation_fee"
                  value={formik.values.consultation_fee}
                  onChange={formik.handleChange}
                  className={inputCls()}
                />
              </Field>

              <Field label="Languages">
                <Input
                  name="languages"
                  value={formik.values.languages}
                  onChange={formik.handleChange}
                  placeholder="English, Gujarati"
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
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </Field>

              <div className="sm:col-span-2">
                <Field label="Professional Bio">
                  <Textarea
                    name="bio"
                    value={formik.values.bio}
                    onChange={formik.handleChange}
                    rows={5}
                    placeholder="Brief description of professional background and expertise…"
                    className={inputCls() + " resize-none leading-relaxed"}
                  />
                </Field>
              </div>
            </div>

            <p className="text-xs  items-center gap-2 text-red-500 mt-3 font-bold  tracking-widest hidden sm:flex">
              <img
                src={alertIcon}
                alt="Info"
                className="w-5 h-5 inline-block -translate-y-px"
              />
              Fields marked with * are mandatory
            </p>

            <div className="grid sm:grid-cols-2 gap-4 w-full sm:w-auto pt-6 mt-4 border-t border-healthcare-border">
              <button
                type="button"
                onClick={() => navigate("/admin/therapists")}
                className="flex-1 sm:flex-none px-8 py-3.5 border border-healthcare-border rounded-md text-sm font-bold text-healthcare-text hover:bg-healthcare-surface transition-all cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isPending}
                onClick={() => setEditconform(true)}
                className="flex-1 sm:flex-none px-12 py-3.5 bg-[#1e40af] text-white rounded-md text-sm font-bold hover:opacity-90 hover:shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
              >
                {isPending
                  ? "Processing…"
                  : isEdit
                    ? "Save Changes"
                    : "Create Therapist"}
              </button>
            </div>
          </form>
        )}
      </div>
      <Modal
        isOpen={editconform}
        onClose={() => setEditconform(false)}
        title={isEdit ? "Confirm Changes" : "Confirm Creation"}
      >
        <p className="text-lg text-start text-healthcare-text mb-6">
          {isEdit
            ? "Are you sure you want to save changes to this therapist's profile?"
            : "Are you sure you want to create this therapist account?"}
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setEditconform(false)}
            className="px-4 py-2 text-sm font-semibold bg-gray-100 hover:bg-gray-200 rounded-md"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              setEditconform(false);
              formik.submitForm();
            }}
            className="px-4 py-2 text-sm font-semibold bg-[#1e40af] text-white hover:opacity-90 rounded-md"
          >
            {isEdit ? "Save Changes" : "Create"}
          </button>
        </div>
      </Modal>
    </>
  );
}
