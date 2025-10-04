import { assets } from '../assets/assets'
import { Star } from 'lucide-react'
import { useState } from 'react'
import { register, login } from '../lib/api'
import { Link } from 'react-router-dom'

const Signup = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordErrors, setPasswordErrors] = useState([])

  // Password validation function
  const validatePassword = (password) => {
    const errors = []
    let strength = 0

    // Length check
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    } else {
      strength += 1
    }

    // Uppercase check
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    } else {
      strength += 1
    }

    // Lowercase check
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    } else {
      strength += 1
    }

    // Number check
    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number')
    } else {
      strength += 1
    }

    // Special character check
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('Password must contain at least one special character')
    } else {
      strength += 1
    }

    setPasswordErrors(errors)
    setPasswordStrength(strength)
    return errors.length === 0
  }

  // Handle password change
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value
    setPassword(newPassword)
    validatePassword(newPassword)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    // Validate password strength
    if (!validatePassword(password)) {
      setError('Please fix the password requirements below')
      return
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      const res = await register({
        first_name: firstName,
        last_name: lastName,
        username: username || undefined,
        email,
        password,
      })
      // Show success message
      setError('')
      alert('Account created successfully! You can now sign in.')
      window.location.href = '/'
    } catch (err) {
      if (err?.response?.data?.password_errors) {
        setPasswordErrors(err.response.data.password_errors)
        setError('Password does not meet requirements')
      } else {
        setError(err?.message || 'Signup failed')
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
          <h1 className='text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent'>Join the HoriZonix community</h1>
          <p className='text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md'>Create your account to get started</p>
        </div>
        <span className='md:h-10'></span>
      </div>
      <div className='flex-1 flex items-center justify-center p-6 sm:p-10'>
        <form onSubmit={onSubmit} name="signup" className='bg-gradient-to-tr from-blue-50/90 via-white/80 to-blue-100/60 backdrop-blur p-6 md:p-8 rounded-xl shadow w-full max-w-sm space-y-4'>
          <h2 className='text-2xl font-semibold text-indigo-900'>Sign up</h2>
          {error && <p className='text-red-600 text-sm'>{error}</p>}

          <div className='grid grid-cols-2 gap-3'>
            <div>
              <label className='block text-sm text-gray-700 mb-1'>First name</label>
              <input 
                value={firstName} 
                onChange={(e)=>setFirstName(e.target.value)} 
                type='text' 
                className='w-full border rounded px-3 py-2' 
                autoComplete='given-name'
                required 
              />
            </div>
            <div>
              <label className='block text-sm text-gray-700 mb-1'>Last name</label>
              <input 
                value={lastName} 
                onChange={(e)=>setLastName(e.target.value)} 
                type='text' 
                className='w-full border rounded px-3 py-2' 
                autoComplete='family-name'
                required 
              />
            </div>
          </div>

          <div>
            <label className='block text-sm text-gray-700 mb-1'>Username (optional)</label>
            <input 
              value={username} 
              onChange={(e)=>setUsername(e.target.value)} 
              type='text' 
              className='w-full border rounded px-3 py-2' 
              autoComplete='username'
            />
          </div>

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
              onChange={handlePasswordChange} 
              type='password' 
              className={`w-full border rounded px-3 py-2 ${passwordErrors.length > 0 ? 'border-red-300 focus:border-red-500' : 'border-gray-300 focus:border-indigo-500'}`} 
              autoComplete='new-password'
              required 
            />
            
            {/* Password Strength Indicator */}
            {password && (
              <div className='mt-2'>
                <div className='flex items-center gap-2 mb-2'>
                  <div className='flex-1 bg-gray-200 rounded-full h-2'>
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength <= 1 ? 'bg-red-500' :
                        passwordStrength <= 2 ? 'bg-orange-500' :
                        passwordStrength <= 3 ? 'bg-yellow-500' :
                        passwordStrength <= 4 ? 'bg-blue-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    ></div>
                  </div>
                  <span className={`text-xs font-medium ${
                    passwordStrength <= 1 ? 'text-red-600' :
                    passwordStrength <= 2 ? 'text-orange-600' :
                    passwordStrength <= 3 ? 'text-yellow-600' :
                    passwordStrength <= 4 ? 'text-blue-600' : 'text-green-600'
                  }`}>
                    {passwordStrength <= 1 ? 'Weak' :
                     passwordStrength <= 2 ? 'Fair' :
                     passwordStrength <= 3 ? 'Good' :
                     passwordStrength <= 4 ? 'Strong' : 'Very Strong'}
                  </span>
                </div>
                
                {/* Password Requirements */}
                <div className='text-xs text-gray-600 space-y-1'>
                  {passwordErrors.map((error, index) => (
                    <div key={index} className='flex items-center gap-1 text-red-600'>
                      <span className='text-red-500'>✗</span>
                      {error}
                    </div>
                  ))}
                  {passwordErrors.length === 0 && password && (
                    <div className='flex items-center gap-1 text-green-600'>
                      <span className='text-green-500'>✓</span>
                      Password meets all requirements
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className='block text-sm text-gray-700 mb-1'>Confirm password</label>
            <input 
              value={confirmPassword} 
              onChange={(e)=>setConfirmPassword(e.target.value)} 
              type='password' 
              className='w-full border rounded px-3 py-2' 
              autoComplete='new-password'
              required 
            />
          </div>
          <button 
            type='submit' 
            disabled={loading}
            className='w-full py-2.5 rounded bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.99] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2'
          >
            {loading && (
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
            )}
            {loading ? 'Creating account...' : 'Create account'}
          </button>

          <p className='text-sm text-gray-700 text-center'>Already have an account? <Link to='/' className='text-indigo-700 hover:underline'>Sign in</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Signup
