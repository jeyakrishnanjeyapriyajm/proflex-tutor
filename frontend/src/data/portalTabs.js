import {
  BrainCircuit,
  BarChart3,
  Code2,
  BookOpen,
  ClipboardCheck,
  FileText,
  MessageSquare,
  Settings,
  LayoutDashboard,
  UserCheck,
  Users,
  HelpCircle,
  Library,
} from "lucide-react";

export const studentTabs = [
  { label: "Dashboard", path: "/student/dashboard", icon: BrainCircuit, description: "Learning summary" },
  { label: "Analytics", path: "/student/analytics", icon: BarChart3, description: "Performance insights" },
  { label: "Workspace", path: "/student/workspace", icon: Code2, description: "Practice coding" },
  { label: "Curriculum", path: "/student/curriculum", icon: BookOpen, description: "Modules and notes" },
  { label: "Assessment", path: "/student/assessment", icon: ClipboardCheck, description: "Quizzes and feedback" },
  { label: "Resources", path: "/student/resources", icon: FileText, description: "PDFs and videos" },
  { label: "Messages", path: "/student/messages", icon: MessageSquare, description: "Inbox and alerts" },
  { label: "Settings", path: "/student/settings", icon: Settings, description: "Account settings" },
];

export const lecturerTabs = [
  { label: "Overview", path: "/lecturer/overview", icon: LayoutDashboard, description: "Teaching summary" },
  { label: "Analytics", path: "/lecturer/analytics", icon: BarChart3, description: "Class insights" },
  { label: "Question Bank", path: "/lecturer/question-bank", icon: HelpCircle, description: "Manage questions" },
  { label: "Content", path: "/lecturer/content", icon: Library, description: "Learning content" },
  { label: "Students", path: "/lecturer/students", icon: Users, description: "Track students" },
  { label: "Settings", path: "/lecturer/settings", icon: Settings, description: "Account settings" },
];

export const adminTabs = [
  { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard, description: "System overview" },
  { label: "Users", path: "/admin/users", icon: Users, description: "Manage users" },
  { label: "Students", path: "/admin/students", icon: BrainCircuit, description: "Student records" },
  { label: "Lecturers", path: "/admin/lecturers", icon: UserCheck, description: "Approvals" },
  { label: "Questions", path: "/admin/questions", icon: HelpCircle, description: "Review questions" },
  { label: "Settings", path: "/admin/settings", icon: Settings, description: "System settings" },
];