import express from 'express';
import { PassportController } from './passport.controller';
import requireAuth from '@/app/middlewares/requireAuth';
import validateRequest from '@/app/middlewares/validateRequest';
import {
  createPassportSchema,
  updatePassportSchema,
} from './passport.validation';

const router = express.Router();

router.post(
  '/',
  requireAuth(),
  validateRequest(createPassportSchema),
  PassportController.createPassport,
);

router.get('/', requireAuth(), PassportController.getPassports);
router.get('/search', requireAuth(), PassportController.searchPassports);

router.get('/:id', requireAuth(), PassportController.getPassportById);

router.patch(
  '/:id',
  requireAuth(),
  validateRequest(updatePassportSchema),
  PassportController.updatePassport,
);

router.delete('/:id', requireAuth('ADMIN'), PassportController.deletePassport);

export const PassportRoutes = router;
