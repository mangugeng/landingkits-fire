'use client';

import { useState, useEffect } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, ChevronUp, HelpCircle, BookOpen, Mail, Phone, MessageSquare } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  order: number;
  steps?: {
    title: string;
    description: string;
    imageUrl?: string;
  }[];
}

export default function HelpPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaqs, setExpandedFaqs] = useState<string[]>([]);
  const [expandedGuides, setExpandedGuides] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState<'faq' | 'guides'>('faq');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch FAQs
      const faqSnapshot = await getDocs(collection(db, 'faqs'));
      const faqData = faqSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as FAQ[];
      setFaqs(faqData.sort((a, b) => a.order - b.order));

      // Fetch Guides
      const guideSnapshot = await getDocs(collection(db, 'guides'));
      const guideData = guideSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Guide[];
      setGuides(guideData.sort((a, b) => a.order - b.order));
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Gagal memuat data');
    } finally {
      setLoading(false);
    }
  };

  const toggleFaq = (id: string) => {
    setExpandedFaqs(prev =>
      prev.includes(id)
        ? prev.filter(faqId => faqId !== id)
        : [...prev, id]
    );
  };

  const toggleGuide = (id: string) => {
    setExpandedGuides(prev =>
      prev.includes(id)
        ? prev.filter(guideId => guideId !== id)
        : [...prev, id]
    );
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGuides = guides.filter(guide =>
    guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    guide.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleContactClick = (type: 'email' | 'phone' | 'chat') => {
    switch (type) {
      case 'email':
        toast.success('Fitur email support akan segera hadir! Untuk sementara, silakan hubungi kami melalui live chat atau telepon.', {
          duration: 5000,
        });
        break;
      case 'phone':
        toast.success('Fitur telepon support akan segera hadir! Untuk sementara, silakan hubungi kami melalui live chat atau email.', {
          duration: 5000,
        });
        break;
      case 'chat':
        toast.success('Fitur live chat akan segera hadir! Untuk sementara, silakan hubungi kami melalui email atau telepon.', {
          duration: 5000,
        });
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <Toaster position="top-center" />
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Pusat Bantuan</h1>
        <p className="text-gray-600">Temukan jawaban untuk pertanyaan Anda atau ikuti panduan kami</p>
      </div>

      {/* Pertanyaan Umum */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Pertanyaan Umum</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              question: "Bagaimana cara membuat landing page?",
              answer: "Untuk membuat landing page, ikuti panduan 'Memulai dengan LandingKits' di bagian Panduan."
            },
            {
              question: "Bagaimana cara menghubungkan domain?",
              answer: "Ikuti panduan 'Konfigurasi Domain' untuk langkah-langkah detail menghubungkan domain Anda."
            },
            {
              question: "Bagaimana cara mengoptimalkan SEO?",
              answer: "Temukan panduan 'Mengoptimalkan SEO Landing Page' untuk tips dan trik SEO."
            },
            {
              question: "Bagaimana cara mengubah template?",
              answer: "Pelajari cara mengubah template melalui panduan 'Menggunakan Template Editor'."
            }
          ].map((item, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-2">{item.question}</h3>
                <p className="text-sm text-gray-600">{item.answer}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <Input
            placeholder="Cari bantuan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setActiveSection('faq')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeSection === 'faq'
              ? 'bg-primary text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <HelpCircle className="h-5 w-5" />
          FAQ
        </button>
        <button
          onClick={() => setActiveSection('guides')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            activeSection === 'guides'
              ? 'bg-primary text-white'
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          <BookOpen className="h-5 w-5" />
          Panduan
        </button>
      </div>

      <Card>
        <CardContent className="pt-6">
          {activeSection === 'faq' ? (
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleFaq(faq.id)}
                  >
                    <h3 className="text-lg font-medium">{faq.question}</h3>
                    {expandedFaqs.includes(faq.id) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                  {expandedFaqs.includes(faq.id) && (
                    <div className="mt-4 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredGuides.map((guide) => (
                <div key={guide.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleGuide(guide.id)}
                  >
                    <h3 className="text-lg font-medium">{guide.title}</h3>
                    {expandedGuides.includes(guide.id) ? (
                      <ChevronUp className="h-5 w-5" />
                    ) : (
                      <ChevronDown className="h-5 w-5" />
                    )}
                  </div>
                  {expandedGuides.includes(guide.id) && (
                    <div className="mt-4 space-y-4">
                      <p className="text-gray-600">{guide.description}</p>
                      <div className="prose max-w-none">
                        {guide.content}
                      </div>
                      {guide.steps && (
                        <div className="mt-6 space-y-4">
                          {guide.steps.map((step, index) => (
                            <div key={index} className="flex gap-4">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium">{step.title}</h4>
                                <p className="text-gray-600">{step.description}</p>
                                {step.imageUrl && (
                                  <img
                                    src={step.imageUrl}
                                    alt={step.title}
                                    className="mt-2 rounded-lg"
                                  />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hubungi Dukungan */}
      <div className="mt-12">
        <h2 className="text-xl font-semibold mb-4 text-center">Masih Butuh Bantuan?</h2>
        <p className="text-gray-600 text-center mb-6">Tim dukungan kami siap membantu Anda 24/7</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleContactClick('email')}
          >
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <h3 className="font-medium mb-2">Email</h3>
              <p className="text-sm text-gray-600">support@landingkits.com</p>
              <p className="text-xs text-gray-500 mt-1">Respon dalam 24 jam</p>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleContactClick('phone')}
          >
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <h3 className="font-medium mb-2">Telepon</h3>
              <p className="text-sm text-gray-600">021-1234-5678</p>
              <p className="text-xs text-gray-500 mt-1">Senin - Jumat, 09:00 - 17:00</p>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleContactClick('chat')}
          >
            <CardContent className="pt-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <h3 className="font-medium mb-2">Live Chat</h3>
              <p className="text-sm text-gray-600">Chat dengan agen kami</p>
              <p className="text-xs text-gray-500 mt-1">Respon dalam 5 menit</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Atau kunjungi halaman <a href="/contact" className="text-blue-600 hover:underline">Hubungi Kami</a> untuk informasi lebih lanjut
          </p>
        </div>
      </div>
    </div>
  );
} 