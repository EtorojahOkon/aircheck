"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Copy, Check, Download, FileText, Code2, Radio } from "lucide-react";
import { FactItem, ChapterItem, TranscriptEntry } from "@/types/studio";
import { useStudioStore } from "@/store/studio-store";

interface EpisodeExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facts: FactItem[];
  chapters: ChapterItem[];
  transcript: TranscriptEntry[];
  elapsedTime: string;
  recordingUrl?: string;
  sessionName?: string;
}

export function EpisodeExportModal({
  open,
  onOpenChange,
  facts,
  chapters,
  transcript,
  elapsedTime,
  recordingUrl,
  sessionName = "session",
}: EpisodeExportModalProps) {
  const { settings } = useStudioStore();
  const agentName = settings?.agentName || "Producer";
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("markdown");

  const generateMarkdown = () => {
    const dateStr = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    let md = `# Episode Show Notes — AirCheck Live Recording\n\n`;
    md += `**Date:** ${dateStr}  \n`;
    md += `**Duration:** ${elapsedTime}  \n`;
    md += `**Producer:** ${agentName} (AirCheck Live Voice Agent)  \n\n`;

    md += `## ⏱️ Chapters & Timestamps\n\n`;
    if (chapters.length === 0) {
      md += `*No chapters logged for this session.*\n\n`;
    } else {
      chapters.forEach((c) => {
        md += `- **${c.timestamp}** — ${c.title}\n`;
      });
      md += `\n`;
    }

    md += `## 🔍 Verified Live Fact-Checks\n\n`;
    if (facts.length === 0) {
      md += `*No fact checks recorded.*\n\n`;
    } else {
      facts.forEach((f) => {
        md += `### Q: "${f.query}" (${f.timestamp})\n`;
        md += `> **Verified Fact:** ${f.fact}\n`;
        if (f.source) {
          md += `> *Source Reference:* ${f.source}\n`;
        }
        md += `\n`;
      });
    }

    md += `---\n*Generated automatically in-studio with AirCheck Live.*`;
    return md;
  };

  const markdownContent = generateMarkdown();

  const jsonContent = JSON.stringify(
    {
      session: {
        recordedAt: new Date().toISOString(),
        duration: elapsedTime,
        generator: "AirCheck Live Studio",
      },
      chapters,
      facts,
    },
    null,
    2,
  );

  const generateTranscriptText = () => {
    if (transcript.length === 0) return "No transcript recorded for this session.";
    const header = `Transcript: ${sessionName}\nProducer: ${agentName}\nExported: ${new Date().toLocaleString()}\n${"-".repeat(40)}\n\n`;
    const agentSpeakerTag = agentName.toUpperCase();
    return (
      header +
      transcript
        .map(
          (e) =>
            `[${e.timestamp}] ${e.speaker === "host" ? "HOST" : agentSpeakerTag}: ${e.text}`
        )
        .join("\n\n")
    );
  };

  const transcriptContent = generateTranscriptText();

  const handleCopy = (text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (typeof window === "undefined") return;
    const isMarkdown = activeTab === "markdown";
    const isJson = activeTab === "json";
    const content = isMarkdown ? markdownContent : isJson ? jsonContent : transcriptContent;
    const ext = isMarkdown ? "md" : isJson ? "json" : "txt";
    const mimeType = isMarkdown ? "text/markdown" : isJson ? "application/json" : "text/plain";
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const prefix = sessionName ? sessionName.replace(/\s+/g, "-").toLowerCase() : "aircheck";
    a.download = `${prefix}-${activeTab}-${new Date().toISOString().slice(0, 10)}.${ext}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadRecording = () => {
    if (!recordingUrl) return;
    const a = document.createElement("a");
    a.href = recordingUrl;
    a.download = `${sessionName.replace(/\s+/g, "-").toLowerCase()}-recording.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card border-border/70 text-foreground p-0 overflow-hidden rounded-3xl shadow-xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/50 bg-secondary/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-studio-violet text-white flex items-center justify-center font-bold shadow-xs">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-black tracking-tight text-foreground">
                  Export Episode Show Notes
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Formatted chapters and verified facts ready for YouTube &amp;
                  Spotify
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <TabsList className="bg-secondary/60 border border-border/60 p-1 rounded-full">
                <TabsTrigger
                  value="markdown"
                  className="rounded-full text-xs gap-1.5 px-3 py-1 data-[state=active]:bg-card"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Markdown
                </TabsTrigger>
                <TabsTrigger
                  value="json"
                  className="rounded-full text-xs gap-1.5 px-3 py-1 data-[state=active]:bg-card"
                >
                  <Code2 className="h-3.5 w-3.5" />
                  JSON
                </TabsTrigger>
                <TabsTrigger
                  value="transcript"
                  className="rounded-full text-xs gap-1.5 px-3 py-1 data-[state=active]:bg-card"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Transcript
                </TabsTrigger>
              </TabsList>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="xs"
                  onClick={() => handleCopy(
                    activeTab === "markdown" ? markdownContent
                    : activeTab === "json" ? jsonContent
                    : transcriptContent
                  )}
                  className="h-8 text-xs rounded-full border-border/60 bg-card hover:bg-secondary text-foreground gap-1.5 px-3"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-500" />
                      <span className="text-emerald-500">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                      <span>Copy All</span>
                    </>
                  )}
                </Button>

                <Button
                  size="xs"
                  onClick={handleDownload}
                  className="h-8 text-xs rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold gap-1.5 px-3.5 shadow-xs"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download {activeTab === "markdown" ? ".md" : activeTab === "json" ? ".json" : ".txt"}</span>
                </Button>

                {recordingUrl && (
                  <Button
                    size="xs"
                    variant="outline"
                    onClick={handleDownloadRecording}
                    className="h-8 text-xs rounded-full border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 gap-1.5 px-3.5"
                  >
                    <Radio className="h-3.5 w-3.5" />
                    Recording
                  </Button>
                )}
              </div>
            </div>

            <TabsContent value="markdown" className="mt-0">
              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4 font-mono text-xs text-foreground/90 max-h-[320px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
                {markdownContent}
              </div>
            </TabsContent>

            <TabsContent value="json" className="mt-0">
              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4 font-mono text-xs text-emerald-600 dark:text-emerald-400 max-h-[320px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
                {jsonContent}
              </div>
            </TabsContent>

            <TabsContent value="transcript" className="mt-0">
              <div className="rounded-2xl border border-border/60 bg-secondary/30 p-4 font-mono text-xs text-foreground/90 max-h-[320px] overflow-y-auto leading-relaxed whitespace-pre-wrap select-all">
                {transcriptContent}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
