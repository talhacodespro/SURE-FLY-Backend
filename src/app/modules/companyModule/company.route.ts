import express from 'express';
import CompanyController from './company.controller';
import requireAuth from '@/app/middlewares/requireAuth';
import validateRequest from '@/app/middlewares/validateRequest';
import { createCompanySchema, updateCompanySchema } from './company.validation';
const router = express.Router();

router.post(
  '/',
  requireAuth(),
  validateRequest(createCompanySchema),
  CompanyController.createCompany,
);

router.get('/', requireAuth(), CompanyController.getCompanies);

router.get('/search', requireAuth(), CompanyController.searchCompanies);

router.get('/balance/:id', requireAuth(), CompanyController.getCompanyBalance);

router.get('/:id', requireAuth(), CompanyController.getCompanyById);

router.patch(
  '/:id',
  requireAuth(),
  validateRequest(updateCompanySchema),
  CompanyController.updateCompany,
);

router.delete('/:id', requireAuth('ADMIN'), CompanyController.deleteCompany);

export const CompanyRoutes = router;
