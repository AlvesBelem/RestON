import prismaClient from "../../prisma";

interface ItemRequest {
  itemId: string;
}

class RemoveItemService {
  async execute({ itemId }: ItemRequest) {
    const order = await prismaClient.item.delete({
      where: {
        id: itemId,
      },
    });

    return order;
  }
}

export { RemoveItemService };
