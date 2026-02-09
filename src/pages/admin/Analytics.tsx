import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

interface AnalyticsData {
  categoryData: { name: string; count: number; revenue: number }[];
  stockData: { name: string; stock: number; status: string }[];
  priceRangeData: { range: string; count: number }[];
  totalValue: number;
  avgPrice: number;
  totalStock: number;
}

const COLORS = [
  "hsl(43, 74%, 49%)",    // accent gold
  "hsl(270, 60%, 55%)",   // purple
  "hsl(350, 70%, 55%)",   // rose
  "hsl(160, 60%, 45%)",   // emerald
  "hsl(210, 70%, 55%)",   // blue
];

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const { data: products } = await supabase.from("products").select("*");
      const items = products || [];

      // Category breakdown
      const catMap: Record<string, { count: number; revenue: number }> = {};
      let totalValue = 0;
      let totalPrices = 0;
      let totalStock = 0;

      const priceRanges: Record<string, number> = {
        "Under ৳1500": 0,
        "৳1500 - ৳3000": 0,
        "৳3000 - ৳5000": 0,
        "Over ৳5000": 0,
      };

      items.forEach((p: any) => {
        const cat = p.category || "other";
        const variants = Array.isArray(p.variants) ? p.variants : [];
        const minPrice = variants.length > 0 ? Math.min(...variants.map((v: any) => v.price)) : 0;
        const maxPrice = variants.length > 0 ? Math.max(...variants.map((v: any) => v.price)) : 0;
        
        if (!catMap[cat]) catMap[cat] = { count: 0, revenue: 0 };
        catMap[cat].count++;
        catMap[cat].revenue += maxPrice * (p.stock || 0);
        totalValue += maxPrice * (p.stock || 0);
        totalPrices += minPrice;
        totalStock += p.stock || 0;

        if (minPrice < 1500) priceRanges["Under ৳1500"]++;
        else if (minPrice < 3000) priceRanges["৳1500 - ৳3000"]++;
        else if (minPrice < 5000) priceRanges["৳3000 - ৳5000"]++;
        else priceRanges["Over ৳5000"]++;
      });

      const categoryData = Object.entries(catMap).map(([name, v]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        count: v.count,
        revenue: v.revenue,
      }));

      const stockData = items
        .map((p: any) => ({
          name: p.name,
          stock: p.stock || 0,
          status: (p.stock || 0) < 20 ? "critical" : (p.stock || 0) < 50 ? "low" : "good",
        }))
        .sort((a: any, b: any) => a.stock - b.stock)
        .slice(0, 10);

      const priceRangeData = Object.entries(priceRanges).map(([range, count]) => ({ range, count }));

      setData({
        categoryData,
        stockData,
        priceRangeData,
        totalValue,
        avgPrice: items.length > 0 ? Math.round(totalPrices / items.length) : 0,
        totalStock,
      });
    } catch (err) {
      console.error("Analytics error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) return <p className="text-muted-foreground">Failed to load analytics.</p>;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="bg-card border border-accent/20 rounded-sm p-3 shadow-lg">
        <p className="text-foreground text-sm font-semibold">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: p.color }}>
            {p.name}: {typeof p.value === "number" ? p.value.toLocaleString() : p.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Analytics</h1>
        <p className="text-muted-foreground text-sm mt-1">Inventory & product insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-card border border-accent/10 rounded-sm p-4 sm:p-6">
          <p className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider">Inventory Value</p>
          <p className="font-serif text-xl sm:text-2xl text-accent mt-1">৳{data.totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-accent/10 rounded-sm p-4 sm:p-6">
          <p className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider">Avg Base Price</p>
          <p className="font-serif text-xl sm:text-2xl text-foreground mt-1">৳{data.avgPrice.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-accent/10 rounded-sm p-4 sm:p-6">
          <p className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider">Total Stock</p>
          <p className="font-serif text-xl sm:text-2xl text-foreground mt-1">{data.totalStock.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Category Pie Chart */}
        <div className="bg-card border border-accent/10 rounded-sm p-4 sm:p-6">
          <h2 className="font-serif text-lg text-foreground mb-4">Products by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="count"
                  nameKey="name"
                  label={({ name, count }) => `${name} (${count})`}
                  labelLine={false}
                >
                  {data.categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Price Range Bar Chart */}
        <div className="bg-card border border-accent/10 rounded-sm p-4 sm:p-6">
          <h2 className="font-serif text-lg text-foreground mb-4">Price Distribution</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.priceRangeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 15%, 88%)" />
                <XAxis dataKey="range" tick={{ fontSize: 11, fill: "hsl(270, 10%, 42%)" }} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(270, 10%, 42%)" }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="hsl(43, 74%, 49%)" radius={[4, 4, 0, 0]} name="Products" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stock Level Area Chart */}
        <div className="bg-card border border-accent/10 rounded-sm p-4 sm:p-6 lg:col-span-2">
          <h2 className="font-serif text-lg text-foreground mb-4">Stock Levels (Lowest 10)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.stockData}>
                <defs>
                  <linearGradient id="stockGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(43, 74%, 49%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(270, 15%, 88%)" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(270, 10%, 42%)" }} angle={-20} textAnchor="end" height={60} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(270, 10%, 42%)" }} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="stock"
                  stroke="hsl(43, 74%, 49%)"
                  fill="url(#stockGrad)"
                  strokeWidth={2}
                  name="Stock"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
