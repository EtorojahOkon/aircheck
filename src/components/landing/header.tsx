import Link from "next/link";
import { Radio, Mic } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Header() {
  return (
    <header className="fixed w-full top-0 z-50 bg-background">
      <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-studio-violet flex items-center justify-center text-white shadow-md">
            <Radio className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <span className="font-extrabold text-xl tracking-tight flex items-center gap-1.5">
              AirCheck
            </span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">
            Home
          </a>
          <a
            href="#features"
            className="hover:text-foreground transition-colors"
          >
            About
          </a>
          <a
            href="#soundboard"
            className="hover:text-foreground transition-colors"
          >
            Soundboard Demo
          </a>
        </nav>

        <Link
          href="/studio"
          className={buttonVariants({
            className:
              "bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-full px-6 shadow-sm inline-flex items-center gap-2",
          })}
        >
          <Mic className="h-4 w-4 shrink-0" />
          Go On Air
        </Link>
      </div>
    </header>
  );
}
