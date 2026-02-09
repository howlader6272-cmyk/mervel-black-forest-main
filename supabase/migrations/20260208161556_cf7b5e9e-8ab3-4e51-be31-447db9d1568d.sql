
-- Fix SELECT policies: drop RESTRICTIVE ones and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;

-- Recreate as PERMISSIVE
CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own orders"
ON public.orders
FOR SELECT
USING (user_id = auth.uid());
