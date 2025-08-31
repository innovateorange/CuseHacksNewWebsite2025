import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { FeatureFlagProvider } from './contexts/FeatureFlagContext'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const SubmitPage = lazy(() => import('./pages/SubmitPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const AdminRegistrationsPage = lazy(() => import('./pages/AdminRegistrationsPage'))
const AdminMessagesPage = lazy(() => import('./pages/AdminMessagesPage'))

function App() {
  return (
    <FeatureFlagProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/submit" element={<SubmitPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/registrations" element={<AdminRegistrationsPage />} />
            <Route path="/admin/messages" element={<AdminMessagesPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </Suspense>
      </Router>
    </FeatureFlagProvider>
  )
}

export default App