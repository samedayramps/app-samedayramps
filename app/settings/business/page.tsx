import { Separator } from "@/components/ui/separator";
import { BusinessForm } from "@/components/settings/business-form";
import { getBusinessSettings } from "@/app/actions/settings";

export default async function SettingsBusinessPage() {
  const settings = await getBusinessSettings();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Business Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your business settings and pricing.
        </p>
      </div>
      <Separator />
      <BusinessForm initialData={settings} />
    </div>
  );
} 