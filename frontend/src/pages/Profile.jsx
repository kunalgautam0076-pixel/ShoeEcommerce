import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Package, Settings } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <main className="profile-page page-container container">
      <div className="profile-header">
        <h1>My Account</h1>
      </div>

      <div className="profile-grid">
        <aside className="profile-sidebar glass-panel">
          <div className="user-info-card">
            <div className="user-avatar">
              {user.firstName.charAt(0)}{user.lastName.charAt(0)}
            </div>
            <h3>{user.firstName} {user.lastName}</h3>
            <p>{user.email}</p>
          </div>

          <nav className="profile-nav">
            <button className="profile-nav-btn active">
              <User size={18} /> Account Details
            </button>
            <button className="profile-nav-btn">
              <Package size={18} /> Order History
            </button>
            <button className="profile-nav-btn">
              <Settings size={18} /> Settings
            </button>
            <button className="profile-nav-btn logout-btn" onClick={handleLogout}>
              <LogOut size={18} /> Sign Out
            </button>
          </nav>
        </aside>

        <section className="profile-content glass-panel">
          <h2>Account Details</h2>
          <div className="details-card">
            <div className="detail-group">
              <label>First Name</label>
              <p>{user.firstName}</p>
            </div>
            <div className="detail-group">
              <label>Last Name</label>
              <p>{user.lastName}</p>
            </div>
            <div className="detail-group">
              <label>Email Address</label>
              <p>{user.email}</p>
            </div>
            <div className="detail-group">
              <label>Account Status</label>
              <p><span className="status-badge">Active</span></p>
            </div>
          </div>
          
          <button className="btn btn-outline edit-btn">Edit Profile</button>
        </section>
      </div>
    </main>
  );
};

export default Profile;
