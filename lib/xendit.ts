import Xendit from 'xendit-node';

if (!process.env.XENDIT_SECRET_KEY) {
  console.warn('XENDIT_SECRET_KEY is not defined in environment variables. Xendit integration will be disabled.');
}

const xenditClient = process.env.XENDIT_SECRET_KEY
  ? new Xendit({
      secretKey: process.env.XENDIT_SECRET_KEY,
    })
  : null;

export const Invoice = xenditClient?.Invoice;
export const PaymentMethod = xenditClient?.PaymentMethod;

export default xenditClient; 