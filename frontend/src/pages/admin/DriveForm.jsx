import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { driveApi, companyApi } from '../../api/services'
import { LoadingSpinner } from '../../components/common'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

const INIT = {
  title:'', description:'', companyId:'', jobRole:'', jobType:'Full-time',
  packageLpa:'', minCgpa:'', eligibleDepartments:'', requiredSkills:'',
  driveDate:'', lastDateToApply:'', location:'', vacancyCount:'', status:'UPCOMING'
}

export default function DriveForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [form, setForm]         = useState(INIT)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(isEdit)
  const [companies, setCompanies] = useState([])

  useEffect(() => {
    companyApi.getAll({ size: 100, status: 'ACTIVE' })
      .then(res => setCompanies(res.data.data?.content || []))
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (!isEdit) return
    driveApi.getById(id)
      .then(res => {
        const d = res.data.data
        setForm({
          title: d.title, description: d.description || '', companyId: d.companyId,
          jobRole: d.jobRole, jobType: d.jobType || 'Full-time',
          packageLpa: d.packageLpa ?? '', minCgpa: d.minCgpa ?? '',
          eligibleDepartments: d.eligibleDepartments || '',
          requiredSkills: d.requiredSkills || '',
          driveDate: d.driveDate || '', lastDateToApply: d.lastDateToApply || '',
          location: d.location || '', vacancyCount: d.vacancyCount ?? '',
          status: d.status
        })
      })
      .catch(() => toast.error('Failed to load drive'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const validate = () => {
    const e = {}
    if (!form.title.trim())   e.title     = 'Title is required'
    if (!form.companyId)      e.companyId = 'Company is required'
    if (!form.jobRole.trim()) e.jobRole   = 'Job role is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const payload = {
      ...form,
      companyId:    Number(form.companyId),
      packageLpa:   form.packageLpa   ? Number(form.packageLpa)   : null,
      minCgpa:      form.minCgpa      ? Number(form.minCgpa)      : null,
      vacancyCount: form.vacancyCount ? Number(form.vacancyCount) : null,
      driveDate:         form.driveDate         || null,
      lastDateToApply:   form.lastDateToApply   || null,
    }
    try {
      if (isEdit) { await driveApi.update(id, payload); toast.success('Drive updated') }
      else        { await driveApi.create(payload);     toast.success('Drive created') }
      navigate('/drives')
    } catch (err) {
      const vErrors = err.response?.data?.validationErrors
      if (vErrors) setErrors(vErrors)
    } finally { setLoading(false) }
  }

  if (fetching || !companies) return <LoadingSpinner />

  const F = ({ label, name, type='text', required, options, rows, placeholder='' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {options === 'company' ? (
        <select value={form[name]} onChange={e => setForm({...form,[name]: e.target.value})}
          className={`input-field ${errors[name] ? 'input-error' : ''}`}>
          <option value="">Select company</option>
          {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      ) : options ? (
        <select value={form[name]} onChange={e => setForm({...form,[name]: e.target.value})}
          className={`input-field ${errors[name] ? 'input-error' : ''}`}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : rows ? (
        <textarea rows={rows} value={form[name]} placeholder={placeholder}
          onChange={e => setForm({...form,[name]: e.target.value})}
          className={`input-field resize-none ${errors[name] ? 'input-error' : ''}`} />
      ) : (
        <input type={type} value={form[name]} placeholder={placeholder}
          onChange={e => setForm({...form,[name]: e.target.value})}
          className={`input-field ${errors[name] ? 'input-error' : ''}`} />
      )}
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate('/drives')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size={16} /> Back to Drives
      </button>
      <div className="card">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Placement Drive' : 'Create Placement Drive'}
        </h1>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <F label="Drive Title" name="title" required placeholder="Google SWE Campus Drive 2025" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <F label="Company" name="companyId" options="company" required />
            <F label="Status"  name="status"
              options={['UPCOMING','ACTIVE','COMPLETED','CANCELLED']} />
            <F label="Job Role"  name="jobRole"  required placeholder="Software Engineer" />
            <F label="Job Type"  name="jobType"
              options={['Full-time','Internship','Part-time','Contract']} />
            <F label="Package (LPA)" name="packageLpa" type="number" placeholder="22.0" />
            <F label="Min CGPA"      name="minCgpa"    type="number" placeholder="7.5" />
            <F label="Drive Date"         name="driveDate"       type="date" />
            <F label="Last Date to Apply" name="lastDateToApply" type="date" />
            <F label="Location"      name="location"     placeholder="Hyderabad / Remote" />
            <F label="Vacancies"     name="vacancyCount" type="number" placeholder="10" />
          </div>

          <F label="Eligible Departments (comma-separated)" name="eligibleDepartments"
            placeholder="CSE,IT,ECE" />
          <F label="Required Skills (comma-separated)" name="requiredSkills"
            placeholder="Java, Python, DSA" />
          <F label="Description" name="description" rows={3}
            placeholder="Describe the role and selection process…" />

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving…' : isEdit ? 'Update Drive' : 'Create Drive'}
            </button>
            <button type="button" onClick={() => navigate('/drives')} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
