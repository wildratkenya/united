import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ProtectedRoute } from "@/components/admin/ProtectedRoute";
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
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route
              path="/admin"
              element={
                <AdminAuthProvider>
                  <ProtectedRoute>
                    <AdminLayout />
                  </ProtectedRoute>
                </AdminAuthProvider>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="subscribers" element={<AdminSubscribers />} />
              <Route path="pricing" element={<AdminPricing />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
