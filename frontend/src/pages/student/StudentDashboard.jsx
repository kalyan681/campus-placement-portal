import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { studentApi, driveApi, applicationApi } from '../../api/services'
import { LoadingSpinner, StatCard } from '../../components/common'
import { StatusBadge, formatDate, formatCurrency } from '../../utils/helpers'
import { FileText, CalendarCheck, Award, User, ArrowRight } from 'lucide-react'

export default function StudentDashboard() {
  const { user }     = useAuth()
  const navigate     = useNavigate()
  const [profile, setProfile]   = useState(null)
  const [apps, setApps]         = useState([])
  const [drives, setDrives]     = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        // Try to load student profile by username match
        const [drivesRes] = await Promise.all([
          driveApi.search({ status: 'ACTIVE', size: 5 })
        ])
        setDrives(drivesRes.data.data?.content || [])

        // Try to find student record linked to logged-in user
        if (user?.id) {
          try {
            const studRes = await studentApi.search({ keyword: user.username, size: 1 })
            const student = studRes.data.data?.content?.[0]
            if (student) {
              setProfile(student)
              const appsRes = await applicationApi.getByStudent(student.id, { size: 5 })
              setApps(appsRes.data.data?.content || [])
            }
          } catch (_) {}
        }
      } catch (e) {}
      finally { setLoading(false) }
    }
    load()
  }, [user])

  if (loading) return <LoadingSpinner />

  const appliedCount  = apps.length
  const selectedCount = apps.filter(a => a.status === 'SELECTED').length
  const shortlisted   = apps.filter(a => ['SHORTLISTED','INTERVIEW_SCHEDULED'].includes(a.status)).length

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <User size={26} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome, {user?.fullName || user?.username}!</h1>
            <p className="text-primary-200 text-sm mt-0.5">
              {profile
                ? `${profile.department} • ${profile.degree} • CGPA: ${profile.cgpa ?? '—'}`
                : 'Campus Placement Portal'}
            </p>
          </div>
        </div>
        {profile?.isPlaced && (
          <div className="mt-4 bg-white/10 rounded-xl px-4 py-3 flex items-center gap-3">
            <Award size={20} className="text-yellow-300" />
            <span className="text-sm font-medium">
              🎉 Placed at <strong>{profile.placedCompany}</strong> — {formatCurrency(profile.packageLpa)}
            </span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Applications Submitted" value={appliedCount}  icon={FileText}      color="blue" />
        <StatCard title="Shortlisted"             value={shortlisted}   icon={CalendarCheck} color="purple" />
        <StatCard title="Offers Received"         value={selectedCount} icon={Award}         color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Recent Applications</h2>
            <button onClick={() => navigate('/my-applications')}
              className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          {apps.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">
              No applications yet.{' '}
              <button onClick={() => navigate('/available-drives')}
                className="text-primary-600 hover:underline">Browse drives</button>
            </div>
          ) : (
            <div className="space-y-3">
              {apps.slice(0, 4).map(app => (
                <div key={app.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{app.driveTitle}</p>
                    <p className="text-xs text-gray-400">{app.companyName} • {formatDate(app.createdAt)}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Active Drives */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-800">Active Drives</h2>
            <button onClick={() => navigate('/available-drives')}
              className="text-xs text-primary-600 hover:underline flex items-center gap-1">
              View all <ArrowRight size={12} />
            </button>
          </div>
          {drives.length === 0 ? (
            <div className="text-center py-8 text-gray-400 text-sm">No active drives at the moment.</div>
          ) : (
            <div className="space-y-3">
              {drives.map(d => (
                <div key={d.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{d.companyName}</p>
                    <p className="text-xs text-gray-400">{d.jobRole} • {formatCurrency(d.packageLpa)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Apply by</p>
                    <p className="text-xs font-medium text-gray-700">{formatDate(d.lastDateToApply)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
