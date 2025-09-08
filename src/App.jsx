import React, { useEffect, useState, createContext, useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Feed from './pages/Feed'
import Messages from './pages/Messages'
import ChatBox from './pages/ChatBox'
import Connections from './pages/Connections'
import Discover from './pages/Discover'
import Profile from './pages/Profile'
import CreatePost from './pages/CreatePost'
import PostDetail from './pages/PostDetail'
import Layout from './pages/Layout'
import Signup from './pages/Signup'
import VerifyEmail from './pages/VerifyEmail'
import {Toaster} from 'react-hot-toast'
import { getMe } from './lib/api'

// Create auth context
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const App = () => {
  const [isSignedIn, setIsSignedIn] = useState(null)

  const checkAuth = async () => {
    try {
      const res = await getMe()
      setIsSignedIn(!!res?.user)
      return !!res?.user
    } catch (error) {
      console.error('Auth check failed:', error)
      setIsSignedIn(false)
      return false
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  if (isSignedIn === null) return null

  return (
    <AuthContext.Provider value={{ isSignedIn, checkAuth }}>
      <Toaster />
      <Routes>
        <Route path='/' element={ !isSignedIn ? <Login /> : <Layout /> }>
          <Route index element={<Feed />} />
          <Route path='messages' element={<Messages />} />
          <Route path='messages/:userId' element={<ChatBox />} />
          <Route path='connections' element={<Connections />} />
          <Route path='discover' element={<Discover />} />
          <Route path='profile' element={<Profile />} />
          <Route path='profile/:profileId' element={<Profile />} />
          <Route path='create-post' element={<CreatePost />} />
          <Route path='post/:postId' element={<PostDetail />} />
        </Route>
        <Route path='/signup' element={<Signup />} />
        <Route path='/verify-email' element={<VerifyEmail />} />
      </Routes>
    </AuthContext.Provider>
  )
}

export default App;
