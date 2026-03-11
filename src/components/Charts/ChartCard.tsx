import React from "react";

interface Props {
  title: string;
  children: React.ReactNode;
}

export default function ChartCard({ title, children }: Props) {
  return (
    <div className="bg-white border border-healthcare-border rounded-md p-6">
      <h3 className="text-lg font-bold text-healthcare-text mb-4">
        {title}
      </h3>

      <div className="h-72">{children}</div>
    </div>
  );
}