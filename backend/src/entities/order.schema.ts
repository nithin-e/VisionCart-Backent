import mongoose, { Schema, Document, Types } from 'mongoose';

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface IOrderItemAttributes {
  color?: string;
  size?: string;
}

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  image: string;
  price: number;
  quantity: number;
  attributes: IOrderItemAttributes;
}

export interface IOrderStatusTimeline {
  status: OrderStatus;
  date: Date;
}

export interface IOrder extends Document {
  userId: Types.ObjectId;
  items: IOrderItem[];
  totalAmount: number;
  status: OrderStatus;
  addressId: Types.ObjectId;
  paymentStatus: PaymentStatus;
  paymentMethod?: string;
  refundReason?: string;
  estimatedDelivery?: Date;
  statusTimeline: IOrderStatusTimeline[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    attributes: {
      color: { type: String, default: '' },
      size: { type: String, default: '' },
    },
  },
  { _id: false }
);

const OrderStatusTimelineSchema = new Schema<IOrderStatusTimeline>(
  {
    status: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      default: [],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'refunded'],
      default: 'pending',
    },
    addressId: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      default: '',
    },
    refundReason: {
      type: String,
      default: null,
    },
    estimatedDelivery: {
      type: Date,
    },
    statusTimeline: {
      type: [OrderStatusTimelineSchema],
      default: [{ status: 'pending', date: new Date() }],
    },
  },
  {
    timestamps: true,
  }
);

OrderSchema.index({ status: 1 });
OrderSchema.index({ createdAt: -1 });

export const Order = mongoose.model<IOrder>('Order', OrderSchema);