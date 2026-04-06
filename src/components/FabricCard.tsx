import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import type { Fabric } from "@/data/fabrics";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

interface FabricCardProps {
  fabric: Fabric;
}

const FabricCard = ({ fabric }: FabricCardProps) => {
  const { addItem } = useCart();
  const { lang } = useLanguage();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: fabric.id,
      name: fabric.name,
      nameEn: fabric.nameEn,
      image: fabric.image,
      price: fabric.priceNum,
      priceDisplay: fabric.price,
    });
    toast.success(lang === "ar" ? "تمت الإضافة للسلة" : "Added to cart");
  };

  return (
    <Link to={`/fabric/${fabric.id}`}>
      <motion.div
        className="group relative rounded-lg overflow-hidden shadow-fabric hover:shadow-fabric-hover transition-shadow duration-300 bg-card"
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
      >
        {/* Image */}
        <div className="relative overflow-hidden aspect-square">
          <img
            src={fabric.image}
            alt={fabric.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Badges */}
          <div className="absolute top-3 right-3 flex flex-col gap-1">
            {fabric.isFeatured && (
              <span className="bg-gold text-gold-foreground text-xs px-2 py-1 rounded font-body font-semibold">
                {lang === "ar" ? "مميز" : "Featured"}
              </span>
            )}
            {fabric.isNew && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded font-body font-semibold">
                {lang === "ar" ? "جديد" : "New"}
              </span>
            )}
            {fabric.comingSoon && (
              <span className="bg-muted text-muted-foreground text-xs px-2 py-1 rounded font-body font-semibold">
                {lang === "ar" ? "قريباً" : "Soon"}
              </span>
            )}
          </div>
          {/* Quick add button */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span className="bg-background/80 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded font-body">
              {fabric.category === "upholstery" ? (lang === "ar" ? "تنجيد" : "Upholstery") : (lang === "ar" ? "ستائر" : "Curtains")}
            </span>
            <button
              onClick={handleAddToCart}
              className="bg-primary text-primary-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-primary/90"
              title={lang === "ar" ? "أضف للسلة" : "Add to Cart"}
            >
              <ShoppingBag size={14} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="font-display text-lg text-foreground mb-1">{fabric.name}</h3>
          <p className="text-xs text-muted-foreground font-body mb-2">{fabric.brand} • {fabric.origin}</p>
          <div className="flex items-center gap-1.5 mb-2">
            {fabric.colorVariants?.slice(0, 5).map((variant, i) => (
              <span
                key={i}
                className="w-5 h-5 rounded-full border border-border"
                style={{ backgroundColor: variant.color }}
                title={variant.name}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-primary font-body">{fabric.price}</span>
            <button
              onClick={handleAddToCart}
              className="text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg font-body font-medium hover:bg-primary/90 transition-colors"
            >
              {lang === "ar" ? "أضف للسلة" : "Add to Cart"}
            </button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default FabricCard;
