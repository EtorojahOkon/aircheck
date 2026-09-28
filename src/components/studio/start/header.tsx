import Link from "next/link";
import { Radio } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function StartHeader() {
  return (
    <header className="sticky top-0 z-40 bg-background">
      <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-10 w-10 rounded-2xl bg-studio-violet flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
            <Radio className="h-5 w-5" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight block leading-tight">
              AirCheck
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Live Studio Hub
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className={buttonVariants({
            variant: "outline",
            className:
              "rounded-full border-border/60 bg-card hover:bg-secondary text-sm font-medium px-5",
          })}
        >
          Back to Home
        </Link>
      </div>
    </header>
  );
}
