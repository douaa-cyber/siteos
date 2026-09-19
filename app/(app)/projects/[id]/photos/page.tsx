import { getAllPhotos } from "@/lib/services/reportService";
import { formatDate } from "@/lib/format";
import { Card } from "@/components/ui/Card";

export default async function ProjectPhotosPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const photos = getAllPhotos(id);

  if (photos.length === 0) {
    return <Card className="p-8 text-center text-sm text-text-secondary">No photos uploaded yet.</Card>;
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {photos.map((p) => (
        // eslint-disable-next-line @next/next/no-img-element
        <div key={p.id} className="group overflow-hidden rounded-md border border-border-hair bg-surface-card">
          <img src={p.url} alt={p.description ?? "Site photo"} className="h-40 w-full object-cover" loading="lazy" />
          <div className="px-3 py-2">
            <p className="text-xs text-text-secondary">{formatDate(p.reportDate)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
