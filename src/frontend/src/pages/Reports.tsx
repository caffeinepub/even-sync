import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, TrendingUp, Users } from "lucide-react";
import { useGetStats } from "../hooks/useQueries";

const METRIC_KEYS = ["total-events", "upcoming", "venues", "vendors"];

export function Reports() {
  const { data: stats } = useGetStats();

  const metrics = [
    {
      label: "Total Events Managed",
      value: stats ? Number(stats.totalEvents) : 57,
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Upcoming Events",
      value: stats ? Number(stats.upcomingEvents) : 4,
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Registered Venues",
      value: stats ? Number(stats.totalVenues) : 8,
      icon: BarChart3,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Active Vendors",
      value: stats ? Number(stats.totalVendors) : 24,
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m, i) => {
          const Icon = m.icon;
          return (
            <Card key={METRIC_KEYS[i]} className="shadow-card border-border">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-2xl font-bold text-foreground">
                      {m.value}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {m.label}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${m.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold">Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Detailed analytics and reporting features coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
