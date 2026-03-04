import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'sonner';
import {
  fetchAdminTherapist,
  createTherapist,
  updateTherapist,
} from '../../api/admin.api';
import Spinner from '../../components/ui/Spinner';

const schema = (isEdit: boolean) =>
  yup.object({
    name: yup.string().required('Name is required'),
    email: yup.string().required('Email is required').email('Invalid email'),
    phone: yup.string(),
    specialization: yup.string().required('Specialization is required'),
    experience: yup.number().required('Experience is required').min(0),
    bio: yup.string(),
    password: isEdit
      ? yup.string().min(8, 'Min 8 characters')
      : yup.string().required('Password is required').min(8, 'Min 8 characters'),
  });

const inputCls = (err?: boolean) =>
  `w-full px-4 py-2.5 rounded-xl border ${err ? 'border-red-400' : 'border-healthcare-neutral/20'} focus:border-brand-blue outline-none text-healthcare-text bg-white font-medium text-sm placeholder:text-healthcare-text-muted/40`;

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-healthcare-text">{label}</label>
      {children}
      {error && <p className="text-red-500 text-xs font-bold">{error}</p>}
    </div>
  );
}

export default function TherapistForm() {
  const { id } = useParams<{ id?: string }>();
  const isEdit = !!id && id !== 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['admin', 'therapist', id],
    queryFn: () => fetchAdminTherapist(id!),
    enabled: isEdit,
  });

  const create = useMutation({
    mutationFn: createTherapist,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'therapists'] });
      toast.success('Therapist created.');
      navigate('/admin/therapists');
    },
    onError: (err: any) => toast.error(err.message ?? 'Failed to create therapist.'),
  });

  const edit = useMutation({
    mutationFn: (payload: any) => updateTherapist(id!, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'therapists'] });
      qc.invalidateQueries({ queryKey: ['admin', 'therapist', id] });
      toast.success('Therapist updated.');
      navigate('/admin/therapists');
    },
    onError: (err: any) => toast.error(err.message ?? 'Failed to update therapist.'),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: existing?.name ?? '',
      email: existing?.email ?? '',
      phone: existing?.phone ?? '',
      specialization: existing?.specialization ?? '',
      experience: existing?.experience ?? 0,
      bio: existing?.bio ?? '',
      password: '',
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
      <div className="flex justify-center py-10">
        <Spinner size="lg" />
      </div>
    );
  }

  const isPending = create.isPending || edit.isPending;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-healthcare-text">
          {isEdit ? 'Edit Therapist' : 'Add Therapist'}
        </h1>
        <p className="text-sm text-healthcare-text-muted mt-1">
          {isEdit ? 'Update therapist details.' : 'Create a new therapist account.'}
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="bg-white rounded-2xl border border-healthcare-border shadow-clinical p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Full Name" error={formik.touched.name ? formik.errors.name : undefined}>
            <input name="name" value={formik.values.name} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Dr. Jane Smith" className={inputCls(!!formik.touched.name && !!formik.errors.name)} />
          </Field>
          <Field label="Email" error={formik.touched.email ? formik.errors.email : undefined}>
            <input type="email" name="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="jane@example.com" className={inputCls(!!formik.touched.email && !!formik.errors.email)} />
          </Field>
          <Field label="Phone">
            <input name="phone" value={formik.values.phone} onChange={formik.handleChange} placeholder="+1 234 567 8900" className={inputCls()} />
          </Field>
          <Field label="Experience (years)" error={formik.touched.experience ? formik.errors.experience : undefined}>
            <input type="number" name="experience" value={formik.values.experience} onChange={formik.handleChange} onBlur={formik.handleBlur} min={0} className={inputCls(!!formik.touched.experience && !!formik.errors.experience)} />
          </Field>
          <Field label="Specialization" error={formik.touched.specialization ? formik.errors.specialization : undefined}>
            <input name="specialization" value={formik.values.specialization} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Cognitive Behavioral Therapy" className={inputCls(!!formik.touched.specialization && !!formik.errors.specialization)} />
          </Field>
          <Field
            label={isEdit ? 'New Password (leave blank to keep)' : 'Password'}
            error={formik.touched.password ? formik.errors.password : undefined}
          >
            <input type="password" name="password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="••••••••" className={inputCls(!!formik.touched.password && !!formik.errors.password)} />
          </Field>
        </div>
        <Field label="Bio">
          <textarea name="bio" value={formik.values.bio} onChange={formik.handleChange} rows={3} placeholder="Brief professional bio…" className={inputCls() + ' resize-none'} />
        </Field>

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate('/admin/therapists')}
            className="px-5 py-2.5 border border-healthcare-neutral/20 rounded-xl text-sm font-bold text-healthcare-text hover:bg-healthcare-surface transition-all cursor-pointer bg-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 bg-brand-blue text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed border-none cursor-pointer"
          >
            {isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Therapist'}
          </button>
        </div>
      </form>
    </div>
  );
}
