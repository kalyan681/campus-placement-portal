import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { applicationApi, driveApi } from '../../api/services'
import { LoadingSpinner, Pagination, EmptyState, Modal } from '../../components/common'
import { StatusBadge, formatDate } from '../../utils/helpers'
import { ArrowLeft, Users, CheckCircle, XCircle, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const STATUSES = ['APPLIED','SHORTLISTED','INTERVIEW_SCHEDULED','SELECTED','REJECTED','WITHDRAWN']

export default function DriveApplicants() {
  const { id }   = useParams()
  const navigate = useNavigate()

  const [drive, setDrive]     = useState(null)
  const [data, setData]       = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(0)
  const [selected, setSelected] = useState(null)  // application being updated
  const [newStatus, setNewStatus] = useState('')
  const [remarks, setRemarks]   = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    driveApi.getById(id)
      .then(res => setDrive(res.data.data))
      .catch(() => {})
  }, [id])

  const fetchApps = useCallback(async () => {
    setLoading(true)
    try {
      const res = await applicationApi.getByDrive(id, { page, size: 15 })
      setData(res.data.data)
    } catch (e) {}
    finally { setLoading(false) }
  }, [id, page])

  useEffect(() => { fetchApps() }, [fetchApps])

  const openStatusModal = (app) => {
    setSelected(app)
    setNewStatus(app.status)
    setRemarks('')
  }

  const handleStatusUpdate = async () => {
    if (!newStatus) return
    setUpdating(true)
    try {
      await applicationApi.updateStatus(selected.id, newStatus, remarks || undefined)
      toast.success('Application status updated')
      setSelected(null)
      fetchApps()
    } catch (e) {}
    finally { setUpdating(false) }
  }

  const statusColor = {
    APPLIED:             'bg-blue-50 text-blue-700',
    SHORTLISTED:         'bg-yellow-50 text-yellow-700',
    INTERVIEW_SCHEDULED: 'bg-purple-50 text-purple-700',
    SELECTED:            'bg-green-50 text-green-700',
    REJECTED:            'bg-red-50 text-red-700',
    WITHDRAWN:           'bg-gray-50 text-gray-600',
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button onClick={() => navigate('/drives')}
          className="mt-1 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Applicants</h1>
          {drive && (
            <p className="text-sm text-gray-500 mt-0.5">
              {drive.title} — <span className="font-medium text-gray-700">{drive.companyName}</span>
            </p>
          )}
        </div>
      </div>

      {/* Summary badges */}
      {drive && (
        <div className="flex flex-wrap gap-3">
          <span className="badge badge-blue">Total: {data.totalElements ?? 0}</span>
          <StatusBadge status={drive.status} />
          {drive.packageLpa && <span className="badge badge-green">₹{drive.packageLpa} LPA</span>}
          {drive.driveDate  && <span className="badge badge-gray">
            <Calendar size={11} className="mr-1 inline" />{formatDate(drive.driveDate)}
          </span>}
        </div>
      )}

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? <LoadingSpinner /> : data.content?.length === 0 ? (
          <EmptyState icon={Users} title="No applications yet"
            description="Students haven't applied to this drive yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Student','Roll No.','Email','Applied On','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.content.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{app.studentName}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{app.studentRollNumber}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{app.studentEmail}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(app.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${statusColor[app.status] || 'badge-gray'}`}>
                        {app.status.replace(/_/g,' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => openStatusModal(app)}
                        className="text-xs btn-secondary px-3 py-1.5">
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && (
          <div className="px-4 pb-4">
            <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      <Modal isOpen={!!selected} onClose={() => setSelected(null)}
        title={`Update Status — ${selected?.studentName}`} size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Status</label>
            <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
              className="input-field">
              {STATUSES.map(s => <option key={s} value={s}>{s.replace(/_/g,' ')}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Remarks (optional)</label>
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)}
              rows={3} placeholder="Add notes for the student…"
              className="input-field resize-none" />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setSelected(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleStatusUpdate} disabled={updating} className="btn-primary">
              {updating ? 'Updating…' : 'Save Status'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
