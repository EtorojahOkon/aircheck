import Link from "next/link";
import { Mic, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="py-20 md:py-28 relative overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight max-w-2xl mx-auto">
          Ready to eliminate dead air on your next recording?
        </h2>

        <p className="text-muted-foreground max-w-lg mx-auto text-base">
          Put on your headphones, grant microphone permissions, and experience a
          live AI broadcast engineer directly in your browser.
        </p>

        <div className="pt-2">
          <Link
            href="/studio"
            className={buttonVariants({
              size: "lg",
              className:
                "text-base text-foreground font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-10 h-14 shadow-xl inline-flex items-center gap-2",
            })}
          >
            <Mic className="h-5 w-5 shrink-0" />
            Enter Studio Control Room
            <ArrowRight className="h-5 w-5 shrink-0" />
          </Link>
        </div>
      </div>
    </section>
  );
}
