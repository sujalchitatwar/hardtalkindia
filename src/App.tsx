import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Stories from './pages/Stories';
import StoryDetail from './pages/StoryDetail';
import VideoHub from './pages/VideoHub';
import SubmitStory from './pages/SubmitStory';
import About from './pages/About';
import Newsletter from './pages/Newsletter';
import Donate from './pages/Donate';
import Contact from './pages/Contact';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import StoriesManager from './pages/admin/StoriesManager';
import SubmissionsManager from './pages/admin/SubmissionsManager';
import ReelsManager from './pages/admin/ReelsManager';
import SubscribersManager from './pages/admin/SubscribersManager';
import Analytics from './pages/admin/Analytics';
import Settings from './pages/admin/Settings';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/story/:slug" element={<StoryDetail />} />
      <Route path="/videos" element={<VideoHub />} />
      <Route path="/submit-story" element={<SubmitStory />} />
      <Route path="/about" element={<About />} />
      <Route path="/newsletter" element={<Newsletter />} />
      <Route path="/donate" element={<Donate />} />
      <Route path="/contact" element={<Contact />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/stories" element={<StoriesManager />} />
      <Route path="/admin/submissions" element={<SubmissionsManager />} />
      <Route path="/admin/reels" element={<ReelsManager />} />
      <Route path="/admin/subscribers" element={<SubscribersManager />} />
      <Route path="/admin/analytics" element={<Analytics />} />
      <Route path="/admin/settings" element={<Settings />} />
    </Routes>
  );
}
