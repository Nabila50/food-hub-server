import express, { Router } from "express";
import { providerController } from "./provider.controller";

const router = express.Router();

router.post("/providers", providerController.createProvider);

export const providerRouter: Router= router;