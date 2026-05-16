import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';
import { User, Shield } from 'lucide-react';

const Settings = () => {
  const { profile, user } = useAdminAuth();
  const [name, setName] = useState(profile?.name || '');

  const updateProfile = async () => {
    if (!user) return;
    await supabase
      .from('admin_profiles')
      .update({ name })
      .eq('user_id', user.id);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your admin profile</p>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Email</label>
            <Input value={profile?.email || ''} disabled className="bg-gray-50 mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1" />
          </div>
          <div>
            <label className="text-sm font-medium">Role</label>
            <Input value={profile?.role || ''} disabled className="bg-gray-50 mt-1" />
          </div>
          <Button onClick={updateProfile} className="bg-blue-600 hover:bg-blue-700">Save Changes</Button>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-600" />
            Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Password management is handled by Supabase Auth. Use the link below to change your password.
          </p>
          <Button
            variant="outline"
            onClick={async () => {
              await supabase.auth.updateUser({ password: prompt('Enter new password:') || '' });
            }}
          >
            Change Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
