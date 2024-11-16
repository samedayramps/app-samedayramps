import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "@/components/settings/profile-form";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Business Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your business settings and pricing.
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
} 