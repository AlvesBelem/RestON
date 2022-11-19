import prismaClient from "../../prisma";

interface ProductRequest {
  name: string;
  price: string;
  description: string;
  banner: string;
  categoryId: string;
}

class CreateProductsService {
  async execute({
    name,
    price,
    description,
    banner,
    categoryId,
  }: ProductRequest) {
    return { ok: true };
  }
}

export { CreateProductsService };
