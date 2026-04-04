import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, ChevronDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo-nobg.png";

const navItems = [
  { label: "الرئيسية", path: "/" },
  { label: "عن آدم", path: "/about" },
  { label: "المعرض", path: "/gallery" },
];

const platformLabels: Record<string, string> = {
  facebook: "فيسبوك",
  tiktok: "تيك توك",
  instagram: "انستجرام",
  twitter: "تويتر",
  youtube: "يوتيوب",
  snapchat: "سناب شات",
  whatsapp: "واتساب",
};

const platformIcons: Record<string, string> = {
  facebook: "📘",
  tiktok: "🎵",
  instagram: "📸",
  twitter: "🐦",
  youtube: "🎥",
  snapchat: "👻",
  whatsapp: "💬",
};

const isActivePath = (pathname: string, path: string) => pathname === path;

type SocialLink = { id: string; platform: string; url: string; is_active: boolean };

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.from("social_links").select("*").then(({ data }) => {
      if (data) setSocialLinks(data);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeLinks = socialLinks.filter((l) => l.is_active && l.url);
  const soonLinks = socialLinks.filter((l) => !l.is_active || !l.url);

  return (
    <nav className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between md:h-20">
          {/* Left side: Search + Nav items */}
          <div className="hidden items-center gap-6 font-body text-sm md:flex">
            {/* Expandable search */}
            <div
              ref={searchRef}
              className="relative flex items-center"
              onMouseEnter={() => setSearchExpanded(true)}
              onMouseLeave={() => setSearchExpanded(false)}
            >
              <Link
                to="/gallery"
                className="p-2 text-muted-foreground transition-colors hover:text-primary"
                aria-label="ابحث في المعرض"
              >
                <Search size={20} />
              </Link>
              <AnimatePresence>
                {searchExpanded && (
                  <motion.span
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: "auto", opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap text-xs text-muted-foreground"
                  >
                    <Link to="/gallery" className="hover:text-primary transition-colors">
                      ابحث في المعرض
                    </Link>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>

            <div className="h-4 w-px bg-border" />


            {/* Social dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 text-muted-foreground transition-colors duration-200 hover:text-primary"
              >
                تواصل معنا
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute left-0 top-full mt-2 w-48 rounded-xl border border-border bg-card p-2 shadow-lg"
                  >
                    {activeLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <span>{platformIcons[link.platform] || "🔗"}</span>
                        {platformLabels[link.platform] || link.platform}
                      </a>
                    ))}
                    {soonLinks.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground cursor-default"
                      >
                        <span>{platformIcons[link.platform] || "🔗"}</span>
                        {platformLabels[link.platform] || link.platform}
                        <span className="mr-auto text-xs bg-muted px-1.5 py-0.5 rounded">قريباً</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors duration-200 hover:text-primary ${
                  isActivePath(location.pathname, item.path) ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center">
              <img src={logo} alt="ADAM Fabrics" className="h-12 w-12 md:h-14 md:w-14 text-right" />
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground md:hidden" aria-label="القائمة">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

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
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`py-2 text-sm ${
                    isActivePath(location.pathname, item.path) ? "text-primary font-semibold" : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              {/* Mobile social links */}
              <div className="border-t border-border pt-3">
                <p className="text-xs text-muted-foreground mb-2">تواصل معنا</p>
                {activeLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 py-2 text-sm text-foreground"
                  >
                    <span>{platformIcons[link.platform] || "🔗"}</span>
                    {platformLabels[link.platform] || link.platform}
                  </a>
                ))}
                {soonLinks.map((link) => (
                  <div key={link.id} className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                    <span>{platformIcons[link.platform] || "🔗"}</span>
                    {platformLabels[link.platform] || link.platform}
                    <span className="mr-auto text-xs bg-muted px-1.5 py-0.5 rounded">قريباً</span>
                  </div>
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
