import { Volume2, Sparkles, Disc3, Globe, Users, ShieldAlert } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function Features() {
  return (
    <section id="features" className="py-20 bg-secondary/30 border-y border-border/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">
            Everything a solo host needs live on mic
          </h2>
          <p className="text-muted-foreground">
            No post-production editing required. AirCheck handles live facts,
            comedic timing, and show chapters while you speak.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="rounded-3xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-studio-amber text-studio-amber-foreground flex items-center justify-center font-bold">
                <Volume2 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Hands-Free Soundboard</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Say a terrible joke or ask for applause. AssemblyAI&apos;s
                tool-calling triggers audio punches and crickets automatically
                without you touching a button.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-studio-violet text-white flex items-center justify-center font-bold">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">In-Ear Fact Checker</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Wonder out loud about a date, statistic, or quote. The agent
                whispers the verified answer into your ears under 15 words so
                you never break eye contact.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold">
                <Disc3 className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Auto Show Notes &amp; Markers</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                AirCheck monitors topic transitions and compiles a timestamped
                chapter outline and verified citation sheet ready to copy for
                YouTube or Spotify.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center font-bold">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">100% In-Browser &amp; Zero Sign-Up</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                No accounts to create, software to install, or API keys to wire up.
                Launch the studio right inside your browser and hit record instantly.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-bold">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">AI Co-Host &amp; Guest</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Need a sparring partner or expert guest? Bring an intelligent AI
                co-host into your live stream to debate topics and banter on cue.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border border-border/60 bg-card shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Banned Word &amp; Policy Guard</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Avoid demonetization and sponsor slip-ups. AirCheck tracks forbidden
                phrases in real time and provides subtle in-ear alerts before they stick.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
