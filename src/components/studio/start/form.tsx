"use client";

import { useRouter } from "next/navigation";
import { Mic, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { sessionSchema } from "@/lib/validations/session";
import { useStudioStore } from "@/store/studio-store";

const PRESETS = [
  "Ep 1: The Solo Podcaster",
  "Weekly Tech Rundown",
  "Live Q&A Sparring Session",
];

type SessionFormValues = z.infer<typeof sessionSchema>;

export function SessionForm() {
  const router = useRouter();
  const { createSession } = useStudioStore();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: { name: "" },
    mode: "onBlur",
  });

  const onSubmit = (data: SessionFormValues) => {
    const session = createSession(data.name);
    router.push(`/studio/${session.id}`);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-card p-8 md:p-12">
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-studio-amber/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-2xl mx-auto text-center space-y-6">
        <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
          Start a new <span className="text-primary">broadcast session</span>
        </h1>

        <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-lg mx-auto">
          Put on your headphones, enter an episode title, and let your AI
          co-host handle live facts, sound cues, and notes in real time.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <div className="w-full flex-1 flex flex-col gap-1.5">
              <Input
                {...register("name")}
                placeholder="e.g. Episode 43: Next-Gen AI Podcasts"
                aria-invalid={!!errors.name}
                className={cn(
                  "h-14 rounded-full px-6 text-base bg-background border-border/70 focus-visible:ring-primary",
                  errors.name &&
                    "border-destructive focus-visible:ring-destructive",
                )}
              />
              {errors.name && (
                <p className="text-sm font-medium text-destructive text-left px-4">
                  {errors.name.message}
                </p>
              )}
            </div>
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto h-14 rounded-xl px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-base gap-2 shrink-0"
            >
              <Mic className="h-5 w-5" />
              Launch Studio
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-muted-foreground">
            <span className="font-medium mr-1 lg:block hidden">Suggested:</span>
            {PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() =>
                  setValue("name", preset, { shouldValidate: true })
                }
                className="px-3 py-1 rounded-full border border-border/60 bg-secondary/50 hover:bg-secondary hover:text-foreground text-muted-foreground transition-colors"
              >
                + {preset}
              </button>
            ))}
          </div>
        </form>
      </div>
    </div>
  );
}
