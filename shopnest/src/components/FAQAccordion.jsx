import { useState } from 'react';
import { FiPlus, FiMinus } from 'react-icons/fi';

const faqs = [
  {
    q: 'How long does shipping take?',
    a: 'Standard shipping takes 3–5 business days. Express delivery (1–2 days) is available at checkout. Free shipping is available on orders over $25.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer free 30-day returns on all items. Simply visit the orders page, select your item, and initiate a return. Refunds are processed within 5–7 business days.',
  },
  {
    q: 'Are my payment details secure?',
    a: "Absolutely. We use 256-bit SSL encryption and never store your full card details. We're PCI-DSS compliant and partner with trusted payment gateways.",
  },
  {
    q: 'Can I track my order?',
    a: "Yes! Once your order ships, you'll receive a confirmation email with a tracking number. You can track your package in real time through our website.",
  },
  {
    q: 'Do you ship internationally?',
    a: 'We currently ship to 50+ countries worldwide. International shipping fees and delivery times vary by destination. Check at checkout for details.',
  },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h2 className="section-title">Frequently Asked <span className="text-gradient">Questions</span></h2>
        <p className="section-subtitle">Everything you need to know about ShopNest.</p>
      </div>
      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              id={`faq-${i}`}
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-dark-700/50 transition-colors"
            >
              <span className="font-medium text-white text-sm sm:text-base pr-4">{faq.q}</span>
              <span className={`flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 ${open === i ? 'bg-accent text-white rotate-180' : 'bg-dark-700 text-gray-400'}`}>
                {open === i ? <FiMinus size={16} /> : <FiPlus size={16} />}
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${open === i ? 'max-h-48' : 'max-h-0'}`}
            >
              <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
