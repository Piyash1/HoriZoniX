import axios from 'axios';

// Configure axios base URL
const API_BASE = (function() {
  if (import.meta.env.VITE_API_BASE) {
    console.log('Using API_BASE from env:', import.meta.env.VITE_API_BASE);
    return import.meta.env.VITE_API_BASE;
  }
  const { protocol, hostname } = window.location;
  const port = '8000';
  const fallbackUrl = `${protocol}//${hostname}:${port}`;
  console.log('Using fallback API_BASE:', fallbackUrl);
  return fallbackUrl;
})();

console.log('Final API_BASE:', API_BASE);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get CSRF token
function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]*)'));
  return match ? decodeURIComponent(match[2]) : null;
}

// Cache CSRF token received from backend JSON (works cross-domain)
let cachedCsrfToken = null;
async function ensureCsrfToken() {
  if (cachedCsrfToken) return cachedCsrfToken;
  try {
    const resp = await axios.get(`${API_BASE}/api/auth/csrf/`, { withCredentials: true });
    cachedCsrfToken = resp?.data?.csrftoken || getCookie('csrftoken') || null;
  } catch (_) {
    cachedCsrfToken = getCookie('csrftoken') || null;
  }
  return cachedCsrfToken;
}

// Explicitly refresh CSRF token (use after login)
export async function refreshCsrfToken() {
  cachedCsrfToken = null;
  return ensureCsrfToken();
}

// Request interceptor to handle CSRF tokens and FormData
api.interceptors.request.use(async (config) => {
  // Handle FormData - don't set Content-Type for FormData
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  
  // Only add CSRF token for unsafe methods
  const method = config.method?.toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    try {
      // Prefer JSON token from backend, fallback to cookie
      let csrftoken = cachedCsrfToken || null;
      if (!csrftoken) {
        console.log('Getting CSRF token for', method, 'request to', config.url);
        csrftoken = await ensureCsrfToken();
      }
      
      if (csrftoken) {
        config.headers['X-CSRFToken'] = csrftoken;
        console.log('CSRF token added to request:', csrftoken);
      } else {
        console.warn('CSRF token not found in cookies');
      }
    } catch (error) {
      console.warn('Failed to get CSRF token:', error);
      // Don't block the request if CSRF fails
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.config.method?.toUpperCase(), response.config.url, response.status);
    return response.data;
  },
  async (error) => {
    console.error('API Error:', {
      method: error.config?.method?.toUpperCase(),
      url: error.config?.url,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });

    // Retry once on CSRF failures (403), fetching a fresh token
    const is403 = error.response?.status === 403;
    const detail = error.response?.data?.detail || '';
    const looksLikeCsrf = /csrf/i.test(detail || '') || /forbidden/i.test(error.response?.statusText || '');
    const originalConfig = error.config || {};
    if (is403 && looksLikeCsrf && !originalConfig._csrfRetried) {
      try {
        const fresh = await ensureCsrfToken();
        originalConfig.headers = originalConfig.headers || {};
        if (fresh) originalConfig.headers['X-CSRFToken'] = fresh;
        originalConfig._csrfRetried = true;
        return api.request(originalConfig);
      } catch (_) {
        // fall through to normal error handling
      }
    }

    // Build message
    let message = 'Request failed';
    if (error.response?.data) {
      if (typeof error.response.data === 'string' && error.response.data.includes('<!doctype html>')) {
        message = `Server Error (${error.response.status}): ${error.response.statusText}`;
      } else if (typeof error.response.data === 'object') {
        message = error.response.data.error || error.response.data.detail || error.response.data.message || `Server Error (${error.response.status})`;
      } else if (typeof error.response.data === 'string') {
        message = error.response.data;
      }
    } else if (error.message) {
      message = error.message;
    }
    throw new Error(message);
  }
);

// ==================== AUTH ENDPOINTS ====================

export async function healthCheck() {
  return api.get('/api/auth/health/');
}

export async function login({ email, password }) {
  return api.post('/api/auth/login/', { email, password });
}

export async function logout() {
  return api.post('/api/auth/logout/');
}

export async function register(payload) {
  return api.post('/api/auth/register/', payload);
}

export async function verifyEmail(token) {
  return api.post('/api/auth/verify-email/', { token });
}

export async function getMe() {
  return api.get('/api/auth/me/');
}

export async function getProfile() {
  return api.get('/api/auth/profile/');
}

export async function updateProfile(payload) {
  return api.put('/api/auth/profile/update/', payload);
}

export async function getProfileById(userId) {
  return api.get(`/api/auth/profile/${userId}/`);
}

// ==================== FOLLOWERS/FOLLOWING ====================

export async function listFollowers(userId) {
  const path = userId ? `/api/auth/followers/${userId}/` : '/api/auth/followers/';
  return api.get(path);
}

export async function listFollowing(userId) {
  const path = userId ? `/api/auth/following/${userId}/` : '/api/auth/following/';
  return api.get(path);
}

export async function listConnections(userId) {
  const path = userId ? `/api/auth/connections/${userId}/` : '/api/auth/connections/';
  return api.get(path);
}

// ==================== USER SEARCH & ACTIONS ====================

export async function searchUsers(query) {
  const q = encodeURIComponent(query || '');
  return api.get(`/api/auth/search/?q=${q}`);
}

export async function toggleFollow(userId) {
  return api.post(`/api/auth/follow/${userId}/`);
}

// ==================== CONNECTION REQUESTS ====================

export async function sendConnectionRequest(userId) {
  return api.post(`/api/auth/connections/request/${userId}/`);
}

export async function cancelConnectionRequest(userId) {
  return api.post(`/api/auth/connections/cancel/${userId}/`);
}

export async function listConnectionRequests() {
  return api.get('/api/auth/connections/requests/');
}

export async function respondConnectionRequest(requestId, action) {
  return api.post(`/api/auth/connections/respond/${requestId}/`, { action });
}

// ==================== POSTS ====================

export async function listPosts() {
  return api.get('/api/posts/');
}

export async function getPostById(postId) {
  return api.get(`/api/posts/${postId}/`);
}

export async function createPost({ content, files }) {
  const form = new FormData();
  form.append('content', content || '');
  (files || []).forEach(file => form.append('images', file));
  
  return api.post('/api/posts/', form);
}

export async function updatePost({ id, content, files }) {
  if (files && files.length) {
    const form = new FormData();
    form.append('content', content || '');
    files.forEach(file => form.append('images', file));
    
    return api.put(`/api/posts/${id}/`, form);
  }
  return api.put(`/api/posts/${id}/`, { content });
}

export async function deletePost(id) {
  return api.delete(`/api/posts/${id}/`);
}

// ==================== LIKES ====================

export async function toggleLike(postId) {
  return api.post(`/api/posts/${postId}/like/`);
}

export async function likePost(postId) {
  return api.post(`/api/posts/${postId}/like/`);
}

export async function unlikePost(postId) {
  return api.post(`/api/posts/${postId}/like/`);
}

// ==================== COMMENTS ====================

export async function listComments(postId) {
  return api.get(`/api/posts/${postId}/comments/`);
}

export async function createComment(postId, text) {
  return api.post(`/api/posts/${postId}/comments/`, { text });
}

export async function updateComment(commentId, text) {
  return api.put(`/api/posts/comments/${commentId}/`, { text });
}

export async function deleteComment(commentId) {
  return api.delete(`/api/posts/comments/${commentId}/`);
}

// ==================== SHARES ====================

export async function sharePost(postId) {
  return api.post(`/api/posts/${postId}/share/`);
}

// ==================== STORIES ====================

export async function listStories() {
  return api.get('/api/posts/stories/');
}

export async function createStory({ content, mediaType, backgroundColor, file }) {
  const form = new FormData();
  if (content) form.append('content', content);
  if (mediaType) form.append('media_type', mediaType);
  if (backgroundColor) form.append('background_color', backgroundColor);
  if (file) form.append('media', file);
  
  return api.post('/api/posts/stories/create/', form);
}

export async function deleteStory(storyId) {
  return api.delete(`/api/posts/stories/${storyId}/`);
}

// ==================== FEED (COMBINED POSTS + STORIES) ====================

export async function getFeeds() {
  try {
    const [posts, stories] = await Promise.all([
      api.get('/api/posts/'),
      api.get('/api/posts/stories/')
    ]);
    return { posts, stories };
  } catch (error) {
    console.error('Error fetching feeds:', error);
    throw error;
  }
}

export async function fetchFeeds() {
  return getFeeds();
}

// ==================== CHAT ====================

export async function listMessages(withUserId) {
  return api.get(`/api/chat/${withUserId}/`);
}

export async function sendMessage(withUserId, { text, imageFile }) {
  const form = new FormData();
  if (text) form.append('text', text);
  if (imageFile) form.append('image', imageFile);
  
  return api.post(`/api/chat/${withUserId}/send/`, form);
}

export async function listRecentThreads() {
  return api.get('/api/chat/recent/');
}

export async function getChats() {
  return api.get('/api/chat/recent/');
}

export async function getChat(withUserId) {
  return api.get(`/api/chat/${withUserId}/`);
}

export async function createChat(withUserId) {
  return api.post(`/api/chat/${withUserId}/`);
}

// Export the axios instance for custom requests if needed
export { api };