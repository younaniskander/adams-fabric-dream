import { CreditCard, RefreshCcw, Truck, Headphones } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const FeaturesBar = () => {
  const { t } = useLanguage();

  const features = [
    { icon: CreditCard, title: t("feat.payment"), desc: t("feat.paymentDesc") },
    { icon: RefreshCcw, title: t("feat.exchange"), desc: t("feat.exchangeDesc") },
    { icon: Truck, title: t("feat.delivery"), desc: t("feat.deliveryDesc") },
    { icon: Headphones, title: t("feat.support"), desc: t("feat.supportDesc") },
  ];

  return (
    <section className="border-y border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feat, i) => (
            <div key={i} className="flex flex-col items-center text-center gap-3">
              <feat.icon className="h-10 w-10 text-muted-foreground" strokeWidth={1.2} />
              <h4 className="font-body text-sm font-semibold text-foreground">{feat.title}</h4>
              <p className="font-body text-xs text-muted-foreground max-w-[200px]">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesBar;
