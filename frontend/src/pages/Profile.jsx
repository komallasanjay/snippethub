import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usersApi } from '@/api/users.api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Avatar } from '@/components/ui/Avatar';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState({
    bio: user?.bio || '',
    avatarUrl: user?.avatarUrl || ''
  });
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      await usersApi.updateProfile(profileData);
      toast.success('Profile updated successfully (Please re-login to see changes immediately)');
    } catch (err) {
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    try {
      await usersApi.changePassword(passwordData);
      toast.success('Password changed successfully');
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you absolutely sure you want to delete your account? This action cannot be undone.')) {
      try {
        await usersApi.deleteAccount();
        logout();
        navigate('/');
        toast.success('Account deleted successfully');
      } catch (err) {
        toast.error('Failed to delete account');
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto space-y-8 mt-8">
      <div>
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ml-3 text-muted-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      <div className="flex items-center gap-6 pb-6 border-b">
        <Avatar src={user.avatarUrl} fallback={user.username} size="xl" />
        <div>
          <h1 className="text-3xl font-bold">{user.username}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Avatar URL</label>
              <Input 
                placeholder="https://example.com/avatar.png" 
                value={profileData.avatarUrl} 
                onChange={e => setProfileData({...profileData, avatarUrl: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <Textarea 
                placeholder="Tell us about yourself" 
                value={profileData.bio} 
                onChange={e => setProfileData({...profileData, bio: e.target.value})} 
              />
            </div>
            <Button type="submit" isLoading={isUpdating}>Save Profile</Button>
          </form>
        </section>
        
        <hr className="border-border" />

        <section>
          <h2 className="text-xl font-semibold mb-4">Change Password</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input 
                type="password" 
                required 
                value={passwordData.oldPassword} 
                onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input 
                type="password" 
                required 
                value={passwordData.newPassword} 
                onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
              />
            </div>
            <Button type="submit">Update Password</Button>
          </form>
        </section>

        <hr className="border-border" />

        <section className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold text-destructive">Danger Zone</h2>
          <div className="flex gap-4">
             <Button type="button" variant="outline" onClick={handleLogout}>Log Out</Button>
             <Button type="button" variant="destructive" className="bg-red-600 hover:bg-red-800" onClick={handleDeleteAccount}>Delete Account</Button>
          </div>
        </section>
      </div>
    </div>
  );
};
