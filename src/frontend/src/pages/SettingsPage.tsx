import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>First Name</Label>
              <Input defaultValue="Sarah" data-ocid="settings.input" />
            </div>
            <div className="space-y-1.5">
              <Label>Last Name</Label>
              <Input defaultValue="Jenkins" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" defaultValue="sarah.jenkins@evensync.com" />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Input defaultValue="Event Planner" />
          </div>
          <Button
            onClick={() => toast.success("Settings saved")}
            data-ocid="settings.submit_button"
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Separator />

      <Card className="shadow-card border-border">
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Application Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Additional configuration options coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
