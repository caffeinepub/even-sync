import { Badge } from "@/components/ui/badge";
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
import { LayoutGrid, Plus, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { BoothSize, BoothStatus } from "../backend.d";
import {
  useAssignBooth,
  useCreateBooth,
  useGetAllBooths,
} from "../hooks/useQueries";

const SAMPLE_BOOTHS = [
  {
    number: 1n,
    zone: "A",
    size: BoothSize.large,
    status: BoothStatus.occupied,
    assignedVendor: "TechCorp Ltd",
  },
  {
    number: 2n,
    zone: "A",
    size: BoothSize.medium,
    status: BoothStatus.reserved,
    assignedVendor: "GreenLeaf Foods",
  },
  {
    number: 3n,
    zone: "B",
    size: BoothSize.small,
    status: BoothStatus.available,
  },
  {
    number: 4n,
    zone: "B",
    size: BoothSize.medium,
    status: BoothStatus.available,
  },
  {
    number: 5n,
    zone: "C",
    size: BoothSize.large,
    status: BoothStatus.occupied,
    assignedVendor: "Nexus Solutions",
  },
  {
    number: 6n,
    zone: "C",
    size: BoothSize.small,
    status: BoothStatus.reserved,
    assignedVendor: "Artisan Crafts",
  },
];

const STATUS_CONFIG: Record<BoothStatus, { label: string; className: string }> =
  {
    [BoothStatus.available]: {
      label: "Available",
      className: "bg-green-100 text-green-700 border-green-200",
    },
    [BoothStatus.reserved]: {
      label: "Reserved",
      className: "bg-amber-100 text-amber-700 border-amber-200",
    },
    [BoothStatus.occupied]: {
      label: "Occupied",
      className: "bg-red-100 text-red-700 border-red-200",
    },
  };

export function BoothAllocation() {
  const { data: boothsData, isLoading } = useGetAllBooths();
  const createBooth = useCreateBooth();
  const assignBooth = useAssignBooth();

  const booths =
    boothsData && boothsData.length > 0 ? boothsData : SAMPLE_BOOTHS;

  const [addOpen, setAddOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(false);
  const [assignIdx, setAssignIdx] = useState<number | null>(null);
  const [form, setForm] = useState({
    number: "",
    zone: "",
    size: BoothSize.medium,
  });
  const [vendorName, setVendorName] = useState("");

  const stats = {
    total: booths.length,
    available: booths.filter((b) => b.status === BoothStatus.available).length,
    occupied: booths.filter((b) => b.status === BoothStatus.occupied).length,
    reserved: booths.filter((b) => b.status === BoothStatus.reserved).length,
  };

  async function handleAddBooth() {
    if (!form.number || !form.zone) return;
    try {
      await createBooth.mutateAsync({
        number: BigInt(form.number),
        zone: form.zone,
        size: form.size,
        status: BoothStatus.available,
      });
      toast.success("Booth added successfully");
      setAddOpen(false);
      setForm({ number: "", zone: "", size: BoothSize.medium });
    } catch {
      toast.error("Failed to add booth");
    }
  }

  async function handleAssign() {
    if (assignIdx === null || !vendorName) return;
    try {
      await assignBooth.mutateAsync({
        id: booths[assignIdx].number,
        vendorName,
      });
      toast.success("Vendor assigned successfully");
      setAssignOpen(false);
      setVendorName("");
    } catch {
      toast.error("Failed to assign vendor");
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          {
            label: "Total Booths",
            value: stats.total,
            color: "text-foreground",
            bg: "bg-muted/40",
          },
          {
            label: "Available",
            value: stats.available,
            color: "text-green-700",
            bg: "bg-green-50",
          },
          {
            label: "Reserved",
            value: stats.reserved,
            color: "text-amber-700",
            bg: "bg-amber-50",
          },
          {
            label: "Occupied",
            value: stats.occupied,
            color: "text-red-700",
            bg: "bg-red-50",
          },
        ].map((s, i) => (
          <Card
            key={s.label}
            className="shadow-card border-border"
            data-ocid={`booths.card.${i + 1}`}
          >
            <CardContent className="p-5">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-primary" />
            <CardTitle className="text-base font-semibold">
              Booth Directory
            </CardTitle>
          </div>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            data-ocid="booths.open_modal_button"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Booth
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="booths.loading_state">
              {[1, 2, 3].map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table data-ocid="booths.table">
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Assigned Vendor</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {booths.map((booth, i) => {
                  const cfg = STATUS_CONFIG[booth.status];
                  return (
                    <TableRow
                      key={String(booth.number)}
                      data-ocid={`booths.item.${i + 1}`}
                    >
                      <TableCell className="font-semibold">
                        B-{String(booth.number).padStart(2, "0")}
                      </TableCell>
                      <TableCell>Zone {booth.zone}</TableCell>
                      <TableCell className="capitalize">{booth.size}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}
                        >
                          {cfg.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {booth.assignedVendor ?? "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          data-ocid={`booths.edit_button.${i + 1}`}
                          onClick={() => {
                            setAssignIdx(i);
                            setAssignOpen(true);
                          }}
                        >
                          <UserPlus className="w-3.5 h-3.5 mr-1" /> Assign
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add Booth Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-ocid="booths.dialog">
          <DialogHeader>
            <DialogTitle>Add New Booth</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Booth Number</Label>
              <Input
                type="number"
                placeholder="e.g. 7"
                value={form.number}
                onChange={(e) =>
                  setForm((p) => ({ ...p, number: e.target.value }))
                }
                data-ocid="booths.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Zone</Label>
              <Input
                placeholder="e.g. A, B, C"
                value={form.zone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, zone: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Size</Label>
              <Select
                value={form.size}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, size: v as BoothSize }))
                }
              >
                <SelectTrigger data-ocid="booths.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={BoothSize.small}>Small</SelectItem>
                  <SelectItem value={BoothSize.medium}>Medium</SelectItem>
                  <SelectItem value={BoothSize.large}>Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="booths.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddBooth}
              disabled={createBooth.isPending}
              data-ocid="booths.submit_button"
            >
              {createBooth.isPending ? "Adding..." : "Add Booth"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Vendor Dialog */}
      <Dialog open={assignOpen} onOpenChange={setAssignOpen}>
        <DialogContent data-ocid="booths.modal">
          <DialogHeader>
            <DialogTitle>Assign Vendor to Booth</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Vendor Name</Label>
              <Input
                placeholder="Enter vendor name"
                value={vendorName}
                onChange={(e) => setVendorName(e.target.value)}
                data-ocid="booths.textarea"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssignOpen(false)}
              data-ocid="booths.close_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={assignBooth.isPending}
              data-ocid="booths.confirm_button"
            >
              {assignBooth.isPending ? "Assigning..." : "Assign Vendor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
