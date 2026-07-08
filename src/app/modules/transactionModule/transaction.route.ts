import express from 'express';
import requireAuth from '@/app/middlewares/requireAuth';
import TransactionController from './transaction.controller';
import { createPaymentMethodSchema } from './transaction.validation';
import validateRequest from '@/app/middlewares/validateRequest';

const router = express.Router();

router.get('/', requireAuth(), TransactionController.getTransactions);
router.get(
  '/payment-method',
  // requireAuth(),
  TransactionController.getPaymentMethods,
);
router.post(
  '/payment-method',
  requireAuth(),
  validateRequest(createPaymentMethodSchema),
  TransactionController.createPaymentMethod,
);
router.get('/:id', requireAuth(), TransactionController.getTransactionById);

export const TransactionRoutes = router;
