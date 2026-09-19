"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { formatDateShort } from "@/lib/format";

export function SpendingOverTimeChart({
  data,
}: {
  data: { date: string; cumulative: number }[];
}) {
  const chartData = data.map((d) => ({ date: formatDateShort(d.date), cumulative: d.cumulative }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-brand)" stopOpacity={0.25} />
            <stop offset="100%" stopColor="var(--color-brand)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-hair)" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
          axisLine={{ stroke: "var(--color-border-hair)" }}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
          width={40}
        />
        <Tooltip
          formatter={(value) => [`${Number(value).toLocaleString()} DA`, "Cumulative spend"]}
          contentStyle={{
            fontSize: 12,
            border: "1px solid var(--color-border-hair)",
            borderRadius: 4,
            boxShadow: "none",
          }}
        />
        <Area type="monotone" dataKey="cumulative" stroke="var(--color-brand)" strokeWidth={2} fill="url(#spendGradient)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
