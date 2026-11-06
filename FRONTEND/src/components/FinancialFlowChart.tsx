'use client';

import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';

interface FlowDataItem {
  step: string;
  fullName: string;
  amount: number;
}

interface FinancialFlowChartProps {
  flowData?: FlowDataItem[];
}

export default function FinancialFlowChart({ flowData }: FinancialFlowChartProps) {
  const data = flowData && flowData.length > 0 ? flowData : [];

  if (data.length === 0) {
    return (
      <div className="w-full p-5 rounded-2xl border border-[rgba(20,20,22,0.1)] bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 text-xs">
          <span className="text-[var(--soft)] uppercase tracking-wider text-[11px]">
            Laundering Dispersal Flow (₹ Lakhs)
          </span>
        </div>
        <div className="py-8 text-center space-y-2">
          <div className="text-3xl">💸</div>
          <p className="text-xs font-medium text-[var(--ink)]">No Financial Flow Data Yet</p>
          <p className="text-[11px] text-[var(--soft)] max-w-xs mx-auto">
            Upload financial evidence (bank statements, UPI logs) to auto-generate the dispersal flow analysis.
          </p>
        </div>
      </div>
    );
  }

  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="w-full p-5 rounded-2xl border border-[rgba(20,20,22,0.1)] bg-white shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-4 text-xs">
        <span className="text-[var(--soft)] uppercase tracking-wider text-[11px]">
          Laundering Dispersal Flow (₹ Lakhs)
        </span>
        <span className="text-[var(--ink)] font-medium">
          ₹{totalAmount.toFixed(1)} Lakh Total Flow Traced
        </span>
      </div>

      <ResponsiveContainer width="100%" height={170}>
        <BarChart data={data} margin={{ top: 8, right: 10, left: -22, bottom: 4 }}>
          <XAxis
            dataKey="step"
            tick={{ fill: '#55555a', fontSize: 11, fontFamily: 'var(--font-inter), sans-serif' }}
            axisLine={{ stroke: 'rgba(20, 20, 22, 0.12)' }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#55555a', fontSize: 11, fontFamily: 'var(--font-inter), sans-serif' }}
            axisLine={{ stroke: 'rgba(20, 20, 22, 0.12)' }}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#ffffff',
              borderColor: 'rgba(20, 20, 22, 0.15)',
              borderRadius: '12px',
              color: '#141416',
              fontSize: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              fontFamily: 'var(--font-inter), sans-serif',
            }}
            formatter={(value: any, _name: any, item: any) => [
              `₹${value} Lakhs (${item.payload.fullName})`,
              'Amount',
            ]}
          />
          <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => {
              const fill =
                index === 0
                  ? '#141416'
                  : index === data.length - 1
                  ? 'rgba(20, 20, 22, 0.75)'
                  : 'rgba(20, 20, 22, 0.35)';
              return <Cell key={`cell-${index}`} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
