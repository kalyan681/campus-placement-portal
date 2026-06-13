import api from './axiosClient'

// ─── Auth ────────────────────────────────────────────────────────────────────
export const authApi = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
}

// ─── Students ────────────────────────────────────────────────────────────────
export const studentApi = {
  getAll:    (params) => api.get('/students', { params }),
  search:    (params) => api.get('/students/search', { params }),
  getById:   (id)     => api.get(`/students/${id}`),
  create:    (data)   => api.post('/students', data),
  update:    (id, data) => api.put(`/students/${id}`, data),
  delete:    (id)     => api.delete(`/students/${id}`),
  markPlaced:(id, company, packageLpa) =>
    api.patch(`/students/${id}/place`, null, { params: { company, packageLpa } }),
}

// ─── Companies ───────────────────────────────────────────────────────────────
export const companyApi = {
  getAll:       (params)     => api.get('/companies', { params }),
  search:       (params)     => api.get('/companies/search', { params }),
  getById:      (id)         => api.get(`/companies/${id}`),
  create:       (data)       => api.post('/companies', data),
  update:       (id, data)   => api.put(`/companies/${id}`, data),
  delete:       (id)         => api.delete(`/companies/${id}`),
  updateStatus: (id, status) => api.patch(`/companies/${id}/status`, null, { params: { status } }),
}

// ─── Placement Drives ────────────────────────────────────────────────────────
export const driveApi = {
  getAll:       (params)     => api.get('/drives', { params }),
  search:       (params)     => api.get('/drives/search', { params }),
  getById:      (id)         => api.get(`/drives/${id}`),
  create:       (data)       => api.post('/drives', data),
  update:       (id, data)   => api.put(`/drives/${id}`, data),
  delete:       (id)         => api.delete(`/drives/${id}`),
  updateStatus: (id, status) => api.patch(`/drives/${id}/status`, null, { params: { status } }),
}

// ─── Applications ────────────────────────────────────────────────────────────
export const applicationApi = {
  apply:         (data)          => api.post('/applications', data),
  getById:       (id)            => api.get(`/applications/${id}`),
  getByStudent:  (studentId, params) => api.get(`/applications/student/${studentId}`, { params }),
  getByDrive:    (driveId, params)   => api.get(`/applications/drive/${driveId}`, { params }),
  updateStatus:  (id, status, remarks) =>
    api.patch(`/applications/${id}/status`, null, { params: { status, remarks } }),
  withdraw:      (id)            => api.patch(`/applications/${id}/withdraw`),
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
export const dashboardApi = {
  getStats: () => api.get('/dashboard/stats'),
}
