import { Decimal } from '@prisma/client/runtime/library';

export type DecimalLike = Decimal | number | string;

export interface ItemInput {
  name: string;
  unitPrice: DecimalLike;
  quantity: number;
}

export interface OrderItemInput {
  itemId: string;
  quantity: number;
}

export interface OrderCreationInput {
  userId: string;
  items: OrderItemInput[];
}
