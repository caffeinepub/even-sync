import { Toaster } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Layout, type Page } from "./components/Layout";
import { Bookings } from "./pages/Bookings";
import { BoothAllocation } from "./pages/BoothAllocation";
import { CrowdMonitor } from "./pages/CrowdMonitor";
import { Dashboard } from "./pages/Dashboard";
import { DocumentVerification } from "./pages/DocumentVerification";
import { Events } from "./pages/Events";
import { PaymentTracking } from "./pages/PaymentTracking";
import { Profile } from "./pages/Profile";
import { Reports } from "./pages/Reports";
import { SettingsPage } from "./pages/SettingsPage";
import { VendorRegistration } from "./pages/VendorRegistration";
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
      case "vendor-registration":
        return <VendorRegistration />;
      case "booths":
        return <BoothAllocation />;
      case "payments":
        return <PaymentTracking />;
      case "documents":
        return <DocumentVerification />;
      case "crowd":
        return <CrowdMonitor />;
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
