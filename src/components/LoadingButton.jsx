import React from 'react'

const LoadingButton = ({ 
  children, 
  loading, 
  loadingText, 
  disabled, 
  className = '', 
  onClick,
  type = 'button',
  ...props 
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading && (
        <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current'></div>
      )}
      {loading ? loadingText : children}
    </button>
  )
}

export default LoadingButton
