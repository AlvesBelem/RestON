import { Request, Response } from "express";
import { RemoveOrderService } from "../../services/order/RemoveOrderService";

class RemoveOrderController {
  async handle(req: Request, res: Response) {
    const orderId = req.query.orderId as string;

    const removeOrder = new RemoveOrderService();

    const order = await removeOrder.execute({
      orderId,
    });

    return res.json(order);
  }
}

export { RemoveOrderController };
