import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminRoute from './components/common/AdminRoute'
import Layout from './components/layout/Layout'

// Auth pages
import Login    from './pages/auth/Login'
import Register from './pages/auth/Register'

// Admin pages
import Dashboard       from './pages/admin/Dashboard'
import Students        from './pages/admin/Students'
import StudentForm     from './pages/admin/StudentForm'
import Companies       from './pages/admin/Companies'
import CompanyForm     from './pages/admin/CompanyForm'
import PlacementDrives from './pages/admin/PlacementDrives'
import DriveForm       from './pages/admin/DriveForm'
import DriveApplicants from './pages/admin/DriveApplicants'

// Student pages
import StudentDashboard from './pages/student/StudentDashboard'
import AvailableDrives  from './pages/student/AvailableDrives'
import MyApplications   from './pages/student/MyApplications'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes with shared Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            {/* Admin-only */}
            <Route element={<AdminRoute />}>
              <Route path="/dashboard"              element={<Dashboard />} />
              <Route path="/students"               element={<Students />} />
              <Route path="/students/new"           element={<StudentForm />} />
              <Route path="/students/:id/edit"      element={<StudentForm />} />
              <Route path="/companies"              element={<Companies />} />
              <Route path="/companies/new"          element={<CompanyForm />} />
              <Route path="/companies/:id/edit"     element={<CompanyForm />} />
              <Route path="/drives"                 element={<PlacementDrives />} />
              <Route path="/drives/new"             element={<DriveForm />} />
              <Route path="/drives/:id/edit"        element={<DriveForm />} />
              <Route path="/drives/:id/applicants"  element={<DriveApplicants />} />
            </Route>

            {/* Student routes */}
            <Route path="/my-dashboard"    element={<StudentDashboard />} />
            <Route path="/available-drives" element={<AvailableDrives />} />
            <Route path="/my-applications"  element={<MyApplications />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </AuthProvider>
  )
}
