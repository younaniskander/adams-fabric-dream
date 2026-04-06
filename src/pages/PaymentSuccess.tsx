import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PaymentSuccess = () => {
  const { clearCart } = useCart();
  const { lang } = useLanguage();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-20 text-center">
        <CheckCircle className="mx-auto text-primary mb-6" size={64} />
        <h1 className="font-display text-3xl text-foreground mb-4">
          {lang === "ar" ? "تم الدفع بنجاح!" : "Payment Successful!"}
        </h1>
        <p className="text-muted-foreground font-body mb-8">
          {lang === "ar"
            ? "شكراً لك! سيتم التواصل معك قريباً لتأكيد طلبك."
            : "Thank you! We'll contact you soon to confirm your order."}
        </p>
        <Link
          to="/"
          className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-body font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          {lang === "ar" ? "العودة للرئيسية" : "Back to Home"}
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default PaymentSuccess;
