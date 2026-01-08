import { useRouter } from "next/navigation";

const products = [
  {
    name: "Modern Swing Chair",
    category: "Outdoor",
    price: "$450",
    sold: 124,
    image: "/comfortable-armchair.png",
  },
  {
    name: "Teak Wood Sofa",
    category: "Living Room",
    price: "$1,299",
    sold: 98,
    image: "/comfortable-living-room-sofa.png",
  },
  {
    name: "Office Study Desk",
    category: "Study",
    price: "$320",
    sold: 86,
    image: "/simple-wooden-desk.png",
  },
  {
    name: "Dining Table Set",
    category: "Kitchen",
    price: "$850",
    sold: 65,
    image: "/wooden-dining-table.png",
  },
];

export default function TopProducts() {
  const route = useRouter();
  const navigateAllProducts = () => {
    route.push("/dashboard/products");
  };
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
      <h3 className="text-lg font-bold text-[#2C1810] mb-1">Top Products</h3>
      <p className="text-sm text-gray-500 mb-6">
        Best selling items this month
      </p>

      <div className="space-y-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-2 hover:bg-gray-50 rounded-xl transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden">
              <img
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-[#2C1810] text-sm">
                {product.name}
              </h4>
              <p className="text-xs text-gray-500">{product.category}</p>
            </div>
            <div className="text-right">
              <p className="font-bold text-[#D4A574] text-sm">
                {product.price}
              </p>
              <p className="text-xs text-gray-400">{product.sold} sold</p>
            </div>
          </div>
        ))}
      </div>
      <button
        className="w-full mt-6 py-2.5 text-sm font-medium text-[#2C1810] border border-gray-200 rounded-xl hover:bg-[#2C1810] hover:text-[#D4A574] hover:border-[#2C1810] transition-all duration-300"
        onClick={navigateAllProducts}
      >
        View All Products
      </button>
    </div>
  );
}
