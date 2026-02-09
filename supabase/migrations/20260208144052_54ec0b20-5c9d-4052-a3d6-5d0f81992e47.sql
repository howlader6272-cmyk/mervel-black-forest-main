
-- Fix permissive INSERT policy on orders
DROP POLICY "Anyone can create orders" ON public.orders;

CREATE POLICY "Authenticated users can create orders"
  ON public.orders FOR INSERT
  TO authenticated
  WITH CHECK (true);
