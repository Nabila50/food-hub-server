import express, { Router } from "express";
import { providerController } from "./provider.controller";

const router = express.Router();

router.get("/providerId", providerController.getProviderById);

router.post("/", providerController.createProvider);


export const providerRouter: Router= router;