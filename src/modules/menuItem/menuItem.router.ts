import express, { Router } from 'express';
import { menuItemController } from './menuItem.controller';

import auth, { UserRole } from '../../middlewares/auth';

const router = express.Router();

router.get("/", menuItemController.getAllMenuItem);

// router.delete("/:menuitemsId", auth(UserRole.ADMIN, UserRole.PROVIDER, UserRole.CUSTOMER), menuItemController.deleteMenuItem)

router.delete("/:menuItemId", auth(UserRole.PROVIDER, UserRole.ADMIN ), menuItemController.deleteMenuItem

)

export const menuItemRouter: Router = router;