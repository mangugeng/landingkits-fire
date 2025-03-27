'use client';

import React, { useState, useRef } from 'react';
import { ComponentData, ImageLibraryItem } from '../types/editor';
import { storage } from '../lib/firebase.singleton';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../lib/firebase.singleton';
import ImageLibraryModal from './editor/ImageLibraryModal';
import { Button } from './ui/button';

interface ComponentPropertiesProps {
  component: ComponentData;
  onUpdate: (updatedComponent: ComponentData) => void;
  onDelete: (componentId: string) => void;
}

export default function ComponentProperties({
  component,
  onUpdate,
  onDelete
}: ComponentPropertiesProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [tempUrl, setTempUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showCameraModal, setShowCameraModal] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showImageLibrary, setShowImageLibrary] = useState(false);

  const handleChange = (field: string, value: any) => {
    console.log('Handling change:', field, value);
    if (value === undefined) {
      console.warn(`Mencoba mengatur ${field} dengan nilai undefined, menggunakan nilai default`);
      switch (field) {
        case 'text':
        case 'src':
        case 'alt':
        case 'link':
          value = '';
          break;
        case 'level':
          value = 'h1';
          break;
        case 'style':
          value = 'primary';
          break;
        case 'height':
          value = 40;
          break;
        case 'imageSource':
          value = 'url';
          break;
        default:
          value = null;
      }
    }

    const updatedComponent: ComponentData = {
      ...component,
      props: {
        ...component.props,
        [field]: value
      }
    };
    console.log('Updated component:', updatedComponent);
    onUpdate(updatedComponent);
  };

  const handleContentChange = (value: string) => {
    console.log('Handling content change:', value);
    const content = value === undefined ? '' : value;
    const updatedComponent: ComponentData = {
      ...component,
      content
    };
    console.log('Updated component with content:', updatedComponent);
    onUpdate(updatedComponent);
  };

  const validateFile = (file: File): string | null => {
    // Validasi ukuran file (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return 'Ukuran file terlalu besar. Maksimal 5MB.';
    }

    // Validasi tipe file
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return 'Tipe file tidak didukung. Gunakan JPG, PNG, GIF, atau WEBP.';
    }

    return null;
  };

  const uploadToFirebase = async (file: File): Promise<string> => {
    try {
      // Validasi file
      const error = validateFile(file);
      if (error) {
        throw new Error(error);
      }

      // Dapatkan user yang sedang login
      const user = auth.currentUser;
      if (!user) {
        throw new Error('Silakan login terlebih dahulu untuk mengupload gambar');
      }

      // Buat nama file unik dengan timestamp
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      
      // Buat reference ke storage dengan path user
      const storageRef = ref(storage, `users/${user.uid}/images/${fileName}`);
      
      // Upload file dengan progress
      const uploadTask = uploadBytes(storageRef, file);
      
      // Simulasi progress (karena uploadBytes tidak menyediakan progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const snapshot = await uploadTask;
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Dapatkan URL download
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      return downloadURL;
    } catch (error: any) {
      console.error('Error uploading to Firebase:', error);
      
      // Handle specific Firebase errors
      if (error.code === 'storage/unauthorized') {
        setUploadError('Anda tidak memiliki izin untuk mengupload gambar. Silakan login terlebih dahulu.');
      } else if (error.code === 'storage/canceled') {
        setUploadError('Upload dibatalkan.');
      } else if (error.code === 'storage/unknown') {
        setUploadError('Terjadi kesalahan saat upload. Silakan coba lagi.');
      } else {
        setUploadError(error.message || 'Terjadi kesalahan saat upload');
      }
      
      throw error;
    } finally {
      // Reset progress dan error setelah beberapa detik
      setTimeout(() => {
        setUploadProgress(0);
        setUploadError(null);
      }, 2000);
    }
  };

  const handleFileUpload = async (file: File) => {
    try {
      setUploadError(null);
      setUploadProgress(0);
      
      // Buat URL sementara untuk preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      
      // Upload ke Firebase Storage
      const uploadedUrl = await uploadToFirebase(file);
      
      // Update component dengan URL dari Firebase
      const updatedComponent: ComponentData = {
        ...component,
        content: uploadedUrl,
        props: {
          ...component.props,
          src: uploadedUrl,
          alt: file.name
        }
      };
      
      // Update di database
      onUpdate(updatedComponent);
      
      // Bersihkan URL sementara
      URL.revokeObjectURL(objectUrl);
      setPreviewUrl(null);
      
      // Tutup modal setelah upload berhasil
      setShowUploadModal(false);
    } catch (error) {
      console.error('Error uploading file:', error);
      // Revert ke URL sebelumnya jika upload gagal
      const updatedComponent: ComponentData = {
        ...component,
        content: component.props?.src || '',
        props: {
          ...component.props,
          src: component.props?.src || ''
        }
      };
      onUpdate(updatedComponent);
      setPreviewUrl(null);
    }
  };

  const handleImageSourceChange = (source: string) => {
    handleChange('imageSource', source);
    // Reset preview dan error state
    setPreviewUrl(null);
    setUploadError(null);
    setUploadProgress(0);

    if (source === 'url') {
      setTempUrl(component.props?.src || 'https://placehold.co/600x400');
      setShowUrlModal(true);
    } else if (source === 'device') {
      setShowUploadModal(true);
    } else if (source === 'camera') {
      handleCameraCapture();
    } else if (source === 'library') {
      setShowImageLibrary(true);
    } else {
      // Set default image URL saat pertama kali memilih sumber gambar
      if (!component.props?.src) {
        switch (source) {
          case 'library':
            handleChange('src', '/images/library/image1.jpg');
            handleChange('alt', 'Default library image');
            break;
        }
      }
    }
  };

  const handleCameraCapture = async () => {
    try {
      // Minta izin kamera
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment', // Gunakan kamera belakang jika tersedia
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      // Tampilkan modal kamera
      setShowCameraModal(true);
      
      // Set video source setelah modal muncul
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);

    } catch (error: any) {
      console.error('Error accessing camera:', error);
      let errorMessage = 'Tidak dapat mengakses kamera.';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Akses kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Kamera tidak ditemukan. Pastikan perangkat Anda memiliki kamera.';
      }
      
      setUploadError(errorMessage);
      setShowCameraModal(false);
    }
  };

  const captureImage = async () => {
    try {
      if (!videoRef.current || !canvasRef.current) {
        throw new Error('Video atau canvas tidak tersedia');
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      if (!context) {
        throw new Error('Tidak dapat mengakses canvas context');
      }

      // Set canvas size sama dengan video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Capture frame dari video ke canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Convert canvas ke blob dengan kualitas tinggi
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/jpeg', 0.95);
      });

      // Stop camera
      const stream = video.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());

      // Tutup modal kamera
      setShowCameraModal(false);

      // Handle upload seperti file biasa
      await handleFileUpload(new File([blob], `camera-capture-${Date.now()}.jpg`, { type: 'image/jpeg' }));
    } catch (error) {
      console.error('Error capturing from camera:', error);
      setUploadError('Gagal mengambil foto. Silakan coba lagi.');
      
      // Stop camera jika terjadi error
      const video = videoRef.current;
      if (video?.srcObject) {
        const stream = video.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleUrlChange = async (url: string) => {
    try {
      // Validasi URL
      if (!url) {
        url = 'https://placehold.co/600x400';
      }

      // Update state sementara
      setTempUrl(url);
      setUploadError(null);

      // Cek apakah URL valid
      const img = new Image();
      
      img.onload = () => {
        // URL valid, update component
        const updatedComponent = {
          ...component,
          props: {
            ...component.props,
            src: url,
            alt: `Image from URL: ${url.split('/').pop()}`
          }
        };
        onUpdate(updatedComponent);
        setUploadError(null);
      };

      img.onerror = () => {
        // URL tidak valid, gunakan default
        console.error('URL gambar tidak valid');
        const defaultUrl = 'https://placehold.co/600x400';
        setTempUrl(defaultUrl);
        const updatedComponent = {
          ...component,
          props: {
            ...component.props,
            src: defaultUrl,
            alt: 'Default placeholder image'
          }
        };
        onUpdate(updatedComponent);
        setUploadError('URL gambar tidak valid. Gunakan URL yang lain.');
      };

      img.src = url;
    } catch (error) {
      console.error('Error updating image URL:', error);
      setUploadError('Gagal mengupdate URL gambar');
    }
  };

  const handleUrlSubmit = async () => {
    try {
      // Pastikan tempUrl tidak kosong
      if (!tempUrl) {
        setTempUrl('https://placehold.co/600x400');
      }

      // Validasi URL
      const img = new Image();
      
      img.onload = () => {
        // URL valid, update component
        const updatedComponent = {
          ...component,
          content: tempUrl,
          props: {
            ...component.props,
            src: tempUrl,
            alt: `Image from URL: ${tempUrl.split('/').pop()}`
          }
        };
        onUpdate(updatedComponent);
        setUploadError(null);
        setShowUrlModal(false);
      };

      img.onerror = () => {
        // URL tidak valid, gunakan default
        console.error('URL gambar tidak valid');
        const defaultUrl = 'https://placehold.co/600x400';
        const updatedComponent = {
          ...component,
          content: defaultUrl,
          props: {
            ...component.props,
            src: defaultUrl,
            alt: 'Default placeholder image'
          }
        };
        onUpdate(updatedComponent);
        setUploadError('URL gambar tidak valid. Gunakan URL yang lain.');
      };

      img.src = tempUrl;
    } catch (error) {
      console.error('Error updating image URL:', error);
      setUploadError('Gagal mengupdate URL gambar');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDeviceUpload = () => {
    fileInputRef.current?.click();
  };

  const handleLibrarySelect = async (imagePath: string) => {
    try {
      setUploadError(null);
      setUploadProgress(0);
      handleChange('src', imagePath);
      handleChange('alt', `Library image ${imagePath.split('/').pop()}`);
    } catch (error) {
      console.error('Error selecting library image:', error);
      setUploadError('Gagal memilih gambar dari library');
    }
  };

  const handleImageSelect = (image: ImageLibraryItem) => {
    const updatedComponent: ComponentData = {
      ...component,
      content: image.url,
      props: {
        ...component.props,
        src: image.url,
        alt: image.name
      }
    };
    onUpdate(updatedComponent);
    setShowImageLibrary(false);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">
          {component.type.charAt(0).toUpperCase() + component.type.slice(1)} Properties
        </h3>
        <div className="flex space-x-2">
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDelete(component.id)}
          >
            Hapus
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {component.type === 'heading' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Text</label>
              <input
                type="text"
                value={component.content || ''}
                onChange={(e) => handleContentChange(e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-white hover:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Level</label>
                <select
                value={component.props?.level || 'h1'}
                onChange={(e) => handleChange('level', e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-white hover:border-gray-400"
              >
                <option value="h1">H1</option>
                <option value="h2">H2</option>
                <option value="h3">H3</option>
                <option value="h4">H4</option>
                <option value="h5">H5</option>
                <option value="h6">H6</option>
                </select>
            </div>
          </>
        )}

        {component.type === 'paragraph' && (
            <div>
            <label className="block text-sm font-medium text-gray-700">Text</label>
              <textarea
              value={component.content || ''}
              onChange={(e) => handleContentChange(e.target.value)}
                rows={4}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-white hover:border-gray-400"
              />
            </div>
        )}

        {component.type === 'image' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Sumber Gambar</label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => handleImageSourceChange('url')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition-colors ${
                    component.props?.imageSource === 'url' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  <span className="text-sm font-medium">URL Gambar</span>
                </button>
                
                <button
                  onClick={() => handleImageSourceChange('camera')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition-colors ${
                    component.props?.imageSource === 'camera' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-sm font-medium">Kamera</span>
                </button>

                <button
                  onClick={() => handleImageSourceChange('device')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition-colors ${
                    component.props?.imageSource === 'device' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium">Galeri Device</span>
                </button>

                <button
                  onClick={() => handleImageSourceChange('library')}
                  className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-blue-500 transition-colors ${
                    component.props?.imageSource === 'library' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span className="text-sm font-medium">Library</span>
                </button>
              </div>
            </div>

            {/* Preview Image */}
            {(previewUrl || component.props?.src) && (
              <div className="mt-4 relative">
                <img
                  src={previewUrl || component.props?.src}
                  alt={component.props?.alt || 'Preview'}
                  className="w-full h-48 object-cover rounded-lg"
                />
                {previewUrl && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <div className="text-white text-sm">Uploading...</div>
                  </div>
                )}
              </div>
            )}

            {component.props?.imageSource === 'url' && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Gambar</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={component.props?.src || ''}
                    onChange={(e) => handleUrlChange(e.target.value)}
                    onBlur={(e) => handleUrlChange(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="flex-1 rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-white hover:border-gray-400"
                  />
                  <button
                    onClick={() => handleUrlChange(component.props?.src || '')}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  >
                    Update
                  </button>
                </div>
                {uploadError && (
                  <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                )}
                <p className="mt-2 text-sm text-gray-500">
                  Masukkan URL gambar yang valid (jpg, png, gif, webp)
                </p>
              </div>
            )}

            {component.props?.imageSource === 'camera' && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleCameraCapture}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Buka Kamera
                </button>
              </div>
            )}

            {component.props?.imageSource === 'device' && (
              <div className="mt-4 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="device-image-upload"
                />
                <button
                  onClick={handleDeviceUpload}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Pilih dari Device
                </button>
            </div>
            )}

            {component.props?.imageSource === 'library' && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {[
                  '/images/library/image1.jpg',
                  '/images/library/image2.jpg',
                  '/images/library/image3.jpg',
                  '/images/library/image4.jpg',
                  '/images/library/image5.jpg',
                  '/images/library/image6.jpg'
                ].map((imagePath, index) => (
                  <button
                    key={index}
                    onClick={() => handleLibrarySelect(imagePath)}
                    className={`aspect-square border-2 rounded-lg overflow-hidden hover:border-blue-500 transition-colors ${
                      component.props?.src === imagePath ? 'border-blue-500' : 'border-gray-300'
                    }`}
                  >
                    <img
                      src={imagePath}
                      alt={`Library image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
          </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">Alt Text</label>
              <input
                type="text"
                value={component.props?.alt || ''}
                onChange={(e) => handleChange('alt', e.target.value)}
                placeholder="Deskripsi gambar"
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-white hover:border-gray-400"
              />
            </div>

            {uploadProgress > 0 && (
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}

            {uploadError && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600">{uploadError}</p>
              </div>
            )}
          </>
        )}

        {component.type === 'button' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">Text</label>
              <input
                type="text"
                value={component.props?.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-white hover:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Link</label>
              <input
                type="text"
                value={component.props?.link || ''}
                onChange={(e) => handleChange('link', e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-white hover:border-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Style</label>
                <select
                value={component.props?.style || 'primary'}
                onChange={(e) => handleChange('style', e.target.value)}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-white hover:border-gray-400"
                >
                  <option value="primary">Primary</option>
                  <option value="secondary">Secondary</option>
                  <option value="outline">Outline</option>
                </select>
            </div>
          </>
        )}

        {component.type === 'spacer' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Height (px)</label>
            <input
              type="number"
              value={component.props?.height || 40}
              onChange={(e) => handleChange('height', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-white hover:border-gray-400"
            />
          </div>
        )}
      </div>

      {/* URL Modal */}
      {showUrlModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Masukkan URL Gambar</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">URL Gambar</label>
                <input
                  type="text"
                  value={tempUrl}
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-md border-2 border-gray-300 focus:border-blue-500 focus:ring-blue-500 px-4 py-2 bg-white hover:border-gray-400"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Masukkan URL gambar yang valid (jpg, png, gif, webp)
                </p>
              </div>

              {/* Preview */}
              {tempUrl && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <div className="relative rounded-lg overflow-hidden border-2 border-gray-300">
                    <img
                      src={tempUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://placehold.co/600x400';
                      }}
                    />
                  </div>
                </div>
              )}

              {uploadError && (
                <p className="text-sm text-red-600 mt-2">{uploadError}</p>
              )}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  onClick={() => setShowUrlModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleUrlSubmit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Upload Gambar</h3>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="device-image-upload"
                />
                <label
                  htmlFor="device-image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="mt-2 text-sm text-gray-600">
                    Klik untuk memilih gambar
                  </span>
                  <span className="mt-1 text-xs text-gray-500">
                    atau drag and drop
                  </span>
                </label>
              </div>

              {/* Preview */}
              {previewUrl && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
                  <div className="relative rounded-lg overflow-hidden border-2 border-gray-300">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-48 object-cover"
                    />
                    {uploadProgress > 0 && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="text-white text-center">
                          <div className="w-32 h-2 bg-white rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                          <p className="text-sm mt-2">Uploading... {uploadProgress}%</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{uploadError}</p>
                </div>
              )}

              <div className="flex justify-end gap-2 mt-6">
        <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
                  Batal
        </button>
      </div>
            </div>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      {showCameraModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ambil Foto</h3>
            
            <div className="space-y-4">
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    const stream = videoRef.current?.srcObject as MediaStream;
                    stream?.getTracks().forEach(track => track.stop());
                    setShowCameraModal(false);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={captureImage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Ambil Foto
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Library Modal */}
      <ImageLibraryModal
        isOpen={showImageLibrary}
        onClose={() => setShowImageLibrary(false)}
        onSelect={handleImageSelect}
      />
    </div>
  );
} 