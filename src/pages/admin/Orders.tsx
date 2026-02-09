import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Eye, X, Bell } from "lucide-react";

interface Order {
  id: string;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  items: any[];
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  shipping_address: string | null;
  notes: string | null;
  created_at: string;
}

const statusOptions = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [newOrderIds, setNewOrderIds] = useState<Set<string>>(new Set());

  const parseOrder = (o: any): Order => ({
    ...o,
    subtotal: Number(o.subtotal),
    discount: Number(o.discount),
    total: Number(o.total),
    items: Array.isArray(o.items) ? o.items : [],
  });

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load orders");
      console.error(error);
    } else {
      setOrders((data || []).map(parseOrder));
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();

    // Subscribe to real-time order changes
    const channel = supabase
      .channel("admin-orders-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          const newOrder = parseOrder(payload.new);
          setOrders((prev) => [newOrder, ...prev]);
          setNewOrderIds((prev) => new Set(prev).add(newOrder.id));
          toast.success(`🔔 New order from ${newOrder.customer_name}!`, {
            description: `৳${newOrder.total.toLocaleString()}`,
            duration: 6000,
          });
          // Play notification sound
          try {
            const audio = new Audio("data:audio/wav;base64,UklGRl9vT19teleGluZQBNb25vABAAgA+AAAIAZGF0YU" + "tvT19XQVZFZm10IBIAAAABAAEAgD4AAIA+AAABAAgATElTVBoAAABJTkZPSVNGVA4AAABMYXZmNTguMjkuMTAwAGRhdGFRAAAAgICAgICAgICAgICAgIA=");
            audio.volume = 0.3;
            audio.play().catch(() => {});
          } catch {}
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        (payload) => {
          const updated = parseOrder(payload.new);
          setOrders((prev) =>
            prev.map((o) => (o.id === updated.id ? updated : o))
          );
          if (selectedOrder?.id === updated.id) {
            setSelectedOrder(updated);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "orders" },
        (payload) => {
          const deletedId = (payload.old as any).id;
          setOrders((prev) => prev.filter((o) => o.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateStatus = async (orderId: string, newStatus: string) => {
    const { error } = await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
    }
  };

  const filtered = statusFilter === "all" ? orders : orders.filter((o) => o.status === statusFilter);

  const statusColor = (s: string) => {
    switch (s) {
      case "pending": return "bg-amber-500/15 text-amber-400";
      case "confirmed": return "bg-blue-500/15 text-blue-400";
      case "shipped": return "bg-purple-500/15 text-purple-400";
      case "delivered": return "bg-emerald-500/15 text-emerald-400";
      case "cancelled": return "bg-red-500/15 text-red-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const pendingCount = orders.filter((o) => o.status === "pending").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl text-foreground">Orders</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {orders.length} total orders
            {pendingCount > 0 && (
              <span className="ml-2 text-amber-400">• {pendingCount} pending</span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bell className="w-5 h-5 text-accent" />
            {newOrderIds.size > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                {newOrderIds.size}
              </span>
            )}
          </div>
          <span className="text-xs text-emerald-400 flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {["all", ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 text-xs uppercase tracking-wider rounded-sm border transition-all ${
              statusFilter === s
                ? "border-accent/30 bg-accent/15 text-accent"
                : "border-accent/10 text-muted-foreground hover:text-foreground"
            }`}
          >
            {s === "all" ? "All" : s}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <p className="text-muted-foreground text-sm py-8 text-center">No orders found.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => {
            const isNew = newOrderIds.has(order.id);
            return (
              <div
                key={order.id}
                className={`bg-card border rounded-sm p-4 hover:border-accent/20 transition-all ${
                  isNew
                    ? "border-accent/40 ring-1 ring-accent/20 animate-[pulse_2s_ease-in-out_1]"
                    : "border-accent/10"
                }`}
                onClick={() => isNew && setNewOrderIds((prev) => {
                  const next = new Set(prev);
                  next.delete(order.id);
                  return next;
                })}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {isNew && (
                        <span className="text-[9px] bg-accent/20 text-accent px-1.5 py-0.5 rounded-sm uppercase tracking-wider font-bold animate-pulse">
                          New
                        </span>
                      )}
                      <h3 className="text-foreground font-semibold text-sm">{order.customer_name}</h3>
                      <span className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-sm ${statusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-1 flex-wrap text-xs text-muted-foreground">
                      <span>{new Date(order.created_at).toLocaleDateString("en-GB")}</span>
                      {order.customer_phone && <span>{order.customer_phone}</span>}
                      <span className="text-accent font-semibold">৳{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className="bg-input border border-accent/10 rounded-sm px-2 py-1.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-muted-foreground hover:text-accent transition-colors bg-muted/30 rounded-sm"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-accent/15 rounded-sm w-full max-w-lg my-8 p-5 sm:p-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-xl text-foreground">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Customer</span>
                  <p className="text-foreground">{selectedOrder.customer_name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Email</span>
                  <p className="text-foreground">{selectedOrder.customer_email || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Phone</span>
                  <p className="text-foreground">{selectedOrder.customer_phone || "N/A"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Date</span>
                  <p className="text-foreground">{new Date(selectedOrder.created_at).toLocaleString("en-GB")}</p>
                </div>
              </div>

              {selectedOrder.shipping_address && (
                <div>
                  <span className="text-muted-foreground text-xs uppercase">Address</span>
                  <p className="text-foreground">{selectedOrder.shipping_address}</p>
                </div>
              )}

              <div className="border-t border-accent/10 pt-3">
                <span className="text-muted-foreground text-xs uppercase">Items</span>
                <div className="space-y-2 mt-2">
                  {selectedOrder.items.map((item: any, i: number) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-foreground">
                        {item.name || item.product?.name || "Item"} × {item.quantity || 1}
                      </span>
                      <span className="text-accent">৳{(item.price || item.variant?.price || 0).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-accent/10 pt-3 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground">৳{selectedOrder.subtotal.toLocaleString()}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-emerald-400">Discount</span>
                    <span className="text-emerald-400">-৳{selectedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-base pt-1">
                  <span className="text-foreground">Total</span>
                  <span className="text-accent">৳{selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;
