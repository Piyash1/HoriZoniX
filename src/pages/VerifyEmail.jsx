import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { verifyEmail, resendVerificationEmail } from '../lib/api'
import toast from 'react-hot-toast'

const VerifyEmail = () => {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [isResending, setIsResending] = useState(false)

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Missing verification token')
      return
    }
    
    verifyEmail(token)
      .then(() => {
        setStatus('success')
        setMessage('Email verified successfully! You can now sign in.')
        toast.success('Email verified successfully!')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err?.response?.data?.error || err?.message || 'Verification failed')
        toast.error('Email verification failed')
      })
  }, [params])

  const handleResendVerification = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email address')
      return
    }

    setIsResending(true)
    try {
      await resendVerificationEmail(email)
      toast.success('Verification email sent! Check your inbox.')
      setMessage('A new verification email has been sent to your email address.')
    } catch (err) {
      toast.error(err?.response?.data?.error || 'Failed to resend verification email')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-indigo-50 to-purple-50'>
      <div className='bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-white/20'>
        {/* Header */}
        <div className='mb-6'>
          <div className='w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center'>
            {status === 'verifying' && (
              <div className='w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin'></div>
            )}
            {status === 'success' && (
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
              </svg>
            )}
            {status === 'error' && (
              <svg className='w-8 h-8 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
              </svg>
            )}
          </div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            {status === 'verifying' && 'Verifying Email...'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
          </h1>
        </div>

        {/* Content */}
        {status === 'verifying' && (
          <div className='space-y-4'>
            <p className='text-gray-600'>Please wait while we verify your email address...</p>
            <div className='w-full bg-gray-200 rounded-full h-2'>
              <div className='bg-indigo-600 h-2 rounded-full animate-pulse' style={{width: '60%'}}></div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className='space-y-4'>
            <p className='text-green-700 font-medium'>{message}</p>
            <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
              <p className='text-green-800 text-sm'>
                Your account is now verified and ready to use!
              </p>
            </div>
            <Link 
              to='/' 
              className='inline-block bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors'
            >
              Go to Sign In
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className='space-y-4'>
            <p className='text-red-700 font-medium'>{message}</p>
            <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
              <p className='text-red-800 text-sm mb-3'>
                Don't worry! You can request a new verification email.
              </p>
              <div className='space-y-3'>
                <input
                  type='email'
                  placeholder='Enter your email address'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                />
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className='w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                >
                  {isResending ? 'Sending...' : 'Resend Verification Email'}
                </button>
              </div>
            </div>
            <Link 
              to='/' 
              className='text-indigo-600 hover:text-indigo-800 hover:underline'
            >
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
