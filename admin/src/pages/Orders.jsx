import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShoppingBag, CheckCircle, Clock, Truck, XCircle } from 'lucide-react';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/orders');
      setOrders(res.data || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/api/admin/orders/${orderId}`, {
        status: newStatus
      });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'fulfillment-delivered';
      case 'shipped':
        return 'fulfillment-shipped';
      case 'cancelled':
        return 'fulfillment-cancelled';
      case 'processing':
      default:
        return 'fulfillment-processing';
    }
  };

  if (loading) return <div style={{ padding: '40px', color: 'var(--text-muted)', textAlign: 'center' }}>Loading customer orders...</div>;

  return (
    <div className="orders-page-dark">
      {/* HEADER WITH TITLE */}
      <div className="orders-page-header">
        <div>
          <h1>Customer Orders</h1>
          <p>Track and update order fulfillment statuses in real-time</p>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="orders-stats-row">
        <div className="order-stat-card">
          <div className="stat-icon icon-amber">
            <Clock size={20} />
          </div>
          <div>
            <span className="stat-num">{orders.filter(o => !o.status || o.status === 'Processing').length}</span>
            <span className="stat-lbl">Processing</span>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="stat-icon icon-blue">
            <Truck size={20} />
          </div>
          <div>
            <span className="stat-num">{orders.filter(o => o.status === 'Shipped').length}</span>
            <span className="stat-lbl">Shipped</span>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="stat-icon icon-emerald">
            <CheckCircle size={20} />
          </div>
          <div>
            <span className="stat-num">{orders.filter(o => o.status === 'Delivered').length}</span>
            <span className="stat-lbl">Delivered</span>
          </div>
        </div>

        <div className="order-stat-card">
          <div className="stat-icon icon-rose">
            <XCircle size={20} />
          </div>
          <div>
            <span className="stat-num">{orders.filter(o => o.status === 'Cancelled').length}</span>
            <span className="stat-lbl">Cancelled</span>
          </div>
        </div>
      </div>

      {/* ORDERS TABLE CONTAINER */}
      <div className="dark-card orders-table-card">
        <div className="table-responsive">
          <table className="dark-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Items Count</th>
                <th>Fulfillment Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, idx) => {
                  const orderId = order._id ? `#ORD-${order._id.slice(-6).toUpperCase()}` : `#ORD-100${idx + 1}`;
                  const customerName = order.user?.name || order.shippingAddress?.fullName || 'Customer';
                  const dateStr = order.createdAt 
                    ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : '16 Oct 2025, 04:30 PM';
                  
                  const itemCount = order.orderItems?.length || order.items?.length || 1;
                  const currentStatus = order.status || 'Processing';
                  const totalAmountStr = `$${(order.totalPrice || order.totalAmount || 0).toFixed(2)}`;

                  return (
                    <tr key={order._id || idx}>
                      <td><span className="order-id-code">{orderId}</span></td>
                      <td>
                        <div className="customer-cell-info">
                          <span className="customer-name-bold">{customerName}</span>
                          {order.user?.email && <span className="customer-email-muted">{order.user.email}</span>}
                        </div>
                      </td>
                      <td><span className="cell-date-muted">{dateStr}</span></td>
                      <td><strong className="order-amount-bold">{totalAmountStr}</strong></td>
                      <td><span className="items-count-badge">{itemCount} items</span></td>
                      <td>
                        <span className={`fulfillment-pill-badge ${getStatusClass(currentStatus)}`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td>
                        <div className="action-select-container">
                          <select 
                            className="order-status-select-dark"
                            value={currentStatus}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                      <ShoppingBag size={36} style={{ opacity: 0.4 }} />
                      <p>No customer orders placed yet.</p>
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

export default Orders;
