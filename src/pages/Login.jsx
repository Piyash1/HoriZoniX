import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import { useState } from 'react'
import { login, getMe, refreshCsrfToken } from '../lib/api'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { checkAuth } = useAuth()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const loginResponse = await login({ email, password })
      if (loginResponse?.user) {
        // Login successful and user data received
        console.log('Login successful, refreshing CSRF token...')
        await refreshCsrfToken()
        console.log('CSRF refreshed, checking auth state...')
        const isAuthenticated = await checkAuth()
        if (isAuthenticated) {
          console.log('Auth state updated, redirecting to feed...')
          navigate('/', { replace: true })
        } else {
          setError('Login succeeded but authentication state not updated.')
        }
      } else {
        // Fallback: check session with /me endpoint
        console.log('Login response missing user, checking /me endpoint...')
        const me = await getMe()
        if (me?.user) {
          console.log('Me endpoint successful, updating auth state...')
          const isAuthenticated = await checkAuth()
          if (isAuthenticated) {
            console.log('Auth state updated, redirecting to feed...')
            navigate('/', { replace: true })
          } else {
            setError('Login succeeded but authentication state not updated.')
          }
        } else {
          setError('Login succeeded but session not set. Check cookies/CSRF config.')
        }
      }
    } catch (err) {
      console.error('Login error:', err)
      const errorMessage = err?.response?.data?.error || err?.message || 'Login failed'
      setError(errorMessage)
      
      // If it's an email verification error, show a link to resend verification
      if (errorMessage.includes('verify your email')) {
        setError(errorMessage + ' Click here to resend verification email.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
      <img src={assets.bgImage} alt="" className='absolute top-0 left-0 -z-1 w-full h-full object-cover' />

      <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40'>
        <img src={assets.logo} alt="" className='h-12 object-contain' />
        <div>
          <div className='flex items-center gap-3 mb-4 max-md:mt-10'>
            <img src={assets.group_users} alt=""  className='h-8 md:h-10'/>
            <div>
              <div className='flex'>
                {Array(5).fill(0).map((_, i)=>(<Star key={i} className='size-4 md:size-4.5 text-transparent fill-amber-500' />))}
              </div>
              <p>Used By 12k+ Developers</p>
            </div>
          </div>
          <h1 className='text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent'>More than just friends truely connect</h1>
          <p className='text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md'>Connect with global community on HoriZonix</p>
        </div>
        <span className='md:h-10'></span>
      </div>
      <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
        <form onSubmit={onSubmit} name="login" className='bg-gradient-to-tr from-blue-50/90 via-white/80 to-blue-100/60 backdrop-blur p-6 md:p-8 rounded-xl shadow w-full max-w-sm space-y-4'>
          <h2 className='text-2xl font-semibold text-indigo-900'>Sign in</h2>
          {error && <p className='text-red-600 text-sm'>{error}</p>}
          <div>
            <label className='block text-sm text-gray-700 mb-1'>Email</label>
            <input 
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
              type='email' 
              className='w-full border rounded px-3 py-2' 
              autoComplete='email'
              required 
            />
          </div>
          <div>
            <label className='block text-sm text-gray-700 mb-1'>Password</label>
            <input 
              value={password} 
              onChange={(e)=>setPassword(e.target.value)} 
              type='password' 
              className='w-full border rounded px-3 py-2' 
              autoComplete='current-password'
              required 
              minLength="8"
            />
          </div>
          <button 
            type='submit' 
            disabled={loading}
            className='w-full py-2.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {loading && (
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
            )}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>

          <p className='text-sm text-gray-700 text-center'>No account? <Link to='/signup' className='text-indigo-700 hover:underline'>Sign up here</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Login