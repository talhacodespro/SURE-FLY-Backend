import express from 'express';
import SalesController from './sales.controller';
import requireAuth from '@/app/middlewares/requireAuth';
import validateRequest from '@/app/middlewares/validateRequest';
import { SalesValidation } from './sales.validation';

const router = express.Router();

router.post(
  '/',
  requireAuth(),
  validateRequest(SalesValidation.createSaleSchema),
  SalesController.createSale,
);

router.get('/', requireAuth(), SalesController.getSales);

router.get('/:id', requireAuth(), SalesController.getSaleById);

router.patch(
  '/:id',
  requireAuth(),
  validateRequest(SalesValidation.updateSaleSchema),
  SalesController.updateSale,
);

router.delete('/:id', requireAuth('ADMIN'), SalesController.deleteSale);

export const SalesRoutes = router;
