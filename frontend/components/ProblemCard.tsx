// components/ProblemCard.tsx
"use client";

import { ArrowUpRight, Star, Clock, Code } from "lucide-react";
import { Difficulty, ProblemCardProps } from "@/types/problems";
import { formatDifficulty } from "@/lib/helperFunctions";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ProblemCard: React.FC<ProblemCardProps> = ({
  index,
  uuid,
  title,
  description,
  difficulty,
  tags,
  type = "check",
  starred = false,
}) => {
  const pathname = usePathname();
  const basePath = pathname?.startsWith("/admin") ? "/admin/problems" : "/problems";
  const problemUrl = `${basePath}/${uuid}`;

  const difficultyConfig = {
    [Difficulty.EASY]: {
      bg: "bg-emerald-500/10",
      text: "text-emerald-400",
      border: "border-emerald-500/20",
    },
    [Difficulty.MEDIUM]: {
      bg: "bg-yellow-500/10",
      text: "text-yellow-400",
      border: "border-yellow-500/20",
    },
    [Difficulty.HARD]: {
      bg: "bg-red-500/10",
      text: "text-red-400",
      border: "border-red-500/20",
    },
  };

  const config = difficultyConfig[difficulty];

  const icon = {
    check: <ArrowUpRight className="w-4 h-4" />,
    clock: <Clock className="w-4 h-4" />,
    code: <Code className="w-4 h-4" />,
  };

  return (
    <Link href={problemUrl} className="block group">
      <div className="bg-[#09090b] border border-white/5 rounded-xl p-6 relative hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg flex flex-col h-full">
        {/* Header Row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
            <span className="font-bold text-emerald-500">#{index + 1}</span>
            {starred && <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
          </div>
          <div className="text-zinc-600 group-hover:text-emerald-400 transition-colors">
            {type && icon[type]}
          </div>
        </div>

        {/* Content */}
        <div className="mb-6 flex-1">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors tracking-tight">
            {title}
          </h3>
          <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          {/* Tags */}
          <div className="flex gap-2 flex-wrap">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-zinc-400 font-medium border border-white/5"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="px-2 py-1 rounded-md bg-white/5 text-[10px] text-zinc-500 font-medium border border-white/5">
                +{tags.length - 3}
              </span>
            )}
          </div>

          {/* Difficulty Badge */}
          <span
            className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${config.bg} ${config.text} ${config.border}`}
          >
            {formatDifficulty(difficulty)}
          </span>
        </div>
      </div>
    </Link>
  );
};
