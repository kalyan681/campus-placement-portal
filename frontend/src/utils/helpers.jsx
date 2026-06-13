// Badge color maps for status enums

export function getStatusBadge(status) {
  const map = {
    // Student
    ACTIVE:    'badge-green',
    INACTIVE:  'badge-gray',
    GRADUATED: 'badge-blue',
    PLACED:    'badge-purple',
    // Company
    BLACKLISTED: 'badge-red',
    // Drive
    UPCOMING:  'badge-blue',
    COMPLETED: 'badge-gray',
    CANCELLED: 'badge-red',
    // Application
    APPLIED:              'badge-blue',
    SHORTLISTED:          'badge-yellow',
    INTERVIEW_SCHEDULED:  'badge-purple',
    SELECTED:             'badge-green',
    REJECTED:             'badge-red',
    WITHDRAWN:            'badge-gray',
  }
  return map[status] || 'badge-gray'
}

export function StatusBadge({ status }) {
  return <span className={getStatusBadge(status)}>{status?.replace(/_/g, ' ')}</span>
}

export function formatDate(date) {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  })
}

export function formatCurrency(value) {
  if (!value) return '—'
  return `₹${value} LPA`
}
