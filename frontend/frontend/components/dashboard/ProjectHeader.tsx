import { MapPin } from "@/components/ui/Icons";
import { DashboardProject } from "@/types/dashboard";

interface Props {
  project: DashboardProject;
}

export default function ProjectHeader({ project }: Props) {
  const start = new Date(project.startDate).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  const end = new Date(project.expectedEndDate).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-zinc-950 p-7 text-white shadow-2xl shadow-zinc-900/10">
      {/* decorative grid */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.08]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-5 flex items-center gap-2">
            <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-emerald-300 ring-1 ring-emerald-400/20">
              {project.status}
            </span>

            <span className="text-xs text-zinc-500">
              Project #{project.id.slice(0, 8)}
            </span>
          </div>

          <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl">
            {project.name}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-zinc-400">
            <span className="flex items-center gap-2">
              <MapPin size={16} />
              {project.location}
            </span>

            <span>Client · {project.clientName}</span>
          </div>
        </div>

        <div className="lg:text-right">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-500">
            Project progress
          </p>

          <div className="mt-1 flex items-baseline gap-2 lg:justify-end">
            <span className="text-5xl font-semibold tracking-tight">
              {project.progress}
            </span>

            <span className="text-xl text-zinc-500">%</span>
          </div>

          <p className="mt-2 text-xs text-zinc-500">
            {start} — {end}
          </p>
        </div>
      </div>
    </section>
  );
}
