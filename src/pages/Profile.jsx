import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function Profile() {
  const { currentUser, isAuthenticated, updateProfile, changePassword, deleteAccount } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  // Modals / Dialog states
  const [activeModal, setActiveModal] = useState(null); // 'edit-profile' | 'change-password' | 'google-account' | 'delete-account' | null

  // Edit Profile Form State
  const [nameInput, setNameInput] = useState(currentUser?.name || "");
  const [emailInput, setEmailInput] = useState(currentUser?.email || "");
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Change Password Form State
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });

  // Preferences State
  const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("vistalk_notifications");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  // Manage Google Account State
  const [isGoogleLinked, setIsGoogleLinked] = useState(true);

  // Format initials
  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Format member date
  const getMemberSinceDate = () => {
    if (!currentUser?.createdAt) return "Member since September 2025";
    try {
      const date = new Date(currentUser.createdAt);
      if (isNaN(date.getTime())) return "Member since September 2025";
      const month = date.toLocaleString("en-US", { month: "long" });
      const year = date.getFullYear();
      return `Member since ${month} ${year}`;
    } catch {
      return "Member since September 2025";
    }
  };

  // Open modal helper
  const openModal = (modalName) => {
    setProfileMsg({ type: "", text: "" });
    setPasswordMsg({ type: "", text: "" });
    if (modalName === "edit-profile") {
      setNameInput(currentUser?.name || "");
      setEmailInput(currentUser?.email || "");
    }
    if (modalName === "change-password") {
      setCurrentPwd("");
      setNewPwd("");
      setConfirmPwd("");
    }
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
    setProfileMsg({ type: "", text: "" });
    setPasswordMsg({ type: "", text: "" });
  };

  // Handle Profile Update
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setProfileMsg({ type: "error", text: "Please enter your full name." });
      return;
    }
    if (!emailInput.trim() || !emailInput.includes("@")) {
      setProfileMsg({ type: "error", text: "Please enter a valid email address." });
      return;
    }

    setIsSubmitting(true);
    try {
      await updateProfile(nameInput, emailInput);
      setProfileMsg({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => {
        closeModal();
      }, 1200);
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message || "Failed to update profile." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!currentPwd) {
      setPasswordMsg({ type: "error", text: "Please enter your current password." });
      return;
    }
    if (newPwd.length < 6) {
      setPasswordMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPasswordMsg({ type: "error", text: "New passwords do not match." });
      return;
    }

    setIsSubmitting(true);
    try {
      await changePassword(currentPwd, newPwd);
      setPasswordMsg({ type: "success", text: "Password changed successfully!" });
      setTimeout(() => {
        closeModal();
      }, 1200);
    } catch (err) {
      setPasswordMsg({ type: "error", text: err.message || "Failed to change password." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Notifications Toggle
  const handleToggleNotifications = () => {
    const nextVal = !notificationsEnabled;
    setNotificationsEnabled(nextVal);
    try {
      localStorage.setItem("vistalk_notifications", JSON.stringify(nextVal));
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Delete Account
  const handleDeleteAccountConfirm = async () => {
    setIsSubmitting(true);
    try {
      await deleteAccount();
      navigate("/");
    } catch (err) {
      console.error("Failed to delete account:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayName = currentUser?.name || "Nida Kamil";
  const displayEmail = currentUser?.email || "nida.kamil24@pccoepune.org";
  const initials = getInitials(displayName);

  return (
    <div className="profile-page-root">
      <div className="profile-page-container">
        {/* Centered Top Heading Block */}
        <div className="profile-top-header">
          <span className="profile-eyebrow">YOUR ACCOUNT</span>
          <h1 className="profile-main-title">My Profile</h1>
          <p className="profile-main-subtitle">Manage your account and preferences.</p>
        </div>

        {/* Main Content Layout: Left Profile Card + Right Clean Editorial Quote */}
        <div className="profile-content-layout">
          {/* LEFT: Compact Settings Card */}
          <div className="profile-settings-card">
            {/* Top User Info Section */}
            <div className="profile-user-header">
              <div className="profile-avatar-wrapper">
                <div className="profile-avatar-circle">
                  <span className="profile-avatar-initials">{initials}</span>
                </div>
                <button
                  type="button"
                  className="profile-avatar-edit-badge"
                  onClick={() => openModal("edit-profile")}
                  aria-label="Edit Profile"
                  title="Edit Profile"
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                </button>
              </div>

              <div className="profile-user-info-text">
                <h2 className="profile-user-name">{displayName}</h2>
                <p className="profile-user-email">{displayEmail}</p>
                <p className="profile-member-since">{getMemberSinceDate()}</p>
              </div>
            </div>

            {/* Section 1: Personal Information */}
            <div className="profile-section-block">
              <div className="profile-section-heading">
                <svg className="section-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Personal Information</span>
              </div>

              <button
                type="button"
                className="profile-action-row"
                onClick={() => openModal("edit-profile")}
              >
                <span className="action-row-label">Edit Profile</span>
                <svg className="action-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>

            {/* Section 2: Security */}
            <div className="profile-section-block">
              <div className="profile-section-heading">
                <svg className="section-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <span>Security</span>
              </div>

              <div className="profile-action-rows-group">
                <button
                  type="button"
                  className="profile-action-row"
                  onClick={() => openModal("change-password")}
                >
                  <span className="action-row-label">Change Password</span>
                  <svg className="action-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="profile-action-row"
                  onClick={() => openModal("google-account")}
                >
                  <span className="action-row-label">Manage Google Account</span>
                  <svg className="action-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Section 3: Preferences */}
            <div className="profile-section-block">
              <div className="profile-section-heading">
                <svg className="section-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span>Preferences</span>
              </div>

              <div className="profile-preference-rows">
                {/* Theme Selector Row */}
                <div className="profile-preference-row">
                  <span className="preference-label">Theme</span>
                  <div className="profile-theme-select-wrapper">
                    <select
                      className="profile-theme-select"
                      value={theme}
                      onChange={(e) => setTheme(e.target.value)}
                      aria-label="Select Theme"
                    >
                      <option value="light">☀️ Light</option>
                      <option value="dark">🌙 Dark</option>
                    </select>
                    <svg className="select-chevron-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>

                {/* Notifications Row */}
                <div className="profile-preference-row">
                  <span className="preference-label">Notifications</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={notificationsEnabled}
                    className={`profile-switch-btn ${notificationsEnabled ? "active" : ""}`}
                    onClick={handleToggleNotifications}
                  >
                    <span className="profile-switch-thumb" />
                  </button>
                </div>
              </div>
            </div>

            {/* Section 4: Danger Zone */}
            <div className="profile-section-block danger-section">
              <div className="profile-section-heading danger-heading">
                <svg className="section-icon danger-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
                <span>Danger Zone</span>
              </div>

              <button
                type="button"
                className="profile-action-row danger-row"
                onClick={() => openModal("delete-account")}
              >
                <span className="action-row-label danger-text">Delete Account</span>
                <svg className="action-chevron danger-chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* RIGHT: Editorial Whitespace with Italic Vertical Quote */}
          <aside className="profile-quote-aside">
            <div className="profile-editorial-quote">
              <p className="quote-text">“A kinder world starts with you.”</p>
              <span className="quote-author">— VisTalk</span>
            </div>
          </aside>
        </div>
      </div>

      {/* ================= MODALS ================= */}

      {/* Edit Profile Modal */}
      {activeModal === "edit-profile" && (
        <div className="profile-modal-overlay" onClick={closeModal}>
          <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3 className="modal-title">Edit Profile</h3>
              <button type="button" className="modal-close-btn" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>

            {profileMsg.text && (
              <div className={`profile-modal-alert ${profileMsg.type}`}>
                {profileMsg.text}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} className="profile-modal-form">
              <div className="form-field-group">
                <label className="field-label" htmlFor="profile-name">Full Name</label>
                <input
                  id="profile-name"
                  type="text"
                  className="profile-input"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="field-label" htmlFor="profile-email">Email Address</label>
                <input
                  id="profile-email"
                  type="email"
                  className="profile-input"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  required
                />
              </div>

              <div className="modal-actions-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {activeModal === "change-password" && (
        <div className="profile-modal-overlay" onClick={closeModal}>
          <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3 className="modal-title">Change Password</h3>
              <button type="button" className="modal-close-btn" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>

            {passwordMsg.text && (
              <div className={`profile-modal-alert ${passwordMsg.type}`}>
                {passwordMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="profile-modal-form">
              <div className="form-field-group">
                <label className="field-label" htmlFor="current-pwd">Current Password</label>
                <input
                  id="current-pwd"
                  type="password"
                  className="profile-input"
                  value={currentPwd}
                  onChange={(e) => setCurrentPwd(e.target.value)}
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="field-label" htmlFor="new-pwd">New Password</label>
                <input
                  id="new-pwd"
                  type="password"
                  className="profile-input"
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                />
              </div>

              <div className="form-field-group">
                <label className="field-label" htmlFor="confirm-pwd">Confirm New Password</label>
                <input
                  id="confirm-pwd"
                  type="password"
                  className="profile-input"
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Re-type new password"
                  required
                />
              </div>

              <div className="modal-actions-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manage Google Account Modal */}
      {activeModal === "google-account" && (
        <div className="profile-modal-overlay" onClick={closeModal}>
          <div className="profile-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3 className="modal-title">Google Account</h3>
              <button type="button" className="modal-close-btn" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="google-account-content">
              <div className="google-sync-card">
                <div className="google-icon-box">
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" />
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.32 24 12 24z" />
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z" />
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
                  </svg>
                </div>
                <div className="google-sync-info">
                  <span className="google-status-title">
                    {isGoogleLinked ? "Google Account Linked" : "Not Linked"}
                  </span>
                  <span className="google-sync-email">{displayEmail}</span>
                </div>
                <span className={`google-badge-pill ${isGoogleLinked ? "connected" : "disconnected"}`}>
                  {isGoogleLinked ? "Synced" : "Disconnected"}
                </span>
              </div>

              <p className="google-sync-description">
                Your VisTalk account is synced with Google Single Sign-On for seamless and secure authentication across devices.
              </p>

              <div className="modal-actions-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setIsGoogleLinked(!isGoogleLinked)}
                >
                  {isGoogleLinked ? "Disconnect Google" : "Connect Google"}
                </button>
                <button type="button" className="btn-primary" onClick={closeModal}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Modal */}
      {activeModal === "delete-account" && (
        <div className="profile-modal-overlay" onClick={closeModal}>
          <div className="profile-modal-card danger-modal" onClick={(e) => e.stopPropagation()}>
            <div className="profile-modal-header">
              <h3 className="modal-title danger-title">Delete Account</h3>
              <button type="button" className="modal-close-btn" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="delete-modal-content">
              <div className="danger-warning-box">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d94b4b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <p>
                  <strong>Warning:</strong> This action is permanent and cannot be undone. All your practice data, XP, and settings will be permanently removed.
                </p>
              </div>

              <p className="delete-confirm-text">
                Are you absolutely sure you want to delete your VisTalk account?
              </p>

              <div className="modal-actions-footer">
                <button type="button" className="btn-secondary" onClick={closeModal}>
                  Keep My Account
                </button>
                <button
                  type="button"
                  className="btn-danger-confirm"
                  onClick={handleDeleteAccountConfirm}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Deleting..." : "Yes, Delete Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
