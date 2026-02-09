
-- Create a function to auto-assign admin role to specific email
CREATE OR REPLACE FUNCTION public.auto_assign_admin()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'rafim6172@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger that runs after the default user role trigger
CREATE TRIGGER on_auth_user_created_admin_check
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.auto_assign_admin();
