import prismaClient from "../../prisma";

interface DetailRequest {
  orderId: string;
}

class DetailOrderService {
  async execute({ orderId }: DetailRequest) {
    const orders = await prismaClient.item.findMany({
      where: {
        orderId: orderId,
      },
      include: {
        product: true,
        Order: true,
      },
    });

    return orders;
  }
}

export { DetailOrderService };
