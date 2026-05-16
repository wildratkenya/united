-- Order ID generator for sequential tracking IDs like UDC-2026-0001
CREATE TABLE IF NOT EXISTS public.order_sequences (
  year integer NOT NULL,
  last_number integer NOT NULL DEFAULT 0,
  PRIMARY KEY (year)
);

CREATE OR REPLACE FUNCTION public.generate_order_id()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  current_year integer := EXTRACT(YEAR FROM now());
  next_number integer;
BEGIN
  INSERT INTO public.order_sequences (year, last_number)
  VALUES (current_year, 1)
  ON CONFLICT (year) DO UPDATE SET last_number = order_sequences.last_number + 1
  RETURNING last_number INTO next_number;

  RETURN 'UDC-' || current_year::text || '-' || LPAD(next_number::text, 4, '0');
END;
$$;
