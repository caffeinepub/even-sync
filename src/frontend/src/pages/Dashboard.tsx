import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar, MapPin, TrendingUp, Users } from "lucide-react";
import { EventStatus } from "../backend.d";
import { useGetAllEvents, useGetStats } from "../hooks/useQueries";

const SAMPLE_EVENTS = [
  {
    name: "Tech Summit 2026",
    date: new Date("2026-04-15").getTime(),
    venueName: "Grand Convention Center",
    status: EventStatus.upcoming,
  },
  {
    name: "Spring Gala Fundraiser",
    date: new Date("2026-04-22").getTime(),
    venueName: "Rosewood Ballroom",
    status: EventStatus.upcoming,
  },
  {
    name: "Product Launch Event",
    date: new Date("2026-05-03").getTime(),
    venueName: "Horizon Expo Hall",
    status: EventStatus.ongoing,
  },
  {
    name: "Leadership Conference",
    date: new Date("2026-05-18").getTime(),
    venueName: "Metropolitan Hotel",
    status: EventStatus.upcoming,
  },
  {
    name: "Annual Awards Ceremony",
    date: new Date("2026-03-10").getTime(),
    venueName: "Grand Convention Center",
    status: EventStatus.completed,
  },
];

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  upcoming: {
    label: "Upcoming",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  ongoing: {
    label: "Ongoing",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  completed: {
    label: "Completed",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4"];

export function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useGetStats();
  const { data: eventsData, isLoading: eventsLoading } = useGetAllEvents();

  const events =
    eventsData && eventsData.length > 0 ? eventsData : SAMPLE_EVENTS;

  const kpis = [
    {
      label: "Upcoming Events",
      value: stats ? Number(stats.upcomingEvents) : 4,
      icon: Calendar,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Venues",
      value: stats ? Number(stats.totalVenues) : 8,
      icon: MapPin,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Registered Vendors",
      value: stats ? Number(stats.totalVendors) : 24,
      icon: Users,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Total Events",
      value: stats ? Number(stats.totalEvents) : 57,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        data-ocid="dashboard.section"
      >
        {kpis.map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <Card
              key={kpi.label}
              className="shadow-card border-border"
              data-ocid={`dashboard.card.${i + 1}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    {statsLoading ? (
                      <Skeleton className="h-8 w-16 mb-1" />
                    ) : (
                      <p className="text-2xl font-bold text-foreground">
                        {kpi.value}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {kpi.label}
                    </p>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-lg ${kpi.bg} flex items-center justify-center`}
                  >
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Upcoming Events Table */}
      <Card className="shadow-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold">
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {eventsLoading ? (
            <div className="p-6 space-y-3" data-ocid="dashboard.loading_state">
              {SKELETON_KEYS.map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table data-ocid="dashboard.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Event Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.slice(0, 5).map((event, i) => {
                  const cfg =
                    STATUS_CONFIG[event.status] ?? STATUS_CONFIG.upcoming;
                  const date =
                    typeof event.date === "bigint"
                      ? new Date(Number(event.date))
                      : new Date(event.date as number);
                  return (
                    <TableRow
                      key={event.name}
                      data-ocid={`dashboard.item.${i + 1}`}
                    >
                      <TableCell className="font-medium text-sm">
                        {event.name}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {date.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {event.venueName}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}
                        >
                          {cfg.label}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
