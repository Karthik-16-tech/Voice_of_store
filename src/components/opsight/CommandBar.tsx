import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Mic,
  MicOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  isVoice?: boolean;
}

export interface HistoricalIncident {
  id: string;
  title: string;
  similarity: number;
  status: string;
  timeAgo: string;
  rootCause: string;
  resolution: string;
  lesson: string;
}

const HISTORICAL_INCIDENTS: HistoricalIncident[] = [
  {
    id: "INC-014",
    title: "Payment Service 504 Timeout",
    similarity: 94,
    status: "Resolved",
    timeAgo: "2 months ago",
    rootCause: "Database connection pool saturation",
    resolution: "Resize connection pool from 50 → 200",
    lesson: "Aggressive connection-leak detection prevented recurrence",
  },
  {
    id: "INC-027",
    title: "Database Connection Saturation",
    similarity: 87,
    status: "Resolved",
    timeAgo: "5 months ago",
    rootCause: "Database connection saturation",
    resolution: "Resize connection pool from 50 → 200",
    lesson: "Aggressive connection-leak detection prevented recurrence",
  },
  {
    id: "INC-009",
    title: "Payment Worker Timeout",
    similarity: 76,
    status: "Resolved",
    timeAgo: "8 months ago",
    rootCause: "Payment worker timeout",
    resolution: "Resize connection pool from 50 → 200",
    lesson: "Aggressive connection-leak detection prevented recurrence",
  },
];

function cleanAIExplanation(rawContent: string): string {
  let text = rawContent;
  if (text.includes("Similar Incident Ticket:")) {
    text = text.split("Similar Incident Ticket:")[0] ?? "";
  }
  if (text.includes("Matched Precedent:")) {
    text = text.split("Matched Precedent:")[0] ?? "";
  }
  if (text.includes("### 📑 Matched Hindsight Ticket")) {
    text = text.split("### 📑 Matched Hindsight Ticket")[0] ?? "";
  }
  return text.trim().replace(/---\s*$/, "").replace(/--\s*$/, "").trim();
}

function IncidentHistorySection({
  onApplyExperience,
}: {
  onApplyExperience?: (incident: HistoricalIncident) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIncidentId, setSelectedIncidentId] = useState<string | null>(null);
  const [appliedIncidentId, setAppliedIncidentId] = useState<string | null>(null);

  const handleApply = (inc: HistoricalIncident) => {
    setAppliedIncidentId(inc.id);
    onApplyExperience?.(inc);
  };

  return (
    <div className="mt-3 pt-2 border-t border-white/[0.08]">
      {/* ◷ INCIDENT HISTORY CONTROL (Default state) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="group flex items-center justify-between w-full rounded-lg px-2.5 py-1.5 text-xs transition-all cursor-pointer bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-sky-500/30 text-white/90"
      >
        <div className="flex items-center gap-2">
          <span className="text-sky-400 text-xs font-mono select-none">◷</span>
          <span className="font-mono text-[10.5px] font-bold tracking-wider text-white">
            INCIDENT HISTORY
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono tracking-wider text-white/40 group-hover:text-sky-300/80 transition-colors uppercase">
            3 SIMILAR INCIDENTS
          </span>
          <ChevronDown
            className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${
              isOpen ? "rotate-180 text-sky-400" : ""
            }`}
          />
        </div>
      </button>

      {/* COMPACT EXPANDABLE HISTORY PANEL */}
      {isOpen && (
        <div className="mt-2 space-y-1.5 rounded-lg bg-black/60 p-2 border border-white/[0.08] backdrop-blur-md transition-all">
          {HISTORICAL_INCIDENTS.map((inc) => {
            const isSelected = selectedIncidentId === inc.id;
            const isApplied = appliedIncidentId === inc.id;

            return (
              <div
                key={inc.id}
                className={`rounded-md border transition-all duration-150 overflow-hidden ${
                  isSelected
                    ? "bg-white/[0.06] border-white/20"
                    : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12]"
                }`}
              >
                {/* Clickable Header Row */}
                <div
                  onClick={() =>
                    setSelectedIncidentId(isSelected ? null : inc.id)
                  }
                  className="p-2 cursor-pointer select-none flex items-center justify-between gap-2"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-white tracking-wider">
                        {inc.id}
                      </span>
                      <span className="text-xs text-white/90 font-medium truncate">
                        {inc.title}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40 font-mono">
                      <span className="text-sky-300/90 font-medium">
                        {inc.similarity}% similar
                      </span>
                      <span>•</span>
                      <span>
                        {inc.status} • {inc.timeAgo}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 text-white/40">
                    <ChevronDown
                      className={`h-3.5 w-3.5 transition-transform duration-200 ${
                        isSelected ? "rotate-180 text-sky-400" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Expanded Details for Selected Incident */}
                {isSelected && (
                  <div className="border-t border-white/[0.08] bg-black/40 px-2.5 py-2.5 space-y-2.5 font-mono text-[11px]">
                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-white/40 font-semibold mb-0.5">
                        ROOT CAUSE
                      </div>
                      <div className="text-white/80 leading-relaxed font-sans text-xs">
                        {inc.rootCause}
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-white/40 font-semibold mb-0.5">
                        RESOLUTION
                      </div>
                      <div className="text-sky-200 leading-relaxed font-sans text-xs bg-sky-950/40 border border-sky-500/20 px-2.5 py-1.5 rounded">
                        {inc.resolution}
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] uppercase tracking-widest text-white/40 font-semibold mb-0.5">
                        LESSON
                      </div>
                      <div className="text-white/70 leading-relaxed font-sans text-xs">
                        {inc.lesson}
                      </div>
                    </div>

                    {/* Small Action Button */}
                    <div className="pt-1.5 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.06]">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleApply(inc);
                        }}
                        disabled={isApplied}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                          isApplied
                            ? "bg-sky-500/20 text-sky-300 border border-sky-500/30 cursor-default"
                            : "bg-white/[0.08] hover:bg-sky-500/20 text-white hover:text-sky-200 border border-white/20 hover:border-sky-500/30"
                        }`}
                      >
                        {isApplied ? (
                          <>
                            <Check className="h-3 w-3 text-sky-400" />
                            <span>EXPERIENCE APPLIED</span>
                          </>
                        ) : (
                          <span>USE THIS EXPERIENCE</span>
                        )}
                      </button>

                      {isApplied && (
                        <span className="text-[10px] text-sky-300 font-mono tracking-wide flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
                          Hindsight experience added to investigation.
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const DEFAULT_INVESTIGATION_TEXT = `### 🔍 Root Cause Analysis
The failure originates at the **Database Layer (PostgreSQL Cluster)**, not the Frontend or Backend Gateway. Commit \`a8f3c1b\` introduced unclosed database transactions. Under checkout load, PostgreSQL connections reached **98/100 (98% saturation)**, exhausting the HikariCP connection pool and cascading timeouts upstream.

---

### 📋 Error Message Breakdown by Architecture Layer
• **Frontend (NEXA Storefront)**: \`Checkout timeout: POST /api/checkout stalled after 30000ms\` (Waiting on backend)
• **Backend Gateway (API Gateway)**: \`504 Gateway Timeout while proxying request to payments-service on node-us-east-2\`
• **Payment API (payments-service)**: \`HikariPool-1 - Connection is not available, request timed out after 30000ms\`
• **Database (PostgreSQL Primary)**: 🔴 \`FATAL: remaining connection slots reserved (98/100 connections in use, pool EXHAUSTED, 184 queued queries)\`

---

### 🛠️ What Needs to Be Done to Resolve
1. **Reroute Traffic**: Drain checkout traffic from degraded node \`node-us-east-2\` to healthy standby pods in \`us-east-1\`.
2. **Clear Orphaned Connections**: Run \`SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE state = 'idle in transaction';\` in PostgreSQL.
3. **Rollback Faulty Commit**: Trigger canary rollback of \`payments-service\` to stable release \`v2.13.8\`.
4. **Scale Connection Capacity**: Resize HikariCP connection pool from 50 to 200 with an aggressive 30s leak-detection threshold.`;

const BACKEND_URL =
  (import.meta.env["VITE_FASTAPI_BACKEND_URL"] as string) || "http://127.0.0.1:8000";
const GEMINI_API_KEY =
  (import.meta.env["VITE_GEMINI_API_KEY"] as string) || "";

export function CommandBar({
  onSubmit,
}: {
  onSubmit?: (value: string) => void;
}) {
  const [value, setValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [interimText, setInterimText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial-investigation",
      role: "assistant",
      content: DEFAULT_INVESTIGATION_TEXT,
      timestamp: "09:59 AM",
    },
  ]);

  const recognitionRef = useRef<any>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto scroll messages to bottom
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognizer = new SpeechRecognition();
      recognizer.continuous = false;
      recognizer.interimResults = true;
      recognizer.lang = "en-US";

      recognizer.onstart = () => {
        setIsListening(true);
      };

      recognizer.onresult = (event: any) => {
        let text = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setInterimText(text);
      };

      recognizer.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognizer.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognizer;
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // When speech stops and has transcribed text, auto-send
  useEffect(() => {
    if (!isListening && interimText.trim()) {
      const query = interimText.trim();
      setInterimText("");
      handleSendMessage(query, true);
    }
  }, [isListening]);

  const toggleListening = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Chrome or Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      setInterimText("");
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error("Speech recognition start failed:", err);
      }
    }
  };

  const speakReply = (text: string) => {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find(
          (v) =>
            v.lang.startsWith("en") &&
            (v.name.includes("Natural") ||
              v.name.includes("Google") ||
              v.name.includes("Samantha") ||
              v.name.includes("Daniel"))
        ) || voices.find((v) => v.lang.startsWith("en"));

      if (preferred) utterance.voice = preferred;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis error:", e);
    }
  };

  const handleSendMessage = async (text: string, isVoice = false) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isVoice,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);
    onSubmit?.(text);

    try {
      let reply = "";
      let spokenText = "";

      // 1. Send to FastAPI backend
      try {
        const res = await fetch(`${BACKEND_URL}/api/voice-chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: text,
            history: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          }),
        });

        if (res.ok) {
          const data = await res.json();
          reply = data.reply || data.voice_reply;
          spokenText = data.spoken_summary || "";
        }
      } catch (beErr) {
        console.warn("FastAPI backend call fallback:", beErr);
      }

      // 2. Direct Fallback if backend was unreachable
      if (!reply) {
        reply = DEFAULT_INVESTIGATION_TEXT;
        spokenText = "Investigation complete: The failure was caused by the Database layer, where PostgreSQL connection pool reached 98% saturation from unclosed transactions in commit a8f3c1b. This cascaded 504 timeouts to the Backend and stalled the Frontend. To resolve: drain node-us-east-2, clear idle connections, and rollback to version v2.13.8. 3 similar historical incidents are available in Hindsight.";
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
      speakReply(spokenText || reply);
    } catch (err) {
      console.error("Failed to get assistant response:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        content: "Telemetry link temporarily interrupted. Diagnostics continuing in background.",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="relative w-full flex flex-col items-center pointer-events-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {/* CHAT INVESTIGATION HISTORY CONTAINER */}
      {messages.length > 0 && (
        <div
          ref={scrollContainerRef}
          className="mb-2 w-full max-h-[14rem] sm:max-h-[15rem] overflow-y-auto [scrollbar-width:thin] scrollbar-thumb-white/10 flex flex-col gap-2 px-1 py-1"
          style={{
            background: "transparent",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 10%, black 100%)",
          }}
        >
          {messages.map((msg) => {
            if (msg.role === "user") {
              return (
                <div key={msg.id} className="flex w-full justify-end">
                  <div
                    className="max-w-[85%] rounded-xl px-3 py-1.5 text-xs leading-relaxed backdrop-blur-md bg-white/[0.12] text-white"
                    style={{ border: "none", boxShadow: "none" }}
                  >
                    <p className="select-text whitespace-pre-wrap">{msg.content}</p>
                    <div className="mt-0.5 flex items-center justify-between gap-2 text-[9px] text-white/40 font-mono">
                      <span>{msg.timestamp}</span>
                      {msg.isVoice && <span className="text-white/70">Voice</span>}
                    </div>
                  </div>
                </div>
              );
            }

            const cleanText = cleanAIExplanation(msg.content);

            return (
              <div key={msg.id} className="flex w-full justify-start">
                <div
                  className="w-full text-xs leading-relaxed text-white/90 transition-all px-1 py-0.5"
                  style={{
                    border: "none",
                    boxShadow: "none",
                    background: "transparent",
                  }}
                >
                  {/* CURRENT INVESTIGATION DIVIDER & HEADER */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-1 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      <span className="text-[10px] font-mono tracking-widest text-white/60 uppercase font-semibold">
                        Current Investigation
                      </span>
                    </div>
                    <span className="text-[9px] font-mono text-white/40 tracking-wider">
                      OPSIGHT SRE
                    </span>
                  </div>

                  {/* CLEAN AI EXPLANATION (NO OUTER BOX, PURE CLEAN TEXT) */}
                  <div className="select-text whitespace-pre-wrap leading-relaxed text-white/85 font-sans space-y-1 text-xs">
                    {cleanText}
                  </div>

                  {/* DEDICATED INCIDENT HISTORY INTERACTION */}
                  <IncidentHistorySection
                    onApplyExperience={(inc) => {
                      onSubmit?.(`execute runbook ${inc.id}`);
                    }}
                  />

                  {/* TIMESTAMP FOOTER */}
                  <div className="mt-2 pt-1 border-t border-white/[0.04] flex items-center justify-between text-[9px] text-white/40 font-mono">
                    <span>{msg.timestamp}</span>
                    {msg.isVoice && <span className="text-white/70">Voice</span>}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex justify-start">
              <div
                className="rounded-xl px-3 py-1 text-[11px] text-white/80 bg-white/[0.04] backdrop-blur-md animate-pulse"
                style={{ border: "none" }}
              >
                Thinking...
              </div>
            </div>
          )}
        </div>
      )}

      {/* SMALL SIMPLE WEBSITE ERROR BOXES (ALL-BLACK GLASSMORPHISM, WHITE TEXT, COMPACT) */}
      <div className="mb-2 flex flex-wrap items-center justify-center gap-1.5 px-1">
        <button
          type="button"
          onClick={() =>
            handleSendMessage(
              "Investigate Payment Service: 504 Gateway Timeout (SEV-1). Show the previous incident tickets from Hindsight, explain why it is similar to that problem, and explain how they resolved it.",
              false
            )
          }
          className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer"
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <span className="h-1 w-1 rounded-full bg-white animate-pulse" />
          <span className="font-medium text-[10px]">Payment 504 Timeout (SEV-1)</span>
        </button>

        <button
          type="button"
          onClick={() =>
            handleSendMessage(
              "Search Hindsight memory for similar historical incidents to this 504 timeout and explain what worked before",
              false
            )
          }
          className="group flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer"
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <span className="h-1 w-1 rounded-full bg-white/70 animate-pulse" />
          <span className="font-medium text-[10px]">Ticket #INC-2841</span>
        </button>

        <button
          type="button"
          onClick={() =>
            handleSendMessage(
              "What are the evidence-backed recommended resolution steps for the on-call engineer to execute?",
              false
            )
          }
          className="group hidden sm:flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] text-white/90 backdrop-blur-md transition-all hover:bg-white/10 cursor-pointer"
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
          }}
        >
          <span className="h-1 w-1 rounded-full bg-white/50" />
          <span className="font-medium text-[10px]">Resolution Playbook</span>
        </button>
      </div>

      {/* COMPACT INPUT COMMAND & VOICE BAR */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!value.trim()) return;
          const query = value.trim();
          setValue("");
          handleSendMessage(query, false);
        }}
        onClick={(e) => {
          e.stopPropagation();
          inputRef.current?.focus();
        }}
        className={`flex w-full items-center gap-2.5 rounded-full py-1 pl-1 pr-1.5 transition-all duration-300 ${
          isListening
            ? "ring-1 ring-white/50 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
            : ""
        }`}
        style={{
          borderRadius: 9999,
          background: "rgba(12, 16, 24, 0.8)",
          backdropFilter: "blur(24px)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          boxShadow: "0 8px 30px rgba(0, 0, 0, 0.6)",
        }}
      >
        {/* Compact Microphone Voice Button */}
        <button
          type="button"
          onClick={toggleListening}
          title={isListening ? "Stop Listening" : "Voice Activation"}
          className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all cursor-pointer ${
            isListening
              ? "bg-white text-black shadow-lg scale-105"
              : "bg-white/10 text-white/90 hover:bg-white/20"
          }`}
          style={{ border: "none" }}
        >
          {isListening ? (
            <MicOff className="h-3.5 w-3.5 animate-bounce" />
          ) : (
            <Mic className="h-3.5 w-3.5" />
          )}

          {isListening && (
            <span className="absolute -inset-1 rounded-full border border-white/60 animate-ping" />
          )}
        </button>

        {/* Compact Input Text Field */}
        <input
          ref={inputRef}
          type="text"
          value={
            isListening
              ? (interimText ? `"${interimText}"` : "Listening... speak now")
              : value
          }
          onChange={(e) => {
            if (!isListening) setValue(e.target.value);
          }}
          onKeyDown={(e) => {
            e.stopPropagation();
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              if (value.trim()) {
                const query = value.trim();
                setValue("");
                handleSendMessage(query, false);
              }
            }
          }}
          onKeyUp={(e) => e.stopPropagation()}
          onKeyPress={(e) => e.stopPropagation()}
          placeholder="Ask or speak about incident..."
          className={`min-w-0 flex-1 bg-transparent text-xs focus:outline-none cursor-text transition-colors select-text ${
            isListening
              ? "text-white italic placeholder:text-white/60 font-mono"
              : "text-foreground placeholder:text-muted-foreground"
          }`}
          style={{ border: "none", outline: "none" }}
        />

        {/* Compact Sound Wave Bars */}
        <div aria-hidden className="hidden items-end gap-[2px] sm:flex pr-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <span
              key={i}
              className={`w-[1.5px] rounded-full transition-all duration-200 ${
                isListening
                  ? "bg-white"
                  : speaking
                  ? "bg-white/80"
                  : "bg-white/30"
              }`}
              style={{
                height: isListening
                  ? `${6 + ((i * 7) % 14)}px`
                  : `${4 + ((i * 4) % 10)}px`,
                animation: isListening
                  ? `wave ${0.5 + (i % 4) * 0.12}s ease-in-out infinite alternate`
                  : `wave ${1.1 + (i % 5) * 0.16}s ease-in-out ${i * 0.05}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Compact Submit Arrow Button */}
        <button
          type="submit"
          disabled={!value.trim() && !isListening}
          aria-label="Send"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 transition-all hover:bg-white/20 text-white cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ border: "none" }}
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
}
