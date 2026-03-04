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
import Spinner from "../../components/ui/Spinner";
import AdminPageHeader from "../../components/admin/AdminPageHeader";

const schema = (isEdit: boolean) =>
  yup.object({
    name: yup.string().required("Name is required"),
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
  `w-full px-5 py-3.5 rounded-2xl border ${err ? "border-red-400 bg-red-50/10" : "border-healthcare-border bg-healthcare-surface/20"} focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 outline-none text-healthcare-text font-medium text-sm transition-all placeholder:text-healthcare-text-muted/40`;

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
      <label className="text-sm font-bold text-healthcare-text px-1 flex items-center gap-1">
        {label}
        {required && <span className="text-red-500">*</span>}
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

export default function TherapistForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id && id !== "new";
  const navigate = useNavigate();
  const qc = useQueryClient();

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
      name: existing?.name ?? "",
      email: existing?.email ?? "",
      phone: existing?.phone ?? "",
      specialization: existing?.specialization ?? "",
      experience: existing?.experience ?? 0,
      bio: existing?.bio ?? "",
      password: "",
    },
    validationSchema: schema(isEdit),
    onSubmit: (values) => {
      const payload: any = { ...values };
      if (isEdit && !payload.password) delete payload.password;
      if (!payload.phone) delete payload.phone;
      if (!payload.bio) delete payload.bio;

      if (isEdit) {
        edit.mutate(payload);
      } else {
        create.mutate(payload);
      }
    },
  });

  if (isEdit && isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const isPending = create.isPending || edit.isPending;

  return (
    <div className="max-w-4xl space-y-8 animate-fade-in">
      <div className="flex items-start gap-4">
        <Link
          to="/admin/therapists"
          className="mt-1 w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-healthcare-border text-healthcare-text hover:bg-brand-blue hover:text-white hover:border-brand-blue transition-all no-underline shadow-sm group"
        >
          <svg
            className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
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

      <form
        onSubmit={formik.handleSubmit}
        className="bg-white rounded-3xl border border-healthcare-border shadow-clinical p-8 space-y-8"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <Field
            label="Full Name"
            required
            error={formik.touched.name ? formik.errors.name : undefined}
          >
            <input
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Dr. Jane Smith"
              className={inputCls(
                !!formik.touched.name && !!formik.errors.name,
              )}
            />
          </Field>
          <Field
            label="Professional Email"
            required
            error={formik.touched.email ? formik.errors.email : undefined}
          >
            <input
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
            <input
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
              formik.touched.experience ? formik.errors.experience : undefined
            }
          >
            <input
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
                ? formik.errors.specialization
                : undefined
            }
          >
            <input
              name="specialization"
              value={formik.values.specialization}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="e.g. Clinical Psychology"
              className={inputCls(
                !!formik.touched.specialization &&
                  !!formik.errors.specialization,
              )}
            />
          </Field>
          <Field
            label={isEdit ? "Update Password (optional)" : "Account Password"}
            required={!isEdit}
            error={formik.touched.password ? formik.errors.password : undefined}
          >
            <input
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
          <div className="sm:col-span-2">
            <Field label="Professional Bio">
              <textarea
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

        <div className="flex items-center justify-between gap-4 pt-6 mt-4 border-t border-healthcare-border">
          <p className="text-xs text-healthcare-text-muted font-bold uppercase tracking-widest hidden sm:block">
            Fields marked with * are mandatory
          </p>
          <div className="flex gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate("/admin/therapists")}
              className="flex-1 sm:flex-none px-8 py-3.5 border border-healthcare-border rounded-2xl text-sm font-bold text-healthcare-text hover:bg-healthcare-surface transition-all cursor-pointer bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 sm:flex-none px-12 py-3.5 bg-healthcare-text text-white rounded-2xl text-sm font-bold hover:opacity-90 hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
            >
              {isPending
                ? "Processing…"
                : isEdit
                  ? "Save Changes"
                  : "Create Therapist"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
