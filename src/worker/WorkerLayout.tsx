import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useWorkerAuth } from '@/contexts/WorkerAuthContext';
import { HardHat, LayoutDashboard, ListTodo, ClipboardList, LogOut, Menu, X, PlusCircle } from 'lucide-react';
import { useState } from 'react';

const stationColors: Record<string, string> = {
  intake: 'bg-blue-500', washing: 'bg-purple-500', drying: 'bg-indigo-500',
  pressing: 'bg-orange-500', packaging: 'bg-pink-500', delivery: 'bg-green-500',
  supervisor: 'bg-amber-500',
};

const navItems = [
  { to: '/worker', icon: LayoutDashboard, label: 'Kanban', end: true },
  { to: '/worker/create-order', icon: PlusCircle, label: 'New Order' },
  { to: '/worker/queue', icon: ListTodo, label: 'My Queue' },
  { to: '/worker/orders', icon: ClipboardList, label: 'All Orders' },
];

const WorkerLayout = () => {
  const { profile, logout } = useWorkerAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/worker/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <header className="sticky top-0 z-50 bg-[#0f1828] text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-3 sm:px-6">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <button className="sm:hidden p-1.5" onClick={() => setOpen(!open)}>
                {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#EE6633] to-[#d45522] flex items-center justify-center">
                  <HardHat className="w-4 h-4 text-white" />
                </div>
                <div className="hidden sm:block">
                  <div className="text-sm font-bold leading-tight">UDC</div>
                  <div className="text-[10px] text-slate-400 leading-tight">Worker Portal</div>
                </div>
              </div>
            </div>

            <nav className="hidden sm:flex items-center gap-1">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                      isActive ? 'bg-white/15 text-white' : 'text-slate-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {profile && (
                <div className="hidden sm:flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${stationColors[profile.stations?.[0]] || 'bg-slate-500'}`} />
                  <span className="text-slate-300">{profile.name}</span>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-white/10 transition"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {open && (
          <div className="sm:hidden border-t border-white/10">
            {navItems.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 text-sm font-medium border-l-2 transition ${
                    isActive ? 'bg-white/10 text-white border-[#EE6633]' : 'text-slate-300 border-transparent'
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
            {profile && (
              <div className="px-4 py-3 text-xs text-slate-400 border-t border-white/10 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${stationColors[profile.stations?.[0]] || 'bg-slate-500'}`} />
                {profile.name} • {profile.stations?.join(', ') || 'no station'}
              </div>
            )}
          </div>
        )}
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        <Outlet />
      </main>
    </div>
  );
};

export default WorkerLayout;
