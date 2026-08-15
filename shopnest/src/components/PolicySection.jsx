import { FiPackage, FiRefreshCw, FiHeadphones, FiShield } from 'react-icons/fi';

const policies = [
  {
    icon: FiPackage,
    title: 'Free Shipping',
    desc: 'On all orders over $25. Fast and reliable delivery to your doorstep.',
    color: 'from-blue-500/20 to-blue-600/10',
    iconColor: 'text-blue-400',
  },
  {
    icon: FiRefreshCw,
    title: 'Free Returns',
    desc: 'Changed your mind? Return any item within 30 days, no questions asked.',
    color: 'from-green-500/20 to-green-600/10',
    iconColor: 'text-green-400',
  },
  {
    icon: FiHeadphones,
    title: '24/7 Support',
    desc: 'Our dedicated team is always here to help you, anytime, anywhere.',
    color: 'from-accent/20 to-primary-400/10',
    iconColor: 'text-accent',
  },
  {
    icon: FiShield,
    title: 'Secure Payments',
    desc: 'Your payment information is always protected with 256-bit encryption.',
    color: 'from-purple-500/20 to-purple-600/10',
    iconColor: 'text-purple-400',
  },
];

export default function PolicySection() {
  return (
    <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {policies.map((p, i) => (
          <div
            key={p.title}
            className={`card p-6 bg-gradient-to-br ${p.color} border-dark-600/50 animate-fade-in-up opaque-0`}
            style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}
          >
            <div className={`w-12 h-12 rounded-2xl bg-dark-800/60 flex items-center justify-center mb-4 ${p.iconColor}`}>
              <p.icon size={22} />
            </div>
            <h3 className="font-display font-semibold text-white text-base mb-2">{p.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
