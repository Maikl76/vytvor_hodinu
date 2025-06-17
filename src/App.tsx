
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import CreateLesson from './pages/CreateLesson';
import History from './pages/History';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminAISettings from './pages/AdminAISettings';
import AdminSchools from './pages/AdminSchools';
import AdminConstructItems from './pages/AdminConstructItems';
import AdminExercises from './pages/AdminExercises';
import AdminEnvironments from './pages/AdminEnvironments';
import AdminPreparationFinish from './pages/AdminPreparationFinish';
import PreviewLesson from './pages/PreviewLesson';
import CreateWeeklyPlan from './pages/CreateWeeklyPlan';
import WeeklyPlan from './pages/WeeklyPlan';
import WeeklyPlansHistory from './pages/WeeklyPlansHistory';
import WeeklyPlanGenerator from './pages/WeeklyPlanGenerator';
import FavoriteExercises from './pages/FavoriteExercises';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/create-lesson" element={<CreateLesson />} />
        <Route path="/create-weekly-plan" element={<CreateWeeklyPlan />} />
        <Route path="/weekly-plans-history" element={<WeeklyPlansHistory />} />
        <Route path="/weekly-plan/:id" element={<WeeklyPlan />} />
        <Route path="/weekly-plan-generator/:id" element={<WeeklyPlanGenerator />} />
        <Route path="/generate-weekly-plan/:id" element={<WeeklyPlanGenerator />} />
        <Route path="/history" element={<History />} />
        <Route path="/preview-lesson" element={<PreviewLesson />} />
        <Route path="/preview-lesson/:id" element={<PreviewLesson />} />
        <Route path="/favorite-exercises" element={<FavoriteExercises />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/ai-settings" element={<AdminAISettings />} />
        <Route path="/admin/schools" element={<AdminSchools />} />
        <Route path="/admin/construct-items/:constructId" element={<AdminConstructItems />} />
        <Route path="/admin/exercises" element={<AdminExercises />} />
        <Route path="/admin/environments" element={<AdminEnvironments />} />
        <Route path="/admin/preparation-finish" element={<AdminPreparationFinish />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
