import { useState } from "react";

const Settings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    whatsappNotifications: true,
    reminderFrequency: "24h",
    marketingEmails: false,
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Mock save
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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

        {/* ================= SAVE SUCCESS ================= */}
        {saved && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-sm font-semibold text-green-800">
              Settings saved successfully
            </span>
          </div>
        )}

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
                  checked={notificationSettings.emailNotifications}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: e.target.checked,
                    })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-brand-blue after:absolute after:top-[2px] after:left-[2px] after:h-5 after:w-5 after:bg-white after:rounded-full after:transition peer-checked:after:translate-x-full" />
              </label>
            </div>

            {/* WhatsApp */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-healthcare-text">
                  WhatsApp notifications
                </p>
                <p className="text-sm text-healthcare-text-muted">
                  Instant updates and reminders
                </p>
              </div>

              <label className="relative inline-flex cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationSettings.whatsappNotifications}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      whatsappNotifications: e.target.checked,
                    })
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
                      name="reminderFrequency"
                      value={option.value}
                      checked={
                        notificationSettings.reminderFrequency === option.value
                      }
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          reminderFrequency: e.target.value,
                        })
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
                  checked={notificationSettings.marketingEmails}
                  onChange={(e) =>
                    setNotificationSettings({
                      ...notificationSettings,
                      marketingEmails: e.target.checked,
                    })
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
          <button className="px-6 py-3 border border-healthcare-border rounded-lg font-semibold text-healthcare-text hover:bg-healthcare-surface transition">
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:opacity-90 transition"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
