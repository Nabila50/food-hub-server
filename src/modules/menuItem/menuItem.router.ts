import expres, { Router } from 'express';
import { menuItemController } from './menuItem.controller';

const router = expres.Router();

router.get("/", menuItemController.getAllMenuItem);

export const menuItemRouter: Router = router;