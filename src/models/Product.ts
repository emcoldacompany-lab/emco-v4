import mongoose, { Schema, model, models } from 'mongoose';

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, default: '' },
    brand: { type: String, default: '' },
    summary: { type: String, default: '' },
    description: { type: String, default: '' },
    price: { type: Number, default: null }, // null = "price on request"
    unit: { type: String, default: 'piece' },
    images: { type: [String], default: [] },
    specs: { type: [{ label: String, value: String }], default: [] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    inStock: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Powers the catalogue search box.
ProductSchema.index({ name: 'text', summary: 'text', brand: 'text', sku: 'text' });

export type ProductDoc = mongoose.InferSchemaType<typeof ProductSchema> & { _id: string };
export const Product = models.Product || model('Product', ProductSchema);
