
-- Grant necessary permissions on orders table
GRANT SELECT, INSERT ON public.orders TO anon;
GRANT SELECT, INSERT ON public.orders TO authenticated;
GRANT UPDATE ON public.orders TO authenticated;
