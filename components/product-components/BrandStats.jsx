"use client";

export default function BrandStats() {
  const stats = [
    { value: "2M+", label: "Garments Produced" },
    { value: "150+", label: "Countries Shipped" },
    { value: "11", label: "Exclusive Stores" },
    { value: "100%", label: "Fit Guarantee" },
  ];

  return (
    <div className="mt-16 bg-gray-50 rounded-lg p-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="text-center">
            <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
