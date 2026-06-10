import {
  BookOpen,
  CheckCircle2,
  BrainCircuit,
  Code2,
  Trophy,
  FileText,
  Video,
  Flame,
  Target,
  BadgeCheck,
  Star,
} from "lucide-react";

export const notifications = [
  {
    id: 1,
    title: "New lesson available",
    message: "Module 5: Multidimensional Arrays is now open.",
    time: "2m ago",
    read: false,
    icon: BookOpen,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    id: 2,
    title: "Quiz completed",
    message: "Your Loops MCQ practice was submitted successfully.",
    time: "1h ago",
    read: true,
    icon: CheckCircle2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    id: 3,
    title: "AI support updated",
    message: "New hint recommendations are available for Arrays.",
    time: "5h ago",
    read: true,
    icon: BrainCircuit,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export const masteryData = [
  {
    concept: "Variables & Data Types",
    level: 86,
  },
  {
    concept: "Conditional Statements",
    level: 72,
  },
  {
    concept: "Loops",
    level: 58,
  },
  {
    concept: "Arrays",
    level: 41,
  },
];

export const recentActivities = [
  {
    title: "Nested For Loops",
    result: "Passed",
    time: "Today, 10:42 AM",
    icon: Code2,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    title: "Conditionals Assessment",
    result: "85%",
    time: "Yesterday, 4:15 PM",
    icon: BookOpen,
    color: "text-sky-600",
    bg: "bg-sky-50",
  },
  {
    title: "Logic Master Badge",
    result: "Unlocked",
    time: "Mar 1, 2:30 PM",
    icon: Trophy,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
];

export const resources = [
  {
    title: "Introduction to C Arrays.pdf",
    type: "PDF",
    size: "2.4 MB",
    icon: FileText,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
  {
    title: "Loop Tracing Example.mp4",
    type: "Video",
    size: "45 MB",
    icon: Video,
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
];

export const messages = [
  {
    name: "Instructor",
    time: "10:24 AM",
    msg: "Your loop practice is improving. Review nested loop tracing again.",
    avatar: "https://picsum.photos/seed/instructor/100/100",
  },
  {
    name: "ProgFlex Support",
    time: "Yesterday",
    msg: "Your latest mastery report is now available.",
    avatar: "https://picsum.photos/seed/support/100/100",
  },
];

export const badges = [
  {
    id: 1,
    name: "First Quiz",
    earned: true,
    icon: Star,
    bg: "bg-amber-50",
    color: "text-amber-600",
  },
  {
    id: 2,
    name: "Loop Starter",
    earned: true,
    icon: Flame,
    bg: "bg-orange-50",
    color: "text-orange-600",
  },
  {
    id: 3,
    name: "Code Practice",
    earned: true,
    icon: Code2,
    bg: "bg-sky-50",
    color: "text-sky-600",
  },
  {
    id: 4,
    name: "Mastery Badge",
    earned: false,
    icon: BadgeCheck,
    bg: "bg-slate-50",
    color: "text-slate-300",
  },
  {
    id: 5,
    name: "Target Achiever",
    earned: false,
    icon: Target,
    bg: "bg-slate-50",
    color: "text-slate-300",
  },
];