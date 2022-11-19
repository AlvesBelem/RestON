import { Router, Response, Request } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";

import { isAthenticaded } from "./middlewares/isAthenticaded";

const router = Router();

// Rotas Users
router.post("/users", new CreateUserController().handle);

router.post("/session", new AuthUserController().handle);

router.get("/me", isAthenticaded, new DetailUserController().handle);

export { router };
