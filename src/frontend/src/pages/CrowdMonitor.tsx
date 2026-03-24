import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Activity, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { SafetyStatus } from "../backend.d";
import {
  useAddCrowdSession,
  useGetAllCrowdSessions,
} from "../hooks/useQueries";

const SAMPLE_SESSIONS = [
  {
    zone: "A",
    visitorCount: 340n,
    occupancyPercentage: 85,
    safetyStatus: SafetyStatus.caution,
    timestamp: BigInt(Date.now() - 3600000),
  },
  {
    zone: "B",
    visitorCount: 210n,
    occupancyPercentage: 52,
    safetyStatus: SafetyStatus.normal,
    timestamp: BigInt(Date.now() - 7200000),
  },
  {
    zone: "C",
    visitorCount: 480n,
    occupancyPercentage: 96,
    safetyStatus: SafetyStatus.critical,
    timestamp: BigInt(Date.now() - 1800000),
  },
  {
    zone: "D",
    visitorCount: 125n,
    occupancyPercentage: 31,
    safetyStatus: SafetyStatus.normal,
    timestamp: BigInt(Date.now() - 5400000),
  },
  {
    zone: "E",
    visitorCount: 290n,
    occupancyPercentage: 72,
    safetyStatus: SafetyStatus.caution,
    timestamp: BigInt(Date.now() - 9000000),
  },
];

const SAFETY_CONFIG: Record<
  SafetyStatus,
  { label: string; className: string; dot: string }
> = {
  [SafetyStatus.normal]: {
    label: "Normal",
    className: "bg-green-100 text-green-700 border-green-200",
    dot: "bg-green-500",
  },
  [SafetyStatus.caution]: {
    label: "Caution",
    className: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
  },
  [SafetyStatus.critical]: {
    label: "Critical",
    className: "bg-red-100 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
};

export function CrowdMonitor() {
  const { data: sessionsData, isLoading } = useGetAllCrowdSessions();
  const addSession = useAddCrowdSession();

  const sessions =
    sessionsData && sessionsData.length > 0 ? sessionsData : SAMPLE_SESSIONS;

  const [logOpen, setLogOpen] = useState(false);
  const [form, setForm] = useState({
    zone: "",
    visitorCount: "",
    occupancyPercentage: "",
    safetyStatus: SafetyStatus.normal,
  });

  const totalVisitors = sessions.reduce(
    (sum, s) => sum + Number(s.visitorCount),
    0,
  );
  const avgOccupancy =
    sessions.length > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + s.occupancyPercentage, 0) /
            sessions.length,
        )
      : 0;
  const overallSafety = sessions.some(
    (s) => s.safetyStatus === SafetyStatus.critical,
  )
    ? SafetyStatus.critical
    : sessions.some((s) => s.safetyStatus === SafetyStatus.caution)
      ? SafetyStatus.caution
      : SafetyStatus.normal;

  async function handleLog() {
    if (!form.zone || !form.visitorCount || !form.occupancyPercentage) return;
    try {
      await addSession.mutateAsync({
        zone: form.zone,
        visitorCount: BigInt(form.visitorCount),
        occupancyPercentage: Number(form.occupancyPercentage),
        safetyStatus: form.safetyStatus,
        timestamp: BigInt(Date.now()),
      });
      toast.success("Session logged");
      setLogOpen(false);
      setForm({
        zone: "",
        visitorCount: "",
        occupancyPercentage: "",
        safetyStatus: SafetyStatus.normal,
      });
    } catch {
      toast.error("Failed to log session");
    }
  }

  const safetyCfg = SAFETY_CONFIG[overallSafety];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card border-border" data-ocid="crowd.card.1">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {totalVisitors.toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Total Visitors Today
                </p>
              </div>
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border" data-ocid="crowd.card.2">
          <CardContent className="p-5">
            <p className="text-2xl font-bold text-foreground">
              {avgOccupancy}%
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              Average Occupancy
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-card border-border" data-ocid="crowd.card.3">
          <CardContent className="p-5">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${safetyCfg.dot}`} />
              <p className="text-2xl font-bold text-foreground">
                {safetyCfg.label}
              </p>
            </div>
            <p className="text-sm text-muted-foreground mt-0.5">
              Overall Safety Status
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <CardTitle className="text-base font-semibold">
              Zone Activity Feed
            </CardTitle>
          </div>
          <Button
            size="sm"
            onClick={() => setLogOpen(true)}
            data-ocid="crowd.open_modal_button"
          >
            <Plus className="w-4 h-4 mr-1" /> Log Session
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="crowd.loading_state">
              {[1, 2, 3].map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table data-ocid="crowd.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Zone</TableHead>
                  <TableHead>Visitor Count</TableHead>
                  <TableHead>Occupancy %</TableHead>
                  <TableHead>Safety Status</TableHead>
                  <TableHead>Timestamp</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((s, i) => {
                  const cfg = SAFETY_CONFIG[s.safetyStatus];
                  const ts = new Date(Number(s.timestamp));
                  return (
                    <TableRow
                      key={`crowd-${s.zone}-${i}`}
                      data-ocid={`crowd.item.${i + 1}`}
                    >
                      <TableCell className="font-semibold">
                        Zone {s.zone}
                      </TableCell>
                      <TableCell>
                        {Number(s.visitorCount).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 max-w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${s.occupancyPercentage >= 90 ? "bg-red-500" : s.occupancyPercentage >= 70 ? "bg-amber-500" : "bg-green-500"}`}
                              style={{
                                width: `${Math.min(s.occupancyPercentage, 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm">
                            {s.occupancyPercentage}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                          />
                          {cfg.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {ts.toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={logOpen} onOpenChange={setLogOpen}>
        <DialogContent data-ocid="crowd.dialog">
          <DialogHeader>
            <DialogTitle>Log Crowd Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Zone</Label>
              <Input
                placeholder="e.g. A, B, C"
                value={form.zone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, zone: e.target.value }))
                }
                data-ocid="crowd.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Visitor Count</Label>
              <Input
                type="number"
                placeholder="e.g. 250"
                value={form.visitorCount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, visitorCount: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Occupancy %</Label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 75"
                value={form.occupancyPercentage}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    occupancyPercentage: e.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Safety Status</Label>
              <Select
                value={form.safetyStatus}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, safetyStatus: v as SafetyStatus }))
                }
              >
                <SelectTrigger data-ocid="crowd.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={SafetyStatus.normal}>Normal</SelectItem>
                  <SelectItem value={SafetyStatus.caution}>Caution</SelectItem>
                  <SelectItem value={SafetyStatus.critical}>
                    Critical
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLogOpen(false)}
              data-ocid="crowd.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLog}
              disabled={addSession.isPending}
              data-ocid="crowd.submit_button"
            >
              {addSession.isPending ? "Logging..." : "Log Session"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
