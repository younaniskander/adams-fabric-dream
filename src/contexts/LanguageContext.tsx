import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "ar" | "en";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  isRtl: boolean;
}

const translations: Record<string, Record<Language, string>> = {
  // Navbar
  "nav.home": { ar: "الرئيسية", en: "Home" },
  "nav.about": { ar: "عن آدم", en: "About" },
  "nav.gallery": { ar: "المعرض", en: "Gallery" },
  "nav.upholstery": { ar: "أقمشة تنجيد", en: "Upholstery" },
  "nav.curtains": { ar: "أقمشة ستائر", en: "Curtains" },
  "nav.branches": { ar: "الفروع", en: "Branches" },
  "nav.contact": { ar: "تواصل معنا", en: "Contact Us" },
  "nav.search": { ar: "بحث", en: "Search" },
  "nav.searchPlaceholder": { ar: "ابحث عن منتج...", en: "Search products..." },
  "nav.signIn": { ar: "تسجيل دخول", en: "Sign In" },
  "nav.register": { ar: "تسجيل", en: "Register" },
  "nav.cart": { ar: "السلة", en: "Cart" },

  // Hero
  "hero.title": { ar: "آدم للأقمشة الفاخرة", en: "ADAM Premium Fabrics" },
  "hero.subtitle": { ar: "اكتشف أرقى أقمشة التنجيد والستائر بأعلى جودة", en: "Discover the finest upholstery and curtain fabrics" },
  "hero.cta": { ar: "تسوق الآن", en: "Shop Now" },
  "hero.discount": { ar: "خصم إضافي", en: "Extra Discount" },
  "hero.requestEngineer": { ar: "اطلب مهندس", en: "Request An Engineer" },
  "hero.requestEngineerDesc": { ar: "واختر قماشك في المنزل", en: "And Choose Your Fabric At Home" },
  "hero.requestNow": { ar: "اطلب الآن", en: "Request Now" },

  // Sections
  "section.flashSale": { ar: "عروض فلاش", en: "Flash Sale" },
  "section.shopByCategory": { ar: "تسوق حسب الفئة", en: "Shop By Category" },
  "section.bestSellers": { ar: "الأكثر مبيعاً", en: "Best Sellers" },
  "section.mostViewed": { ar: "الأكثر مشاهدة", en: "Most Viewed" },
  "section.featured": { ar: "أقمشة مميزة", en: "Featured Fabrics" },
  "section.newArrivals": { ar: "وصل حديثاً", en: "New Arrivals" },
  "section.popular": { ar: "الأكثر طلباً", en: "Most Popular" },
  "section.collections": { ar: "مجموعاتنا", en: "Our Collections" },
  "section.viewAll": { ar: "عرض الكل", en: "View All" },
  "section.shopNow": { ar: "تسوق الآن", en: "Shop Now" },

  // Categories
  "cat.upholstery": { ar: "أقمشة تنجيد", en: "Upholstery" },
  "cat.curtains": { ar: "أقمشة ستائر", en: "Curtains" },
  "cat.velvet": { ar: "مخمل", en: "Velvet" },
  "cat.cotton": { ar: "قطن", en: "Cotton" },
  "cat.silk": { ar: "حرير", en: "Silk" },
  "cat.linen": { ar: "كتان", en: "Linen" },
  "cat.satin": { ar: "ساتان", en: "Satin" },
  "cat.denim": { ar: "دنيم", en: "Denim" },

  // Features bar
  "feat.payment": { ar: "طرق دفع متعددة", en: "Payment Methods" },
  "feat.paymentDesc": { ar: "خيارات دفع مرنة وآمنة تناسب احتياجاتك", en: "Flexible and secure payment options" },
  "feat.exchange": { ar: "استبدال واسترجاع", en: "Return & Exchange" },
  "feat.exchangeDesc": { ar: "تسوق بثقة مع سياسة استبدال سهلة", en: "Shop with confidence with our return policy" },
  "feat.delivery": { ar: "شحن وتوصيل", en: "Shipping & Delivery" },
  "feat.deliveryDesc": { ar: "توصيل سريع وموثوق لباب منزلك", en: "Fast and reliable delivery to your door" },
  "feat.support": { ar: "دعم العملاء", en: "Customer Support" },
  "feat.supportDesc": { ar: "فريق دعم متخصص لمساعدتك في كل خطوة", en: "Dedicated support team for every step" },

  // Footer
  "footer.about": { ar: "آدم للأقمشة - وجهتك الأولى لأرقى الأقمشة المحلية والمستوردة", en: "ADAM Fabrics - Your premier destination for finest local and imported fabrics" },
  "footer.quickLinks": { ar: "روابط سريعة", en: "Quick Links" },
  "footer.categories": { ar: "الفئات", en: "Categories" },
  "footer.info": { ar: "معلومات", en: "Information" },
  "footer.contactUs": { ar: "تواصل معنا", en: "Contact Us" },
  "footer.terms": { ar: "الشروط والأحكام", en: "Terms & Conditions" },
  "footer.faq": { ar: "الأسئلة الشائعة", en: "FAQ" },
  "footer.rights": { ar: "جميع الحقوق محفوظة", en: "All rights reserved" },
  "footer.branches": { ar: "فروعنا", en: "Our Branches" },

  // Product
  "product.askPrice": { ar: "اطلب السعر", en: "Ask for Price" },
  "product.addToCart": { ar: "أضف للسلة", en: "Add to Cart" },
  "product.viewDetails": { ar: "عرض التفاصيل", en: "View Details" },
  "product.new": { ar: "جديد", en: "New" },
  "product.featured": { ar: "مميز", en: "Featured" },
  "product.comingSoon": { ar: "قريباً", en: "Coming Soon" },

  // Misc
  "misc.findUs": { ar: "أين تجدنا؟", en: "Where to Find Us?" },
  "misc.adam": { ar: "آدم", en: "ADAM" },
  "misc.whatsapp": { ar: "تواصل عبر واتساب", en: "Chat on WhatsApp" },
  "misc.chatHelp": { ar: "مرحباً! كيف أساعدك؟", en: "Hello! How can I help?" },
  "misc.chatDesc": { ar: "أهلاً بك في آدم للأقمشة! تواصل معنا عبر واتساب للاستفسار.", en: "Welcome to ADAM Fabrics! Contact us via WhatsApp." },

  // Gallery
  "gallery.title": { ar: "معرض الأقمشة", en: "Fabric Gallery" },
  "gallery.subtitle": { ar: "تصفح مجموعتنا الكاملة من أقمشة التنجيد والستائر", en: "Browse our complete collection of upholstery and curtain fabrics" },
  "gallery.search": { ar: "ابحث عن قماش...", en: "Search fabrics..." },
  "gallery.type": { ar: "النوع", en: "Type" },
  "gallery.category": { ar: "التصنيف", en: "Category" },
  "gallery.brand": { ar: "الماركة", en: "Brand" },
  "gallery.origin": { ar: "المنشأ", en: "Origin" },
  "gallery.all": { ar: "الكل", en: "All" },
  "gallery.noResults": { ar: "لم يتم العثور على نتائج", en: "No results found" },
  "gallery.changeFilters": { ar: "جرب تغيير معايير البحث", en: "Try changing your search criteria" },
  "gallery.fabric": { ar: "قماش", en: "fabric(s)" },
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("adam-lang");
    return (saved === "en" || saved === "ar") ? saved : "ar";
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("adam-lang", newLang);
  };

  useEffect(() => {
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang]);

  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, isRtl: lang === "ar" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
}
