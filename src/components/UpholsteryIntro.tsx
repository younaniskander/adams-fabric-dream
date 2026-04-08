import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

const UpholsteryIntro = () => {
  const { lang } = useLanguage();

  return (
    <section className="relative w-full h-[70vh] overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/upholstery-intro.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-foreground/40" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-4">
        <motion.p
          className="font-body text-xs uppercase tracking-[0.4em] text-primary-foreground/70 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {lang === "ar" ? "مجموعة حصرية" : "Exclusive Collection"}
        </motion.p>
        <motion.h2
          className="font-display text-4xl md:text-6xl text-primary-foreground"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {lang === "ar" ? "أقمشة التنجيد" : "Upholstery Fabrics"}
        </motion.h2>
        <motion.p
          className="mt-4 max-w-lg font-body text-base text-primary-foreground/80"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.25 }}
        >
          {lang === "ar"
            ? "أقمشة تنجيد فاخرة بجودة عالمية لتحويل مساحاتك"
            : "Premium upholstery fabrics with world-class quality to transform your spaces"}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link
            to="/gallery"
            className="mt-8 inline-block rounded-lg border border-primary-foreground/40 bg-primary-foreground/10 px-8 py-3 font-body text-sm text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary-foreground/20"
          >
            {lang === "ar" ? "تصفّح المجموعة" : "Browse Collection"}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default UpholsteryIntro;
