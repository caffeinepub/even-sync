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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { EventStatus } from "../backend.d";
import type { Event } from "../backend.d";
import {
  useCreateEvent,
  useDeleteEvent,
  useGetAllEvents,
  useUpdateEvent,
} from "../hooks/useQueries";

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

const SAMPLE_EVENTS: (Event & { _id: bigint })[] = [
  {
    _id: 1n,
    name: "Tech Summit 2026",
    date: BigInt(new Date("2026-04-15").getTime()),
    venueName: "Grand Convention Center",
    status: EventStatus.upcoming,
    description: "Annual technology summit bringing together industry leaders.",
  },
  {
    _id: 2n,
    name: "Spring Gala Fundraiser",
    date: BigInt(new Date("2026-04-22").getTime()),
    venueName: "Rosewood Ballroom",
    status: EventStatus.upcoming,
    description: "Charity gala to support local community programs.",
  },
  {
    _id: 3n,
    name: "Product Launch Event",
    date: BigInt(new Date("2026-05-03").getTime()),
    venueName: "Horizon Expo Hall",
    status: EventStatus.ongoing,
    description: "New flagship product reveal to press and partners.",
  },
  {
    _id: 4n,
    name: "Leadership Conference",
    date: BigInt(new Date("2026-05-18").getTime()),
    venueName: "Metropolitan Hotel",
    status: EventStatus.upcoming,
    description: "Corporate leadership development conference.",
  },
  {
    _id: 5n,
    name: "Annual Awards Ceremony",
    date: BigInt(new Date("2026-03-10").getTime()),
    venueName: "Grand Convention Center",
    status: EventStatus.completed,
    description: "Annual company awards and recognition event.",
  },
];

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4"];
const EMPTY_FORM = {
  name: "",
  description: "",
  venueName: "",
  date: "",
  status: EventStatus.upcoming,
};

export function Events() {
  const { data: rawEvents, isLoading } = useGetAllEvents();
  const createEvent = useCreateEvent();
  const updateEvent = useUpdateEvent();
  const deleteEvent = useDeleteEvent();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const events =
    rawEvents && rawEvents.length > 0
      ? rawEvents.map((e, i) => ({ ...e, _id: BigInt(i) }))
      : SAMPLE_EVENTS;

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditIndex(null);
    setDialogOpen(true);
  };

  const openEdit = (idx: number) => {
    const e = events[idx];
    const d = new Date(Number(e.date));
    setForm({
      name: e.name,
      description: e.description,
      venueName: e.venueName,
      date: d.toISOString().slice(0, 10),
      status: e.status,
    });
    setEditIndex(idx);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.date || !form.venueName) {
      toast.error("Please fill in all required fields");
      return;
    }
    const payload: Event = {
      name: form.name,
      description: form.description,
      venueName: form.venueName,
      date: BigInt(new Date(form.date).getTime()),
      status: form.status as EventStatus,
    };
    try {
      if (editIndex !== null) {
        await updateEvent.mutateAsync({
          id: events[editIndex]._id,
          event: payload,
        });
        toast.success("Event updated");
      } else {
        await createEvent.mutateAsync(payload);
        toast.success("Event created");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteEvent.mutateAsync(id);
      toast.success("Event deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete event");
    }
  };

  const isPending = createEvent.isPending || updateEvent.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {events.length} events total
        </p>
        <Button onClick={openCreate} data-ocid="events.primary_button">
          <Plus className="w-4 h-4 mr-2" />
          New Event
        </Button>
      </div>

      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="events.loading_state">
              {SKELETON_KEYS.map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : events.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              data-ocid="events.empty_state"
            >
              <p className="text-sm">
                No events found. Create your first event.
              </p>
            </div>
          ) : (
            <Table data-ocid="events.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {events.map((event, i) => {
                  const cfg =
                    STATUS_CONFIG[event.status] ?? STATUS_CONFIG.upcoming;
                  const date = new Date(Number(event.date));
                  return (
                    <TableRow
                      key={event.name}
                      data-ocid={`events.item.${i + 1}`}
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
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openEdit(i)}
                            data-ocid={`events.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setDeleteId(event._id)}
                            data-ocid={`events.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="events.dialog">
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? "Edit Event" : "New Event"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="e-name">Event Name *</Label>
              <Input
                id="e-name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Tech Summit 2026"
                data-ocid="events.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e-desc">Description</Label>
              <Textarea
                id="e-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                placeholder="Brief description..."
                rows={3}
                data-ocid="events.textarea"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="e-venue">Venue *</Label>
                <Input
                  id="e-venue"
                  value={form.venueName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, venueName: e.target.value }))
                  }
                  placeholder="Venue name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="e-date">Date *</Label>
                <Input
                  id="e-date"
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, date: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, status: v as EventStatus }))
                }
              >
                <SelectTrigger data-ocid="events.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(EventStatus).map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="events.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              data-ocid="events.submit_button"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editIndex !== null ? "Save Changes" : "Create Event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent data-ocid="events.modal">
          <DialogHeader>
            <DialogTitle>Delete Event</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this event? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="events.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId !== null && handleDelete(deleteId)}
              disabled={deleteEvent.isPending}
              data-ocid="events.confirm_button"
            >
              {deleteEvent.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
