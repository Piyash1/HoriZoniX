import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { verifyEmail } from '../lib/api'

const VerifyEmail = () => {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      setStatus('error')
      setMessage('Missing token')
      return
    }
    verifyEmail(token)
      .then(() => {
        setStatus('success')
        setMessage('Email verified! You can now sign in.')
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err?.message || 'Verification failed')
      })
  }, [])

  return (
    <div className='min-h-screen flex items-center justify-center p-6'>
      <div className='bg-white/80 backdrop-blur p-8 rounded-xl shadow max-w-md w-full text-center'>
        {status === 'verifying' && <p>Verifying your email...</p>}
        {status !== 'verifying' && (
          <>
            <p className={status === 'success' ? 'text-green-700' : 'text-red-700'}>{message}</p>
            <div className='mt-4'>
              <Link to='/' className='text-indigo-700 hover:underline'>Go to sign in</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail
