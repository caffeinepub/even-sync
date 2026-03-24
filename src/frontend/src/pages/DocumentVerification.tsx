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
import { FileCheck, Plus, ShieldCheck, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DocumentStatus } from "../backend.d";
import {
  useCreateDocument,
  useGetAllDocuments,
  useUpdateDocumentStatus,
} from "../hooks/useQueries";

const SAMPLE_DOCS = [
  {
    vendorId: 1n,
    docType: { __kind__: "license" as const, license: null },
    fileName: "techcorp_license.pdf",
    status: DocumentStatus.verified,
  },
  {
    vendorId: 2n,
    docType: { __kind__: "id" as const, id: null },
    fileName: "greenleaf_id.jpg",
    status: DocumentStatus.pending,
  },
  {
    vendorId: 3n,
    docType: { __kind__: "permit" as const, permit: null },
    fileName: "nexus_permit.pdf",
    status: DocumentStatus.rejected,
  },
  {
    vendorId: 4n,
    docType: { __kind__: "license" as const, license: null },
    fileName: "artisan_license.pdf",
    status: DocumentStatus.pending,
  },
  {
    vendorId: 5n,
    docType: { __kind__: "id" as const, id: null },
    fileName: "summit_id.jpg",
    status: DocumentStatus.verified,
  },
];

const STATUS_CONFIG: Record<
  DocumentStatus,
  { label: string; className: string }
> = {
  [DocumentStatus.verified]: {
    label: "Verified",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  [DocumentStatus.pending]: {
    label: "Pending",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  [DocumentStatus.rejected]: {
    label: "Rejected",
    className: "bg-red-100 text-red-700 border-red-200",
  },
};

function getDocTypeLabel(docType: {
  __kind__: string;
  other?: string;
}): string {
  if (docType.__kind__ === "other") return docType.other ?? "Other";
  const map: Record<string, string> = {
    license: "License",
    id: "ID Proof",
    permit: "Permit",
  };
  return map[docType.__kind__] ?? docType.__kind__;
}

export function DocumentVerification() {
  const { data: docsData, isLoading } = useGetAllDocuments();
  const createDoc = useCreateDocument();
  const updateStatus = useUpdateDocumentStatus();

  const docs = docsData && docsData.length > 0 ? docsData : SAMPLE_DOCS;

  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({
    vendorId: "",
    docType: "license",
    fileName: "",
  });

  const statusCounts = docs.reduce(
    (acc, d) => {
      acc[d.status] = (acc[d.status] ?? 0) + 1;
      return acc;
    },
    {} as Record<DocumentStatus, number>,
  );

  async function handleAdd() {
    if (!form.vendorId || !form.fileName) return;
    try {
      const docTypeMap: Record<string, any> = {
        license: { __kind__: "license", license: null },
        id: { __kind__: "id", id: null },
        permit: { __kind__: "permit", permit: null },
        other: { __kind__: "other", other: "Other" },
      };
      await createDoc.mutateAsync({
        vendorId: BigInt(form.vendorId),
        docType: docTypeMap[form.docType],
        fileName: form.fileName,
        status: DocumentStatus.pending,
      });
      toast.success("Document submitted");
      setAddOpen(false);
      setForm({ vendorId: "", docType: "license", fileName: "" });
    } catch {
      toast.error("Failed to submit document");
    }
  }

  async function handleVerify(idx: number) {
    try {
      await updateStatus.mutateAsync({
        id: docs[idx].vendorId,
        status: DocumentStatus.verified,
      });
      toast.success("Document verified");
    } catch {
      toast.error("Failed to verify");
    }
  }

  async function handleReject(idx: number) {
    try {
      await updateStatus.mutateAsync({
        id: docs[idx].vendorId,
        status: DocumentStatus.rejected,
      });
      toast.success("Document rejected");
    } catch {
      toast.error("Failed to reject");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Verified",
            count: statusCounts[DocumentStatus.verified] ?? 0,
            color: "text-green-700",
            bg: "bg-green-50",
          },
          {
            label: "Pending Review",
            count: statusCounts[DocumentStatus.pending] ?? 0,
            color: "text-amber-700",
            bg: "bg-amber-50",
          },
          {
            label: "Rejected",
            count: statusCounts[DocumentStatus.rejected] ?? 0,
            color: "text-red-700",
            bg: "bg-red-50",
          },
        ].map((s, i) => (
          <Card
            key={s.label}
            className="shadow-card border-border"
            data-ocid={`documents.card.${i + 1}`}
          >
            <CardContent className="p-5">
              <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="shadow-card border-border">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            <CardTitle className="text-base font-semibold">
              Document Registry
            </CardTitle>
          </div>
          <Button
            size="sm"
            onClick={() => setAddOpen(true)}
            data-ocid="documents.open_modal_button"
          >
            <Plus className="w-4 h-4 mr-1" /> Add Document
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6 space-y-3" data-ocid="documents.loading_state">
              {[1, 2, 3].map((k) => (
                <Skeleton key={k} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table data-ocid="documents.table">
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor ID</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>File Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {docs.map((doc, i) => {
                  const cfg = STATUS_CONFIG[doc.status];
                  return (
                    <TableRow
                      key={`doc-${String(doc.vendorId)}-${i}`}
                      data-ocid={`documents.item.${i + 1}`}
                    >
                      <TableCell className="font-medium">
                        V-{String(doc.vendorId).padStart(3, "0")}
                      </TableCell>
                      <TableCell>
                        {getDocTypeLabel(doc.docType as any)}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm font-mono text-xs">
                        {doc.fileName}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${cfg.className}`}
                        >
                          {cfg.label}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {doc.status === DocumentStatus.pending && (
                          <div className="flex gap-1.5 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVerify(i)}
                              data-ocid={`documents.edit_button.${i + 1}`}
                            >
                              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-green-600" />{" "}
                              Verify
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleReject(i)}
                              data-ocid={`documents.delete_button.${i + 1}`}
                            >
                              <XCircle className="w-3.5 h-3.5 mr-1 text-red-500" />{" "}
                              Reject
                            </Button>
                          </div>
                        )}
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
        <DialogContent data-ocid="documents.dialog">
          <DialogHeader>
            <DialogTitle>Submit Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label>Vendor ID</Label>
              <Input
                type="number"
                placeholder="e.g. 2"
                value={form.vendorId}
                onChange={(e) =>
                  setForm((p) => ({ ...p, vendorId: e.target.value }))
                }
                data-ocid="documents.input"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Document Type</Label>
              <Select
                value={form.docType}
                onValueChange={(v) => setForm((p) => ({ ...p, docType: v }))}
              >
                <SelectTrigger data-ocid="documents.select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="license">License</SelectItem>
                  <SelectItem value="id">ID Proof</SelectItem>
                  <SelectItem value="permit">Permit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>File Name</Label>
              <Input
                placeholder="e.g. vendor_license.pdf"
                value={form.fileName}
                onChange={(e) =>
                  setForm((p) => ({ ...p, fileName: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddOpen(false)}
              data-ocid="documents.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdd}
              disabled={createDoc.isPending}
              data-ocid="documents.submit_button"
            >
              {createDoc.isPending ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
