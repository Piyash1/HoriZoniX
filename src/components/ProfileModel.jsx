import React, { useState, useEffect, useRef } from 'react'
import { Pencil } from 'lucide-react';
import { getProfile, updateProfile } from '../lib/api'
import LoadingButton from './LoadingButton'

const ProfileModel = ({setShowEdit, onProfileUpdate}) => {

  const [editForm, setEditForm] = useState({
    username: '',
    bio: '',
    location: '',
    profile_picture: null,
    cover_photo: null,
    full_name: '',
    profile_picture_url: '',
    cover_photo_url: '',
  })
  const [saving, setSaving] = useState(false)
  const profileInputRef = useRef(null)
  const coverInputRef = useRef(null)

  useEffect(() => {
    getProfile().then((u) => {
      setEditForm({
        username: u.username || '',
        bio: u.bio || '',
        location: u.location || '',
        profile_picture: null,
        cover_photo: null,
        full_name: `${u.first_name || ''} ${u.last_name || ''}`.trim() || u.username,
        profile_picture_url: u.profile_picture_url || u.profile_picture || '',
        cover_photo_url: u.cover_photo_url || u.cover_photo || '',
      })
    })
  }, [])

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (saving) return
    setSaving(true)
    const [firstName, ...lastParts] = editForm.full_name.split(' ').filter(Boolean)
    const form = new FormData()
    form.append('username', editForm.username)
    form.append('bio', editForm.bio)
    form.append('location', editForm.location)
    form.append('first_name', firstName || '')
    form.append('last_name', lastParts.join(' '))
    
    // Only append files if they exist and are valid
    if (editForm.profile_picture && editForm.profile_picture.size > 0) {
      form.append('profile_picture', editForm.profile_picture)
    }
    if (editForm.cover_photo && editForm.cover_photo.size > 0) {
      form.append('cover_photo', editForm.cover_photo)
    }
    
    try {
      await updateProfile(form)
      // Refresh the profile data in the parent component
      if (onProfileUpdate) {
        onProfileUpdate()
      }
      setShowEdit(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className='fixed top-0 left-0 bottom-0 right-0 z-[110] h-screen overflow-y-scroll bg-black/50'>
        <div className='max-w-2xl sm:py-6 mx-auto'>
          <div className='bg-white rounded-lg shadow p-6'>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>Edit Profile</h1>

            <form className='space-y-4' onSubmit={handleSaveProfile}>
              {/* Profile Picture */}
              <div className='flex flex-col items-center gap-3'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Profile Picture
                </label>
                <input
                  ref={profileInputRef}
                  hidden
                  type="file"
                  accept='image/*'
                  id='profile_picture'
                  onChange={(e)=> {
                    const file = e.target.files[0];
                    if (file && file.size > 0) {
                      setEditForm({...editForm, profile_picture: file});
                    } else {
                      setEditForm({...editForm, profile_picture: null});
                    }
                  }}
                />
                <div className='group relative cursor-pointer' onClick={()=> profileInputRef.current?.click()}>
                  <img
                    src={editForm.profile_picture ? URL.createObjectURL(editForm.profile_picture) : (editForm.profile_picture_url || undefined)}
                    alt='Profile preview'
                    className='w-24 h-24 rounded-full object-cover mt-2 bg-gray-100'
                  />
                  <div className='absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/25 rounded-full'>
                    <Pencil className='w-5 h-5 text-white' />
                  </div>
                </div>
              </div>

              {/* Cover Photo */}
              <div className='flex flex-col items-start gap-3'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Cover Photo
                </label>
                <input
                  ref={coverInputRef}
                  hidden
                  type="file"
                  accept='image/*'
                  id='cover_photo'
                  onChange={(e)=> {
                    const file = e.target.files[0];
                    if (file && file.size > 0) {
                      setEditForm({...editForm, cover_photo: file});
                    } else {
                      setEditForm({...editForm, cover_photo: null});
                    }
                  }}
                />
                <div className='group relative cursor-pointer' onClick={()=> coverInputRef.current?.click()}>
                  <img
                    src={editForm.cover_photo ? URL.createObjectURL(editForm.cover_photo) : (editForm.cover_photo_url || undefined)}
                    className='w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2'
                    alt='Cover preview'
                  />
                  <div className='absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/20 rounded-lg'>
                    <Pencil className='w-5 h-5 text-white' />
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Name
                </label>
                <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Please enter your full name' onChange={(e)=> setEditForm({...editForm, full_name: e.target.value})} value={editForm.full_name} />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Username
                </label>
                <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Please enter a username' onChange={(e)=> setEditForm({...editForm, username: e.target.value})} value={editForm.username} />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Bio
                </label>
                <textarea rows={3} className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Please enter a short bio' onChange={(e)=> setEditForm({...editForm, bio: e.target.value})} value={editForm.bio} />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Location
                </label>
                <input type="text" className='w-full p-3 border border-gray-200 rounded-lg' placeholder='Please enter your location' onChange={(e)=> setEditForm({...editForm, location: e.target.value})} value={editForm.location} />
              </div>

              <div className='flex justify-end space-x-3 pt-6'>

                <button onClick={()=> setShowEdit(false)} type='button' className='px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer'>Cancel</button>

                <LoadingButton
                  type='submit'
                  loading={saving}
                  loadingText='Saving...'
                  className='px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition cursor-pointer'
                >
                  Save Changes
                </LoadingButton>

              </div>

            </form>
          </div>
        </div>
    </div>
  )
}

export default ProfileModel