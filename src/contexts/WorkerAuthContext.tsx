import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';
import { logAudit } from '@/lib/audit';

interface WorkerProfile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  stations: string[];
}

interface WorkerAuthContextType {
  user: User | null;
  session: Session | null;
  profile: WorkerProfile | null;
  loading: boolean;
  login: (email: string, password: string, options?: { captchaToken?: string }) => Promise<string | null>;
  logout: () => Promise<void>;
  isWorker: boolean;
}

const WorkerAuthContext = createContext<WorkerAuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  login: async () => null,
  logout: async () => {},
  isWorker: false,
});

export const useWorkerAuth = () => useContext(WorkerAuthContext);

export const WorkerAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<WorkerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('worker_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    setProfile(data as WorkerProfile | null);
    setLoading(false);
  };

  const login = async (email: string, password: string, opts?: { captchaToken?: string }): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password, options: { captchaToken: opts?.captchaToken } });
    if (error) return error.message;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'Login failed';

    const { data: workerProfile } = await supabase
      .from('worker_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!workerProfile) {
      await supabase.auth.signOut();
      return 'Access denied: Worker account not found';
    }

    if (!workerProfile.is_active) {
      await supabase.auth.signOut();
      return 'Account is deactivated. Contact supervisor.';
    }

    logAudit({
      action: 'worker_login',
      userId: user.id,
      userEmail: user.email || email,
      userName: workerProfile.name || email,
      details: { stations: workerProfile.stations },
    });

    return null;
  };

  const logout = async () => {
    logAudit({
      action: 'worker_logout',
      userId: user?.id,
      userEmail: user?.email || undefined,
      userName: profile?.name || undefined,
    });
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <WorkerAuthContext.Provider
      value={{ user, session, profile, loading, login, logout, isWorker: !!profile }}
    >
      {children}
    </WorkerAuthContext.Provider>
  );
};
