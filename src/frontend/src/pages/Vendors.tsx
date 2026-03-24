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
import type { Vendor } from "../backend.d";
import {
  useCreateVendor,
  useDeleteVendor,
  useGetAllVendors,
  useUpdateVendor,
} from "../hooks/useQueries";

const SAMPLE_VENDORS: (Vendor & { _id: bigint })[] = [
  {
    _id: 1n,
    name: "Stellar Catering Co.",
    category: "Catering",
    contactEmail: "info@stellarcatering.com",
    contactPhone: "+1 555-0101",
  },
  {
    _id: 2n,
    name: "Peak Audio Visual",
    category: "AV & Tech",
    contactEmail: "booking@peakav.com",
    contactPhone: "+1 555-0202",
  },
  {
    _id: 3n,
    name: "Bloom Floral Design",
    category: "Florals",
    contactEmail: "hello@bloomfloral.com",
    contactPhone: "+1 555-0303",
  },
  {
    _id: 4n,
    name: "Luxe Photography",
    category: "Photography",
    contactEmail: "shoots@luxephoto.com",
    contactPhone: "+1 555-0404",
  },
  {
    _id: 5n,
    name: "Harmony Live Music",
    category: "Entertainment",
    contactEmail: "bookings@harmonylive.com",
    contactPhone: "+1 555-0505",
  },
  {
    _id: 6n,
    name: "Swift Event Staffing",
    category: "Staffing",
    contactEmail: "staff@swiftevent.com",
    contactPhone: "+1 555-0606",
  },
];

const SKELETON_KEYS = ["sk1", "sk2", "sk3", "sk4"];
const EMPTY_FORM = {
  name: "",
  category: "",
  contactEmail: "",
  contactPhone: "",
};

export function Vendors() {
  const { data: rawVendors, isLoading } = useGetAllVendors();
  const createVendor = useCreateVendor();
  const updateVendor = useUpdateVendor();
  const deleteVendor = useDeleteVendor();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);

  const vendors =
    rawVendors && rawVendors.length > 0
      ? rawVendors.map((v, i) => ({ ...v, _id: BigInt(i) }))
      : SAMPLE_VENDORS;

  const openCreate = () => {
    setForm(EMPTY_FORM);
    setEditIndex(null);
    setDialogOpen(true);
  };

  const openEdit = (idx: number) => {
    const v = vendors[idx];
    setForm({
      name: v.name,
      category: v.category,
      contactEmail: v.contactEmail,
      contactPhone: v.contactPhone,
    });
    setEditIndex(idx);
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.name || !form.category || !form.contactEmail) {
      toast.error("Please fill in all required fields");
      return;
    }
    const payload: Vendor = {
      name: form.name,
      category: form.category,
      contactEmail: form.contactEmail,
      contactPhone: form.contactPhone,
    };
    try {
      if (editIndex !== null) {
        await updateVendor.mutateAsync({
          id: vendors[editIndex]._id,
          vendor: payload,
        });
        toast.success("Vendor updated");
      } else {
        await createVendor.mutateAsync(payload);
        toast.success("Vendor added");
      }
      setDialogOpen(false);
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deleteVendor.mutateAsync(id);
      toast.success("Vendor removed");
      setDeleteId(null);
    } catch {
      toast.error("Failed to delete vendor");
    }
  };

  const isPending = createVendor.isPending || updateVendor.isPending;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {vendors.length} vendors registered
        </p>
        <Button onClick={openCreate} data-ocid="vendors.primary_button">
          <Plus className="w-4 h-4 mr-2" />
          Add Vendor
        </Button>
      </div>

      <Card className="shadow-card border-border">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="vendors.loading_state">
              {SKELETON_KEYS.map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : vendors.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 text-muted-foreground"
              data-ocid="vendors.empty_state"
            >
              <p className="text-sm">
                No vendors found. Add your first vendor.
              </p>
            </div>
          ) : (
            <Table data-ocid="vendors.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor, i) => (
                  <TableRow
                    key={vendor.name}
                    data-ocid={`vendors.item.${i + 1}`}
                  >
                    <TableCell className="font-medium text-sm">
                      {vendor.name}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
                        {vendor.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {vendor.contactEmail}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {vendor.contactPhone}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => openEdit(i)}
                          data-ocid={`vendors.edit_button.${i + 1}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => setDeleteId(vendor._id)}
                          data-ocid={`vendors.delete_button.${i + 1}`}
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
        <DialogContent data-ocid="vendors.dialog">
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? "Edit Vendor" : "Add Vendor"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="vd-name">Vendor Name *</Label>
              <Input
                id="vd-name"
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({ ...p, name: e.target.value }))
                }
                placeholder="Stellar Catering Co."
                data-ocid="vendors.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vd-cat">Category *</Label>
              <Input
                id="vd-cat"
                value={form.category}
                onChange={(e) =>
                  setForm((p) => ({ ...p, category: e.target.value }))
                }
                placeholder="Catering, AV & Tech, Florals..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vd-email">Email *</Label>
              <Input
                id="vd-email"
                type="email"
                value={form.contactEmail}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contactEmail: e.target.value }))
                }
                placeholder="contact@vendor.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="vd-phone">Phone</Label>
              <Input
                id="vd-phone"
                value={form.contactPhone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, contactPhone: e.target.value }))
                }
                placeholder="+1 555-0000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogOpen(false)}
              data-ocid="vendors.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              data-ocid="vendors.submit_button"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editIndex !== null ? "Save Changes" : "Add Vendor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent data-ocid="vendors.modal">
          <DialogHeader>
            <DialogTitle>Remove Vendor</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to remove this vendor?
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteId(null)}
              data-ocid="vendors.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId !== null && handleDelete(deleteId)}
              disabled={deleteVendor.isPending}
              data-ocid="vendors.confirm_button"
            >
              {deleteVendor.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
