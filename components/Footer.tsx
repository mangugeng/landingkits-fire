'use client';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <p className="text-sm text-center text-gray-500">
          © {new Date().getFullYear()} LandingKits. All rights reserved.
        </p>
      </div>
    </footer>
  );
} 