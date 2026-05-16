import { supabase } from './supabase';

type AuditAction =
  | 'admin_login'
  | 'worker_login'
  | 'order_created'
  | 'order_advanced'
  | 'order_moved_back'
  | 'order_assigned'
  | 'order_edited'
  | 'worker_created'
  | 'worker_deactivated'
  | 'admin_logout'
  | 'worker_logout';

interface AuditEntry {
  userId?: string;
  userEmail?: string;
  userName?: string;
  action: AuditAction;
  entityType?: string;
  entityId?: string;
  details?: Record<string, unknown>;
}

export async function logAudit(entry: AuditEntry) {
  try {
    const { error } = await supabase.from('audit_logs').insert({
      user_id: entry.userId || null,
      user_email: entry.userEmail || null,
      user_name: entry.userName || null,
      action: entry.action,
      entity_type: entry.entityType || null,
      entity_id: entry.entityId || null,
      details: entry.details || null,
    });
    if (error) console.warn('Audit log insert failed:', error.message);
  } catch (err) {
    console.warn('Audit log error:', err);
  }
}
