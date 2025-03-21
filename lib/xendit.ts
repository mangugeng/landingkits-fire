import Xendit from 'xendit-node';

if (!process.env.XENDIT_SECRET_KEY) {
  throw new Error('XENDIT_SECRET_KEY is not defined in environment variables');
}

const xenditClient = new Xendit({
  secretKey: process.env.XENDIT_SECRET_KEY,
});

export const Invoice = xenditClient.Invoice;
export const PaymentMethod = xenditClient.PaymentMethod;

export default xenditClient; 