import { Package, Truck, CheckCircle2, Clock, XCircle, MapPin } from "lucide-react";

interface TrackedOrder {
  id: string;
  short_id: string;
  customer_name: string;
  items: { name: string; volume: string; quantity: number; image: string | null }[];
  subtotal: number;
  discount: number;
  total: number;
  status: string;
  shipping_address: string | null;
  created_at: string;
}

const statusSteps = ["pending", "confirmed", "shipped", "delivered"];

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  pending: { label: "Pending", icon: Clock, color: "text-amber-400" },
  confirmed: { label: "Confirmed", icon: Package, color: "text-blue-400" },
  shipped: { label: "Shipped", icon: Truck, color: "text-purple-400" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-emerald-400" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-red-400" },
};

const OrderTrackCard = ({ order }: { order: TrackedOrder }) => {
  const currentStepIndex = statusSteps.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="space-y-6">
      {/* Order Header */}
      <div className="bg-card/50 border border-accent/10 rounded-sm p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest">Order ID</p>
            <p className="font-serif text-lg text-accent font-semibold">#{order.short_id}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest">Date</p>
            <p className="text-foreground text-sm">
              {new Date(order.created_at).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest">Customer</p>
            <p className="text-foreground text-sm">{order.customer_name}</p>
          </div>
          <div className="text-right">
            <p className="text-muted-foreground text-[10px] uppercase tracking-widest">Total</p>
            <p className="font-serif text-xl text-accent font-semibold">৳{order.total.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Status Tracker */}
      <div className="bg-card/50 border border-accent/10 rounded-sm p-5 sm:p-6">
        <h3 className="font-serif text-lg text-foreground mb-5">Order Status</h3>

        {isCancelled ? (
          <div className="flex items-center justify-center gap-3 py-4">
            <XCircle className="w-8 h-8 text-destructive" />
            <span className="text-destructive font-semibold uppercase tracking-wider text-sm">
              Order Cancelled
            </span>
          </div>
        ) : (
          <div className="relative">
            <div className="absolute left-[17px] top-[18px] bottom-[18px] w-[2px] bg-accent/10 rounded-full" />

            {currentStepIndex > 0 && (
              <div
                className="absolute left-[17px] top-[18px] w-[2px] rounded-full status-line-flow transition-all duration-1000 ease-out"
                style={{
                  height: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%`,
                  maxHeight: "calc(100% - 36px)",
                }}
              />
            )}

            {currentStepIndex > 0 && currentStepIndex < statusSteps.length - 1 && (
              <div
                className="absolute left-[15px] w-[6px]"
                style={{
                  top: `${((currentStepIndex - 1) / (statusSteps.length - 1)) * 100}%`,
                  height: `${(1 / (statusSteps.length - 1)) * 100}%`,
                }}
              >
                <span className="status-fly-dot" />
              </div>
            )}

            <div className="space-y-8">
              {statusSteps.map((step, i) => {
                const config = statusConfig[step];
                const isActive = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                const Icon = config.icon;

                return (
                  <div
                    key={step}
                    className="flex items-center gap-4 relative status-step-enter"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <div
                      className={`relative w-[36px] h-[36px] rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all duration-500 ${
                        isActive
                          ? "border-accent bg-accent/20"
                          : "border-accent/15 bg-card"
                      } ${isCurrent ? "status-current-glow status-current-ping" : ""} ${
                        isActive && !isCurrent ? "status-check-pop" : ""
                      }`}
                      style={isActive && !isCurrent ? { animationDelay: `${i * 150 + 200}ms` } : undefined}
                    >
                      {isActive ? (
                        <Icon className="w-4 h-4 text-accent" />
                      ) : (
                        <Icon className="w-4 h-4 text-muted-foreground/30" />
                      )}
                    </div>

                    <div>
                      <p className={`text-sm font-semibold transition-colors duration-300 ${
                        isActive ? "text-foreground" : "text-muted-foreground/40"
                      }`}>
                        {config.label}
                      </p>
                      {isCurrent && (
                        <p className="text-xs text-accent mt-0.5 animate-pulse font-medium">
                          Current status
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-card/50 border border-accent/10 rounded-sm p-5 sm:p-6">
        <h3 className="font-serif text-lg text-foreground mb-4">Items</h3>
        <div className="space-y-3">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-12 h-14 bg-muted/20 rounded-sm border border-accent/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {item.image ? (
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="font-serif text-accent/40 text-xs">M</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-foreground text-sm font-medium truncate">{item.name}</p>
                <p className="text-muted-foreground text-xs">{item.volume} · Qty: {item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-accent/10 mt-4 pt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="text-foreground">৳{order.subtotal.toLocaleString()}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between">
              <span className="text-emerald-400">Discount</span>
              <span className="text-emerald-400">-৳{order.discount.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between font-bold pt-1">
            <span className="text-foreground">Total</span>
            <span className="text-accent">৳{order.total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shipping_address && (
        <div className="bg-card/50 border border-accent/10 rounded-sm p-5 sm:p-6">
          <h3 className="font-serif text-lg text-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-accent" />
            Shipping Address
          </h3>
          <p className="text-foreground text-sm leading-relaxed">{order.shipping_address}</p>
        </div>
      )}
    </div>
  );
};

export default OrderTrackCard;
