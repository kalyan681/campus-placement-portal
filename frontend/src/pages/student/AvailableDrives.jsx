import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '../../context/AuthContext'
import { driveApi, applicationApi, studentApi } from '../../api/services'
import { LoadingSpinner, Pagination, EmptyState, Modal } from '../../components/common'
import { StatusBadge, formatDate, formatCurrency } from '../../utils/helpers'
import {
  CalendarCheck, Search, Building2, MapPin,
  Briefcase, GraduationCap, Clock, Send
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useDebounce } from '../../hooks/useDebounce'

export default function AvailableDrives() {
  const { user } = useAuth()
  const [data, setData]       = useState({ content: [], totalPages: 0 })
  const [loading, setLoading] = useState(true)
  const [page, setPage]       = useState(0)
  const [keyword, setKeyword] = useState('')
  const [studentId, setStudentId] = useState(null)
  const [applying, setApplying]   = useState(false)
  const [applyDrive, setApplyDrive] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')
  const [appliedIds, setAppliedIds]   = useState(new Set())
  const debounced = useDebounce(keyword, 400)

  // Fetch student profile to get studentId
  useEffect(() => {
    if (!user) return
    studentApi.search({ keyword: user.username, size: 1 })
      .then(res => {
        const s = res.data.data?.content?.[0]
        if (s) {
          setStudentId(s.id)
          // Load all application IDs for this student to mark already-applied
          applicationApi.getByStudent(s.id, { size: 100 })
            .then(r => {
              const ids = new Set(r.data.data?.content?.map(a => a.driveId))
              setAppliedIds(ids)
            })
            .catch(() => {})
        }
      })
      .catch(() => {})
  }, [user])

  const fetchDrives = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, size: 9 }
      if (debounced) params.keyword = debounced
      const res = debounced
        ? await driveApi.search({ ...params, status: 'ACTIVE' })
        : await driveApi.search({ ...params, status: 'ACTIVE' })
      setData(res.data.data)
    } catch (e) {}
    finally { setLoading(false) }
  }, [page, debounced])

  useEffect(() => { fetchDrives() }, [fetchDrives])

  const openApply = (drive) => {
    if (!studentId) {
      toast.error('Your student profile is not linked to this account. Contact admin.')
      return
    }
    setCoverLetter('')
    setApplyDrive(drive)
  }

  const handleApply = async () => {
    setApplying(true)
    try {
      await applicationApi.apply({
        studentId,
        driveId: applyDrive.id,
        coverLetter: coverLetter || undefined,
      })
      toast.success(`Applied to ${applyDrive.title}!`)
      setAppliedIds(prev => new Set([...prev, applyDrive.id]))
      setApplyDrive(null)
    } catch (e) {}
    finally { setApplying(false) }
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Browse Placement Drives</h1>
        <p className="text-sm text-gray-500 mt-1">Explore active drives and apply directly</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={keyword} onChange={e => { setKeyword(e.target.value); setPage(0) }}
          placeholder="Search company, role, skills…"
          className="input-field pl-8 text-sm" />
      </div>

      {/* Drive cards grid */}
      {loading ? <LoadingSpinner /> : data.content?.length === 0 ? (
        <EmptyState icon={CalendarCheck} title="No active drives"
          description="Check back later for new placement opportunities." />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {data.content.map(drive => {
              const alreadyApplied = appliedIds.has(drive.id)
              return (
                <div key={drive.id}
                  className="card hover:shadow-md transition-shadow flex flex-col gap-3">
                  {/* Company + status */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600 flex-shrink-0">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{drive.companyName}</p>
                        <p className="text-xs text-gray-400">{drive.jobType || 'Full-time'}</p>
                      </div>
                    </div>
                    <StatusBadge status={drive.status} />
                  </div>

                  {/* Title */}
                  <div>
                    <h3 className="font-semibold text-gray-800">{drive.title}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{drive.jobRole}</p>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
                    {drive.packageLpa && (
                      <div className="flex items-center gap-1.5 text-green-700 font-semibold">
                        <Briefcase size={12} /> {formatCurrency(drive.packageLpa)}
                      </div>
                    )}
                    {drive.location && (
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} /> {drive.location}
                      </div>
                    )}
                    {drive.minCgpa > 0 && (
                      <div className="flex items-center gap-1.5">
                        <GraduationCap size={12} /> Min CGPA: {drive.minCgpa}
                      </div>
                    )}
                    {drive.lastDateToApply && (
                      <div className="flex items-center gap-1.5 text-red-500">
                        <Clock size={12} /> Apply by {formatDate(drive.lastDateToApply)}
                      </div>
                    )}
                  </div>

                  {/* Skills */}
                  {drive.requiredSkills && (
                    <div className="flex flex-wrap gap-1.5">
                      {drive.requiredSkills.split(',').slice(0,4).map(s => (
                        <span key={s} className="badge badge-gray text-xs">{s.trim()}</span>
                      ))}
                    </div>
                  )}

                  {/* Apply button */}
                  <div className="mt-auto pt-2 border-t border-gray-50">
                    {alreadyApplied ? (
                      <span className="text-sm text-green-600 font-medium flex items-center gap-1.5">
                        ✓ Applied
                      </span>
                    ) : (
                      <button onClick={() => openApply(drive)}
                        className="btn-primary w-full flex items-center justify-center gap-2 text-sm py-2">
                        <Send size={14} /> Apply Now
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
          <Pagination page={page} totalPages={data.totalPages} onPageChange={setPage} />
        </>
      )}

      {/* Apply Modal */}
      <Modal isOpen={!!applyDrive} onClose={() => setApplyDrive(null)}
        title={`Apply — ${applyDrive?.title}`} size="md">
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
            <p><span className="text-gray-500">Company:</span> <strong>{applyDrive?.companyName}</strong></p>
            <p><span className="text-gray-500">Role:</span> {applyDrive?.jobRole}</p>
            <p><span className="text-gray-500">Package:</span> {formatCurrency(applyDrive?.packageLpa)}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Letter <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
              rows={5} placeholder="Tell the company why you're a great fit…"
              className="input-field resize-none" />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setApplyDrive(null)} className="btn-secondary">Cancel</button>
            <button onClick={handleApply} disabled={applying}
              className="btn-primary flex items-center gap-2">
              <Send size={14} />
              {applying ? 'Submitting…' : 'Submit Application'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
