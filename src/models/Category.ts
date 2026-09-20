import mongoose, { Schema, model, models } from 'mongoose';

const CategorySchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
  },
  { timestamps: true }
);

export type CategoryDoc = mongoose.InferSchemaType<typeof CategorySchema> & { _id: string };
export const Category = models.Category || model('Category', CategorySchema);
