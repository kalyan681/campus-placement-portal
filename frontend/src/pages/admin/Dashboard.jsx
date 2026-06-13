import { useEffect, useState } from 'react'
import { dashboardApi } from '../../api/services'
import { StatCard, LoadingSpinner } from '../../components/common'
import {
  Users, Building2, CalendarCheck, FileText,
  TrendingUp, Award
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const PIE_COLORS = ['#3b82f6','#10b981','#f59e0b','#ef4444','#8b5cf6','#6b7280']

export default function Dashboard() {
  const [stats, setStats]   = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    dashboardApi.getStats()
      .then(res => setStats(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner />

  const deptData = stats
    ? Object.entries(stats.studentsByDepartment).map(([name, count]) => ({ name, count }))
    : []

  const statusData = stats
    ? Object.entries(stats.applicationsByStatus).map(([name, value]) => ({
        name: name.replace(/_/g, ' '), value
      }))
    : []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Campus Placement Portal Overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <StatCard title="Total Students"    value={stats?.totalStudents}    icon={Users}         color="blue" />
        <StatCard title="Placed Students"   value={stats?.placedStudents}   icon={Award}         color="green"
                  subtitle={`${stats?.placementPercentage ?? 0}% placement rate`} />
        <StatCard title="Total Companies"   value={stats?.totalCompanies}   icon={Building2}     color="purple" />
        <StatCard title="Active Drives"     value={stats?.activeDrives}     icon={CalendarCheck} color="orange"
                  subtitle={`${stats?.totalDrives} total`} />
        <StatCard title="Total Applications" value={stats?.totalApplications} icon={FileText}   color="blue" />
        <StatCard title="Placement %"        value={`${stats?.placementPercentage ?? 0}%`}
                  icon={TrendingUp} color="green" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students by Department */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Students by Department</h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={deptData} margin={{ top:0, right:10, left:-10, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Applications by Status */}
        <div className="card">
          <h2 className="text-base font-semibold text-gray-800 mb-4">Applications by Status</h2>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                     outerRadius={80} label={({ name, percent }) =>
                       `${name} ${(percent * 100).toFixed(0)}%`
                     }
                     labelLine={false}
                >
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              No application data yet
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
