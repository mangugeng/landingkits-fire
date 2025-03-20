This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

# LandingKits

Platform all-in-one untuk membuat landing page profesional dengan mudah.

## Fitur Utama
- Drag & drop builder
- Template premium
- Analitik lengkap
- Custom domain & subdomain
- API access

## Git Backup & Version Control

### 1. Initial Setup
```bash
# Inisialisasi Git repository
git init

# Tambahkan remote repository
git remote add origin https://github.com/username/landingkits.git
```

### 2. File yang Perlu Di-ignore
Buat file `.gitignore`:
```
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

### 3. Backup Process
```bash
# Cek status perubahan
git status

# Stage semua perubahan
git add .

# Commit dengan pesan deskriptif
git commit -m "feat: implementasi subdomain routing dan dynamic page rendering"

# Push ke remote repository
git push origin main
```

### 4. Branching Strategy
- `main` - Production branch
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Hotfix branches

### 5. Commit Convention
Format: `type: description`

Types:
- `feat` - Fitur baru
- `fix` - Bug fix
- `docs` - Dokumentasi
- `style` - Formatting, missing semi colons, etc
- `refactor` - Refactoring kode
- `test` - Menambah/memperbaiki tests
- `chore` - Maintenance

Contoh:
```bash
git commit -m "feat: tambah fitur custom domain"
git commit -m "fix: perbaiki infinite redirect di subdomain"
git commit -m "docs: update dokumentasi setup DNS"
```

## Implementasi Subdomain & Dynamic Routing

### 1. Struktur URL & Flow
- Domain utama: `www.landingkits.com`
- Subdomain: `[slug].landingkits.com` (contoh: `tokoku.landingkits.com`)
- Preview: `/preview/[slug]`
- Editor: `/editor/[slug]`

Flow:
1. User mengakses `tokoku.landingkits.com`
2. Middleware mendeteksi subdomain
3. Root page mengambil data dari Firestore berdasarkan slug
4. Render komponen landing page sesuai data

### 2. Implementasi Kode

#### a. Root Page (`app/page.tsx`)
```typescript
'use client';

interface LandingPage {
  id: string;
  title: string;
  description: string;
  content: ComponentData[];
  status: 'draft' | 'published';
  userId: string;
  createdAt: string;
  lastUpdated: string;
  slug: string;
  customDomain?: string;
}

export default function RootPage() {
  const [pageData, setPageData] = useState<LandingPage | null>(null);
  const [isSubdomain, setIsSubdomain] = useState(false);

  useEffect(() => {
    const handleSubdomain = async () => {
      try {
        const hostname = window.location.hostname;
        const isSubdomain = hostname.includes('landingkits.com') && 
                          hostname !== 'www.landingkits.com';

        if (isSubdomain) {
          setIsSubdomain(true);
          const subdomain = hostname.split('.')[0];
          const pagesRef = collection(db, 'landing_pages');
          const q = query(
            pagesRef,
            where('slug', '==', subdomain),
            where('status', '==', 'published')
          );

          const querySnapshot = await getDocs(q);
          if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            setPageData({
              id: doc.id,
              ...doc.data()
            } as LandingPage);
          } else {
            window.location.href = 'https://www.landingkits.com';
          }
        }
      } catch (error) {
        console.error('Error handling subdomain:', error);
        toast.error('Terjadi kesalahan');
      }
    };

    handleSubdomain();
  }, []);

  // Render landing page jika di subdomain
  if (isSubdomain && pageData) {
    return (
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {pageData.content.map((component, index) => (
            <div key={index}>{renderComponent(component)}</div>
          ))}
        </div>
      </div>
    );
  }

  // Render halaman utama jika bukan subdomain
  return (
    <div className="min-h-screen">
      {/* Konten halaman utama */}
    </div>
  );
}
```

#### b. Middleware (`middleware.ts`)
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, host } = request.nextUrl;

  // Redirect ke www jika mengakses tanpa www
  if (host === 'landingkits.com') {
    return NextResponse.redirect(
      new URL(`https://www.landingkits.com${pathname}`)
    );
  }

  // Handle subdomain
  if (host.includes('landingkits.com') && host !== 'www.landingkits.com') {
    const subdomain = host.split('.')[0];
    
    // Redirect /home ke root subdomain
    if (pathname === '/home') {
      return NextResponse.redirect(
        new URL(`https://${subdomain}.landingkits.com`)
      );
    }
  }

  // Handle auth untuk admin & dashboard
  if (pathname.startsWith('/admin') || pathname.startsWith('/dashboard')) {
    // ... logic autentikasi
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
```

#### c. Render Component
```typescript
const renderComponent = (component: ComponentData) => {
  switch (component.type) {
    case 'heading':
      return (
        <div className="text-4xl font-bold text-gray-900 mb-4">
          {component.content}
        </div>
      );
    case 'paragraph':
      return (
        <div className="text-lg text-gray-600 mb-4">
          {component.content}
        </div>
      );
    // ... komponen lainnya
  }
};
```

### 3. Poin Penting
1. **Deteksi Subdomain**
   - Cek hostname menggunakan `window.location.hostname`
   - Parse subdomain dari hostname
   - Validasi format subdomain

2. **Query Data**
   - Gunakan slug sebagai identifier
   - Filter berdasarkan status published
   - Handle kasus data tidak ditemukan

3. **Render Konten**
   - Render komponen sesuai tipe
   - Gunakan proper styling dan layout
   - Handle loading dan error states

4. **Redirect Rules**
   - Subdomain ke www jika tidak ditemukan
   - /home ke root subdomain
   - Handle auth redirects

### 4. Troubleshooting

#### a. Infinite Redirect
```typescript
// Salah ❌
if (isSubdomain) {
  window.location.href = `/${subdomain}`;
}

// Benar ✅
if (isSubdomain && currentPath === '/') {
  window.location.href = `/${subdomain}`;
}
```

#### b. Data Fetching
```typescript
// Salah ❌
setPageData(doc.data());

// Benar ✅
setPageData({
  id: doc.id,
  ...doc.data()
} as LandingPage);
```

#### c. Component Rendering
```typescript
// Salah ❌
<div dangerouslySetInnerHTML={{ __html: pageData.content }} />

// Benar ✅
{pageData.content.map((component, index) => (
  <div key={index}>{renderComponent(component)}</div>
))}
```

## Development Setup
1. Konfigurasi DNS untuk subdomain
   ```
   *.landingkits.com CNAME vercel.app
   ```

2. Environment Variables di Vercel
   ```bash
   vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
   vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   # ... dst
   ```

3. Deploy
   ```bash
   vercel deploy --prod
   ```

## License
© 2024 LandingKits. All rights reserved.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
