import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://dcguhloghcabmdnaekhm.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZ3VobG9naGNhYm1kbmFla2htIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5Mzg2ODUsImV4cCI6MjA5NDUxNDY4NX0.cbCagyR3kvKLJpCiaS3BN1WD8q5IoxgHWveL_MfH6uY'
);

// Try to select the new columns
const { data, error } = await supabase
  .from('worker_profiles')
  .select('location_type, location_name')
  .limit(1);

if (error) {
  if (error.message?.includes('column')) {
    console.log('COLUMNS_MISSING');
  } else {
    console.log('OTHER_ERROR:', error.message);
  }
} else {
  console.log('COLUMNS_EXIST', JSON.stringify(data));
}
