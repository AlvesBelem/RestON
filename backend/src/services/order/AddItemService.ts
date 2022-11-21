import prismaClient from "../../prisma";

interface ItemRequest {
  orderId: string;
  productId: string;
  amount: number;
}

class AddItemService {
  async execute({ orderId, productId, amount }: ItemRequest) {
    const order = await prismaClient.item.create({
      data: {
        orderId: orderId,
        productId: productId,
        amount: amount,
      },
    });

    return order;
  }
}

export { AddItemService };
