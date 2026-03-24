import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Layout, type Page } from "./components/Layout";
import { Bookings } from "./pages/Bookings";
import { Dashboard } from "./pages/Dashboard";
import { Events } from "./pages/Events";
import { Profile } from "./pages/Profile";
import { Reports } from "./pages/Reports";
import { SettingsPage } from "./pages/SettingsPage";
import { Vendors } from "./pages/Vendors";
import { Venues } from "./pages/Venues";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 2,
    },
  },
});

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "events":
        return <Events />;
      case "venues":
        return <Venues />;
      case "vendors":
        return <Vendors />;
      case "bookings":
        return <Bookings />;
      case "reports":
        return <Reports />;
      case "settings":
        return <SettingsPage />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
      <Toaster />
      <footer className="hidden">
        <p>
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            rel="noopener noreferrer"
          >
            caffeine.ai
          </a>
        </p>
      </footer>
    </QueryClientProvider>
  );
}
