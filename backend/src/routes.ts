import { Router, Response, Request } from "express";
import multer from "multer";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { DetailUserController } from "./controllers/user/DetailUserController";

import { isAthenticaded } from "./middlewares/isAthenticaded";
import { CreateCategoryController } from "./controllers/category/CreateCategoryController";
import { ListCategoryController } from "./controllers/category/ListCategoryController";
import { CreateProductController } from "./controllers/products/CreateProductController";
import { ListByCategoryController } from "./controllers/products/ListByCategoryController";
import { CreateOrderController } from "./controllers/order/CreateOrderController";
import { RemoveOrderController } from "./controllers/order/RemoveOrderController";
import { AddItemController } from "./controllers/order/AddItemController";
import { RemoveItemController } from "./controllers/order/RemoveItemController";
import { SendOrderController } from "./controllers/order/SendOrderController";
import { ListOrderControllers } from "./controllers/order/ListOrderControllers";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { FinishOrderController } from "./controllers/order/FinishOrderController";

import uploadConfig from "./config/multer";

const router = Router();

const upload = multer(uploadConfig.upload("./tmp"));

// Rotas Users
router.post("/users", new CreateUserController().handle);

router.post("/session", new AuthUserController().handle);

router.get("/me", isAthenticaded, new DetailUserController().handle);

// Rotas Category
router.post("/category", isAthenticaded, new CreateCategoryController().handle);
router.get("/category", isAthenticaded, new ListCategoryController().handle);

// Rotas Products
router.post(
  "/products",
  isAthenticaded,
  upload.single("file"),
  new CreateProductController().handle
);

router.get(
  "/category/product",
  isAthenticaded,
  new ListByCategoryController().handle
);

// Rotas Order
router.post("/order", isAthenticaded, new CreateOrderController().handle);
router.delete("/order", isAthenticaded, new RemoveOrderController().handle);
router.post("/order/add", isAthenticaded, new AddItemController().handle);
router.delete(
  "/order/remove",
  isAthenticaded,
  new RemoveItemController().handle
);
router.put("/order/send", isAthenticaded, new SendOrderController().handle);
router.get("/orders", isAthenticaded, new ListOrderControllers().handle);
router.get("/order/detail", isAthenticaded, new DetailOrderController().handle);
router.put("/order/finish", isAthenticaded, new FinishOrderController().handle);

export { router };
