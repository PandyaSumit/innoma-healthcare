import { useState } from 'react';

const Settings = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    whatsappNotifications: true,
    reminderFrequency: '24h',
    marketingEmails: false,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'private',
    shareDataForResearch: false,
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-healthcare-text mb-2">Settings</h1>
          <p className="text-healthcare-text-muted">Manage your account preferences and notifications</p>
        </div>

        {/* Save Confirmation */}
        {saved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-green-800 font-semibold">Settings saved successfully!</span>
          </div>
        )}

        {/* Notification Settings */}
        <div className="bg-white rounded-lg border border-healthcare-border p-6 mb-6">
          <h2 className="text-xl font-bold text-healthcare-text mb-6">Notification Preferences</h2>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-healthcare-text mb-1">Email Notifications</h3>
                <p className="text-sm text-healthcare-text-muted">
                  Receive booking confirmations and session reminders via email
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-healthcare-text mb-1">WhatsApp Notifications</h3>
                <p className="text-sm text-healthcare-text-muted">
                  Get instant reminders and updates on WhatsApp
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
              </label>
            </div>

            <div>
              <label className="block font-semibold text-healthcare-text mb-3">
                Reminder Frequency
              </label>
              <div className="space-y-2">
                {[
                  { value: '24h', label: '24 hours before session' },
                  { value: '12h', label: '12 hours and 1 hour before' },
                  { value: '1h', label: '1 hour before session only' },
                  { value: 'none', label: 'No reminders' },
                ].map((option) => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="reminderFrequency"
                      value={option.value}
                      checked={notificationSettings.reminderFrequency === option.value}
                      onChange={(e) =>
                        setNotificationSettings({
                          ...notificationSettings,
                          reminderFrequency: e.target.value,
                        })
                      }
                      className="w-4 h-4 text-brand-blue focus:ring-brand-blue"
                    />
                    <span className="text-healthcare-text">{option.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-healthcare-border">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-healthcare-text mb-1">Marketing Emails</h3>
                  <p className="text-sm text-healthcare-text-muted">
                    Receive updates about new features and wellness tips
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
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
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white rounded-lg border border-healthcare-border p-6 mb-6">
          <h2 className="text-xl font-bold text-healthcare-text mb-6">Privacy & Security</h2>

          <div className="space-y-6">
            <div>
              <label className="block font-semibold text-healthcare-text mb-3">
                Profile Visibility
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="profileVisibility"
                    value="private"
                    checked={privacySettings.profileVisibility === 'private'}
                    onChange={(e) =>
                      setPrivacySettings({
                        ...privacySettings,
                        profileVisibility: e.target.value,
                      })
                    }
                    className="w-4 h-4 text-brand-blue focus:ring-brand-blue"
                  />
                  <div>
                    <span className="font-medium text-healthcare-text">Private</span>
                    <p className="text-sm text-healthcare-text-muted">
                      Only you and your therapists can see your profile
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-healthcare-border">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-healthcare-text mb-1">
                    Share Data for Research (Optional)
                  </h3>
                  <p className="text-sm text-healthcare-text-muted">
                    Help improve mental health care by anonymously sharing aggregated data for research
                    purposes. No personal information will be shared.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={privacySettings.shareDataForResearch}
                    onChange={(e) =>
                      setPrivacySettings({
                        ...privacySettings,
                        shareDataForResearch: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-blue"></div>
                </label>
              </div>
            </div>

            <div className="pt-6 border-t border-healthcare-border">
              <button className="w-full px-6 py-3 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-colors">
                Download My Data (GDPR)
              </button>
              <p className="text-xs text-healthcare-text-muted mt-2 text-center">
                Export all your personal data in a machine-readable format
              </p>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-lg border border-red-200 p-6">
          <h2 className="text-xl font-bold text-red-800 mb-4">Danger Zone</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-red-800 mb-2">Delete Account</h3>
              <p className="text-sm text-red-700 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <button className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
                Delete My Account
              </button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end gap-4">
          <button className="px-8 py-3 border-2 border-healthcare-border text-healthcare-text rounded-lg font-semibold hover:bg-healthcare-surface transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-8 py-3 bg-brand-blue text-white rounded-lg font-semibold hover:bg-healthcare-text transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
