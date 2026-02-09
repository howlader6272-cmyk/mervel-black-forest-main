import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Package, ShoppingCart, DollarSign, TrendingUp, AlertTriangle } from "lucide-react";

interface Stats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockCount: number;
  recentOrders: Array<{
    id: string;
    customer_name: string;
    total: number;
    status: string;
    created_at: string;
  }>;
  categoryBreakdown: Record<string, number>;
}

const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        supabase.from("products").select("*"),
        supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(10),
      ]);

      const products = productsRes.data || [];
      const orders = ordersRes.data || [];

      const categoryBreakdown: Record<string, number> = {};
      let lowStockCount = 0;
      products.forEach((p: any) => {
        categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + 1;
        if (p.stock < 20) lowStockCount++;
      });

      const totalRevenue = orders.reduce((sum: number, o: any) => sum + Number(o.total || 0), 0);

      setStats({
        totalProducts: products.length,
        totalOrders: orders.length,
        totalRevenue,
        lowStockCount,
        recentOrders: orders.slice(0, 5).map((o: any) => ({
          id: o.id,
          customer_name: o.customer_name,
          total: Number(o.total),
          status: o.status,
          created_at: o.created_at,
        })),
        categoryBreakdown,
      });
    } catch (err) {
      console.error("Failed to fetch stats", err);
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

  if (!stats) return <p className="text-muted-foreground">Failed to load data.</p>;

  const statCards = [
    { label: "Total Products", value: stats.totalProducts, icon: Package, color: "text-blue-400" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingCart, color: "text-emerald-400" },
    { label: "Revenue", value: `৳${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "text-accent" },
    { label: "Low Stock Items", value: stats.lowStockCount, icon: AlertTriangle, color: "text-red-400" },
  ];

  const categoryColors: Record<string, string> = {
    woody: "bg-amber-500/80",
    spicy: "bg-red-500/80",
    floral: "bg-pink-500/80",
    musk: "bg-purple-500/80",
  };

  const totalCategoryProducts = Object.values(stats.categoryBreakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Overview of your store</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-card border border-accent/10 rounded-sm p-4 sm:p-6 hover:border-accent/25 transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <card.icon className={`w-5 h-5 ${card.color} group-hover:scale-110 transition-transform`} />
              <TrendingUp className="w-3 h-3 text-muted-foreground/50" />
            </div>
            <p className="font-serif text-xl sm:text-2xl text-foreground">{card.value}</p>
            <p className="text-muted-foreground text-[10px] sm:text-xs uppercase tracking-wider mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Category Breakdown */}
        <div className="bg-card border border-accent/10 rounded-sm p-4 sm:p-6">
          <h2 className="font-serif text-lg text-foreground mb-4">Category Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown).map(([cat, count]) => {
              const pct = totalCategoryProducts > 0 ? (count / totalCategoryProducts) * 100 : 0;
              return (
                <div key={cat}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize text-foreground">{cat}</span>
                    <span className="text-muted-foreground">{count} products</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${categoryColors[cat] || "bg-accent"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card border border-accent/10 rounded-sm p-4 sm:p-6">
          <h2 className="font-serif text-lg text-foreground mb-4">Recent Orders</h2>
          {stats.recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-2 border-b border-accent/5 last:border-0"
                >
                  <div>
                    <p className="text-sm text-foreground">{order.customer_name}</p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("bn-BD")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-accent">৳{order.total.toLocaleString()}</p>
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-sm ${
                        order.status === "completed"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : order.status === "pending"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
