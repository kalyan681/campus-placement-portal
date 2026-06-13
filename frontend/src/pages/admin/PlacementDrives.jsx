import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { driveApi } from '../../api/services'
import { LoadingSpinner, Pagination, EmptyState, ConfirmDialog } from '../../components/common'
import { StatusBadge, formatDate, formatCurrency } from '../../utils/helpers'
import { Plus, Pencil, Trash2, CalendarCheck, Search, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { useDebounce } from '../../hooks/useDebounce'

export default function PlacementDrives() {
  const navigate = useNavigate()
  const [data, setData]       = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(0)
  const [keyword, setKeyword] = useState('')
  const [status, setStatus]   = useState('')
  const [delId, setDelId]     = useState(null)
  const [delLoading, setDelLoading] = useState(false)
  const debounced = useDebounce(keyword, 400)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, size: 10 }
      if (debounced) params.keyword = debounced
      if (status)    params.status  = status
      const res = (debounced || status)
        ? await driveApi.search(params)
        : await driveApi.getAll(params)
      setData(res.data.data)
    } catch (e) {}
    finally { setLoading(false) }
  }, [page, debounced, status])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await driveApi.delete(delId)
      toast.success('Drive deleted')
      setDelId(null)
      fetchData()
    } catch (e) {}
    finally { setDelLoading(false) }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Placement Drives</h1>
          <p className="text-sm text-gray-500">{data.totalElements ?? 0} total drives</p>
        </div>
        <button onClick={() => navigate('/drives/new')} className="btn-primary flex items-center gap-2 self-start">
          <Plus size={16} /> Add Drive
        </button>
      </div>

      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={keyword} onChange={e => { setKeyword(e.target.value); setPage(0) }}
            placeholder="Search title, job role…"
            className="input-field pl-8 text-sm" />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(0) }}
          className="input-field w-40 text-sm">
          <option value="">All Statuses</option>
          <option value="UPCOMING">Upcoming</option>
          <option value="ACTIVE">Active</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? <LoadingSpinner /> : data.content?.length === 0 ? (
          <EmptyState icon={CalendarCheck} title="No drives found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Drive','Company','Role','Package','Drive Date','Applications','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.content.map(d => (
                  <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900 max-w-[200px] truncate">{d.title}</div>
                      <div className="text-xs text-gray-400">{d.jobType || 'Full-time'}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-700 font-medium">{d.companyName}</td>
                    <td className="px-4 py-3 text-gray-600">{d.jobRole}</td>
                    <td className="px-4 py-3 text-green-700 font-semibold">{formatCurrency(d.packageLpa)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(d.driveDate)}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => navigate(`/drives/${d.id}/applicants`)}
                        className="flex items-center gap-1 text-primary-600 hover:underline text-sm font-medium">
                        <Users size={13} /> {d.applicationCount ?? 0}
                      </button>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={d.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/drives/${d.id}/edit`)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDelId(d.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && <div className="px-4 pb-4"><Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} /></div>}
      </div>

      <ConfirmDialog isOpen={!!delId} onClose={() => setDelId(null)} onConfirm={handleDelete}
        loading={delLoading} title="Delete Drive"
        message="Delete this placement drive? All applications will also be removed." />
    </div>
  )
}
