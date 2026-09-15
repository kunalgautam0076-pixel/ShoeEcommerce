import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, ShoppingBag, Users, Settings } from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>Shoe<span>X</span> Admin</h2>
      
      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/add-product" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <PlusCircle size={20} /> Add Product
        </NavLink>
        <NavLink to="/orders" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <ShoppingBag size={20} /> Orders
        </NavLink>
        <NavLink to="/users" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <Users size={20} /> Users
        </NavLink>
        <NavLink to="/settings" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          <Settings size={20} /> Settings
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
