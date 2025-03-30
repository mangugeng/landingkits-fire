const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const faqs = [
    // General FAQs
    {
        question: 'Apa itu LandingKits?',
        answer: 'LandingKits adalah platform yang memungkinkan Anda membuat landing page profesional dengan mudah dan cepat. Kami menyediakan berbagai template yang dapat disesuaikan dan fitur-fitur yang membantu Anda mengoptimalkan landing page Anda.',
        category: 'general',
        order: 1
    },
    {
        question: 'Siapa yang dapat menggunakan LandingKits?',
        answer: 'LandingKits dapat digunakan oleh siapa saja yang ingin membuat landing page profesional, termasuk pebisnis, marketer, freelancer, atau siapa pun yang ingin mempromosikan produk atau layanan secara online.',
        category: 'general',
        order: 2
    },
    {
        question: 'Apakah saya perlu kemampuan coding?',
        answer: 'Tidak, Anda tidak perlu memiliki kemampuan coding untuk menggunakan LandingKits. Interface drag-and-drop dan template yang sudah disediakan memungkinkan Anda membuat landing page profesional tanpa coding.',
        category: 'general',
        order: 3
    },

    // Landing Page FAQs
    {
        question: 'Bagaimana cara membuat landing page baru?',
        answer: 'Untuk membuat landing page baru: 1) Klik tombol "Buat Landing Page Baru" di dashboard, 2) Pilih template yang Anda inginkan, 3) Sesuaikan konten dan desainnya menggunakan editor visual kami, 4) Klik "Publikasikan" ketika sudah selesai.',
        category: 'landing-page',
        order: 1
    },
    {
        question: 'Berapa banyak landing page yang bisa saya buat?',
        answer: 'Jumlah landing page yang dapat Anda buat tergantung pada paket berlangganan Anda. Paket Starter memungkinkan 1 landing page, Professional 5 landing page, Premium 15 landing page, dan Enterprise tidak terbatas.',
        category: 'landing-page',
        order: 2
    },
    {
        question: 'Apakah saya bisa mengubah template setelah landing page dipublikasikan?',
        answer: 'Ya, Anda dapat mengubah template kapan saja, bahkan setelah landing page dipublikasikan. Namun, perlu diingat bahwa mengubah template mungkin memerlukan penyesuaian ulang konten Anda.',
        category: 'landing-page',
        order: 3
    },

    // Template FAQs
    {
        question: 'Apa saja jenis template yang tersedia?',
        answer: 'Kami menyediakan berbagai jenis template untuk berbagai kebutuhan, termasuk: promosi produk, pendaftaran event, unduhan ebook, halaman coming soon, dan banyak lagi. Setiap template dirancang dengan mempertimbangkan conversion rate optimization.',
        category: 'template',
        order: 1
    },
    {
        question: 'Apakah template bisa dikustomisasi?',
        answer: 'Ya, semua template dapat dikustomisasi sepenuhnya. Anda dapat mengubah warna, font, layout, gambar, dan semua elemen desain lainnya sesuai dengan kebutuhan brand Anda.',
        category: 'template',
        order: 2
    },
    {
        question: 'Apakah template responsif untuk mobile?',
        answer: 'Ya, semua template kami responsif dan akan tampil dengan baik di semua ukuran layar, termasuk desktop, tablet, dan mobile. Anda juga dapat melihat preview tampilan mobile saat mengedit.',
        category: 'template',
        order: 3
    },

    // Domain FAQs
    {
        question: 'Apakah saya bisa menggunakan domain kustom?',
        answer: 'Ya, Anda dapat menggunakan domain kustom dengan mengatur DNS records sesuai dengan panduan yang kami berikan. Kami mendukung domain kustom untuk semua paket berbayar.',
        category: 'domain',
        order: 1
    },
    {
        question: 'Bagaimana cara menghubungkan domain saya?',
        answer: 'Untuk menghubungkan domain: 1) Masuk ke pengaturan domain, 2) Tambahkan domain Anda, 3) Ikuti panduan konfigurasi DNS yang kami berikan, 4) Tunggu propagasi DNS (biasanya 24-48 jam).',
        category: 'domain',
        order: 2
    },
    {
        question: 'Apakah subdomain tersedia?',
        answer: 'Ya, Anda dapat membuat subdomain untuk setiap landing page Anda. Misalnya: promo.domainanda.com atau event.domainanda.com.',
        category: 'domain',
        order: 3
    },

    // Billing FAQs
    {
        question: 'Bagaimana cara membayar subscription?',
        answer: 'Anda dapat membayar subscription menggunakan berbagai metode pembayaran yang kami dukung, termasuk kartu kredit, transfer bank, dan e-wallet. Pembayaran akan diproses secara otomatis setiap bulan atau tahun sesuai dengan paket yang Anda pilih.',
        category: 'billing',
        order: 1
    },
    {
        question: 'Apakah ada trial period?',
        answer: 'Ya, kami menyediakan trial period 14 hari untuk semua paket berbayar. Selama periode ini, Anda dapat mencoba semua fitur premium tanpa biaya.',
        category: 'billing',
        order: 2
    },
    {
        question: 'Bagaimana cara upgrade/downgrade paket?',
        answer: 'Anda dapat mengubah paket kapan saja dari halaman subscription. Jika upgrade, perbedaan biaya akan dihitung secara prorata. Jika downgrade, perubahan akan berlaku pada periode berikutnya.',
        category: 'billing',
        order: 3
    },

    // Technical FAQs
    {
        question: 'Apakah landing page saya aman?',
        answer: 'Ya, semua landing page dilindungi dengan SSL/TLS dan hosting yang aman. Kami juga melakukan backup regular dan memiliki sistem monitoring 24/7.',
        category: 'technical',
        order: 1
    },
    {
        question: 'Bagaimana dengan kecepatan loading?',
        answer: 'Kami menggunakan CDN global dan optimasi gambar otomatis untuk memastikan landing page Anda dimuat dengan cepat di seluruh dunia.',
        category: 'technical',
        order: 2
    },
    {
        question: 'Apakah ada batasan bandwidth?',
        answer: 'Tidak ada batasan bandwidth khusus, namun kami memantau penggunaan untuk mencegah penyalahgunaan. Untuk penggunaan tinggi, kami sarankan paket Enterprise.',
        category: 'technical',
        order: 3
    }
];

const guides = [
    // Getting Started Guides
    {
        title: 'Memulai dengan LandingKits',
        description: 'Panduan lengkap untuk memulai perjalanan Anda dengan LandingKits',
        content: 'LandingKits adalah platform yang dirancang untuk membantu Anda membuat landing page profesional dengan mudah. Panduan ini akan membantu Anda memahami dasar-dasar penggunaan platform kami.',
        category: 'getting-started',
        order: 1,
        steps: [
            {
                title: 'Mendaftar Akun',
                description: 'Buat akun LandingKits dengan mengisi form pendaftaran atau menggunakan akun Google Anda.',
                imageUrl: '/images/guides/register.png'
            },
            {
                title: 'Memilih Template',
                description: 'Pilih template yang sesuai dengan kebutuhan Anda dari koleksi template kami.',
                imageUrl: '/images/guides/select-template.png'
            },
            {
                title: 'Menyesuaikan Konten',
                description: 'Edit konten, gambar, dan elemen desain sesuai dengan kebutuhan Anda.',
                imageUrl: '/images/guides/customize.png'
            }
        ]
    },
    {
        title: 'Mengenal Dashboard',
        description: 'Pelajari cara menggunakan dashboard LandingKits',
        content: 'Dashboard adalah pusat kontrol untuk mengelola semua landing page dan pengaturan Anda. Mari kita pelajari setiap fitur yang tersedia.',
        category: 'getting-started',
        order: 2,
        steps: [
            {
                title: 'Menu Navigasi',
                description: 'Kenali setiap menu di sidebar dan fungsinya.',
                imageUrl: '/images/guides/navigation.png'
            },
            {
                title: 'Statistik Overview',
                description: 'Pahami metrik-metrik penting di dashboard Anda.',
                imageUrl: '/images/guides/statistics.png'
            },
            {
                title: 'Quick Actions',
                description: 'Akses cepat ke fungsi-fungsi yang sering digunakan.',
                imageUrl: '/images/guides/quick-actions.png'
            }
        ]
    },

    // Landing Page Guides
    {
        title: 'Membuat Landing Page Pertama',
        description: 'Panduan langkah demi langkah membuat landing page pertama Anda',
        content: 'Membuat landing page pertama bisa jadi menantang. Panduan ini akan membantu Anda membuat landing page yang efektif.',
        category: 'landing-page',
        order: 1,
        steps: [
            {
                title: 'Menentukan Tujuan',
                description: 'Tentukan tujuan utama landing page Anda (konversi, lead generation, dll).',
                imageUrl: '/images/guides/goal-setting.png'
            },
            {
                title: 'Memilih Template',
                description: 'Pilih template yang sesuai dengan tujuan Anda.',
                imageUrl: '/images/guides/template-selection.png'
            },
            {
                title: 'Optimasi Konversi',
                description: 'Terapkan best practices untuk meningkatkan conversion rate.',
                imageUrl: '/images/guides/conversion.png'
            }
        ]
    },
    {
        title: 'Mengoptimalkan SEO Landing Page',
        description: 'Panduan untuk mengoptimalkan SEO landing page Anda',
        content: 'SEO adalah faktor penting dalam meningkatkan visibilitas landing page Anda di mesin pencari. Panduan ini akan membantu Anda mengoptimalkan SEO landing page Anda.',
        category: 'landing-page',
        order: 2,
        steps: [
            {
                title: 'Mengatur Meta Tags',
                description: 'Isi meta title dan meta description yang menarik dan relevan.',
                imageUrl: '/images/guides/meta-tags.png'
            },
            {
                title: 'Optimasi Konten',
                description: 'Gunakan kata kunci yang relevan dan struktur konten yang baik.',
                imageUrl: '/images/guides/content-optimization.png'
            },
            {
                title: 'Mengatur URL',
                description: 'Buat URL yang SEO-friendly dan mudah diingat.',
                imageUrl: '/images/guides/url-structure.png'
            }
        ]
    },

    // Template Guides
    {
        title: 'Menggunakan Template Editor',
        description: 'Panduan lengkap menggunakan template editor',
        content: 'Template editor adalah alat utama untuk menyesuaikan tampilan landing page Anda. Mari pelajari cara menggunakannya secara efektif.',
        category: 'template',
        order: 1,
        steps: [
            {
                title: 'Interface Editor',
                description: 'Kenali berbagai tools dan panel di template editor.',
                imageUrl: '/images/guides/editor-interface.png'
            },
            {
                title: 'Styling Elements',
                description: 'Cara mengubah style elemen seperti warna, font, dan spacing.',
                imageUrl: '/images/guides/styling.png'
            },
            {
                title: 'Responsive Design',
                description: 'Memastikan landing page tampil baik di semua perangkat.',
                imageUrl: '/images/guides/responsive.png'
            }
        ]
    },

    // Domain Guides
    {
        title: 'Konfigurasi Domain',
        description: 'Panduan lengkap mengatur domain kustom',
        content: 'Menggunakan domain kustom akan membuat landing page Anda lebih profesional. Ikuti panduan ini untuk mengatur domain dengan benar.',
        category: 'domain',
        order: 1,
        steps: [
            {
                title: 'Menambah Domain',
                description: 'Cara menambahkan domain baru ke akun Anda.',
                imageUrl: '/images/guides/add-domain.png'
            },
            {
                title: 'Konfigurasi DNS',
                description: 'Langkah-langkah mengatur DNS records yang diperlukan.',
                imageUrl: '/images/guides/dns-setup.png'
            },
            {
                title: 'Verifikasi Domain',
                description: 'Memverifikasi dan mengaktifkan domain Anda.',
                imageUrl: '/images/guides/verify-domain.png'
            }
        ]
    },

    // Technical Guides
    {
        title: 'Mengoptimalkan Performa',
        description: 'Panduan teknis untuk mengoptimalkan performa landing page',
        content: 'Performa yang baik adalah kunci sukses landing page. Pelajari cara mengoptimalkan landing page Anda.',
        category: 'technical',
        order: 1,
        steps: [
            {
                title: 'Optimasi Gambar',
                description: 'Cara mengoptimalkan gambar untuk kecepatan loading.',
                imageUrl: '/images/guides/image-optimization.png'
            },
            {
                title: 'Caching',
                description: 'Memahami dan mengatur caching untuk performa lebih baik.',
                imageUrl: '/images/guides/caching.png'
            },
            {
                title: 'Mobile Optimization',
                description: 'Mengoptimalkan pengalaman pengguna mobile.',
                imageUrl: '/images/guides/mobile-opt.png'
            }
        ]
    }
];

async function seedData() {
    try {
        // Seed FAQs
        for (const faq of faqs) {
            await addDoc(collection(db, 'faqs'), faq);
            console.log('Added FAQ:', faq.question);
        }

        // Seed Guides
        for (const guide of guides) {
            await addDoc(collection(db, 'guides'), guide);
            console.log('Added Guide:', guide.title);
        }

        console.log('Data seeding completed successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

seedData(); 