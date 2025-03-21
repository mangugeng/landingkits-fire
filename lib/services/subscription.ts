import { db } from '@/lib/firebase';
import { collection, doc, getDoc, updateDoc, addDoc, query, where, getDocs, writeBatch } from 'firebase/firestore';
import { Subscription, SubscriptionLog } from '@/types/subscription';
import nodemailer from 'nodemailer';

const GRACE_PERIOD_DAYS = 3;

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

export class SubscriptionService {
  // Mengupdate status subscription
  static async updateSubscription(
    userId: string, 
    plan: 'BASIC' | 'PRO' | 'ENTERPRISE', 
    interval: 'MONTH' | 'YEAR'
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User tidak ditemukan');
      }

      const user = userSnap.data();
      const startDate = new Date();
      const endDate = new Date(this.calculateEndDate(interval));

      const subscription: Subscription = {
        userId,
        plan,
        status: 'ACTIVE',
        interval,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        renewalAttempts: 0,
        lastPaymentDate: startDate.toISOString(),
        nextPaymentDate: endDate.toISOString()
      };

      await updateDoc(userRef, { subscription });

      // Log aktivitas
      await this.logActivity(userId, 'CREATE', {
        plan,
        interval,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      });

      // Kirim email konfirmasi
      await this.sendSubscriptionEmail(user.email, subscription);
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  // Mengirim reminder subscription akan berakhir
  static async sendExpirationReminder(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User tidak ditemukan');
      }

      const user = userSnap.data();
      const subscription = user.subscription as Subscription;
      
      if (!subscription || subscription.status !== 'ACTIVE') {
        return;
      }

      const endDate = new Date(subscription.endDate);
      const now = new Date();
      const daysLeft = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      // Kirim reminder 7 hari dan 3 hari sebelum expired
      if (daysLeft === 7 || daysLeft === 3) {
        await sendMail(
          user.email,
          'Subscription Anda Akan Berakhir - LandingKits',
          `
            <h1>Subscription Anda Akan Berakhir</h1>
            <p>Subscription Anda akan berakhir dalam ${daysLeft} hari.</p>
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
        );
      }
    } catch (error) {
      console.error('Error sending expiration reminder:', error);
    }
  }

  // Menangani grace period
  static async handleGracePeriod(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User tidak ditemukan');
      }

      const subscription = userSnap.data().subscription as Subscription;

      if (subscription.status === 'EXPIRED') {
        const expiredDate = new Date(subscription.endDate);
        const now = new Date();
        const daysSinceExpired = Math.floor(
          (now.getTime() - expiredDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (daysSinceExpired <= GRACE_PERIOD_DAYS) {
          const graceEndDate = new Date(expiredDate);
          graceEndDate.setDate(graceEndDate.getDate() + GRACE_PERIOD_DAYS);

          await updateDoc(userRef, {
            'subscription.status': 'GRACE',
            'subscription.graceEndDate': graceEndDate.toISOString()
          });

          await this.logActivity(userId, 'UPDATE', {
            oldStatus: 'EXPIRED',
            newStatus: 'GRACE',
            graceEndDate: graceEndDate.toISOString()
          });

          // Kirim email notifikasi grace period
          await sendMail(
            userSnap.data().email,
            'Masa Tenggang Subscription - LandingKits',
            `
              <h1>Subscription Anda Telah Memasuki Masa Tenggang</h1>
              <p>Subscription Anda telah berakhir pada ${new Date(subscription.endDate).toLocaleDateString('id-ID')}.</p>
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
          );
        }
      }
    } catch (error) {
      console.error('Error handling grace period:', error);
    }
  }

  // Membatalkan subscription
  static async cancelSubscription(
    userId: string, 
    reason: string
  ): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error('User tidak ditemukan');
      }

      const subscription = userSnap.data().subscription as Subscription;
      const now = new Date();

      await updateDoc(userRef, {
        'subscription.status': 'CANCELLED',
        'subscription.cancelledAt': now.toISOString(),
        'subscription.cancelReason': reason
      });

      await this.logActivity(userId, 'UPDATE', {
        oldStatus: subscription.status,
        newStatus: 'CANCELLED',
        reason,
        cancelledAt: now.toISOString()
      });

      // Kirim email konfirmasi pembatalan
      await sendMail(
        userSnap.data().email,
        'Subscription Dibatalkan - LandingKits',
        `
          <h1>Subscription Anda Telah Dibatalkan</h1>
          <p>Subscription Anda telah dibatalkan pada ${now.toLocaleDateString('id-ID')}.</p>
          <p>Alasan pembatalan: ${reason}</p>
          <p>Anda masih dapat menggunakan layanan premium hingga ${new Date(subscription.endDate).toLocaleDateString('id-ID')}.</p>
          <p>Jika Anda berubah pikiran, Anda dapat berlangganan kembali kapan saja.</p>
        `
      );
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  // Utility functions
  private static calculateEndDate(interval: 'MONTH' | 'YEAR'): string {
    const now = new Date();
    const endDate = new Date(now);
    
    if (interval === 'MONTH') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    return endDate.toISOString();
  }

  private static async logActivity(
    userId: string, 
    action: SubscriptionLog['action'], 
    details: any
  ): Promise<void> {
    await addDoc(collection(db, 'subscription_logs'), {
      userId,
      action,
      details,
      timestamp: new Date().toISOString()
    });
  }

  private static async sendSubscriptionEmail(
    email: string, 
    subscription: Subscription
  ): Promise<void> {
    await sendMail(
      email,
      'Subscription Aktif - LandingKits',
      `
        <h1>Selamat! Subscription Anda Telah Aktif</h1>
        <p>Detail subscription:</p>
        <ul>
          <li>Plan: ${subscription.plan}</li>
          <li>Durasi: ${subscription.interval === 'MONTH' ? 'Bulanan' : 'Tahunan'}</li>
          <li>Tanggal Mulai: ${new Date(subscription.startDate).toLocaleDateString('id-ID')}</li>
          <li>Tanggal Berakhir: ${new Date(subscription.endDate).toLocaleDateString('id-ID')}</li>
        </ul>
        <p>Selamat menggunakan layanan premium LandingKits!</p>
      `
    );
  }

  async createSubscription(userId: string, plan: 'BASIC' | 'PRO' | 'ENTERPRISE', interval: 'MONTH' | 'YEAR'): Promise<Subscription> {
    try {
      const now = new Date();
      const endDate = new Date(SubscriptionService.calculateEndDate(interval));

      const subscription: Subscription = {
        userId,
        plan,
        status: 'ACTIVE',
        interval,
        startDate: now.toISOString(),
        endDate: endDate.toISOString(),
        renewalAttempts: 0,
        lastPaymentDate: now.toISOString(),
        nextPaymentDate: endDate.toISOString()
      };

      const subscriptionsRef = collection(db, 'subscriptions');
      await addDoc(subscriptionsRef, subscription);

      return subscription;
    } catch (error) {
      console.error('Error creating subscription:', error);
      throw error;
    }
  }

  async updateSubscriptionStatus(userId: string, status: Subscription['status']): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        throw new Error('User not found');
      }

      await updateDoc(userRef, {
        'subscription.status': status
      });
    } catch (error) {
      console.error('Error updating subscription status:', error);
      throw error;
    }
  }

  async checkAndUpdateExpiredSubscriptions(): Promise<void> {
    try {
      const now = new Date();
      const subscriptionsRef = collection(db, 'subscriptions');
      const expiredSubscriptions = await getDocs(
        query(
          subscriptionsRef,
          where('status', '==', 'ACTIVE'),
          where('endDate', '<=', now.toISOString())
        )
      );

      const batch = writeBatch(db);
      expiredSubscriptions.forEach((doc) => {
        const subscription = doc.data() as Subscription;
        const graceEndDate = new Date(subscription.endDate);
        graceEndDate.setDate(graceEndDate.getDate() + 3); // 3 days grace period

        batch.update(doc.ref, {
          status: 'GRACE',
          graceEndDate: graceEndDate.toISOString()
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error checking expired subscriptions:', error);
      throw error;
    }
  }

  async checkAndUpdateGracePeriodEnd(): Promise<void> {
    try {
      const now = new Date();
      const subscriptionsRef = collection(db, 'subscriptions');
      const graceEndedSubscriptions = await getDocs(
        query(
          subscriptionsRef,
          where('status', '==', 'GRACE'),
          where('graceEndDate', '<=', now.toISOString())
        )
      );

      const batch = writeBatch(db);
      graceEndedSubscriptions.forEach((doc) => {
        batch.update(doc.ref, {
          status: 'EXPIRED'
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error checking grace period end:', error);
      throw error;
    }
  }
} 