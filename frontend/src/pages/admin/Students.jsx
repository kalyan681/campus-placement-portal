import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { studentApi } from '../../api/services'
import { LoadingSpinner, Pagination, EmptyState, ConfirmDialog } from '../../components/common'
import { StatusBadge } from '../../utils/helpers'
import { Plus, Pencil, Trash2, GraduationCap, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import { useDebounce } from '../../hooks/useDebounce'

const DEPARTMENTS = ['CSE','IT','ECE','MECH','CIVIL','EEE']

export default function Students() {
  const navigate = useNavigate()
  const [data, setData]         = useState({ content: [], totalPages: 0 })
  const [loading, setLoading]   = useState(true)
  const [page, setPage]         = useState(0)
  const [keyword, setKeyword]   = useState('')
  const [dept, setDept]         = useState('')
  const [isPlaced, setIsPlaced] = useState('')
  const [delId, setDelId]       = useState(null)
  const [delLoading, setDelLoading] = useState(false)

  const debouncedKeyword = useDebounce(keyword, 400)

  const fetchStudents = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, size: 10 }
      if (debouncedKeyword) params.keyword = debouncedKeyword
      if (dept)             params.department = dept
      if (isPlaced !== '')  params.isPlaced = isPlaced

      const res = (debouncedKeyword || dept || isPlaced !== '')
        ? await studentApi.search(params)
        : await studentApi.getAll(params)

      setData(res.data.data)
    } catch (e) {}
    finally { setLoading(false) }
  }, [page, debouncedKeyword, dept, isPlaced])

  useEffect(() => { fetchStudents() }, [fetchStudents])

  const handleDelete = async () => {
    setDelLoading(true)
    try {
      await studentApi.delete(delId)
      toast.success('Student deleted')
      setDelId(null)
      fetchStudents()
    } catch (e) {}
    finally { setDelLoading(false) }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-sm text-gray-500">{data.totalElements ?? 0} total students</p>
        </div>
        <button onClick={() => navigate('/students/new')} className="btn-primary flex items-center gap-2 self-start">
          <Plus size={16} /> Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={keyword} onChange={e => { setKeyword(e.target.value); setPage(0) }}
            placeholder="Search name, roll number…"
            className="input-field pl-8 text-sm" />
        </div>
        <select value={dept} onChange={e => { setDept(e.target.value); setPage(0) }}
          className="input-field w-40 text-sm">
          <option value="">All Departments</option>
          {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={isPlaced} onChange={e => { setIsPlaced(e.target.value); setPage(0) }}
          className="input-field w-36 text-sm">
          <option value="">All Status</option>
          <option value="false">Unplaced</option>
          <option value="true">Placed</option>
        </select>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        {loading ? <LoadingSpinner /> : data.content?.length === 0 ? (
          <EmptyState icon={GraduationCap} title="No students found"
            description="Try adjusting your filters or add a new student" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Roll No.','Name','Department','CGPA','Graduation','Status','Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.content.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-gray-600">{s.rollNumber}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{s.fullName}</div>
                      <div className="text-xs text-gray-400">{s.email}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{s.department}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{s.cgpa ?? '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{s.graduationYear ?? '—'}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={s.isPlaced ? 'PLACED' : s.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => navigate(`/students/${s.id}/edit`)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => setDelId(s.id)}
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

      <ConfirmDialog
        isOpen={!!delId}
        onClose={() => setDelId(null)}
        onConfirm={handleDelete}
        loading={delLoading}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
      />
    </div>
  )
}
