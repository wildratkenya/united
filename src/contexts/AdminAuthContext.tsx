import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Session } from '@supabase/supabase-js';

interface AdminProfile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: string;
}

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  profile: AdminProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
  isAdmin: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  login: async () => null,
  logout: async () => {},
  isAdmin: false,
});

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id, session.user.email!);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) fetchProfile(session.user.id, session.user.email!);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string, email: string) => {
    const { data } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (data) {
      setProfile(data as AdminProfile);
    } else {
      setProfile(null);
    }
    setLoading(false);
  };

  const login = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return error.message;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'Login failed';

    const { data: adminProfile } = await supabase
      .from('admin_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!adminProfile) {
      await supabase.auth.signOut();
      return 'Access denied: Admin account not found';
    }

    return null;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AdminAuthContext.Provider
      value={{ user, session, profile, loading, login, logout, isAdmin: !!profile }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};
