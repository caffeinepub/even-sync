import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BookingStatus } from "../backend.d";
import type { Booking } from "../backend.d";
import { useCreateBooking, useGetAllBookings } from "../hooks/useQueries";

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  confirmed: {
    label: "Confirmed",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  pending: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

const SAMPLE_BOOKINGS: Booking[] = [
  {
    eventId: 1n,
    resourceId: 1n,
    isVendor: false,
    status: BookingStatus.confirmed,
  },
  {
    eventId: 1n,
    resourceId: 2n,
    isVendor: true,
    status: BookingStatus.confirmed,
  },
  {
    eventId: 2n,
    resourceId: 1n,
    isVendor: false,
    status: BookingStatus.pending,
  },
  {
    eventId: 2n,
    resourceId: 3n,
    isVendor: true,
    status: BookingStatus.pending,
  },
  {
    eventId: 3n,
    resourceId: 2n,
    isVendor: false,
    status: BookingStatus.confirmed,
  },
  {
    eventId: 4n,
    resourceId: 5n,
    isVendor: true,
    status: BookingStatus.pending,
  },
];

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4"];
const EMPTY_FORM = {
  eventId: "",
  resourceId: "",
  isVendor: false,
  status: BookingStatus.pending,
};

export function Bookings() {
  const { data: rawBookings, isLoading } = useGetAllBookings();
  const createBooking = useCreateBooking();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const bookings =
    rawBookings && rawBookings.length > 0 ? rawBookings : SAMPLE_BOOKINGS;

  const handleSubmit = async () => {
    if (!form.eventId || !form.resourceId) {
      toast.error("Please fill in all required fields");
      return;
    }
    const payload: Booking = {
      eventId: BigInt(Number.parseInt(form.eventId, 10)),
      resourceId: BigInt(Number.parseInt(form.resourceId, 10)),
      isVendor: form.isVendor,
      status: form.status as BookingStatus,
    };
    try {
      await createBooking.mutateAsync(payload);
      toast.success("Booking created");
      setDialogOpen(false);
      setForm(EMPTY_FORM);
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {bookings.length} bookings total
        </p>
        <Button
          onClick={() => setDialogOpen(true)}
          data-ocid="bookings.primary_button"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="bookings.loading_state">
              {SKELETON_KEYS.map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              data-ocid="bookings.empty_state"
            >
              <p className="text-sm">
                No bookings found. Create your first booking.
              </p>
            </div>
          ) : (
            <Table data-ocid="bookings.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Event ID</TableHead>
                  <TableHead>Resource ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bookings.map((booking, i) => {
                  const cfg =
                    STATUS_CONFIG[booking.status] ?? STATUS_CONFIG.pending;
                  return (
                    <TableRow
                      key={`${booking.eventId}-${booking.resourceId}-${i}`}
                      data-ocid={`bookings.item.${i + 1}`}
                    >
                      <TableCell className="font-medium text-sm">
                        #{String(booking.eventId)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        #{String(booking.resourceId)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                            booking.isVendor
                              ? "bg-purple-100 text-purple-700 border-purple-200"
                              : "bg-blue-100 text-blue-700 border-blue-200"
                          }`}
                        >
                          {booking.isVendor ? "Vendor" : "Venue"}
                        </span>
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="bookings.dialog">
          <DialogHeader>
            <DialogTitle>New Booking</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="b-event">Event ID *</Label>
                <Input
                  id="b-event"
                  type="number"
                  value={form.eventId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, eventId: e.target.value }))
                  }
                  placeholder="1"
                  data-ocid="bookings.input"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="b-res">Resource ID *</Label>
                <Input
                  id="b-res"
                  type="number"
                  value={form.resourceId}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, resourceId: e.target.value }))
                  }
                  placeholder="1"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, status: v as BookingStatus }))
                }
              >
                <SelectTrigger data-ocid="bookings.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(BookingStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="b-vendor"
                checked={form.isVendor}
                onCheckedChange={(v) => setForm((p) => ({ ...p, isVendor: v }))}
                data-ocid="bookings.switch"
              />
              <Label htmlFor="b-vendor">Vendor booking (vs. Venue)</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="bookings.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createBooking.isPending}
              data-ocid="bookings.submit_button"
            >
              {createBooking.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Booking
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
