import React, { useState } from 'react';
import { Save, Store, Globe, DollarSign, Bell, Lock } from 'lucide-react';

const Settings = () => {
  const [settings, setSettings] = useState({
    storeName: 'ShoeX E-Commerce Store',
    adminEmail: 'admin@shoex.com',
    currency: 'USD ($)',
    theme: 'Dark Glassmorphism',
    emailNotifications: true,
    autoApproveOrders: false
  });

  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="settings-page-dark">
      <div className="page-header-dark">
        <h1>Admin Store Settings</h1>
        <p>Manage system preferences, notifications, and store configurations</p>
      </div>

      <form onSubmit={handleSave} className="settings-container-dark">
        {/* GENERAL STORE INFO */}
        <div className="dark-card settings-card">
          <div className="settings-section-title">
            <Store size={20} className="section-icon-orange" />
            <div>
              <h3>General Store Information</h3>
              <p>Configure store branding and primary admin contact</p>
            </div>
          </div>

          <div className="form-group">
            <label className="field-label-dark">Store Name</label>
            <input 
              type="text" 
              name="storeName" 
              className="form-control-dark" 
              value={settings.storeName}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="form-group">
            <label className="field-label-dark">Admin Email Address</label>
            <input 
              type="email" 
              name="adminEmail" 
              className="form-control-dark" 
              value={settings.adminEmail}
              onChange={handleChange}
              required 
            />
          </div>
        </div>

        {/* REGIONAL & CURRENCY */}
        <div className="dark-card settings-card">
          <div className="settings-section-title">
            <Globe size={20} className="section-icon-orange" />
            <div>
              <h3>Regional & Currency Settings</h3>
              <p>Set store display currency and system timezone</p>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group">
              <label className="field-label-dark">Default Currency</label>
              <select name="currency" className="form-control-dark" value={settings.currency} onChange={handleChange}>
                <option value="USD ($)">USD ($)</option>
                <option value="INR (₹)">INR (₹)</option>
                <option value="EUR (€)">EUR (€)</option>
                <option value="GBP (£)">GBP (£)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="field-label-dark">Store Palette</label>
              <input 
                type="text" 
                name="theme" 
                className="form-control-dark" 
                value={settings.theme}
                disabled
              />
            </div>
          </div>
        </div>

        {/* NOTIFICATIONS & AUTOMATION */}
        <div className="dark-card settings-card">
          <div className="settings-section-title">
            <Bell size={20} className="section-icon-orange" />
            <div>
              <h3>Notifications & Preferences</h3>
              <p>Toggle system notification alerts and email updates</p>
            </div>
          </div>

          <div className="checkbox-row-dark">
            <input 
              type="checkbox" 
              id="emailNotifications" 
              name="emailNotifications" 
              checked={settings.emailNotifications}
              onChange={handleChange}
              className="dark-checkbox"
            />
            <label htmlFor="emailNotifications" className="checkbox-label-dark">
              Receive instant email alerts for new customer orders
            </label>
          </div>

          <div className="checkbox-row-dark">
            <input 
              type="checkbox" 
              id="autoApproveOrders" 
              name="autoApproveOrders" 
              checked={settings.autoApproveOrders}
              onChange={handleChange}
              className="dark-checkbox"
            />
            <label htmlFor="autoApproveOrders" className="checkbox-label-dark">
              Automatically mark new orders as Processing
            </label>
          </div>
        </div>

        <div className="settings-submit-bar">
          {isSaved && <span className="saved-success-msg">✓ Settings saved successfully!</span>}
          <button type="submit" className="btn-publish-orange">
            <Save size={16} /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
