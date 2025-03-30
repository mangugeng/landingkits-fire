"use client";

import { useState, useEffect } from 'react';
import { auth, db, storage } from '@/lib/firebase';
import { onAuthStateChanged, updateProfile, updateEmail, updatePassword, sendEmailVerification, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, updateDoc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { FiUser, FiLock, FiMail, FiSave, FiCamera, FiCheck, FiX, FiShield, FiBell, FiActivity } from 'react-icons/fi';

interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  bio?: string;
  photoURL?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

interface Activity {
  id: string;
  type: string;
  description: string;
  timestamp: Date;
}

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    phone: '',
    address: '',
    bio: '',
    photoURL: '',
    emailVerified: false,
    twoFactorEnabled: false,
    notifications: {
      email: true,
      push: true,
      sms: false
    }
  });
  const [password, setPassword] = useState({
    current: '',
    new: '',
    confirm: ''
  });
  const [activities, setActivities] = useState<Activity[]>([]);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/auth');
        return;
      }

      try {
        // Fetch user profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setProfile({
            name: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified,
            phone: data.phone || '',
            address: data.address || '',
            bio: data.bio || '',
            twoFactorEnabled: data.twoFactorEnabled || false,
            notifications: {
              email: data.notifications?.email ?? true,
              push: data.notifications?.push ?? true,
              sms: data.notifications?.sms ?? false
            }
          });
        } else {
          setProfile({
            name: user.displayName || '',
            email: user.email || '',
            photoURL: user.photoURL || '',
            emailVerified: user.emailVerified,
            phone: '',
            address: '',
            bio: '',
            twoFactorEnabled: false,
            notifications: {
              email: true,
              push: true,
              sms: false
            }
          });
        }

        // Fetch user activities
        const activitiesQuery = query(
          collection(db, 'activities'),
          where('userId', '==', user.uid),
          orderBy('timestamp', 'desc')
        );
        const activitiesSnapshot = await getDocs(activitiesQuery);
        setActivities(activitiesSnapshot.docs.map(doc => ({
          id: doc.id,
          type: doc.data().type || 'unknown',
          description: doc.data().description || '',
          timestamp: doc.data().timestamp.toDate()
        })));
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFile(file);
    setSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      // Upload photo to Firebase Storage
      const storageRef = ref(storage, `profile-photos/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);

      // Update profile photo
      await updateProfile(user, { photoURL });
      await updateDoc(doc(db, 'users', user.uid), { photoURL });

      setProfile(prev => ({ ...prev, photoURL }));
      toast.success('Foto profil berhasil diperbarui');
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast.error('Gagal mengunggah foto profil');
    } finally {
      setSaving(false);
      setPhotoFile(null);
    }
  };

  const handleEmailVerification = async () => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      await sendEmailVerification(user);
      toast.success('Email verifikasi telah dikirim');
    } catch (error) {
      console.error('Error sending verification email:', error);
      toast.error('Gagal mengirim email verifikasi');
    }
  };

  const handleTwoFactorToggle = async () => {
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const newValue = !profile.twoFactorEnabled;
      await updateDoc(doc(db, 'users', user.uid), {
        twoFactorEnabled: newValue
      });

      setProfile(prev => ({ ...prev, twoFactorEnabled: newValue }));
      toast.success(newValue ? 'Two-factor authentication diaktifkan' : 'Two-factor authentication dinonaktifkan');
    } catch (error) {
      console.error('Error toggling 2FA:', error);
      toast.error('Gagal mengubah pengaturan 2FA');
    } finally {
      setSaving(false);
    }
  };

  const handleNotificationToggle = async (type: 'email' | 'push' | 'sms') => {
    setSaving(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const newValue = !profile.notifications[type];
      await updateDoc(doc(db, 'users', user.uid), {
        [`notifications.${type}`]: newValue
      });

      setProfile(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [type]: newValue
        }
      }));
      toast.success(`Notifikasi ${type} ${newValue ? 'diaktifkan' : 'dinonaktifkan'}`);
    } catch (error) {
      console.error('Error toggling notification:', error);
      toast.error('Gagal mengubah pengaturan notifikasi');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: profile.name
      });

      // Update Firestore profile
      await updateDoc(doc(db, 'users', user.uid), {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
        bio: profile.bio
      });

      toast.success('Profil berhasil diperbarui');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      await updateEmail(user, profile.email);
      await updateDoc(doc(db, 'users', user.uid), {
        email: profile.email
      });

      toast.success('Email berhasil diperbarui');
    } catch (error) {
      console.error('Error updating email:', error);
      toast.error('Gagal memperbarui email');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      toast.error('Password baru tidak cocok');
      return;
    }

    setSaving(true);

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      await updatePassword(user, password.new);
      toast.success('Password berhasil diperbarui');
      
      // Reset password form
      setPassword({
        current: '',
        new: '',
        confirm: ''
      });
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Gagal memperbarui password');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardContent>
          <Tabs defaultValue="profile" className="space-y-4">
            <TabsList>
              <TabsTrigger value="profile">Profil</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="security">Keamanan</TabsTrigger>
              <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
              <TabsTrigger value="activity">Aktivitas</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <form onSubmit={handleProfileUpdate} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={profile.photoURL || '/default-avatar.png'}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                    <label
                      htmlFor="photo-upload"
                      className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 shadow-lg cursor-pointer hover:bg-gray-100"
                    >
                      <FiCamera className="h-4 w-4 text-gray-600" />
                    </label>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                  <div className="flex-1">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nama</Label>
                      <Input
                        id="name"
                        value={profile.name}
                        onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Alamat</Label>
                  <Input
                    id="address"
                    value={profile.address}
                    onChange={(e) => setProfile(prev => ({ ...prev, address: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  <FiSave className="mr-2 h-5 w-5" />
                  {saving ? 'Menyimpan...' : 'Simpan Profil'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="email">
              <form onSubmit={handleEmailUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                    {!profile.emailVerified && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleEmailVerification}
                      >
                        <FiCheck className="mr-2 h-4 w-4" />
                        Verifikasi
                      </Button>
                    )}
                  </div>
                  {profile.emailVerified ? (
                    <div className="flex items-center text-green-600 text-sm">
                      <FiCheck className="mr-1 h-4 w-4" />
                      Email terverifikasi
                    </div>
                  ) : (
                    <div className="flex items-center text-yellow-600 text-sm">
                      <FiX className="mr-1 h-4 w-4" />
                      Email belum terverifikasi
                    </div>
                  )}
                </div>
                <Button type="submit" disabled={saving}>
                  <FiMail className="mr-2 h-5 w-5" />
                  {saving ? 'Menyimpan...' : 'Simpan Email'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="password">
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Password Saat Ini</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={password.current}
                    onChange={(e) => setPassword(prev => ({ ...prev, current: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Password Baru</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={password.new}
                    onChange={(e) => setPassword(prev => ({ ...prev, new: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={password.confirm}
                    onChange={(e) => setPassword(prev => ({ ...prev, confirm: e.target.value }))}
                    required
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  <FiLock className="mr-2 h-5 w-5" />
                  {saving ? 'Menyimpan...' : 'Simpan Password'}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="security">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-gray-500">
                      Tambahkan lapisan keamanan ekstra ke akun Anda
                    </p>
                  </div>
                  <Switch
                    checked={profile.twoFactorEnabled}
                    onCheckedChange={handleTwoFactorToggle}
                    disabled={saving}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Google Authenticator</h3>
                    <p className="text-sm text-gray-500">
                      Gunakan aplikasi Google Authenticator untuk verifikasi
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => toast('Fitur ini akan segera tersedia')}
                  >
                    <FiShield className="mr-2 h-4 w-4" />
                    Setup
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notifications">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Email Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Terima notifikasi melalui email
                    </p>
                  </div>
                  <Switch
                    checked={profile.notifications.email}
                    onCheckedChange={() => handleNotificationToggle('email')}
                    disabled={saving}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Push Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Terima notifikasi push di browser
                    </p>
                  </div>
                  <Switch
                    checked={profile.notifications.push}
                    onCheckedChange={() => handleNotificationToggle('push')}
                    disabled={saving}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">SMS Notifications</h3>
                    <p className="text-sm text-gray-500">
                      Terima notifikasi melalui SMS
                    </p>
                  </div>
                  <Switch
                    checked={profile.notifications.sms}
                    onCheckedChange={() => handleNotificationToggle('sms')}
                    disabled={saving}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FiActivity className="mx-auto h-8 w-8 mb-2" />
                    <p className="text-sm">Belum ada aktivitas</p>
                  </div>
                ) : (
                  activities.map(activity => (
                    <div
                      key={activity.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <FiActivity className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {activity.timestamp.toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
} 