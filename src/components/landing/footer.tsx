import { Radio } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-8 bg-card text-xs text-muted-foreground">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Radio className="h-4 w-4 text-primary" />
          <span className="font-bold text-foreground">AirCheck</span>
          <span>— Live Broadcast Voice Agent</span>
        </div>
        <div>&copy; 2026 AirCheck. All rights reserved.</div>
      </div>
    </footer>
  );
}
