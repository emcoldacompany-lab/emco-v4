import mongoose, { Schema, model, models } from 'mongoose';

const QuoteSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    company: { type: String, default: '' },
    phone: { type: String, required: true, trim: true },
    email: { type: String, default: '' },
    quantity: { type: String, default: '' },
    message: { type: String, default: '' },
    product: { type: Schema.Types.ObjectId, ref: 'Product', default: null },
    productName: { type: String, default: '' },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'won', 'lost'],
      default: 'new',
      index: true,
    },
  },
  { timestamps: true }
);

export type QuoteDoc = mongoose.InferSchemaType<typeof QuoteSchema> & { _id: string };
export const Quote = models.Quote || model('Quote', QuoteSchema);
