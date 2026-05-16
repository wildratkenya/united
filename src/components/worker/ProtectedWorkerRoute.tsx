import { Navigate } from 'react-router-dom';
import { useWorkerAuth } from '@/contexts/WorkerAuthContext';

export const ProtectedWorkerRoute = ({ children }: { children: React.ReactNode }) => {
  const { isWorker, loading } = useWorkerAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f1828]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#EE6633] border-t-transparent" />
          <p className="text-sm text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isWorker) return <Navigate to="/worker/login" replace />;
  return <>{children}</>;
};
