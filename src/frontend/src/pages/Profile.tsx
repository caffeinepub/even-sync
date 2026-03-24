import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Camera,
  Edit2,
  Mail,
  Phone,
  Save,
  User,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ProfileData {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  bio: string;
  role: string;
}

const DEFAULT_PROFILE: ProfileData = {
  fullName: "Sarah Jenkins",
  email: "sarah.jenkins@evensync.co",
  phone: "+1 (555) 234-5678",
  company: "Jenkins Event Group",
  bio: "Senior event planner with 8+ years of experience coordinating large-scale corporate and social events. Passionate about creating seamless, memorable experiences for clients.",
  role: "Event Planner",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function Profile() {
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem("evensync_profile");
      return saved
        ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) }
        : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileData>(profile);

  useEffect(() => {
    setDraft(profile);
  }, [profile]);

  const handleSave = () => {
    localStorage.setItem("evensync_profile", JSON.stringify(draft));
    setProfile(draft);
    setEditing(false);
    toast.success("Profile saved successfully!");
  };

  const handleCancel = () => {
    setDraft(profile);
    setEditing(false);
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const initials = getInitials(profile.fullName);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Header Card */}
      <Card data-ocid="profile.card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {editing && (
                <button
                  type="button"
                  data-ocid="profile.upload_button"
                  className="absolute -bottom-1 -right-1 w-8 h-8 bg-card border-2 border-border rounded-full flex items-center justify-center hover:bg-accent transition-colors"
                  onClick={() => toast.info("Photo upload coming soon")}
                >
                  <Camera className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Name + role */}
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl font-semibold text-foreground">
                {profile.fullName}
              </h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                {profile.role}
              </p>
              <p className="text-sm text-muted-foreground">{profile.company}</p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Mail className="w-3.5 h-3.5" />
                  {profile.email}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="w-3.5 h-3.5" />
                  {profile.phone}
                </span>
              </div>
            </div>

            {/* Edit toggle */}
            {!editing ? (
              <Button
                data-ocid="profile.edit_button"
                variant="outline"
                size="sm"
                onClick={() => setEditing(true)}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  data-ocid="profile.cancel_button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  data-ocid="profile.save_button"
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Details Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full Name</Label>
              {editing ? (
                <Input
                  id="fullName"
                  data-ocid="profile.input"
                  value={draft.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Your full name"
                />
              ) : (
                <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-md">
                  {profile.fullName}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="role">Job Title</Label>
              {editing ? (
                <Input
                  id="role"
                  data-ocid="profile.input"
                  value={draft.role}
                  onChange={(e) => handleChange("role", e.target.value)}
                  placeholder="Your job title"
                />
              ) : (
                <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-md">
                  {profile.role}
                </p>
              )}
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" /> Email
              </Label>
              {editing ? (
                <Input
                  id="email"
                  type="email"
                  data-ocid="profile.input"
                  value={draft.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="email@example.com"
                />
              ) : (
                <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-md">
                  {profile.email}
                </p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Phone
              </Label>
              {editing ? (
                <Input
                  id="phone"
                  type="tel"
                  data-ocid="profile.input"
                  value={draft.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="+1 (555) 000-0000"
                />
              ) : (
                <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-md">
                  {profile.phone}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="company" className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5" /> Company / Organization
            </Label>
            {editing ? (
              <Input
                id="company"
                data-ocid="profile.input"
                value={draft.company}
                onChange={(e) => handleChange("company", e.target.value)}
                placeholder="Your company name"
              />
            ) : (
              <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-md">
                {profile.company}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bio">Bio</Label>
            {editing ? (
              <Textarea
                id="bio"
                data-ocid="profile.textarea"
                value={draft.bio}
                onChange={(e) => handleChange("bio", e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
              />
            ) : (
              <p className="text-sm text-foreground py-2 px-3 bg-muted rounded-md leading-relaxed min-h-[80px]">
                {profile.bio}
              </p>
            )}
          </div>

          {editing && (
            <div
              className="flex justify-end gap-3 pt-2"
              data-ocid="profile.panel"
            >
              <Button
                data-ocid="profile.cancel_button"
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                data-ocid="profile.submit_button"
                onClick={handleSave}
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
