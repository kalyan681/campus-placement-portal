import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../../api/services'
import toast from 'react-hot-toast'
import { GraduationCap } from 'lucide-react'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm]       = useState({ username:'', email:'', password:'', fullName:'', phone:'' })
  const [errors, setErrors]   = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!form.username.trim() || form.username.length < 3) e.username = 'Username must be at least 3 characters'
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email))  e.email    = 'Valid email is required'
    if (!form.password || form.password.length < 6)        e.password = 'Password must be at least 6 characters'
    if (!form.fullName.trim())                             e.fullName = 'Full name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await authApi.register({ ...form, roles: ['student'] })
      toast.success('Registration successful! Please login.')
      navigate('/login')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const field = (label, key, type='text', placeholder='') => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input type={type} value={form[key]} placeholder={placeholder}
        onChange={e => setForm({...form, [key]: e.target.value})}
        className={`input-field ${errors[key] ? 'input-error' : ''}`}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 via-primary-700 to-primary-500
                    flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur mb-4">
            <GraduationCap className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-primary-200 mt-1 text-sm">Register as a student</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {field('Full Name',  'fullName',  'text',     'Your full name')}
            {field('Username',   'username',  'text',     'Choose a username')}
            {field('Email',      'email',     'email',    'your@email.com')}
            {field('Password',   'password',  'password', 'Min. 6 characters')}
            {field('Phone',      'phone',     'tel',      '+91 9000000000')}

            <button type="submit" disabled={loading} className="btn-primary w-full py-2.5 text-base mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
