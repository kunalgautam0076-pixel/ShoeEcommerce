import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users as UsersIcon, UserCheck, Shield, Mail, Calendar } from 'lucide-react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>Loading registered users...</div>;

  const adminCount = users.filter(u => u.isAdmin || u.role === 'admin').length;
  const customerCount = users.length - adminCount;

  return (
    <div className="users-page-dark">
      {/* HEADER WITH TITLE */}
      <div className="users-page-header">
        <div>
          <h1>Registered Users & Customers</h1>
          <p>View and manage registered accounts across your e-commerce store</p>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="users-stats-row">
        <div className="user-stat-card">
          <div className="stat-icon icon-blue">
            <UsersIcon size={22} />
          </div>
          <div>
            <span className="stat-num">{users.length}</span>
            <span className="stat-lbl">Total Registered Users</span>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="stat-icon icon-emerald">
            <UserCheck size={22} />
          </div>
          <div>
            <span className="stat-num">{customerCount}</span>
            <span className="stat-lbl">Customers</span>
          </div>
        </div>

        <div className="user-stat-card">
          <div className="stat-icon icon-purple">
            <Shield size={22} />
          </div>
          <div>
            <span className="stat-num">{adminCount}</span>
            <span className="stat-lbl">Administrators</span>
          </div>
        </div>
      </div>

      {/* USERS TABLE CONTAINER */}
      <div className="dark-card users-table-card">
        <div className="table-responsive">
          <table className="dark-users-table">
            <thead>
              <tr>
                <th>User ID</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, idx) => {
                  const userId = user._id ? `#USR-${user._id.slice(-6).toUpperCase()}` : `#USR-100${idx + 1}`;
                  const userName = user.name || 'Registered User';
                  const userEmail = user.email || 'N/A';
                  const isAdmin = user.isAdmin || user.role === 'admin';
                  const joinedDate = user.createdAt 
                    ? new Date(user.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                    : 'Recent';

                  return (
                    <tr key={user._id || idx}>
                      <td><span className="user-id-code">{userId}</span></td>
                      <td>
                        <div className="user-cell-info">
                          <div className="user-avatar-circle">
                            {userName.charAt(0).toUpperCase()}
                          </div>
                          <span className="user-name-bold">{userName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="email-cell">
                          <Mail size={14} className="cell-icon" />
                          <span className="cell-email-text">{userEmail}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${isAdmin ? 'role-admin' : 'role-customer'}`}>
                          {isAdmin ? 'Admin' : 'Customer'}
                        </span>
                      </td>
                      <td>
                        <div className="date-cell">
                          <Calendar size={14} className="cell-icon" />
                          <span className="cell-date-muted">{joinedDate}</span>
                        </div>
                      </td>
                      <td>
                        <span className="status-badge-pill status-active-user">
                          Active
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <UsersIcon size={36} style={{ opacity: 0.4 }} />
                      <p>No registered users found in database yet.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
