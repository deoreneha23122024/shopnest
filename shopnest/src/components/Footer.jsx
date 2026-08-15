import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin, FiInstagram, FiTwitter, FiGithub, FiFacebook, FiX } from 'react-icons/fi';
import { useState } from 'react';

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'Cart', to: '/cart' },
  { label: 'Wishlist', to: '/wishlist' },
  { label: 'Login', to: '/login' },
];

const categories = [
  { label: 'Electronics', value: 'electronics' },
  { label: "Men's Fashion", value: "men's clothing" },
  { label: "Women's Fashion", value: "women's clothing" },
  { label: 'Jewellery', value: 'jewelery' },
];

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" id="modal-overlay" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      <div
        className="relative bg-dark-800 border border-dark-600 rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto animate-fade-in-up shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-dark-600 sticky top-0 bg-dark-800 z-10">
          <h2 className="font-display font-bold text-white text-xl">{title}</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-xl bg-dark-700 hover:bg-dark-600 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <FiX size={18} />
          </button>
        </div>
        <div className="p-6 text-gray-300 text-sm leading-relaxed space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [modal, setModal] = useState(null); // 'privacy' | 'terms' | null

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <>
      <footer className="bg-dark-800 border-t border-dark-600 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-accent to-primary-400 flex items-center justify-center font-display font-bold text-white text-lg">S</div>
                <span className="font-display font-bold text-xl text-white">Shop<span className="text-gradient">Nest</span></span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">
                Your one-stop destination for premium products at unbeatable prices. Shop smarter, live better.
              </p>
              <div className="flex gap-3">
                {[FiInstagram, FiTwitter, FiFacebook, FiGithub].map((Icon, i) => (
                  <button key={i} className="w-9 h-9 rounded-xl bg-dark-700 hover:bg-accent/20 hover:text-accent text-gray-400 flex items-center justify-center transition-all">
                    <Icon size={16} />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-display font-semibold text-white mb-4">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map(l => (
                  <li key={l.to}>
                    <Link to={l.to} className="text-gray-400 hover:text-accent text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-display font-semibold text-white mb-4">Categories</h3>
              <ul className="space-y-3">
                {categories.map(c => (
                  <li key={c.value}>
                    <Link to="/" className="text-gray-400 hover:text-accent text-sm transition-colors flex items-center gap-2 group">
                      <span className="w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                      {c.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Contact */}
            <div>
              <h3 className="font-display font-semibold text-white mb-4">Stay Updated</h3>
              {subscribed ? (
                <p className="text-accent text-sm font-medium mb-4">🎉 Thanks for subscribing!</p>
              ) : (
                <form onSubmit={handleSubscribe} className="mb-5">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="input-field text-sm mb-2"
                  />
                  <button type="submit" className="btn-primary w-full text-sm py-2">
                    Subscribe
                  </button>
                </form>
              )}
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <FiPhone size={14} className="text-accent" />
                  <span>+1 (800) SHOPNEST</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail size={14} className="text-accent" />
                  <span>support@shopnest.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMapPin size={14} className="text-accent" />
                  <span>123 Commerce St, NY</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-dark-600 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-gray-500 text-sm">© 2026 ShopNest. All rights reserved.</p>
            <div className="flex gap-4 text-sm text-gray-500">
              <button
                id="privacy-policy-btn"
                onClick={() => setModal('privacy')}
                className="hover:text-accent transition-colors"
              >
                Privacy Policy
              </button>
              <button
                id="terms-btn"
                onClick={() => setModal('terms')}
                className="hover:text-accent transition-colors"
              >
                Terms & Conditions
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Modal */}
      {modal === 'privacy' && (
        <Modal title="Privacy Policy" onClose={() => setModal(null)}>
          <p><strong className="text-white">Last updated:</strong> July 2026</p>
          <p>ShopNest ("we", "us", or "our") is committed to protecting your personal information and your right to privacy.</p>
          <h3 className="text-white font-semibold mt-4">1. Information We Collect</h3>
          <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This includes name, email address, shipping address, and payment information.</p>
          <h3 className="text-white font-semibold">2. How We Use Your Information</h3>
          <p>We use the information we collect to process transactions, send you technical notices and support messages, respond to your comments and questions, and send you marketing communications.</p>
          <h3 className="text-white font-semibold">3. Cookies</h3>
          <p>We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies.</p>
          <h3 className="text-white font-semibold">4. Data Security</h3>
          <p>We use industry-standard SSL encryption to protect your data during transmission. Your cart and wishlist data is stored locally on your device using localStorage.</p>
          <h3 className="text-white font-semibold">5. Contact Us</h3>
          <p>If you have questions about this Privacy Policy, please contact us at <span className="text-accent">support@shopnest.com</span>.</p>
        </Modal>
      )}

      {/* Terms & Conditions Modal */}
      {modal === 'terms' && (
        <Modal title="Terms & Conditions" onClose={() => setModal(null)}>
          <p><strong className="text-white">Last updated:</strong> July 2026</p>
          <p>By accessing and using ShopNest, you accept and agree to be bound by the terms and provisions of this agreement.</p>
          <h3 className="text-white font-semibold mt-4">1. Use of the Website</h3>
          <p>You agree to use this website only for lawful purposes and in a manner that does not infringe the rights of others. You must not misuse our site by introducing viruses or other malicious code.</p>
          <h3 className="text-white font-semibold">2. Products & Pricing</h3>
          <p>All product information is sourced from FakeStore API. Prices are displayed in USD and are subject to change without notice. We reserve the right to refuse or cancel any order at our discretion.</p>
          <h3 className="text-white font-semibold">3. Returns & Refunds</h3>
          <p>We offer a 30-day return policy on all items. Items must be returned in their original condition and packaging. Refunds will be processed within 5–7 business days of receiving the returned item.</p>
          <h3 className="text-white font-semibold">4. Intellectual Property</h3>
          <p>The ShopNest name, logo, and all related content are the property of ShopNest. You may not use, reproduce, or distribute any content without our written permission.</p>
          <h3 className="text-white font-semibold">5. Limitation of Liability</h3>
          <p>ShopNest shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of, or inability to use, the service.</p>
          <h3 className="text-white font-semibold">6. Contact Us</h3>
          <p>Questions about our Terms? Contact us at <span className="text-accent">legal@shopnest.com</span>.</p>
        </Modal>
      )}
    </>
  );
}
