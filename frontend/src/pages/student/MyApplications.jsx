import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { applicationApi, studentApi } from '../../api/services'
import { LoadingSpinner, Pagination, EmptyState, Modal, ConfirmDialog } from '../../components/common'
import { StatusBadge, formatDate, formatCurrency } from '../../utils/helpers'
import { FileText, Building2, Calendar, Eye, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MyApplications() {
  const { user } = useAuth()
  const [studentId, setStudentId] = useState(null)
  const [data, setData]       = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(0)
  const [viewApp, setViewApp] = useState(null)
  const [withdrawId, setWithdrawId] = useState(null)
  const [withdrawing, setWithdrawing] = useState(false)

  // Resolve student ID for the logged-in user
  useEffect(() => {
    if (!user) return
    studentApi.search({ keyword: user.username, size: 1 })
      .then(res => {
        const s = res.data.data?.content?.[0]
        if (s) setStudentId(s.id)
      })
      .catch(() => {})
  }, [user])

  const fetchApps = useCallback(async () => {
    if (!studentId) return
    setLoading(true)
    try {
      const res = await applicationApi.getByStudent(studentId, { page, size: 10 })
      setData(res.data.data)
    } catch (e) {}
    finally { setLoading(false) }
  }, [studentId, page])

  useEffect(() => { fetchApps() }, [fetchApps])

  const handleWithdraw = async () => {
    setWithdrawing(true)
    try {
      await applicationApi.withdraw(withdrawId)
      toast.success('Application withdrawn')
      setWithdrawId(null)
      fetchApps()
    } catch (e) {}
    finally { setWithdrawing(false) }
  }

  const canWithdraw = (status) => ['APPLIED', 'SHORTLISTED'].includes(status)

  const statusCard = {
    APPLIED:             'border-l-blue-400',
    SHORTLISTED:         'border-l-yellow-400',
    INTERVIEW_SCHEDULED: 'border-l-purple-400',
    SELECTED:            'border-l-green-400',
    REJECTED:            'border-l-red-400',
    WITHDRAWN:           'border-l-gray-300',
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
        <p className="text-sm text-gray-500 mt-1">{data.totalElements ?? 0} total applications</p>
      </div>

      {loading ? <LoadingSpinner /> : !studentId ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-sm">
            Your student profile is not linked to this account. Please contact the admin.
          </p>
        </div>
      ) : data.content?.length === 0 ? (
        <EmptyState icon={FileText} title="No applications yet"
          description="Browse active drives and apply to get started." />
      ) : (
        <div className="space-y-3">
          {data.content.map(app => (
            <div key={app.id}
              className={`card border-l-4 ${statusCard[app.status] || 'border-l-gray-300'} py-4 flex flex-col sm:flex-row sm:items-center gap-4`}>
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Building2 size={16} className="text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{app.driveTitle}</h3>
                    <p className="text-sm text-gray-500">{app.companyName}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500 pl-13">
                  <span className="flex items-center gap-1">
                    <Calendar size={11} /> Applied: {formatDate(app.createdAt)}
                  </span>
                  {app.interviewDate && (
                    <span className="flex items-center gap-1 text-purple-600">
                      <Calendar size={11} /> Interview: {formatDate(app.interviewDate)}
                    </span>
                  )}
                  {app.offeredPackage && (
                    <span className="text-green-600 font-semibold">
                      Offer: {formatCurrency(app.offeredPackage)}
                    </span>
                  )}
                </div>
                {app.remarks && (
                  <p className="mt-2 text-xs text-gray-400 italic pl-13">"{app.remarks}"</p>
                )}
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                <StatusBadge status={app.status} />
                <button onClick={() => setViewApp(app)}
                  className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                  <Eye size={15} />
                </button>
                {canWithdraw(app.status) && (
                  <button onClick={() => setWithdrawId(app.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    <XCircle size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />}

      {/* View Details Modal */}
      <Modal isOpen={!!viewApp} onClose={() => setViewApp(null)}
        title="Application Details" size="md">
        {viewApp && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              {[
                ['Drive',    viewApp.driveTitle],
                ['Company',  viewApp.companyName],
                ['Status',   null],
                ['Applied',  formatDate(viewApp.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">{k}</p>
                  {k === 'Status'
                    ? <StatusBadge status={viewApp.status} />
                    : <p className="font-medium text-gray-800">{v}</p>}
                </div>
              ))}
              {viewApp.interviewDate && (
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Interview Date</p>
                  <p className="font-medium text-purple-700">{formatDate(viewApp.interviewDate)}</p>
                </div>
              )}
              {viewApp.offeredPackage && (
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400 mb-1">Offered Package</p>
                  <p className="font-semibold text-green-700">{formatCurrency(viewApp.offeredPackage)}</p>
                </div>
              )}
            </div>
            {viewApp.coverLetter && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Cover Letter</p>
                <p className="bg-gray-50 rounded-lg p-3 text-gray-700 whitespace-pre-wrap">{viewApp.coverLetter}</p>
              </div>
            )}
            {viewApp.remarks && (
              <div>
                <p className="text-xs text-gray-400 mb-1">Recruiter Remarks</p>
                <p className="bg-yellow-50 rounded-lg p-3 text-gray-700 italic">{viewApp.remarks}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      <ConfirmDialog isOpen={!!withdrawId} onClose={() => setWithdrawId(null)}
        onConfirm={handleWithdraw} loading={withdrawing}
        title="Withdraw Application"
        message="Are you sure you want to withdraw this application? This action cannot be undone."
        confirmLabel="Withdraw" />
    </div>
  )
}
