import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
import { WorkerAuthProvider } from "@/contexts/WorkerAuthContext";
import { ProtectedWorkerRoute } from "@/components/worker/ProtectedWorkerRoute";
import PageLayout from "@/components/layout/PageLayout";
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ServicesPage from "./pages/ServicesPage";
import BranchesPage from "./pages/BranchesPage";
import ContactPage from "./pages/ContactPage";
import TrackOrderPage from "./pages/TrackOrderPage";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./admin/Login";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/Dashboard";
import AdminOrders from "./admin/Orders";
import AdminSubscribers from "./admin/Subscribers";
import AdminPricing from "./admin/Pricing";
import AdminSettings from "./admin/Settings";
import AdminSetup from "./admin/Setup";
import AdminWorkerSetup from "./admin/WorkerSetup";
import WorkerLogin from "./worker/Login";
import WorkerSetup from "./worker/Setup";
import WorkerLayout from "./worker/WorkerLayout";
import WorkerDashboard from "./worker/Dashboard";
import WorkerMyQueue from "./worker/MyQueue";
import WorkerOrders from "./worker/Orders";
import WorkerCreateOrder from "./worker/CreateOrder";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider defaultTheme="light">
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<PageLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/services" element={<ServicesPage />} />
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/track" element={<TrackOrderPage />} />
              <Route path="/pricing" element={<PricingPage />} />
            </Route>
            <Route path="/admin" element={<AdminAuthProvider><Outlet /></AdminAuthProvider>}>
              <Route path="login" element={<AdminLogin />} />
              <Route path="setup" element={<AdminSetup />} />
              <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="orders" element={<AdminOrders />} />
                <Route path="subscribers" element={<AdminSubscribers />} />
                <Route path="pricing" element={<AdminPricing />} />
                <Route path="workers/setup" element={<AdminWorkerSetup />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Route>
            <Route path="/worker" element={<WorkerAuthProvider><Outlet /></WorkerAuthProvider>}>
              <Route path="login" element={<WorkerLogin />} />
              <Route path="setup" element={<WorkerSetup />} />
              <Route element={<ProtectedWorkerRoute><WorkerLayout /></ProtectedWorkerRoute>}>
                <Route index element={<WorkerDashboard />} />
                <Route path="create-order" element={<WorkerCreateOrder />} />
                <Route path="queue" element={<WorkerMyQueue />} />
                <Route path="orders" element={<WorkerOrders />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
