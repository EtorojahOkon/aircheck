import Link from "next/link";
import { Radio, CheckCircle2, Play } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative pt-28 pb-32 md:pt-40 md:pb-40 overflow-hidden bg-black">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl lg:text-[6.5rem] font-bold tracking-tighter leading-[1.05] text-white mb-8">
          Your solo podcast, with an{" "}
          <span className="text-primary">AI co-host</span>.
        </h1>

        <p className="text-sm md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12">
          AirCheck is your AI producer for solo podcasts—fact-checking your
          takes, adding sound effects, and jumping into the conversation when
          you need a co-host.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/studio"
            className={buttonVariants({
              size: "lg",
              className:
                "w-full text-foreground sm:w-auto text-lg font-semibold bg-primary hover:bg-zinc-200 rounded-full px-10 h-14 transition-all inline-flex items-center gap-2",
            })}
          >
            <Radio className="h-5 w-5" />
            Go On Air
          </Link>
          <a
            href="#soundboard"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className:
                "w-full sm:w-auto text-lg font-medium rounded-full h-14 px-8 border-zinc-800 bg-zinc-950 text-white hover:bg-zinc-900 transition-all inline-flex items-center gap-2",
            })}
          >
            <Play className="h-4 w-4" />
            Try Sound Cues
          </a>
        </div>

        <div className="hidden lg:flex flex-wrap items-center justify-center gap-8 text-sm text-zinc-500 pt-16">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-zinc-400" />
            <span>Sub-second Latency</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-zinc-400" />
            <span>Voice-Activated Soundboard</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-zinc-400" />
            <span>Live Show Logging</span>
          </div>
        </div>
      </div>
    </section>
  );
}
