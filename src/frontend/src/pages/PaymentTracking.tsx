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
import { CheckCircle2, CreditCard, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PaymentStatus } from "../backend.d";
import {
  useCreatePayment,
  useGetAllPayments,
  useUpdatePaymentStatus,
} from "../hooks/useQueries";

const SAMPLE_PAYMENTS = [
  {
    vendorId: 1n,
    amount: 2500,
    currency: { __kind__: "usd" as const, usd: null },
    status: PaymentStatus.paid,
    dueDate: BigInt(new Date("2026-03-15").getTime()),
  },
  {
    vendorId: 2n,
    amount: 1800,
    currency: { __kind__: "usd" as const, usd: null },
    status: PaymentStatus.pending,
    dueDate: BigInt(new Date("2026-04-10").getTime()),
  },
  {
    vendorId: 3n,
    amount: 3200,
    currency: { __kind__: "eur" as const, eur: null },
    status: PaymentStatus.overdue,
    dueDate: BigInt(new Date("2026-03-01").getTime()),
  },
  {
    vendorId: 4n,
    amount: 950,
    currency: { __kind__: "usd" as const, usd: null },
    status: PaymentStatus.pending,
    dueDate: BigInt(new Date("2026-04-20").getTime()),
  },
  {
    vendorId: 5n,
    amount: 4100,
    currency: { __kind__: "gbp" as const, gbp: null },
    status: PaymentStatus.paid,
    dueDate: BigInt(new Date("2026-02-28").getTime()),
  },
];

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; className: string }
> = {
  [PaymentStatus.paid]: {
    label: "Paid",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  [PaymentStatus.pending]: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  [PaymentStatus.overdue]: {
    label: "Overdue",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

function getCurrencyLabel(currency: { __kind__: string }): string {
  return currency.__kind__.toUpperCase();
}

export function PaymentTracking() {
  const { data: paymentsData, isLoading } = useGetAllPayments();
  const createPayment = useCreatePayment();
  const updateStatus = useUpdatePaymentStatus();

  const payments =
    paymentsData && paymentsData.length > 0 ? paymentsData : SAMPLE_PAYMENTS;

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    vendorId: "",
    amount: "",
    currency: "usd",
    dueDate: "",
  });

  const totals = payments.reduce(
    (acc, p) => {
      if (p.status === PaymentStatus.paid) acc.paid += p.amount;
      else if (p.status === PaymentStatus.pending) acc.pending += p.amount;
      else acc.overdue += p.amount;
      return acc;
    },
    { paid: 0, pending: 0, overdue: 0 },
  );

  async function handleAdd() {
    if (!form.vendorId || !form.amount || !form.dueDate) return;
    try {
      await createPayment.mutateAsync({
        vendorId: BigInt(form.vendorId),
        amount: Number(form.amount),
        currency: {
          __kind__: form.currency as any,
          [form.currency]: null,
        } as any,
        status: PaymentStatus.pending,
        dueDate: BigInt(new Date(form.dueDate).getTime()),
      });
      toast.success("Payment record added");
      setAddOpen(false);
      setForm({ vendorId: "", amount: "", currency: "usd", dueDate: "" });
    } catch {
      toast.error("Failed to add payment");
    }
  }

  async function handleMarkPaid(idx: number) {
    try {
      await updateStatus.mutateAsync({
        id: payments[idx].vendorId,
        status: PaymentStatus.paid,
      });
      toast.success("Marked as paid");
    } catch {
      toast.error("Failed to update");
    }
  }

  async function handleMarkOverdue(idx: number) {
    try {
      await updateStatus.mutateAsync({
        id: payments[idx].vendorId,
        status: PaymentStatus.overdue,
      });
      toast.success("Marked as overdue");
    } catch {
      toast.error("Failed to update");
    }
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Paid",
            value: totals.paid,
            color: "text-green-700",
            bg: "bg-green-50",
          },
          {
            label: "Total Pending",
            value: totals.pending,
            color: "text-amber-700",
            bg: "bg-amber-50",
          },
          {
            label: "Total Overdue",
            value: totals.overdue,
            color: "text-red-700",
            bg: "bg-red-50",
          },
        ].map((s, i) => (
          <Card
            key={s.label}
            className="shadow-card border-border"
            data-ocid={`payments.card.${i + 1}`}
          >
            <CardContent className="p-5">
              <p className={`text-2xl font-bold ${s.color}`}>
                ${s.value.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-primary" />
            <CardTitle className="text-base font-semibold">
              Payment Records
            </CardTitle>
          </div>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            data-ocid="payments.open_modal_button"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Payment
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="payments.loading_state">
              {[1, 2, 3].map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table data-ocid="payments.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor ID</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((p, i) => {
                  const cfg = STATUS_CONFIG[p.status];
                  const due = new Date(Number(p.dueDate));
                  return (
                    <TableRow
                      key={`payment-${String(p.vendorId)}-${i}`}
                      data-ocid={`payments.item.${i + 1}`}
                    >
                      <TableCell className="font-medium">
                        V-{String(p.vendorId).padStart(3, "0")}
                      </TableCell>
                      <TableCell>
                        {getCurrencyLabel(p.currency)}{" "}
                        {p.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}
                        >
                          {cfg.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {due.toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-1.5 justify-end">
                          {p.status !== PaymentStatus.paid && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkPaid(i)}
                              data-ocid={`payments.edit_button.${i + 1}`}
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-green-600" />{" "}
                              Paid
                            </Button>
                          )}
                          {p.status === PaymentStatus.pending && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleMarkOverdue(i)}
                              data-ocid={`payments.delete_button.${i + 1}`}
                            >
                              Overdue
                            </Button>
                          )}
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

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent data-ocid="payments.dialog">
          <DialogHeader>
            <DialogTitle>Add Payment Record</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Vendor ID</Label>
              <Input
                type="number"
                placeholder="e.g. 3"
                value={form.vendorId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, vendorId: e.target.value }))
                }
                data-ocid="payments.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="e.g. 1500"
                value={form.amount}
                onChange={(e) =>
                  setForm((p) => ({ ...p, amount: e.target.value }))
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Currency</Label>
              <Select
                value={form.currency}
                onValueChange={(v) => setForm((p) => ({ ...p, currency: v }))}
              >
                <SelectTrigger data-ocid="payments.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["usd", "eur", "gbp", "inr", "icp", "btc", "eth"].map(
                    (c) => (
                      <SelectItem key={c} value={c}>
                        {c.toUpperCase()}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((p) => ({ ...p, dueDate: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="payments.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={createPayment.isPending}
              data-ocid="payments.submit_button"
            >
              {createPayment.isPending ? "Adding..." : "Add Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
