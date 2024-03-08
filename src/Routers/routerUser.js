import { Router } from "express";
import { Manager_users } from "../controllers/controller-users.js";
export const router = Router()




router.post("/premium/:uid",Manager_users.changePremium)