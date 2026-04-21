"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

type Row = { month: string; 로열티: number; 앱교재비: number };

export default function RoyaltyChart({ data }: { data: Row[] }) {
  return (
    <div className="h-[260px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <defs>
            <linearGradient id="royaltyG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="bookG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ec4899" stopOpacity={0.7} />
              <stop offset="100%" stopColor="#ec4899" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#e2e8f0"
            vertical={false}
          />
          <XAxis dataKey="month" tick={{ fontSize: 10 }} />
          <YAxis
            tick={{ fontSize: 10 }}
            tickFormatter={(v) =>
              v >= 10000 ? `${(v / 10000).toFixed(1)}억` : `${v / 1000}천`
            }
          />
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 8 }}
            formatter={(v) => [`${Number(v).toLocaleString()}만원`, ""]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11 }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            type="monotone"
            dataKey="로열티"
            stroke="#7c3aed"
            strokeWidth={2}
            fill="url(#royaltyG)"
            stackId="1"
          />
          <Area
            type="monotone"
            dataKey="앱교재비"
            stroke="#ec4899"
            strokeWidth={2}
            fill="url(#bookG)"
            stackId="1"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
