import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyOrders, selectMyOrders, selectOrderLoading } from '../store/orderSlice';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';

const OrdersPage = () => {
  const dispatch = useDispatch();
  const orders = useSelector(selectMyOrders);
  const loading = useSelector(selectOrderLoading);

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
      { num: 1, label: 'Ordered', icon: <Package className="w-4 h-4" /> },
      { num: 2, label: 'Packed', icon: <Package className="w-4 h-4" /> },
      { num: 3, label: 'Shipped', icon: <Truck className="w-4 h-4" /> },
      { num: 4, label: 'Delivered', icon: <CheckCircle2 className="w-4 h-4" /> }
    ];

    return (
      <div className="flex items-center w-full mt-4">
        {steps.map((step, idx) => (
          <React.Fragment key={step.num}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${currentStep >= step.num ? 'bg-accent border-accent text-white' : 'bg-dark-800 border-dark-600 text-gray-500'}`}>
                {step.icon}
              </div>
              <span className={`text-xs mt-2 font-medium ${currentStep >= step.num ? 'text-white' : 'text-gray-500'}`}>{step.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className="flex-1 h-1 mx-2 bg-dark-700 relative top-[-10px]">
                <div className={`absolute left-0 top-0 h-full bg-accent transition-all duration-500 ${currentStep > step.num ? 'w-full' : 'w-0'}`}></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading orders...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>
      {orders.length === 0 ? (
        <div className="text-center py-12 bg-dark-800 rounded-xl border border-dark-700">
          <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">No orders yet</h2>
          <p className="text-gray-400">Looks like you haven't made your choice yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order.id || order._id} className="bg-dark-800 rounded-xl border border-dark-700 p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm text-gray-400">Order ID: {order.id || order._id}</h3>
                  <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">${order.total?.toFixed(2) || '0.00'}</p>
                  <span className="inline-block px-3 py-1 bg-dark-700 text-accent rounded-full text-xs font-medium mt-2">
                    {order.paymentMethod?.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {order.items?.map(item => (
                  <div key={item.id || item._id} className="flex items-center gap-4 bg-dark-900 p-3 rounded-lg">
                    <img src={item.image} alt={item.title} className="w-12 h-12 object-contain bg-white rounded p-1" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{item.title}</p>
                      <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dark-700 pt-6">
                <h4 className="text-sm font-medium text-white mb-4">Track Order</h4>
                <StatusTimeline status={order.status || 'Ordered'} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;
