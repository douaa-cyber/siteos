"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { categoryLabel } from "@/lib/format";

export function SpendingByCategoryChart({
  data,
}: {
  data: { category: string; amount: number }[];
}) {
  const chartData = data.map((d) => ({ name: categoryLabel(d.category), amount: d.amount }));

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-hair)" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
          axisLine={{ stroke: "var(--color-border-hair)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${(v / 1_000_000).toFixed(1)}M`}
          width={40}
        />
        <Tooltip
          formatter={(value) => [`${Number(value).toLocaleString()} DA`, "Spent"]}
          contentStyle={{
            fontSize: 12,
            border: "1px solid var(--color-border-hair)",
            borderRadius: 4,
            boxShadow: "none",
          }}
        />
        <Bar dataKey="amount" fill="var(--color-brand)" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
