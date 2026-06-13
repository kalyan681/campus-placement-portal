import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { studentApi } from '../../api/services'
import { LoadingSpinner } from '../../components/common'
import toast from 'react-hot-toast'
import { ArrowLeft } from 'lucide-react'

const DEPARTMENTS = ['CSE','IT','ECE','MECH','CIVIL','EEE','MBA']
const DEGREES     = ['B.Tech','M.Tech','MBA','MCA','BCA','B.Sc','M.Sc']

const INIT = {
  rollNumber:'', firstName:'', lastName:'', email:'', phone:'',
  department:'CSE', degree:'B.Tech', cgpa:'', graduationYear:'',
  skills:'', resumeUrl:'', status:'ACTIVE'
}

export default function StudentForm() {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isEdit   = Boolean(id)

  const [form, setForm]         = useState(INIT)
  const [errors, setErrors]     = useState({})
  const [loading, setLoading]   = useState(false)
  const [fetching, setFetching] = useState(isEdit)

  useEffect(() => {
    if (!isEdit) return
    studentApi.getById(id)
      .then(res => {
        const s = res.data.data
        setForm({
          rollNumber: s.rollNumber, firstName: s.firstName, lastName: s.lastName,
          email: s.email, phone: s.phone || '', department: s.department, degree: s.degree,
          cgpa: s.cgpa ?? '', graduationYear: s.graduationYear ?? '',
          skills: s.skills || '', resumeUrl: s.resumeUrl || '', status: s.status
        })
      })
      .catch(() => toast.error('Failed to load student'))
      .finally(() => setFetching(false))
  }, [id, isEdit])

  const validate = () => {
    const e = {}
    if (!form.rollNumber.trim()) e.rollNumber  = 'Roll number is required'
    if (!form.firstName.trim())  e.firstName   = 'First name is required'
    if (!form.lastName.trim())   e.lastName    = 'Last name is required'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required'
    if (!form.department)        e.department  = 'Department is required'
    if (!form.degree)            e.degree      = 'Degree is required'
    if (form.cgpa !== '' && (Number(form.cgpa) < 0 || Number(form.cgpa) > 10))
      e.cgpa = 'CGPA must be between 0 and 10'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const payload = { ...form, cgpa: form.cgpa ? Number(form.cgpa) : null,
                      graduationYear: form.graduationYear ? Number(form.graduationYear) : null }
    try {
      if (isEdit) {
        await studentApi.update(id, payload)
        toast.success('Student updated successfully')
      } else {
        await studentApi.create(payload)
        toast.success('Student created successfully')
      }
      navigate('/students')
    } catch (err) {
      const vErrors = err.response?.data?.validationErrors
      if (vErrors) setErrors(vErrors)
    } finally { setLoading(false) }
  }

  if (fetching) return <LoadingSpinner />

  const F = ({ label, name, type='text', required, options, placeholder='' }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {options ? (
        <select value={form[name]} onChange={e => setForm({...form, [name]: e.target.value})}
          className={`input-field ${errors[name] ? 'input-error' : ''}`}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[name]} placeholder={placeholder}
          onChange={e => setForm({...form, [name]: e.target.value})}
          className={`input-field ${errors[name] ? 'input-error' : ''}`} />
      )}
      {errors[name] && <p className="text-xs text-red-500 mt-1">{errors[name]}</p>}
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <button onClick={() => navigate('/students')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors">
        <ArrowLeft size={16} /> Back to Students
      </button>

      <div className="card">
        <h1 className="text-xl font-bold text-gray-900 mb-6">
          {isEdit ? 'Edit Student' : 'Add New Student'}
        </h1>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <F label="Roll Number" name="rollNumber" required placeholder="CS2025001" />
            <F label="Status"      name="status"     options={['ACTIVE','INACTIVE','GRADUATED','PLACED']} />
            <F label="First Name"  name="firstName"  required placeholder="John" />
            <F label="Last Name"   name="lastName"   required placeholder="Doe" />
            <F label="Email"       name="email"      type="email" required placeholder="john@example.com" />
            <F label="Phone"       name="phone"      type="tel"   placeholder="+91 9000000000" />
            <F label="Department"  name="department" options={DEPARTMENTS} required />
            <F label="Degree"      name="degree"     options={DEGREES}     required />
            <F label="CGPA"        name="cgpa"       type="number" placeholder="8.5" />
            <F label="Graduation Year" name="graduationYear" type="number" placeholder="2025" />
          </div>
          <F label="Skills (comma-separated)" name="skills"    placeholder="Java, React, MySQL…" />
          <F label="Resume URL"               name="resumeUrl" placeholder="https://drive.google.com/…" />

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Saving…' : isEdit ? 'Update Student' : 'Create Student'}
            </button>
            <button type="button" onClick={() => navigate('/students')} className="btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
