// components/SubmissionCard.tsx
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Code,
    Clock,
    MemoryStick,
    Calendar,
} from "lucide-react";
import Link from "next/link";

interface SubmissionCardProps {
    submission: any;
    index: number;
}

const statusTheme: Record<
    string,
    {
        card: string;
        badge: string;
        icon: string;
    }
> = {
    ACCEPTED: {
        card: "dark:bg-green-600/10 border-green-800",
        badge: "bg-green-600/10 text-green-400 border-green-800",
        icon: "text-green-400",
    },
    WRONG_ANSWER: {
        card: "dark:bg-red-600/10 border-red-800",
        badge: "bg-red-600/10 text-red-400 border-red-800",
        icon: "text-red-400",
    },
    TIME_LIMIT_EXCEEDED: {
        card: "dark:bg-orange-600/10 border-orange-800",
        badge: "bg-orange-600/10 text-orange-400 border-orange-800",
        icon: "text-orange-400",
    },
    COMPILATION_ERROR: {
        card: "dark:bg-purple-600/10 border-purple-800",
        badge: "bg-purple-600/10 text-purple-400 border-purple-800",
        icon: "text-purple-400",
    },
};

export const SubmissionCard: React.FC<SubmissionCardProps> = ({
    submission,
    index,
}) => {
    const theme =
        statusTheme[submission.status] ??
        {
            card: "dark:bg-black border-gray-800",
            badge: "bg-gray-600/10 text-gray-400 border-gray-700",
            icon: "text-gray-400",
        };

    return (
        <Card
            className={`border rounded-lg p-4 dark:text-white transition hover:shadow-lg space-y-2 ${theme.card}`}
        >
            <CardHeader className="flex flex-row justify-between items-start p-0">
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-400">
                        #{index + 1}
                    </span>
                    <Code className={`w-4 h-4 ${theme.icon}`} />
                </div>

                <Badge className={`border ${theme.badge}`}>
                    {submission.status.replaceAll("_", " ")}
                </Badge>
            </CardHeader>

            <CardContent className="space-y-3 px-0">
                <CardTitle className="text-lg font-semibold">
                    Language:{" "}
                    <span className="text-gray-400 font-normal">
                        {submission.language}
                    </span>
                </CardTitle>
                {/* 
                <p className="text-sm text-gray-500">
                    Problem ID: {submission.problemId}
                </p> */}

                <div className="flex flex-wrap gap-4 text-sm text-gray-400 mt-2">
                    <span className="flex items-center gap-1">
                        <Clock className={`w-4 h-4 ${theme.icon}`} />
                        {submission.executionTime
                            ? `${submission.executionTime} ms`
                            : "—"}
                    </span>

                    <span className="flex items-center gap-1">
                        <MemoryStick className={`w-4 h-4 ${theme.icon}`} />
                        {submission.memoryUsage
                            ? `${submission.memoryUsage} KB`
                            : "—"}
                    </span>

                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {new Date(submission.createdAt).toLocaleDateString()}
                    </span>
                </div>
            </CardContent>
        </Card>
    );
};
