import { ArrowUpRight, TrendingUp, Wallet } from "@/components/ui/Icons";

interface StatCardProps {
  label: string;
  value: string;
  description: string;
  type: "budget" | "spent" | "remaining" | "progress";
}

export default function StatCard({
  label,
  value,
  description,
  type,
}: StatCardProps) {
  const icons = {
    budget: <Wallet size={20} />,
    spent: <TrendingUp size={20} />,
    remaining: <Wallet size={20} />,
    progress: <ArrowUpRight size={20} />,
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-xl hover:shadow-zinc-200/40">
      <div className="mb-7 flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-100 text-zinc-700 transition-colors group-hover:bg-zinc-900 group-hover:text-white">
          {icons[type]}
        </div>

        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-400">
          {label}
        </span>
      </div>

      <div>
        <p className="text-2xl font-semibold tracking-tight text-zinc-950">
          {value}
        </p>

        <p className="mt-1 text-sm text-zinc-500">{description}</p>
      </div>
    </div>
  );
}
