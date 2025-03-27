import React, { useState, useEffect } from 'react';
import { ImageLibraryItem, ImageLibraryCategory } from '../../types/editor';
import { imageLibraryService } from '../../lib/imageLibrary';

interface ImageLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (image: ImageLibraryItem) => void;
}

export default function ImageLibraryModal({ isOpen, onClose, onSelect }: ImageLibraryModalProps) {
  const [images, setImages] = useState<ImageLibraryItem[]>([]);
  const [categories, setCategories] = useState<ImageLibraryCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load categories
      const categoriesData = await imageLibraryService.getCategories();
      setCategories(categoriesData);

      // Load images
      const imagesData = await imageLibraryService.getImages({
        category: selectedCategory,
        search: searchQuery
      });
      setImages(imagesData);
    } catch (err) {
      console.error('Error loading image library:', err);
      setError('Gagal memuat library gambar. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    loadData();
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // Debounce search
    setTimeout(() => {
      loadData();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Image Library</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Cari gambar..."
              value={searchQuery}
              onChange={handleSearch}
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Kategori</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          /* Image Grid */
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map(image => (
                <div
                  key={image.id}
                  className="relative group cursor-pointer"
                  onClick={() => onSelect(image)}
                >
                  <div className="aspect-square rounded-lg overflow-hidden border-2 border-transparent group-hover:border-blue-500 transition-colors">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                    <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      Pilih
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {images.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12">
                <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-gray-500">Tidak ada gambar yang ditemukan</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 