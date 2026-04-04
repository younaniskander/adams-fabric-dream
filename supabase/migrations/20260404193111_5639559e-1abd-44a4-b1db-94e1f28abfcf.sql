
-- 1. Add explicit restrictive policies on user_roles to prevent privilege escalation
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. Replace overly permissive customers INSERT policy with field validation
DROP POLICY IF EXISTS "Anyone can register as customer" ON public.customers;
CREATE POLICY "Anyone can register as customer"
ON public.customers
FOR INSERT
TO public
WITH CHECK (
  name IS NOT NULL AND length(trim(name)) > 0 AND length(name) <= 100
  AND phone IS NOT NULL AND length(trim(phone)) > 0 AND length(phone) <= 20
  AND image_url IS NULL
);

-- 3. Replace overly permissive messages INSERT policy with field validation
DROP POLICY IF EXISTS "Anyone can send messages" ON public.messages;
CREATE POLICY "Anyone can send messages"
ON public.messages
FOR INSERT
TO public
WITH CHECK (
  name IS NOT NULL AND length(trim(name)) > 0 AND length(name) <= 100
  AND message IS NOT NULL AND length(trim(message)) > 0 AND length(message) <= 2000
  AND (phone IS NULL OR length(phone) <= 20)
  AND is_read = false
);

-- 4. Make customer-images bucket private
UPDATE storage.buckets SET public = false WHERE id = 'customer-images';
