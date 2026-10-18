import { motion } from "framer-motion";
import { Mail, FileText, Image as ImageIcon, Code2, Search, Settings } from "lucide-react";

const tools = [
  {
    icon: Mail,
    title: "Write emails and replies",
    description:
      "Save time with AI-powered OPSIGHT recommendations to craft professional incident reports, status updates and stakeholder emails — in seconds.",
  },
  {
    icon: FileText,
    title: "Read pdf and attachments",
    description:
      "Get instant insights from your PDF runbooks, logs and architecture attachments with OPSIGHT. Simply upload and ask — no more manual reading.",
  },
  {
    icon: ImageIcon,
    title: "Scan images",
    description:
      "Upload architecture diagrams, screenshots and trace graphs. Let OPSIGHT analyze them with AI to get instant descriptions, extracted data and insights.",
  },
  {
    icon: Code2,
    title: "Write code & programs",
    description:
      "Turn your diagnostic ideas into working remediation code and rollback scripts with OPSIGHT. Get clean, efficient and well-structured code for any stack.",
  },
  {
    icon: Search,
    title: "Research",
    description:
      "Find accurate and up-to-date telemetry and historical knowledge with OPSIGHT. Get detailed summaries, root cause correlations and trusted sources.",
  },
  {
    icon: Settings,
    title: "Automation",
    description:
      "Streamline your incident response workflow with AI automation. Let OPSIGHT handle repetitive diagnosis tasks, so you can focus on what matters.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="pt-20 sm:pt-28 lg:pt-32 pb-16 sm:pb-20 lg:pb-24 bg-gradient-to-b from-white via-slate-50/50 to-white relative text-slate-900 overflow-hidden border-t border-slate-100">
      {/* Background subtle ambient glow */}
      <div
        className="absolute top-1/3 left-10 w-[500px] h-[300px] bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      {/* Container aligned with spacious layout */}
      <div className="w-full pl-4 sm:pl-6 md:pl-8 lg:pl-10 xl:pl-12 pr-6 sm:pr-10 max-w-[1480px] relative z-10 text-left">
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 text-left"
        >
          {/* Blue line indicator */}
          <span className="w-8 h-[3px] bg-blue-600 block mb-4 rounded-full" aria-hidden="true" />

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.2rem] font-black text-slate-900 tracking-tight leading-[1.2]">
            Explore the Powerful Tools
            <br />
            <span className="font-black text-blue-600">OPSIGHT AI</span> Brings to You
          </h2>

          {/* Subtitle */}
          <p className="text-xs sm:text-[13px] text-slate-500 mt-2 font-normal tracking-wide max-w-lg">
            Smarter tools. Faster workflows. Endless possibilities.
          </p>
        </motion.div>

        {/* 3-Column Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group flex flex-col items-start p-5 rounded-2xl border border-slate-200/80 bg-white/85 backdrop-blur-xl shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-default"
              >
                {/* Compact round badge with icon */}
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mb-3 transition-colors duration-300 group-hover:bg-blue-600 group-hover:text-white shadow-xs">
                  <Icon size={18} strokeWidth={1.8} />
                </div>

                {/* Title */}
                <h3 className="text-[15px] font-bold text-slate-900 mb-1.5 tracking-tight group-hover:text-blue-600 transition-colors">
                  {tool.title}
                </h3>

                {/* Description */}
                <p className="text-[12px] sm:text-[13px] text-slate-500 font-normal leading-relaxed">
                  {tool.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default AboutSection;
