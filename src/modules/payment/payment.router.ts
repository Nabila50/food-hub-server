import express, { Router } from 'express';
 

import auth from '../../middlewares/auth';
import { paymentController } from './payment.controller';

const router = express.Router();

router.post(
    "/create/:orderId",
    auth(),
    paymentController.createPayment
);


export const paymentRouter: Router = router;