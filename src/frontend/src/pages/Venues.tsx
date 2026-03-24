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
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Venue } from "../backend.d";
import {
  useCreateVenue,
  useDeleteVenue,
  useGetAllVenues,
  useUpdateVenue,
} from "../hooks/useQueries";

const SAMPLE_VENUES: (Venue & { _id: bigint })[] = [
  {
    _id: 1n,
    name: "Grand Convention Center",
    location: "123 Main St, Downtown",
    capacity: 2000n,
  },
  {
    _id: 2n,
    name: "Rosewood Ballroom",
    location: "45 Park Ave, Midtown",
    capacity: 500n,
  },
  {
    _id: 3n,
    name: "Horizon Expo Hall",
    location: "88 Harbor Blvd, Waterfront",
    capacity: 3500n,
  },
  {
    _id: 4n,
    name: "Metropolitan Hotel",
    location: "200 Business Dist, Central",
    capacity: 800n,
  },
  {
    _id: 5n,
    name: "Skyline Rooftop",
    location: "55 Tower St, Uptown",
    capacity: 250n,
  },
  {
    _id: 6n,
    name: "Garden Pavilion",
    location: "10 Park Lane, East Side",
    capacity: 350n,
  },
];

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4"];
const EMPTY_FORM = { name: "", location: "", capacity: "" };

export function Venues() {
  const { data: rawVenues, isLoading } = useGetAllVenues();
  const createVenue = useCreateVenue();
  const updateVenue = useUpdateVenue();
  const deleteVenue = useDeleteVenue();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const venues =
    rawVenues && rawVenues.length > 0
      ? rawVenues.map((v, i) => ({ ...v, _id: BigInt(i) }))
      : SAMPLE_VENUES;

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditIndex(null);
    setDialogOpen(true);
  };

  const openEdit = (idx: number) => {
    const v = venues[idx];
    setForm({
      name: v.name,
      location: v.location,
      capacity: String(v.capacity),
    });
    setEditIndex(idx);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.location || !form.capacity) {
      toast.error("Please fill in all required fields");
      return;
    }
    const payload: Venue = {
      name: form.name,
      location: form.location,
      capacity: BigInt(Number.parseInt(form.capacity, 10) || 0),
    };
    try {
      if (editIndex !== null) {
        await updateVenue.mutateAsync({
          id: venues[editIndex]._id,
          venue: payload,
        });
        toast.success("Venue updated");
      } else {
        await createVenue.mutateAsync(payload);
        toast.success("Venue created");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteVenue.mutateAsync(id);
      toast.success("Venue deleted");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete venue");
    }
  };

  const isPending = createVenue.isPending || updateVenue.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {venues.length} venues registered
        </p>
        <Button onClick={openCreate} data-ocid="venues.primary_button">
          <Plus className="w-4 h-4 mr-2" />
          Add Venue
        </Button>
      </div>

      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="venues.loading_state">
              {SKELETON_KEYS.map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : venues.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              data-ocid="venues.empty_state"
            >
              <p className="text-sm">No venues found. Add your first venue.</p>
            </div>
          ) : (
            <Table data-ocid="venues.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {venues.map((venue, i) => (
                  <TableRow key={venue.name} data-ocid={`venues.item.${i + 1}`}>
                    <TableCell className="font-medium text-sm">
                      {venue.name}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {venue.location}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {Number(venue.capacity).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(i)}
                          data-ocid={`venues.edit_button.${i + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(venue._id)}
                          data-ocid={`venues.delete_button.${i + 1}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent data-ocid="venues.dialog">
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? "Edit Venue" : "Add Venue"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="v-name">Venue Name *</Label>
              <Input
                id="v-name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Grand Convention Center"
                data-ocid="venues.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-loc">Location *</Label>
              <Input
                id="v-loc"
                value={form.location}
                onChange={(e) =>
                  setForm((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="123 Main St, City"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="v-cap">Capacity *</Label>
              <Input
                id="v-cap"
                type="number"
                value={form.capacity}
                onChange={(e) =>
                  setForm((p) => ({ ...p, capacity: e.target.value }))
                }
                placeholder="500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="venues.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              data-ocid="venues.submit_button"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editIndex !== null ? "Save Changes" : "Add Venue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent data-ocid="venues.modal">
          <DialogHeader>
            <DialogTitle>Delete Venue</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this venue?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="venues.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId !== null && handleDelete(deleteId)}
              disabled={deleteVenue.isPending}
              data-ocid="venues.confirm_button"
            >
              {deleteVenue.isPending && (
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
