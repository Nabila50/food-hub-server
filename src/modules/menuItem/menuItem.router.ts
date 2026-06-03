import express, { Router } from 'express';
import { menuItemController } from './menuItem.controller';

import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.get("/", menuItemController.getAllMenuItem);



router.delete("/:menuItemId", auth(UserRole.PROVIDER, UserRole.ADMIN), menuItemController.deleteMenuItem)

router.patch("/:menuItemId", auth(UserRole.ADMIN, UserRole.PROVIDER), menuItemController.updateMenuItem)

export const menuItemRouter: Router = router;