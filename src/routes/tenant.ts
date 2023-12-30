import { Router } from "express";
import * as tenantController from "../controllers/tenantController";
import authenticate from "../middlewares/authenticate";

const router = Router();

router.post("/", authenticate, tenantController.createTenant);
router.get("/", authenticate, tenantController.getTenants);
// Diğer rotaları (PUT, DELETE, GET/:id) burada tanımlayın

export default router;
