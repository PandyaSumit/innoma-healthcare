import { useState, useEffect } from "react";
import { useAuth } from "../hooks";
import { toast } from "sonner";
import {
  fetchPatientProfile,
  fetchTherapistMe,
  updatePatientProfile,
  updateTherapistMe,
} from "../api";

const Settings = () => {
  const { user, updateUser } = useAuth();
  const isTherapist = user?.role === "therapist";

  const [notificationSettings, setNotificationSettings] = useState({
    notification_email: true,
    notification_sms: true,
    reminder_frequency: "24h",
    marketing_email: false,
  });

  const [initialSettings, setInitialSettings] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch profile and initialize settings
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const profileData = isTherapist
          ? await fetchTherapistMe()
          : await fetchPatientProfile();

        // Use notificationSettings nested object for UI state
        const settingsFromApi = {
          notification_email:
            profileData?.notificationSettings?.notification_email ?? true,
          notification_sms:
            profileData?.notificationSettings?.notification_sms ?? true,
          reminder_frequency:
            profileData?.notificationSettings?.reminder_frequency ?? "24h",
          marketing_email:
            profileData?.notificationSettings?.marketing_email ?? false,
        };

        setNotificationSettings(settingsFromApi);
        setInitialSettings(settingsFromApi);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch settings");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role) fetchProfile();
  }, [user?.role, isTherapist]);

  // Save settings — only send notificationSettings object, not entire profile
  const handleSave = async () => {
    setLoading(true);
    try {
      const payload = {
        notificationSettings: {
          ...notificationSettings,
        },
      };

      const updatedProfile = isTherapist
        ? await updateTherapistMe(payload)
        : await updatePatientProfile(payload);

      setInitialSettings(notificationSettings);
      updateUser?.(updatedProfile);
      toast.success("Settings saved successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (initialSettings) setNotificationSettings(initialSettings);
  };

  if (loading && !initialSettings) {
    return <p className="text-center mt-10">Loading settings...</p>;
  }

  return (
    <div>
      <div>
        {/* ================= HEADER ================= */}
        <div className="mb-6">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-healthcare-text">
            Settings
          </h1>
          <p className="text-sm text-healthcare-text-muted mt-1">
            Manage your preferences, notifications and account settings
          </p>
        </div>

        {/* ================= NOTIFICATIONS ================= */}
        <div className="bg-white border border-healthcare-border rounded-xl p-5 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-healthcare-text mb-6">
            Notification Preferences
          </h2>

          <div className="space-y-6">
            {/* Email */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-healthcare-text">
                  Email notifications
                </p>
                <p className="text-sm text-healthcare-text-muted">
                  Booking confirmations and reminders via email
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.notification_email}
                  onChange={(e) =>
                    updateSetting("notification_email", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand-blue after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:transition peer-checked:after:translate-x-full" />
              </label>
            </div>

            {/* WhatsApp/SMS */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-healthcare-text">
                  SMS/WhatsApp notifications
                </p>
                <p className="text-sm text-healthcare-text-muted">
                  Instant updates and reminders
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.notification_sms}
                  onChange={(e) =>
                    updateSetting("notification_sms", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand-blue after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:transition peer-checked:after:translate-x-full" />
              </label>
            </div>

            {/* Reminder Frequency */}
            <div>
              <p className="font-medium text-healthcare-text mb-3">
                Reminder frequency
              </p>
              <div className="space-y-3">
                {[
                  { value: "24h", label: "24 hours before session" },
                  { value: "12h", label: "12 hours & 1 hour before" },
                  { value: "1h", label: "1 hour before only" },
                  { value: "none", label: "No reminders" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="reminder_frequency"
                      value={option.value}
                      checked={
                        notificationSettings.reminder_frequency === option.value
                      }
                      onChange={(e) =>
                        updateSetting("reminder_frequency", e.target.value)
                      }
                      className="w-4 h-4 text-brand-blue"
                    />
                    <span className="text-sm text-healthcare-text">
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Marketing */}
            <div className="pt-6 border-t border-healthcare-border flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-healthcare-text">
                  Marketing emails
                </p>
                <p className="text-sm text-healthcare-text-muted">
                  Feature updates and wellness tips
                </p>
              </div>
              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.marketing_email}
                  onChange={(e) =>
                    updateSetting("marketing_email", e.target.checked)
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand-blue after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:transition peer-checked:after:translate-x-full" />
              </label>
            </div>
          </div>
        </div>

        {/* ================= DANGER ZONE ================= */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-5 sm:p-6 mb-8">
          <h2 className="text-lg font-semibold text-red-800 mb-3">
            Danger zone
          </h2>
          <p className="text-sm text-red-700 mb-4">
            Deleting your account is permanent and cannot be undone.
          </p>
          <button className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition">
            Delete my account
          </button>
        </div>

        {/* ================= ACTION BUTTONS ================= */}
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-3 border border-healthcare-border rounded-lg font-semibold text-healthcare-text hover:bg-healthcare-surface transition"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:opacity-90 transition disabled:opacity-50"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
