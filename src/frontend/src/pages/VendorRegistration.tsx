import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, ClipboardList } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

const CATEGORIES = [
  "Catering",
  "AV & Tech",
  "Florals",
  "Photography",
  "Entertainment",
  "Staffing",
  "Security",
  "Logistics",
  "Other",
];

interface FormData {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  category: string;
  description: string;
  licenseNumber: string;
  website: string;
}

interface FormErrors {
  companyName?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  category?: string;
  description?: string;
  licenseNumber?: string;
}

const initialForm: FormData = {
  companyName: "",
  contactPerson: "",
  email: "",
  phone: "",
  category: "",
  description: "",
  licenseNumber: "",
  website: "",
};

function validate(form: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!form.companyName.trim())
    errors.companyName = "Company name is required.";
  if (!form.contactPerson.trim())
    errors.contactPerson = "Contact person name is required.";
  if (!form.email.trim()) {
    errors.email = "Email address is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!form.phone.trim()) errors.phone = "Phone number is required.";
  if (!form.category) errors.category = "Business category is required.";
  if (!form.description.trim())
    errors.description = "Company description is required.";
  if (!form.licenseNumber.trim())
    errors.licenseNumber = "Trade license number is required.";
  return errors;
}

export function VendorRegistration() {
  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set =
    (field: keyof FormData) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      if (errors[field as keyof FormErrors]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    };

  const handleCategoryChange = (value: string) => {
    setForm((prev) => ({ ...prev, category: value }));
    if (errors.category)
      setErrors((prev) => ({ ...prev, category: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate(form);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors below before submitting.");
      return;
    }
    setIsSubmitting(true);
    // Simulate brief processing
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 800);
  };

  const handleReset = () => {
    setForm(initialForm);
    setErrors({});
    setSubmitted(false);
  };

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          className="max-w-lg mx-auto mt-8"
          data-ocid="vendor_registration.success_state"
        >
          <Card className="text-center shadow-card">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-9 h-9 text-success" />
              </div>
              <CardTitle className="text-2xl">
                Registration Submitted!
              </CardTitle>
              <CardDescription className="text-base mt-1">
                Thank you for registering with Even Sync. Our admin team will
                review your application and contact you at{" "}
                <span className="font-medium text-foreground">
                  {form.email}
                </span>{" "}
                within 2–3 business days.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="bg-muted rounded-md p-4 text-sm text-muted-foreground mb-6 text-left space-y-1.5">
                <p>
                  <span className="font-medium text-foreground">Company:</span>{" "}
                  {form.companyName}
                </p>
                <p>
                  <span className="font-medium text-foreground">Contact:</span>{" "}
                  {form.contactPerson}
                </p>
                <p>
                  <span className="font-medium text-foreground">Category:</span>{" "}
                  {form.category}
                </p>
                <p>
                  <span className="font-medium text-foreground">
                    License #:
                  </span>{" "}
                  {form.licenseNumber}
                </p>
              </div>
              <Button
                data-ocid="vendor_registration.primary_button"
                onClick={handleReset}
                className="w-full"
              >
                Register Another Vendor
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="shadow-card" data-ocid="vendor_registration.panel">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <ClipboardList className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Vendor Registration</CardTitle>
                  <CardDescription>
                    Complete the form below to register your business with Even
                    Sync.
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Row 1 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="companyName">
                      Company / Business Name{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="companyName"
                      data-ocid="vendor_registration.input"
                      placeholder="e.g. Bright Events Co."
                      value={form.companyName}
                      onChange={set("companyName")}
                      aria-invalid={!!errors.companyName}
                    />
                    {errors.companyName && (
                      <p
                        className="text-xs text-destructive"
                        data-ocid="vendor_registration.error_state"
                      >
                        {errors.companyName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contactPerson">
                      Contact Person Name{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="contactPerson"
                      data-ocid="vendor_registration.input"
                      placeholder="e.g. James Okonkwo"
                      value={form.contactPerson}
                      onChange={set("contactPerson")}
                      aria-invalid={!!errors.contactPerson}
                    />
                    {errors.contactPerson && (
                      <p className="text-xs text-destructive">
                        {errors.contactPerson}
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">
                      Email Address <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      data-ocid="vendor_registration.input"
                      placeholder="contact@company.com"
                      value={form.email}
                      onChange={set("email")}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive">{errors.email}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">
                      Phone Number <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      data-ocid="vendor_registration.input"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={set("phone")}
                      aria-invalid={!!errors.phone}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="category">
                      Business Category{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={form.category}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger
                        id="category"
                        data-ocid="vendor_registration.select"
                        aria-invalid={!!errors.category}
                      >
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.category && (
                      <p className="text-xs text-destructive">
                        {errors.category}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="licenseNumber">
                      Trade License Number{" "}
                      <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="licenseNumber"
                      data-ocid="vendor_registration.input"
                      placeholder="e.g. TL-2024-789012"
                      value={form.licenseNumber}
                      onChange={set("licenseNumber")}
                      aria-invalid={!!errors.licenseNumber}
                    />
                    {errors.licenseNumber && (
                      <p className="text-xs text-destructive">
                        {errors.licenseNumber}
                      </p>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-1.5">
                  <Label htmlFor="description">
                    Company Description{" "}
                    <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    data-ocid="vendor_registration.textarea"
                    placeholder="Briefly describe your business, services, and experience..."
                    rows={4}
                    value={form.description}
                    onChange={set("description")}
                    aria-invalid={!!errors.description}
                    className="resize-none"
                  />
                  {errors.description && (
                    <p className="text-xs text-destructive">
                      {errors.description}
                    </p>
                  )}
                </div>

                {/* Website */}
                <div className="space-y-1.5">
                  <Label htmlFor="website">
                    Website URL{" "}
                    <span className="text-muted-foreground text-xs font-normal">
                      (optional)
                    </span>
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    data-ocid="vendor_registration.input"
                    placeholder="https://yourwebsite.com"
                    value={form.website}
                    onChange={set("website")}
                  />
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground">
                    <span className="text-destructive">*</span> Required fields
                  </p>
                  <Button
                    type="submit"
                    data-ocid="vendor_registration.submit_button"
                    disabled={isSubmitting}
                    className="min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting…
                      </span>
                    ) : (
                      "Submit Registration"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
