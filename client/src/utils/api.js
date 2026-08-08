const API_BASE = '/api';

export async function fetchWorkOrders(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.search) params.append('search', filters.search);

  const res = await fetch(`${API_BASE}/work-orders?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch work orders');
  return res.json();
}

export async function fetchWorkOrderById(id) {
  const res = await fetch(`${API_BASE}/work-orders/${id}`);
  if (!res.ok) throw new Error('Work order not found');
  return res.json();
}

export async function submitInspection(formData) {
  const res = await fetch(`${API_BASE}/inspections/analyze`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to submit inspection');
  }
  return res.json();
}

export async function verifyRepair(id, formData) {
  const res = await fetch(`${API_BASE}/work-orders/${id}/verify`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Failed to verify repair');
  }
  return res.json();
}

export async function updateWorkOrderStatus(id, updates) {
  const res = await fetch(`${API_BASE}/work-orders/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update status');
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_BASE}/stats`);
  if (!res.ok) throw new Error('Failed to fetch dashboard stats');
  return res.json();
}
