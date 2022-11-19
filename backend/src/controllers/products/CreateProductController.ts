import { Request, Response } from "express";
import { CreateProductsService } from "../../services/products/CreateProductsService";

class CreateProductController {
  async handle(req: Request, res: Response) {
    const { name, price, description, banner, categoryId } = req.body;
    const createProductsService = new CreateProductsService();
    const product = await createProductsService.execute({
      name,
      price,
      description,
      banner,
      categoryId,
    });

    return res.json(product);
  }
}

export { CreateProductController };
