import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { companyApi } from '../../api/services'
import { LoadingSpinner, Pagination, EmptyState, ConfirmDialog } from '../../components/common'
import { StatusBadge } from '../../utils/helpers'
import { Plus, Pencil, Trash2, Building2, Search, Globe } from 'lucide-react'
import toast from 'react-hot-toast'
import { useDebounce } from '../../hooks/useDebounce'

export default function Companies() {
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
        ? await companyApi.search(params)
        : await companyApi.getAll(params)
      setData(res.data.data)
    } catch (e) {}
    finally { setLoading(false) }
  }, [page, debounced, status])

  useEffect(() => { fetchData() }, [fetchData])

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await companyApi.delete(delId)
      toast.success('Company deleted')
      setDelId(null)
      fetchData()
    } catch (e) {}
    finally { setDelLoading(false) }
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Companies</h1>
          <p className="text-sm text-gray-500">{data.totalElements ?? 0} total companies</p>
        </div>
        <button onClick={() => navigate('/companies/new')} className="btn-primary flex items-center gap-2 self-start">
          <Plus size={16} /> Add Company
        </button>
      </div>

      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={keyword} onChange={e => { setKeyword(e.target.value); setPage(0) }}
            placeholder="Search company, industry, city…"
            className="input-field pl-8 text-sm" />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(0) }}
          className="input-field w-40 text-sm">
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="BLACKLISTED">Blacklisted</option>
        </select>
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? <LoadingSpinner /> : data.content?.length === 0 ? (
          <EmptyState icon={Building2} title="No companies found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Company','Industry','City','HR Contact','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.content.map(c => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 flex-shrink-0">
                          <Building2 size={16} />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{c.name}</div>
                          {c.website && (
                            <a href={c.website} target="_blank" rel="noreferrer"
                              className="text-xs text-primary-500 hover:underline flex items-center gap-1">
                              <Globe size={11} /> Website
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.industry}</td>
                    <td className="px-4 py-3 text-gray-600">{c.city || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="text-gray-800">{c.hrContactName || '—'}</div>
                      <div className="text-xs text-gray-400">{c.hrContactEmail || ''}</div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/companies/${c.id}/edit`)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDelId(c.id)}
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
        loading={delLoading} title="Delete Company"
        message="Delete this company? All associated drives will also be removed." />
    </div>
  )
}
