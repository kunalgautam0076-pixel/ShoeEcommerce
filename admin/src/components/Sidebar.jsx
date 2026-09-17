import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ShoppingBag, Users, Settings as SettingsIcon, ShieldCheck } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <Link to="/" className="brand-logo-link">
          <h2>Shoe<span>X</span> Admin</h2>
        </Link>
        <span className="admin-status-tag"><ShieldCheck size={12} /> Verified</span>
      </div>
      
      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={20} className="nav-icon" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/add-product" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <PlusCircle size={20} className="nav-icon" />
          <span>Add Product</span>
        </NavLink>

        <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <ShoppingBag size={20} className="nav-icon" />
          <span>Orders</span>
        </NavLink>

        <NavLink to="/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <Users size={20} className="nav-icon" />
          <span>Users</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <SettingsIcon size={20} className="nav-icon" />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer-card">
        <div className="pro-badge-icon">⚡</div>
        <div className="footer-text">
          <strong style={{ color: '#fff', fontSize: '0.85rem' }}>ShoeX Pro Portal</strong>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', display: 'block' }}>Store System Active</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
