# Dokumentasi Development LandingKits

## Sistem Subscription

### Konfigurasi Firebase Functions

Firebase Functions digunakan untuk menjalankan cron jobs yang mengelola status subscription dan mengirim email notifikasi.

#### Environment Variables

```bash
# Firebase Functions Config
EMAIL_USER=noreply@landingkits.com
EMAIL_PASSWORD=Farhan!234
NEXT_PUBLIC_APP_URL=https://landingkits.com
```

#### Setup Firebase Functions

1. Install dependencies:
```bash
cd functions
npm install nodemailer @types/nodemailer
npm install --save-dev @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

2. Deploy functions:
```bash
firebase deploy --only functions
```

### Status Subscription

Sistem subscription memiliki beberapa status:

- `ACTIVE`: Subscription aktif dan dapat menggunakan semua fitur
- `PENDING`: Menunggu pembayaran
- `GRACE`: Masa tenggang (3 hari setelah expired)
- `EXPIRED`: Subscription telah berakhir
- `CANCELLED`: Subscription dibatalkan
- `SUSPENDED`: Subscription ditangguhkan

### Cron Jobs

Sistem menjalankan 3 cron jobs otomatis:

1. **Check Expiring Subscriptions** (08:00 WIB)
   - Mengecek subscription yang akan berakhir dalam 7 atau 3 hari
   - Mengirim email reminder
   - Path: `/functions/src/subscription.ts`

2. **Check Expired Subscriptions** (00:00 WIB)
   - Mengecek subscription yang telah expired
   - Mengubah status ke GRACE
   - Mengirim email notifikasi
   - Memberikan masa tenggang 3 hari

3. **Check Grace Period End** (01:00 WIB)
   - Mengecek subscription dalam masa tenggang yang berakhir
   - Mengubah status ke EXPIRED
   - Mengirim email notifikasi final

### Email Notifications

Sistem mengirim beberapa jenis email:

1. **Reminder Subscription**
   - 7 hari sebelum berakhir
   - 3 hari sebelum berakhir
   - Link ke: `/dashboard/renew`

2. **Notifikasi Masa Tenggang**
   - Saat memasuki masa tenggang
   - Durasi: 3 hari
   - Link ke: `/dashboard/renew`

3. **Notifikasi Expired**
   - Saat subscription benar-benar berakhir
   - Link ke: `/pricing`

### Endpoints API

1. **Create Invoice**
   - Path: `/app/api/payments/create-invoice/route.ts`
   - Method: POST
   - Body: `{ userId, plan, interval }`

2. **Webhook Xendit**
   - Path: `/app/api/webhooks/xendit/route.ts`
   - Method: POST
   - Menghandle callback pembayaran

### Pages

1. **Success Payment**
   - Path: `/payment/success`
   - Menampilkan konfirmasi pembayaran berhasil
   - Mengupdate status subscription

2. **Failed Payment**
   - Path: `/payment/failed`
   - Menampilkan pesan error
   - Opsi untuk mencoba lagi

3. **Renewal Page**
   - Path: `/dashboard/renew`
   - Form perpanjangan subscription
   - Pilihan interval (bulanan/tahunan)

4. **Pricing Page**
   - Path: `/pricing`
   - Daftar paket subscription
   - Untuk user yang expired/baru

### Database Schema

```typescript
interface Subscription {
  userId: string;
  status: 'ACTIVE' | 'PENDING' | 'GRACE' | 'EXPIRED' | 'CANCELLED' | 'SUSPENDED';
  plan: 'BASIC' | 'PRO' | 'ENTERPRISE';
  startDate: string;
  endDate: string;
  graceEndDate?: string;
  interval: 'MONTH' | 'YEAR';
  cancelReason?: string;
  renewalAttempts: number;
  lastPaymentDate: string;
  nextPaymentDate: string;
}
```

### Security

1. Webhook Protection:
   - Validasi token Xendit
   - Rate limiting
   - IP whitelist Xendit

2. Email:
   - SMTP dengan TLS
   - App password untuk Gmail
   - No-reply email system

### Monitoring

1. Firebase Functions logs untuk:
   - Cron job execution
   - Email sending status
   - Payment processing

2. Error tracking:
   - Failed payments
   - Email delivery failures
   - Subscription status changes

### Development Flow

1. Local Development:
   ```bash
   # Install dependencies
   npm install
   
   # Run Firebase emulator
   firebase emulators:start
   
   # Deploy functions
   firebase deploy --only functions
   ```

2. Testing:
   - Unit tests untuk subscription logic
   - Integration tests untuk payment flow
   - Email template testing

3. Deployment:
   - Staging environment untuk testing
   - Production deployment dengan Firebase
   - Monitoring setelah deployment

### Troubleshooting

1. Email Issues:
   - Check SMTP settings
   - Verify email credentials
   - Check spam folder

2. Payment Issues:
   - Verify Xendit configuration
   - Check webhook logs
   - Validate payment flow

3. Subscription Issues:
   - Check cron job logs
   - Verify status transitions
   - Monitor grace period 