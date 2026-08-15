import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders, selectMyOrders, selectOrderLoading } from '../store/orderSlice';
import { useCurrency } from '../hooks/useCurrency';
import { Package, Truck, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectMyOrders);
  const loading = useSelector(selectOrderLoading);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusStep = (status) => {
    switch (status) {
      case 'Ordered': return 1;
      case 'Packed': return 2;
      case 'Shipped': return 3;
      case 'Delivered': return 4;
      default: return 1;
    }
  };

  const StatusTimeline = ({ status }) => {
    const currentStep = getStatusStep(status);
    const steps = [
      { num: 1, label: 'Ordered', icon: <ShoppingBag className="w-4 h-4" /> },
      { num: 2, label: 'Packed', icon: <Package className="w-4 h-4" /> },
      { num: 3, label: 'Shipped', icon: <Truck className="w-4 h-4" /> },
      { num: 4, label: 'Delivered', icon: <CheckCircle2 className="w-4 h-4" /> },
    ];

    return (
      <div className="flex items-start w-full mt-4">
        {steps.map((step, idx) => (
          <React.Fragment key={step.num}>
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                currentStep >= step.num
                  ? 'bg-[#2874f0] border-[#2874f0] text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}>
                {step.icon}
              </div>
              <span className={`text-xs mt-2 font-medium text-center ${
                currentStep >= step.num ? 'text-[#2874f0]' : 'text-gray-400'
              }`}>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-1 mt-4 bg-gray-200 relative">
                <div className={`absolute left-0 top-0 h-full bg-[#2874f0] transition-all duration-500 ${
                  currentStep > step.num ? 'w-full' : 'w-0'
                }`} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center">
        <div className="text-gray-500 text-[16px]">Loading your orders...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1f3f6] py-6 font-sans">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-[22px] font-semibold text-gray-800 mb-6">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-white shadow-sm rounded-sm p-12 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h2 className="text-[18px] font-medium text-gray-700 mb-2">No orders yet</h2>
            <p className="text-gray-400 text-[14px] mb-6">Looks like you haven't placed any orders yet.</p>
            <Link to="/" className="inline-block bg-[#2874f0] text-white px-8 py-3 rounded-sm font-medium text-[14px] hover:bg-[#1a65d6] transition-colors">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id || order._id} className="bg-white shadow-sm rounded-sm overflow-hidden">
                {/* Order Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                  <div>
                    <p className="text-[12px] text-gray-500">Order ID</p>
                    <p className="text-[13px] font-medium text-gray-700">{order.id || order._id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    <span className={`inline-block mt-1 px-3 py-1 rounded-sm text-[11px] font-bold uppercase ${
                      order.paymentMethod === 'cod' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-[#2874f0]'
                    }`}>
                      {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="divide-y divide-gray-50">
                  {order.items?.map(item => (
                    <div key={item.id || item._id} className="flex items-center gap-4 px-6 py-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-contain border border-gray-100 rounded-sm p-1"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] text-gray-800 font-medium truncate">{item.title}</p>
                        <p className="text-[12px] text-gray-500 mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-[14px] font-bold text-gray-800">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total */}
                <div className="flex justify-between items-center px-6 py-3 bg-gray-50 border-t border-gray-100">
                  <span className="text-[13px] text-gray-500">Order Total</span>
                  <span className="text-[16px] font-bold text-gray-800">{formatPrice(order.total)}</span>
                </div>

                {/* Tracking Timeline */}
                <div className="px-6 py-4 border-t border-gray-100">
                  <p className="text-[13px] font-semibold text-gray-700 mb-2">Track Order</p>
                  <StatusTimeline status={order.status || 'Ordered'} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
