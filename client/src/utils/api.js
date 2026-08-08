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
  try {
    const res = await fetch(`${API_BASE}/inspections/analyze`, {
      method: 'POST',
      body: formData,
    });
    if (res.ok) return res.json();

    // Fallback: If FormData upload fails, retry as JSON payload with Base64 imageDataUrl
    const location = formData.get('location') || 'Building Main Facility';
    const description = formData.get('description') || 'Visual defect inspection';
    const imageDataUrl = formData.get('imageDataUrl') || null;
    const jsonRes = await fetch(`${API_BASE}/inspections/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ location, description, imageDataUrl }),
    });

    if (jsonRes.ok) return jsonRes.json();
    const errData = await jsonRes.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP ${jsonRes.status}`);
  } catch (err) {
    try {
      const location = formData.get('location') || 'Building Main Facility';
      const description = formData.get('description') || 'Visual defect inspection';
      const imageDataUrl = formData.get('imageDataUrl') || null;
      const jsonRes = await fetch(`/api/inspections/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ location, description, imageDataUrl }),
      });
      if (jsonRes.ok) return jsonRes.json();
    } catch (e) {
      // Ignore
    }
    throw new Error(err.message || 'Failed to submit inspection');
  }
}

export async function verifyRepair(id, formData) {
  try {
    const res = await fetch(`${API_BASE}/work-orders/${id}/verify`, {
      method: 'POST',
      body: formData,
    });
    if (res.ok) return res.json();

    // Fallback JSON payload
    const afterImageDataUrl = formData.get('afterImageDataUrl') || null;
    const jsonRes = await fetch(`${API_BASE}/work-orders/${id}/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: true, afterImageDataUrl }),
    });

    if (jsonRes.ok) return jsonRes.json();
    const errData = await jsonRes.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP ${jsonRes.status}`);
  } catch (err) {
    throw new Error(err.message || 'Failed to verify repair');
  }
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
