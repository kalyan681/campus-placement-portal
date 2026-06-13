import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { companyApi } from '../../api/services'
import { LoadingSpinner } from '../../components/common'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

const INDUSTRIES = ['Technology','IT Services','E-Commerce','Consulting','Finance','Manufacturing','Healthcare','Education','Other']
const INIT = {
  name:'', email:'', phone:'', website:'', industry:'Technology',
  description:'', city:'', country:'India', address:'',
  hrContactName:'', hrContactEmail:'', status:'ACTIVE'
}

export default function CompanyForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [form, setForm]         = useState(INIT)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    companyApi.getById(id)
      .then(res => {
        const c = res.data.data
        setForm({
          name: c.name, email: c.email, phone: c.phone || '', website: c.website || '',
          industry: c.industry, description: c.description || '', city: c.city || '',
          country: c.country || 'India', address: c.address || '',
          hrContactName: c.hrContactName || '', hrContactEmail: c.hrContactEmail || '',
          status: c.status
        })
      })
      .catch(() => toast.error('Failed to load company'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const validate = () => {
    const e = {}
    if (!form.name.trim())    e.name     = 'Company name is required'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.industry)       e.industry = 'Industry is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      if (isEdit) { await companyApi.update(id, form); toast.success('Company updated') }
      else        { await companyApi.create(form);     toast.success('Company created') }
      navigate('/companies')
    } catch (err) {
      const vErrors = err.response?.data?.validationErrors
      if (vErrors) setErrors(vErrors)
    } finally { setLoading(false) }
  }

  if (fetching) return <LoadingSpinner />

  const F = ({ label, name, type='text', required, options, rows, placeholder='' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {options ? (
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
      <button onClick={() => navigate('/companies')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size={16} /> Back to Companies
      </button>
      <div className="card">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Company' : 'Add New Company'}
        </h1>
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <F label="Company Name" name="name"     required placeholder="Google India" />
            <F label="Industry"     name="industry" options={INDUSTRIES} required />
            <F label="Email"        name="email"    type="email" required placeholder="hr@company.com" />
            <F label="Phone"        name="phone"    type="tel"   placeholder="+91 80-12345678" />
            <F label="Website"      name="website"  placeholder="https://company.com" />
            <F label="City"         name="city"     placeholder="Bengaluru" />
            <F label="HR Contact Name"  name="hrContactName"  placeholder="Jane Smith" />
            <F label="HR Contact Email" name="hrContactEmail" type="email" placeholder="jane@company.com" />
            <F label="Status" name="status" options={['ACTIVE','INACTIVE','BLACKLISTED']} />
          </div>
          <F label="Address" name="address" rows={2} placeholder="Full address" />
          <F label="Description" name="description" rows={3} placeholder="Brief company description" />

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving…' : isEdit ? 'Update Company' : 'Create Company'}
            </button>
            <button type="button" onClick={() => navigate('/companies')} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
