// components/ProblemCard.tsx
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, Star, Clock, Code, TrendingUp } from "lucide-react";
import {
  Difficulty,
  Problem,
  ProblemCardProps,
  ProblemsResponse,
} from "@/types/problems";
import { formatDifficulty } from "@/lib/helperFunctions";
import Link from "next/link";

type Trend = "High" | "Medium" | "Low";

// interface ProblemCardProps {
//   id: number;
//   title: string;
//   description: string;
//   difficulty: Difficulty;
//   completion: number; // percentage
//   tags: string[];
//   trend: Trend;
//   trendStats: { correct: number; wrong: number };
//   iconType?: IconType;
//   starred?: boolean;
// }

export const ProblemCard: React.FC<ProblemCardProps> = ({
  index,
  uuid,
  title,
  description,
  difficulty,
  // completion,
  tags,
  // trend,
  // trendStats,
  type = "check",
  starred = false, // favourite
}) => {
  const difficultyColor = {
    [Difficulty.EASY]:
      "bg-green-600/10 border dark:text-green-500 border-green-800 text-white",
    [Difficulty.MEDIUM]:
      "bg-yellow-600/10 border dark:text-yellow-500 border-yellow-800 text-white",
    [Difficulty.HARD]:
      "bg-red-600/10 border dark:text-red-500 border-red-800 text-white",
  };
  const icon = {
    check: <ArrowUpRight className="w-5 h-5" />,
    clock: <Clock className="w-5 h-5" />,
    code: <Code className="w-5 h-5" />,
  };

  return (
    <Card
      // onClick={handleClick}
      className={`border rounded-lg p-4 px-0  dark:text-white dark:bg-black ${
        difficulty === Difficulty.EASY &&
        "dark:bg-green-600/10 border border-green-800"
      } ${
        difficulty === Difficulty.MEDIUM &&
        "dark:bg-yellow-600/10 border border-yellow-800"
      } ${
        difficulty === Difficulty.HARD &&
        "dark:bg-red-600/10 border border-red-800"
      } space-y-4 hover:shadow-lg transition`}
    >
      <Link href={`/admin/submission/${uuid}`}>
        <CardHeader className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-bold">#{index + 1}</span>
            {type && icon[type]}
          </div>
          {starred && <Star className="w-5 h-5 text-yellow-400" />}
        </CardHeader>
      </Link>

      <CardContent className="space-y-2">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        <CardDescription className="text-gray-400">
          {description}
        </CardDescription>

        <Badge className={difficultyColor[difficulty]}>
          {formatDifficulty(difficulty)}
        </Badge>

        {/* <div className="mt-2">
          <Progress value={completion} className="h-2 rounded-full" />
        </div> */}

        <div className="flex flex-wrap gap-2 mt-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline" className="bg-[#262626]">
              {tag}
            </Badge>
          ))}
        </div>

        {/* <div className="flex justify-between mt-2 text-sm text-gray-400">
          <span className="flex space-x-2"><TrendingUp /> <span>{trend}</span></span>
          <span>
            {trendStats.correct} / {trendStats.wrong}
          </span>
        </div> */}
      </CardContent>
    </Card>
  );
};
