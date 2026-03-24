import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Activity,
  BarChart3,
  Bell,
  BookOpen,
  Calendar,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileCheck,
  LayoutDashboard,
  LayoutGrid,
  MapPin,
  Settings,
  User,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";

export type Page =
  | "dashboard"
  | "events"
  | "venues"
  | "vendors"
  | "vendor-registration"
  | "booths"
  | "payments"
  | "documents"
  | "crowd"
  | "bookings"
  | "reports"
  | "settings"
  | "profile";

interface LayoutProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
  children: React.ReactNode;
}

const navItems: { id: Page; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "events", label: "Events", icon: Calendar },
  { id: "venues", label: "Venues", icon: MapPin },
  { id: "vendors", label: "Vendors", icon: Users },
  {
    id: "vendor-registration",
    label: "Vendor Registration",
    icon: ClipboardList,
  },
  { id: "booths", label: "Booth Allocation", icon: LayoutGrid },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "documents", label: "Documents", icon: FileCheck },
  { id: "crowd", label: "Crowd Monitor", icon: Activity },
  { id: "bookings", label: "Bookings", icon: BookOpen },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
  { id: "profile", label: "Profile", icon: User },
];

const pageTitles: Record<Page, string> = {
  dashboard: "Dashboard Overview",
  events: "Events",
  venues: "Venues",
  vendors: "Vendors",
  "vendor-registration": "Vendor Registration",
  booths: "Booth Allocation",
  payments: "Payment Tracking",
  documents: "Document Verification",
  crowd: "Crowd Monitor",
  bookings: "Bookings",
  reports: "Reports",
  settings: "Settings",
  profile: "My Profile",
};

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-60 flex-shrink-0 bg-sidebar flex flex-col">
        {/* Brand */}
        <div className="px-5 py-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <p className="text-sidebar-foreground font-semibold text-sm leading-tight">
                Even Sync
              </p>
              <p className="text-[10px] text-sidebar-foreground/50 leading-tight">
                Event Coordination Hub
              </p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                type="button"
                key={item.id}
                data-ocid={`nav.${item.id}.link`}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-foreground font-medium"
                    : "text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left">{item.label}</span>
                {isActive && (
                  <span className="text-[10px] bg-success text-white px-1.5 py-0.5 rounded-full font-medium">
                    Active
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-sidebar-border">
          <p className="text-[10px] text-sidebar-foreground/30 text-center">
            Even Sync v1.0
          </p>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top header */}
        <header className="h-16 bg-card border-b border-border flex items-center justify-end px-6 gap-4 flex-shrink-0">
          <button
            type="button"
            className="relative p-2 rounded-md hover:bg-accent transition-colors"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-destructive rounded-full" />
          </button>
          <button
            type="button"
            data-ocid="nav.profile.link"
            className="flex items-center gap-2.5 cursor-pointer rounded-md px-2 py-1 hover:bg-accent transition-colors"
            onClick={() => onNavigate("profile")}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                SJ
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground leading-tight">
                Sarah Jenkins
              </p>
              <p className="text-xs text-muted-foreground leading-tight">
                Event Planner
              </p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground">
                {pageTitles[currentPage]}
              </h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {currentPage === "dashboard"
                  ? "Welcome back, Sarah. Here's what's happening."
                  : currentPage === "profile"
                    ? "Manage your personal information and preferences."
                    : currentPage === "vendor-registration"
                      ? "Public self-registration portal for new vendors."
                      : `Manage your ${pageTitles[currentPage].toLowerCase()}.`}
              </p>
            </div>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
