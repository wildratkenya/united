import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dcguhloghcabmdnaekhm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZ3VobG9naGNhYm1kbmFla2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5Mzg2ODUsImV4cCI6MjA5NDUxNDY4NX0.cbCagyR3kvKLJpCiaS3BN1WD8q5IoxgHWveL_MfH6uY'
);

const { data, error } = await supabase
  .from('worker_profiles')
  .select('*')
  .limit(1);

if (error) {
  console.log('Error:', error.message);
} else if (data.length > 0) {
  console.log('Columns:', Object.keys(data[0]).join(', '));
} else {
  console.log('No rows but table exists. Columns unknown.');
}
