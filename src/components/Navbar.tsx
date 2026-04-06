import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ChevronDown, ShoppingBag, User, Globe } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import logo from "@/assets/logo-nobg.png";

const platformLabels: Record<string, Record<string, string>> = {
  facebook: { ar: "فيسبوك", en: "Facebook" },
  tiktok: { ar: "تيك توك", en: "TikTok" },
  instagram: { ar: "انستجرام", en: "Instagram" },
  twitter: { ar: "تويتر", en: "Twitter" },
  youtube: { ar: "يوتيوب", en: "YouTube" },
  snapchat: { ar: "سناب شات", en: "Snapchat" },
  whatsapp: { ar: "واتساب", en: "WhatsApp" },
};

const platformIcons: Record<string, string> = {
  facebook: "📘", tiktok: "🎵", instagram: "📸", twitter: "🐦",
  youtube: "🎥", snapchat: "👻", whatsapp: "💬",
};

type SocialLink = { id: string; platform: string; url: string; is_active: boolean };

const Navbar = () => {
  const { lang, setLang, t } = useLanguage();
  const { totalItems, setIsOpen: setCartOpen } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const location = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("social_links").select("*").then(({ data }) => {
      if (data) setSocialLinks(data);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeLinks = socialLinks.filter((l) => l.is_active && l.url);
  const soonLinks = socialLinks.filter((l) => !l.is_active || !l.url);
  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: t("nav.home"), path: "/" },
    { label: t("nav.about"), path: "/about" },
    { label: t("nav.gallery"), path: "/gallery" },
  ];

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="ADAM Fabrics" className="h-12 w-12 md:h-14 md:w-14" />
          </Link>

          {/* Center nav */}
          <div className="hidden items-center gap-8 font-body text-sm md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors duration-200 hover:text-primary ${
                  isActive(item.path) ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            {/* Social dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 text-muted-foreground transition-colors hover:text-primary"
              >
                {t("nav.contact")}
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute start-0 top-full mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-lg"
                  >
                    {activeLinks.map((link) => (
                      <a
                        key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>{platformIcons[link.platform] || "🔗"}</span>
                        {platformLabels[link.platform]?.[lang] || link.platform}
                      </a>
                    ))}
                    {soonLinks.map((link) => (
                      <div key={link.id} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-default">
                        <span>{platformIcons[link.platform] || "🔗"}</span>
                        {platformLabels[link.platform]?.[lang] || link.platform}
                        <span className="ms-auto text-xs bg-muted px-1.5 py-0.5 rounded">{lang === "ar" ? "قريباً" : "Soon"}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-muted-foreground transition-colors hover:text-primary"
              aria-label={t("nav.search")}
            >
              <Search size={20} />
            </button>

            {/* Language toggle */}
            <button
              onClick={() => setLang(lang === "ar" ? "en" : "ar")}
              className="flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 text-xs font-body text-muted-foreground transition-colors hover:text-primary hover:border-primary"
            >
              <Globe size={14} />
              {lang === "ar" ? "EN" : "عربي"}
            </button>

            {/* User */}
            <Link to="/admin-login" className="hidden p-2 text-muted-foreground transition-colors hover:text-primary md:block" aria-label={t("nav.signIn")}>
              <User size={20} />
            </Link>

            {/* Cart */}
            <button onClick={() => setCartOpen(true)} className="relative p-2 text-muted-foreground transition-colors hover:text-primary" aria-label={t("nav.cart")}>
              <ShoppingBag size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -end-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Mobile menu */}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground md:hidden" aria-label="Menu">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border bg-background"
          >
            <div className="container mx-auto flex items-center gap-3 px-4 py-3">
              <Search size={18} className="text-muted-foreground" />
              <input
                autoFocus
                type="text"
                placeholder={t("nav.searchPlaceholder")}
                className="flex-1 bg-transparent font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = e.currentTarget.value.trim();
                    if (target) window.location.href = `/gallery?search=${encodeURIComponent(target)}`;
                  }
                }}
              />
              <button onClick={() => setSearchOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border bg-background md:hidden"
          >
            <div className="container mx-auto flex flex-col gap-4 px-4 py-4">
              {navItems.map((item) => (
                <Link
                  key={item.path} to={item.path} onClick={() => setIsOpen(false)}
                  className={`py-2 text-sm ${isActive(item.path) ? "text-primary font-semibold" : "text-muted-foreground"}`}
                >
                  {item.label}
                </Link>
              ))}
              <Link to="/admin-login" onClick={() => setIsOpen(false)} className="py-2 text-sm text-muted-foreground">
                {t("nav.signIn")}
              </Link>
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground mb-2">{t("nav.contact")}</p>
                {activeLinks.map((link) => (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-2 text-sm text-foreground"
                  >
                    <span>{platformIcons[link.platform] || "🔗"}</span>
                    {platformLabels[link.platform]?.[lang] || link.platform}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
