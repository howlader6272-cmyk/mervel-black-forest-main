
-- Drop the broken restrictive INSERT policy
DROP POLICY IF EXISTS "Authenticated users can create orders" ON public.orders;

-- Recreate as PERMISSIVE so both logged-in and guest users can place orders
CREATE POLICY "Anyone can create orders"
ON public.orders
FOR INSERT
WITH CHECK (true);
