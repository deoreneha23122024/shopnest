import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { selectCurrentUser } from '../store/authSlice';
import { fetchSellerProducts, selectSellerProducts, addProduct } from '../store/productsSlice';
import { fetchSellerOrders, selectSellerOrders, updateOrderStatus } from '../store/orderSlice';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { FiBox, FiDollarSign, FiStar, FiUsers, FiEdit, FiPlus, FiPackage, FiTrendingUp, FiEye, FiCheckCircle } from 'react-icons/fi';
import StarRating from '../components/StarRating';
import toast from 'react-hot-toast';

const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

const orderStatsData = [
  { name: 'Mon', orders: 12 },
  { name: 'Tue', orders: 19 },
  { name: 'Wed', orders: 3 },
  { name: 'Thu', orders: 5 },
  { name: 'Fri', orders: 2 },
  { name: 'Sat', orders: 20 },
  { name: 'Sun', orders: 15 },
];

export default function SellerDashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const products = useSelector(selectSellerProducts);
  const orders = useSelector(selectSellerOrders);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    dispatch(fetchSellerProducts());
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  if (!user || user.role !== 'seller') { navigate('/'); return null; }
  if (user.sellerStatus !== 'approved') { navigate('/seller/status'); return null; }

  const handleUpdateStatus = (orderId, status) => {
    dispatch(updateOrderStatus({ orderId, status }))
      .unwrap()
      .then(() => toast.success('Order status updated'))
      .catch(() => toast.error('Failed to update status'));
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    dispatch(addProduct(data))
      .unwrap()
      .then(() => {
        toast.success('Product added successfully!');
        e.target.reset();
        setActiveTab('products');
      })
      .catch(() => toast.error('Failed to add product'));
  };

  const renderOverview = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Products', value: products.length, icon: FiBox, color: 'text-blue-400', bg: 'from-blue-500/20 to-blue-500/5' },
          { label: 'Total Revenue', value: `$${orders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(0)}`, icon: FiDollarSign, color: 'text-green-400', bg: 'from-green-500/20 to-green-500/5' },
          { label: 'Avg Rating', value: '4.8', icon: FiStar, color: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-500/5' },
          { label: 'Total Orders', value: orders.length, icon: FiPackage, color: 'text-accent', bg: 'from-accent/20 to-primary-400/5' },
        ].map((s, i) => (
          <div key={i} className={`card p-5 bg-gradient-to-br ${s.bg}`}>
            <div className={`${s.color} mb-3`}><s.icon size={22} /></div>
            <div className="font-display font-bold text-2xl text-white mb-1">{s.value}</div>
            <div className="text-gray-400 text-sm">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-6">Revenue Over Time</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }} />
                <Line type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card p-6">
          <h2 className="font-display font-semibold text-white mb-6">Orders This Week</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" />
                <YAxis stroke="#888" />
                <RechartsTooltip contentStyle={{ backgroundColor: '#1a1a1a', border: 'none' }} />
                <Bar dataKey="orders" fill="#4ade80" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="card">
      <div className="flex items-center justify-between p-6 border-b border-dark-600">
        <h2 className="font-display font-semibold text-white">Your Products ({products.length})</h2>
        <button onClick={() => setActiveTab('add')} className="btn-primary py-2 px-4 text-sm flex items-center gap-2"><FiPlus /> Add New</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-dark-600 bg-dark-700/30">
              {['Product', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                <th key={h} className="py-3 px-4 text-left text-xs text-gray-400 uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id || p._id} className="border-b border-dark-600/50 hover:bg-dark-700/20 transition-colors">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img src={p.image} alt={p.title} className="w-10 h-10 object-contain bg-white rounded p-1" />
                  <span className="text-sm text-white truncate max-w-[200px]">{p.title}</span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-400 capitalize">{p.category}</td>
                <td className="py-3 px-4 text-sm text-white font-medium">${p.price}</td>
                <td className="py-3 px-4 text-sm text-gray-400">{p.stock || 10}</td>
                <td className="py-3 px-4 flex gap-2">
                  <Link to={`/product/${p.id || p._id}`} className="p-1.5 bg-dark-700 rounded text-gray-400 hover:text-white"><FiEye /></Link>
                  <button className="p-1.5 bg-dark-700 rounded text-gray-400 hover:text-accent"><FiEdit /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="card p-6">
      <h2 className="font-display font-semibold text-white mb-6">Recent Orders ({orders.length})</h2>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id || order._id} className="border border-dark-700 bg-dark-800 rounded-lg p-4 flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <p className="text-sm text-gray-400">Order ID: {order.id || order._id}</p>
              <p className="font-medium text-white">${order.total?.toFixed(2)}</p>
            </div>
            <div>
              <span className="text-xs bg-dark-700 px-2 py-1 rounded text-gray-300">Current: {order.status || 'Ordered'}</span>
            </div>
            <div className="flex gap-2">
              {['Packed', 'Shipped', 'Delivered'].map(st => (
                <button
                  key={st}
                  onClick={() => handleUpdateStatus(order._id || order.id, st)}
                  className="text-xs bg-dark-700 hover:bg-accent hover:text-white px-3 py-1.5 rounded transition-colors"
                >
                  Mark {st}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddProduct = () => (
    <div className="card p-6 max-w-2xl mx-auto">
      <h2 className="font-display font-semibold text-white mb-6">Add New Product</h2>
      <form onSubmit={handleAddProduct} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Title</label>
          <input name="title" required className="w-full bg-dark-900 border border-dark-700 p-2.5 rounded text-white focus:border-accent outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Price ($)</label>
          <input name="price" type="number" step="0.01" required className="w-full bg-dark-900 border border-dark-700 p-2.5 rounded text-white focus:border-accent outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Category</label>
          <select name="category" required className="w-full bg-dark-900 border border-dark-700 p-2.5 rounded text-white focus:border-accent outline-none">
            <option value="electronics">Electronics</option>
            <option value="men's clothing">Men's Clothing</option>
            <option value="women's clothing">Women's Clothing</option>
            <option value="jewelery">Jewelery</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Image URL</label>
          <input name="image" type="url" required className="w-full bg-dark-900 border border-dark-700 p-2.5 rounded text-white focus:border-accent outline-none" />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Description</label>
          <textarea name="description" rows="4" required className="w-full bg-dark-900 border border-dark-700 p-2.5 rounded text-white focus:border-accent outline-none"></textarea>
        </div>
        <button type="submit" className="w-full btn-primary py-3">Publish Product</button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-8 border-b border-dark-700 mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Seller Dashboard</h1>
            <p className="text-gray-400 mt-1">{user.storeInfo?.storeName} • {user.email}</p>
          </div>
          <div className="flex bg-dark-800 rounded-lg p-1 border border-dark-700">
            {['overview', 'products', 'orders', 'add'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-dark-600 text-white shadow' : 'text-gray-400 hover:text-white hover:bg-dark-700'}`}
              >
                {tab === 'add' ? 'Add Product' : tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'products' && renderProducts()}
        {activeTab === 'orders' && renderOrders()}
        {activeTab === 'add' && renderAddProduct()}
      </div>
    </div>
  );
}
