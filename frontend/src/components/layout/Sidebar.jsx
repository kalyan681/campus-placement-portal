import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  LayoutDashboard, Users, Building2, CalendarCheck,
  FileText, LogOut, GraduationCap, Menu, X
} from 'lucide-react'
import { useState } from 'react'

const adminLinks = [
  { to: '/dashboard',  label: 'Dashboard',    icon: LayoutDashboard },
  { to: '/students',   label: 'Students',     icon: GraduationCap   },
  { to: '/companies',  label: 'Companies',    icon: Building2        },
  { to: '/drives',     label: 'Drives',       icon: CalendarCheck    },
]

const studentLinks = [
  { to: '/my-dashboard',     label: 'Dashboard',     icon: LayoutDashboard },
  { to: '/available-drives', label: 'Browse Drives', icon: CalendarCheck   },
  { to: '/my-applications',  label: 'My Applications', icon: FileText      },
]

export default function Sidebar() {
  const { isAdmin, logout, user } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const links = isAdmin ? adminLinks : studentLinks

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const NavItems = () => (
    <nav className="flex-1 px-3 py-4 space-y-1">
      {links.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? 'bg-primary-600 text-white'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <>
      {/* Mobile toggle button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white border rounded-lg shadow"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-gray-200
        flex flex-col transition-transform duration-300
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
          <div className="w-9 h-9 bg-primary-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="text-white" size={20} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">Campus</p>
            <p className="text-xs text-gray-500">Placement Portal</p>
          </div>
        </div>

        {/* User info */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-primary-700 text-sm font-semibold">
                {user?.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName || user?.username}</p>
              <p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'Student'}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <NavItems />

        {/* Logout */}
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                       text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}
