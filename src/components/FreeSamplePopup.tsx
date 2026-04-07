import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface FreeSamplePopupProps {
  open: boolean;
  onClose: () => void;
  fabric: {
    id: string;
    name: string;
    nameEn: string;
    image: string;
  };
}

const FreeSamplePopup = ({ open, onClose, fabric }: FreeSamplePopupProps) => {
  const { addItem } = useCart();
  const { lang } = useLanguage();
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [runCount, setRunCount] = useState(0);
  const noBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      setNoPos({ x: 0, y: 0 });
      setRunCount(0);
    }
  }, [open]);

  const handleYes = () => {
    addItem({
      id: `sample-${fabric.id}`,
      name: lang === "ar" ? `عينة مجانية - ${fabric.name}` : `Free Sample - ${fabric.nameEn}`,
      nameEn: `Free Sample - ${fabric.nameEn}`,
      image: fabric.image,
      price: 0,
      priceDisplay: lang === "ar" ? "مجاناً" : "Free",
      color: undefined,
      colorName: lang === "ar" ? "عينة" : "Sample",
    }, 1);
    toast.success(lang === "ar" ? "تمت إضافة العينة المجانية للسلة! 🎉" : "Free sample added to cart! 🎉");
    onClose();
  };

  const runAway = useCallback(() => {
    const maxX = 260;
    const maxY = 180;
    const randX = (Math.random() - 0.5) * 2 * maxX;
    const randY = (Math.random() - 0.5) * 2 * maxY;
    setNoPos({ x: randX, y: randY });
    setRunCount((c) => c + 1);
  }, []);

  const noLabel = runCount === 0
    ? (lang === "ar" ? "لا، شكراً" : "No, thanks")
    : runCount < 3
    ? (lang === "ar" ? "متأكد؟ 🤔" : "Are you sure? 🤔")
    : runCount < 6
    ? (lang === "ar" ? "لا تقدر تمسكني! 😜" : "Can't catch me! 😜")
    : (lang === "ar" ? "مستحيل! 🏃‍♂️" : "No way! 🏃‍♂️");

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md overflow-visible" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-display text-xl text-center">
            {lang === "ar" ? "🎁 عينة مجانية!" : "🎁 Free Sample!"}
          </DialogTitle>
          <DialogDescription className="text-center font-body text-sm pt-2">
            {lang === "ar"
              ? `هل تريد الحصول على عينة مجانية من "${fabric.name}"؟`
              : `Would you like a free sample of "${fabric.nameEn}"?`}
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-6 pt-4 pb-2 relative min-h-[80px]">
          <button
            onClick={handleYes}
            className="bg-primary text-primary-foreground px-8 py-3 rounded-lg font-body font-semibold text-sm hover:bg-primary/90 transition-colors z-10"
          >
            {lang === "ar" ? "نعم، أريد عينة! 🎉" : "Yes, I want one! 🎉"}
          </button>

          <motion.button
            ref={noBtnRef}
            animate={{ x: noPos.x, y: noPos.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            onMouseEnter={runAway}
            onTouchStart={runAway}
            className="bg-muted text-muted-foreground px-6 py-3 rounded-lg font-body text-sm hover:bg-muted/80 transition-colors absolute z-20 whitespace-nowrap"
            style={{ right: "10%" }}
          >
            {noLabel}
          </motion.button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FreeSamplePopup;
