
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import CreateLesson from "./pages/CreateLesson";
import PreviewLesson from "./pages/PreviewLesson";
import History from "./pages/History";
import AdminExercises from "./pages/AdminExercises";
import AdminConstructItems from "./pages/AdminConstructItems";
import AdminSchools from "./pages/AdminSchools";
import AdminEnvironments from "./pages/AdminEnvironments";
import AdminAISettings from "./pages/AdminAISettings";
import AdminPreparationFinish from "./pages/AdminPreparationFinish";
import { initializeDatabaseIfEmpty } from "./services/initData";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    // Initialize database with sample data if needed
    initializeDatabaseIfEmpty();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/exercises" element={<AdminExercises />} />
      <Route path="/admin/exercises/:constructId" element={<AdminConstructItems />} />
      <Route path="/admin/preparation-finish" element={<AdminPreparationFinish />} />
      <Route path="/admin/schools" element={<AdminSchools />} />
      <Route path="/admin/environments" element={<AdminEnvironments />} />
      <Route path="/admin/ai-settings" element={<AdminAISettings />} />
      <Route path="/create-lesson" element={<CreateLesson />} />
      <Route path="/preview-lesson" element={<PreviewLesson />} />
      <Route path="/preview-lesson/:id" element={<PreviewLesson />} />
      <Route path="/history" element={<History />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
