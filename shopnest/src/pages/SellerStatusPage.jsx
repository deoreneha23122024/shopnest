import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCurrentUser } from '../store/authSlice';
import { FiClock, FiCheck, FiX, FiArrowRight, FiRefreshCw } from 'react-icons/fi';

const STATUS_CONFIG = {
  pending: {
    icon: FiClock, iconCls: 'text-yellow-400', bg: 'from-yellow-500/20 to-yellow-600/10', border: 'border-yellow-500/30',
    title: 'Application Under Review', badge: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    badgeText: '⏳ Pending Approval',
    desc: 'Your seller application has been submitted successfully! Our admin team is reviewing your store details. This typically takes 24–48 hours.',
  },
  approved: {
    icon: FiCheck, iconCls: 'text-green-400', bg: 'from-green-500/20 to-green-600/10', border: 'border-green-500/30',
    title: 'Application Approved! 🎉', badge: 'bg-green-500/20 text-green-400 border-green-500/30',
    badgeText: '✅ Approved',
    desc: 'Congratulations! Your seller application has been approved. You now have full access to your Seller Dashboard where you can manage your products and orders.',
  },
  rejected: {
    icon: FiX, iconCls: 'text-red-400', bg: 'from-red-500/20 to-red-600/10', border: 'border-red-500/30',
    title: 'Application Not Approved', badge: 'bg-red-500/20 text-red-400 border-red-500/30',
    badgeText: '❌ Rejected',
    desc: 'Unfortunately, your application was not approved at this time. This may be due to incomplete information or policy reasons. You may reapply with updated store details.',
  },
};

export default function SellerStatusPage() {
  const user = useSelector(selectCurrentUser);
  if (!user || user.role !== 'seller') return null;
  const status = user.sellerStatus || 'pending';
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = config.icon;
  const info = user.storeInfo;

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg animate-fade-in-up">
        {/* Status Card */}
        <div className={`card p-8 bg-gradient-to-br ${config.bg} border ${config.border} mb-6 text-center`}>
          <div className={`w-20 h-20 rounded-2xl bg-dark-800/60 flex items-center justify-center mx-auto mb-5 ${config.iconCls}`}>
            <Icon size={40} />
          </div>
          <span className={`inline-block text-sm font-semibold border px-4 py-1.5 rounded-full mb-4 ${config.badge}`}>{config.badgeText}</span>
          <h1 className="font-display font-bold text-2xl text-white mb-3">{config.title}</h1>
          <p className="text-gray-300 text-sm leading-relaxed">{config.desc}</p>
        </div>

        {/* Store Info */}
        {info && (
          <div className="card p-6 mb-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2">📋 Your Application Details</h2>
            <div className="space-y-3 text-sm">
              {[['Store Name', info.storeName], ['Category', info.category], ['Phone', info.phone], ['Applied', info.appliedAt ? new Date(info.appliedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A']].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 border-b border-dark-600 last:border-0">
                  <span className="text-gray-400">{k}</span>
                  <span className="text-white font-medium">{v}</span>
                </div>
              ))}
              {info.description && (
                <div className="pt-2">
                  <p className="text-gray-400 mb-1">Description</p>
                  <p className="text-gray-300 text-xs leading-relaxed">{info.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold text-white mb-4">Onboarding Progress</h2>
          <div className="space-y-3">
            {[
              { step: 'Account Created', done: true },
              { step: 'Store Details Submitted', done: status !== 'none' },
              { step: 'Admin Review', done: status === 'approved' || status === 'rejected', inProgress: status === 'pending' },
              { step: 'Go Live!', done: status === 'approved' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs ${item.done ? 'bg-green-500 text-white' : item.inProgress ? 'bg-yellow-500 text-white animate-pulse' : 'bg-dark-600 text-gray-500'}`}>
                  {item.done ? '✓' : item.inProgress ? '⏳' : i + 1}
                </div>
                <span className={`text-sm ${item.done ? 'text-white' : item.inProgress ? 'text-yellow-400' : 'text-gray-500'}`}>{item.step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          {status === 'approved' && (
            <Link to="/seller/dashboard" className="btn-primary flex items-center justify-center gap-2 py-3.5 text-base">
              Go to Seller Dashboard <FiArrowRight />
            </Link>
          )}
          {status === 'rejected' && (
            <Link to="/seller/onboarding" className="btn-primary flex items-center justify-center gap-2 py-3.5">
              <FiRefreshCw /> Reapply with New Details
            </Link>
          )}
          {status === 'pending' && (
            <div className="bg-dark-700/50 rounded-xl p-4 text-center text-gray-400 text-sm">
              🔄 Check back later or wait for our email notification.
            </div>
          )}
          <Link to="/" className="btn-outline flex items-center justify-center py-3 text-sm">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
