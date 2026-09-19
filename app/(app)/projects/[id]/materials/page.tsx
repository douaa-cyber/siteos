import { getMaterials } from "@/lib/services/materialService";
import { Card, CardHeader } from "@/components/ui/Card";
import { AddMaterialModal } from "./AddMaterialModal";
import { MaterialRow } from "./MaterialRow";

export default async function ProjectMaterialsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const materials = getMaterials(id);
  const warnings = materials.filter((m) => m.status !== "OK");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs text-text-secondary">Tracked materials</div>
          <div className="mt-1 font-mono-data text-2xl font-semibold text-text-primary">{materials.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-text-secondary">Need attention</div>
          <div className="mt-1 font-mono-data text-2xl font-semibold text-status-warning">{warnings.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-text-secondary">Healthy stock</div>
          <div className="mt-1 font-mono-data text-2xl font-semibold text-status-good">
            {materials.length - warnings.length}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader title="Material inventory" subtitle="Click a material to record a purchase or consumption" action={<AddMaterialModal projectId={id} />} />
        <div className="divide-y divide-border-hair px-5 pb-5 pt-2">
          {materials.map((m) => (
            <MaterialRow key={m.id} projectId={id} material={m} />
          ))}
          {materials.length === 0 && (
            <p className="py-8 text-center text-sm text-text-secondary">No materials tracked yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
