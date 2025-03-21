import { onSchedule, ScheduledEvent } from 'firebase-functions/v2/scheduler';
import * as admin from 'firebase-admin';
import * as nodemailer from 'nodemailer';

// Inisialisasi Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// Konfigurasi transporter email
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Fungsi untuk mengirim email
async function sendMail(to: string, subject: string, html: string) {
  try {
    await transporter.sendMail({
      from: `"LandingKits" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

// Fungsi untuk menghitung tanggal berakhir subscription
function calculateEndDate(startDate: Date, interval: 'MONTH' | 'YEAR'): Date {
  const endDate = new Date(startDate);
  if (interval === 'MONTH') {
    endDate.setMonth(endDate.getMonth() + 1);
  } else {
    endDate.setFullYear(endDate.getFullYear() + 1);
  }
  return endDate;
}

// Cron job untuk mengecek subscription yang akan berakhir (setiap hari jam 8 pagi)
export const checkExpiringSubscriptions = onSchedule({
  schedule: '0 8 * * *',
  timeZone: 'Asia/Jakarta',
  memory: '256MiB',
  timeoutSeconds: 300
}, async (event: ScheduledEvent) => {
  try {
    const now = new Date();
    const sevenDaysFromNow = new Date(now);
    const threeDaysFromNow = new Date(now);
    
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3);

    // Query users dengan subscription yang akan berakhir dalam 7 atau 3 hari
    const usersRef = db.collection('users');
    const snapshot = await usersRef
      .where('subscription.status', '==', 'ACTIVE')
      .get();

    const batch = db.batch();
    const emailPromises: Promise<any>[] = [];

    snapshot.forEach((doc) => {
      const user = doc.data();
      const subscriptionEndDate = new Date(user.subscription.endDate);
      
      // Cek apakah subscription akan berakhir dalam 7 atau 3 hari
      const daysUntilExpiry = Math.ceil(
        (subscriptionEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysUntilExpiry === 7 || daysUntilExpiry === 3) {
        emailPromises.push(
          sendMail(
            user.email,
            'Subscription Anda Akan Berakhir - LandingKits',
            `
              <h1>Subscription Anda Akan Berakhir</h1>
              <p>Subscription Anda akan berakhir dalam ${daysUntilExpiry} hari.</p>
              <p>Untuk melanjutkan menggunakan layanan premium, silakan perpanjang subscription Anda.</p>
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/renew" 
                 style="display: inline-block; 
                        background-color: #4F46E5; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 6px;
                        margin: 16px 0;">
                Perpanjang Sekarang
              </a>
            `
          )
        );
      }
    });

    await Promise.all(emailPromises);
    await batch.commit();

    console.log('Successfully checked expiring subscriptions');
  } catch (error) {
    console.error('Error checking expiring subscriptions:', error);
  }
});

// Cron job untuk mengecek subscription yang expired (setiap hari jam 0:00)
export const checkExpiredSubscriptions = onSchedule({
  schedule: '0 0 * * *',
  timeZone: 'Asia/Jakarta',
  memory: '256MiB',
  timeoutSeconds: 300
}, async (event: ScheduledEvent) => {
  try {
    const now = new Date();
    const GRACE_PERIOD_DAYS = 3;

    // Query users dengan subscription yang sudah expired
    const usersRef = db.collection('users');
    const snapshot = await usersRef
      .where('subscription.status', '==', 'ACTIVE')
      .where('subscription.endDate', '<=', now.toISOString())
      .get();

    const batch = db.batch();
    const emailPromises: Promise<any>[] = [];

    snapshot.forEach((doc) => {
      const user = doc.data();
      const subscriptionEndDate = new Date(user.subscription.endDate);
      const graceEndDate = new Date(subscriptionEndDate);
      graceEndDate.setDate(graceEndDate.getDate() + GRACE_PERIOD_DAYS);

      // Update status ke GRACE
      const userRef = db.collection('users').doc(doc.id);
      batch.update(userRef, {
        'subscription.status': 'GRACE',
        'subscription.graceEndDate': graceEndDate.toISOString()
      });

      // Kirim email notifikasi
      emailPromises.push(
        sendMail(
          user.email,
          'Masa Tenggang Subscription - LandingKits',
          `
            <h1>Subscription Anda Telah Memasuki Masa Tenggang</h1>
            <p>Subscription Anda telah berakhir pada ${subscriptionEndDate.toLocaleDateString('id-ID')}.</p>
            <p>Anda masih dapat menggunakan layanan premium selama masa tenggang hingga ${graceEndDate.toLocaleDateString('id-ID')}.</p>
            <p>Untuk melanjutkan menggunakan layanan premium, silakan perpanjang subscription Anda sebelum masa tenggang berakhir.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/renew" 
               style="display: inline-block; 
                      background-color: #4F46E5; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 6px;
                      margin: 16px 0;">
              Perpanjang Sekarang
            </a>
          `
        )
      );
    });

    await Promise.all(emailPromises);
    await batch.commit();

    console.log('Successfully checked expired subscriptions');
  } catch (error) {
    console.error('Error checking expired subscriptions:', error);
  }
});

// Cron job untuk mengecek subscription dalam masa tenggang yang sudah berakhir (setiap hari jam 1:00)
export const checkGracePeriodEnd = onSchedule({
  schedule: '0 1 * * *',
  timeZone: 'Asia/Jakarta',
  memory: '256MiB',
  timeoutSeconds: 300
}, async (event: ScheduledEvent) => {
  try {
    const now = new Date();

    // Query users dengan subscription dalam masa tenggang yang sudah berakhir
    const usersRef = db.collection('users');
    const snapshot = await usersRef
      .where('subscription.status', '==', 'GRACE')
      .where('subscription.graceEndDate', '<=', now.toISOString())
      .get();

    const batch = db.batch();
    const emailPromises: Promise<any>[] = [];

    snapshot.forEach((doc) => {
      const user = doc.data();

      // Update status ke EXPIRED
      const userRef = db.collection('users').doc(doc.id);
      batch.update(userRef, {
        'subscription.status': 'EXPIRED'
      });

      // Kirim email notifikasi
      emailPromises.push(
        sendMail(
          user.email,
          'Subscription Telah Berakhir - LandingKits',
          `
            <h1>Subscription Anda Telah Berakhir</h1>
            <p>Masa tenggang subscription Anda telah berakhir.</p>
            <p>Untuk menggunakan kembali layanan premium, silakan berlangganan kembali.</p>
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/pricing" 
               style="display: inline-block; 
                      background-color: #4F46E5; 
                      color: white; 
                      padding: 12px 24px; 
                      text-decoration: none; 
                      border-radius: 6px;
                      margin: 16px 0;">
              Berlangganan Kembali
            </a>
          `
        )
      );
    });

    await Promise.all(emailPromises);
    await batch.commit();

    console.log('Successfully checked grace period end');
  } catch (error) {
    console.error('Error checking grace period end:', error);
  }
}); 