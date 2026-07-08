import express from 'express';
import { UserRoutes } from '../modules/userModule/user.route';
import { AuthRoutes } from '../modules/authModule/auth.route';
import { CompanyRoutes } from '../modules/companyModule/company.route';
import { SalesRoutes } from '../modules/salesModule/sales.route';
import { PassportRoutes } from '../modules/passportModule/passport.route';
import { TransactionRoutes } from '../modules/transactionModule/transaction.route';
import { ExpenseRoutes } from '../modules/expenseModule/expense.route';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/companies',
    route: CompanyRoutes,
  },
  {
    path: '/sales',
    route: SalesRoutes,
  },
  {
    path: '/passports',
    route: PassportRoutes,
  },
  {
    path: '/transactions',
    route: TransactionRoutes,
  },
  {
    path: '/expenses',
    route: ExpenseRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
