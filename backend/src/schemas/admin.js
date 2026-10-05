const { z } = require('zod')

// MySQL renvoie les BOOLEAN sous forme 0/1 : on accepte les deux formats
const bool = z.preprocess((v) => {
  if (v === 1 || v === '1' || v === 'true') return true
  if (v === 0 || v === '0' || v === 'false') return false
  return v
}, z.boolean())

// Chaîne optionnelle : '' est converti en NULL (évite les doublons sur les colonnes UNIQUE comme sku)
const optStr = (max) => z.string().max(max).nullable().optional()
  .transform((v) => (v === '' ? null : v))

const slug = z.string().min(1).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug invalide (a-z, 0-9, tirets)')
const id = z.coerce.number().int().positive()

const productSchema = z.object({
  name: z.string().min(2).max(255),
  slug,
  description: z.string().nullable().optional(),
  short_description: optStr(500),
  price: z.coerce.number().positive('Le prix doit être positif'),
  currency: z.string().max(10).optional(),
  category_id: id,
  sku: optStr(100),
  stock_quantity: z.coerce.number().int().min(0).optional(),
  stock_status: z.enum(['in_stock', 'out_of_stock', 'on_backorder']).optional(),
  badge: optStr(50),
  weight: z.coerce.number().nonnegative().nullable().optional(),
  dimensions: optStr(100),
  images: z.array(z.string()).nullable().optional(),
  features: z.array(z.string()).nullable().optional(),
  specifications: z.union([z.record(z.any()), z.array(z.any())]).nullable().optional(),
  is_featured: bool.optional(),
  is_active: bool.optional(),
})

const articleSchema = z.object({
  title: z.string().min(2).max(255),
  slug,
  excerpt: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  category_id: id,
  author_name: z.string().min(2).max(100),
  author_email: z.string().email().nullable().optional().or(z.literal('').transform(() => null)),
  author_bio: z.string().nullable().optional(),
  featured_image: optStr(500),
  read_time: z.coerce.number().int().positive().nullable().optional(),
  tags: z.array(z.string()).nullable().optional(),
  seo_title: optStr(255),
  seo_description: z.string().nullable().optional(),
  seo_keywords: optStr(255),
  is_featured: bool.optional(),
  is_published: bool.optional(),
})

const serviceSchema = z.object({
  name: z.string().min(2).max(255),
  slug,
  description: z.string().nullable().optional(),
  short_description: optStr(500),
  category_id: id,
  icon: optStr(50),
  color: optStr(20),
  bg_color: optStr(20),
  features: z.array(z.string()).nullable().optional(),
  pricing: z.union([z.record(z.any()), z.array(z.any())]).nullable().optional(),
  delivery_time: optStr(100),
  is_active: bool.optional(),
  sort_order: z.coerce.number().int().optional(),
})

const categorySchema = z.object({
  name: z.string().min(2).max(100),
  slug: slug.max(100),
  description: z.string().nullable().optional(),
  icon: optStr(50),
  type: z.enum(['product', 'service', 'blog']),
  parent_id: z.preprocess((v) => (v === '' ? null : v), id.nullable()).optional(),
  sort_order: z.coerce.number().int().optional(),
  is_active: bool.optional(),
})

const contactPatchSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assigned_to: optStr(100),
  notes: z.string().nullable().optional(),
})

const quotePatchSchema = z.object({
  status: z.enum(['pending', 'contacted', 'quoted', 'accepted', 'rejected', 'completed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigned_to: optStr(100),
  notes: z.string().nullable().optional(),
})

module.exports = {
  productSchema,
  productUpdateSchema: productSchema.partial(),
  articleSchema,
  articleUpdateSchema: articleSchema.partial(),
  serviceSchema,
  serviceUpdateSchema: serviceSchema.partial(),
  categorySchema,
  categoryUpdateSchema: categorySchema.partial(),
  contactPatchSchema,
  quotePatchSchema,
}
