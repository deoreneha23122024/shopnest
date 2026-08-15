import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "login": "Login",
      "cart": "Cart",
      "orders": "Orders",
      "search_placeholder": "Search for products, brands and more",
      "best_of_electronics": "Best of Electronics",
      "top_styles": "Top Styles of the Season",
      "view_all": "VIEW ALL",
      "trending_now": "Trending Now",
      "under": "Under",
      "sparkling_jewellery": "Sparkling Jewellery",
      "premium_jewellery": "Discover Premium Jewellery",
      "all_products": "All Products",
      "your_cart": "Your cart is empty!",
      "add_items": "Add items to it now.",
      "shop_now": "Shop now",
      "price_details": "Price Details",
      "price": "Price",
      "discount": "Discount",
      "delivery_charges": "Delivery Charges",
      "total_amount": "Total Amount",
      "save_on_order": "You will save {{amount}} on this order",
      "place_order": "Place Order",
      "safe_secure": "Safe and Secure Payments. Easy returns. 100% Authentic products.",
      "delivery_address": "Delivery Address",
      "order_summary": "Order Summary",
      "payment_options": "Payment Options",
      "save_deliver": "Save and Deliver Here",
      "continue": "Continue",
      "pay": "Pay {{amount}}",
      "cash_on_delivery": "Cash on Delivery",
      "credit_card": "Credit / Debit / ATM Card",
      "upi": "UPI"
    }
  },
  hi: {
    translation: {
      "login": "लॉग इन करें",
      "cart": "कार्ट",
      "orders": "ऑर्डर",
      "search_placeholder": "उत्पाद, ब्रांड और बहुत कुछ खोजें",
      "best_of_electronics": "सर्वश्रेष्ठ इलेक्ट्रॉनिक्स",
      "top_styles": "सीज़न की शीर्ष शैलियाँ",
      "view_all": "सभी देखें",
      "trending_now": "अभी ट्रेंडिंग",
      "under": "के तहत",
      "sparkling_jewellery": "चमकदार आभूषण",
      "premium_jewellery": "प्रीमियम आभूषण खोजें",
      "all_products": "सभी उत्पाद",
      "your_cart": "आपकी कार्ट खाली है!",
      "add_items": "अब इसमें आइटम जोड़ें।",
      "shop_now": "अभी खरीदारी करें",
      "price_details": "मूल्य विवरण",
      "price": "मूल्य",
      "discount": "छूट",
      "delivery_charges": "वितरण शुल्क",
      "total_amount": "कुल राशि",
      "save_on_order": "आप इस ऑर्डर पर {{amount}} बचाएंगे",
      "place_order": "ऑर्डर दें",
      "safe_secure": "सुरक्षित भुगतान। आसान वापसी। 100% प्रामाणिक उत्पाद।",
      "delivery_address": "वितरण का पता",
      "order_summary": "ऑर्डर सारांश",
      "payment_options": "भुगतान विकल्प",
      "save_deliver": "सहेजें और यहाँ वितरित करें",
      "continue": "जारी रखें",
      "pay": "भुगतान करें {{amount}}",
      "cash_on_delivery": "कैश ऑन डिलीवरी",
      "credit_card": "क्रेडिट / डेबिट / एटीएम कार्ड",
      "upi": "यूपीआई"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
