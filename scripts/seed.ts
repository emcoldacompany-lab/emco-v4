/**
 * Loads sample departments, products and one admin user.
 * Run with:  npm run seed
 * Safe to re-run — it clears the three collections first.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Category } from '../src/models/Category';
import { Product } from '../src/models/Product';
import { User } from '../src/models/User';

const img = (seed: string) => `https://picsum.photos/seed/${seed}/900/700`;

const categories = [
  { name: 'Power tools', slug: 'power-tools', description: 'Grinders, drills, saws and accessories from brands with real warranties.' },
  { name: 'Building materials', slug: 'building-materials', description: 'Cement, steel, roofing and aggregates by the bag, bundle or truck.' },
  { name: 'Plumbing', slug: 'plumbing', description: 'Pipes, fittings, tanks and fixtures for domestic and commercial jobs.' },
  { name: 'Electrical', slug: 'electrical', description: 'Cable, conduit, switchgear and lighting that passes inspection.' },
  { name: 'Safety gear', slug: 'safety-gear', description: 'Helmets, boots, harnesses and site signage.' },
  { name: 'Others', slug: 'others', description: 'Anything else in stock that does not fit a department above.' },
];

const products = [
  { name: 'Angle grinder 750W, 100mm', slug: 'angle-grinder-750w-100mm', cat: 'power-tools', brand: 'Makita', sku: 'MK-9553NB', price: 4200, unit: 'piece', featured: true,
    summary: 'Compact 750W grinder for cutting and finishing on site.',
    description: 'A workhorse grinder sized for rebar, tile and light steel. Slim body fits between joists, and the labyrinth construction keeps dust out of the bearings.',
    images: [img('angle-grinder-750w')],
    specs: [{ label: 'Power', value: '750W' }, { label: 'Disc size', value: '100mm' }, { label: 'No-load speed', value: '11,000 rpm' }, { label: 'Warranty', value: '12 months' }] },
  { name: 'Cordless impact drill, 18V', slug: 'cordless-impact-drill-18v', cat: 'power-tools', brand: 'DeWalt', sku: 'DW-DCD778', price: 9800, unit: 'piece', featured: true,
    summary: 'Two batteries, brushless motor, hammer action for masonry.',
    description: 'Brushless 18V drill supplied with two 2.0Ah batteries, fast charger and a carry case. Hammer mode handles block and light concrete.',
    images: [img('cordless-impact-drill')],
    specs: [{ label: 'Voltage', value: '18V' }, { label: 'Chuck', value: '13mm keyless' }, { label: 'Batteries', value: '2 × 2.0Ah' }] },
  { name: 'Circular saw 1400W, 185mm', slug: 'circular-saw-1400w-185mm', cat: 'power-tools', brand: 'Bosch', sku: 'BS-GKS190', price: 7600, unit: 'piece',
    summary: 'Straight, fast cuts in timber and board.',
    description: 'A 1400W saw with a 185mm blade and 63mm cut depth. Cast base plate stays true after a drop off the bench.',
    images: [img('circular-saw-1400w')],
    specs: [{ label: 'Power', value: '1400W' }, { label: 'Cut depth', value: '63mm at 90°' }] },
  { name: 'Portland cement 50kg', slug: 'portland-cement-50kg', cat: 'building-materials', brand: 'Cimentos de Moçambique', sku: 'CEM-42N', price: 950, unit: 'bag', featured: true,
    summary: '42.5N ordinary Portland cement, collected or delivered.',
    description: 'Standard 42.5N cement for structural concrete, blockwork and screed. Delivered by the pallet or the truckload; ask for the tonnage rate.',
    images: [img('portland-cement-50kg')],
    specs: [{ label: 'Grade', value: '42.5N' }, { label: 'Bag weight', value: '50kg' }, { label: 'Pallet', value: '40 bags' }] },
  { name: 'Deformed steel bar Y12, 12m', slug: 'deformed-steel-bar-y12', cat: 'building-materials', brand: 'Vulcan Steel', sku: 'RB-Y12', price: 1450, unit: 'length',
    summary: 'High-yield ribbed bar for beams, columns and slabs.',
    description: 'Y12 high-tensile deformed bar in 12 metre lengths, mill certificates available on request for consultant sign-off.',
    images: [img('deformed-steel-bar-y12')],
    specs: [{ label: 'Diameter', value: '12mm' }, { label: 'Length', value: '12m' }, { label: 'Grade', value: '500 MPa' }] },
  { name: 'Iron sheets, 30 gauge, 3m', slug: 'iron-sheets-30g-3m', cat: 'building-materials', brand: 'Macor', sku: 'UB-30G3', price: 1100, unit: 'sheet',
    summary: 'Pre-painted corrugated roofing sheet.',
    description: 'Pre-painted 30 gauge corrugated sheet in charcoal, brick red or forest green. Cut to your rafter length at no extra cost.',
    images: [img('iron-sheets-30g')],
    specs: [{ label: 'Gauge', value: '30' }, { label: 'Length', value: '3m' }] },
  { name: 'PPR pipe 20mm, 4m', slug: 'ppr-pipe-20mm', cat: 'plumbing', brand: 'Plasgran', sku: 'PPR-20', price: 480, unit: 'length',
    summary: 'Hot and cold water pipe, heat fused.',
    description: 'PN20 polypropylene pipe rated for hot and cold supply. Matching sockets, elbows and tees in stock.',
    images: [img('ppr-pipe-20mm')],
    specs: [{ label: 'Diameter', value: '20mm' }, { label: 'Pressure', value: 'PN20' }] },
  { name: 'Water tank 5000L', slug: 'water-tank-5000l', cat: 'plumbing', brand: 'AquaStore', sku: 'CT-5000', price: 18500, unit: 'piece', featured: true,
    summary: 'UV-stabilised vertical tank with lid and outlet.',
    description: 'Three-layer vertical storage tank with a UV-stabilised outer wall and a food-grade inner layer. Delivered upright on site.',
    images: [img('water-tank-5000l')],
    specs: [{ label: 'Capacity', value: '5,000 litres' }, { label: 'Outlet', value: '1 inch' }, { label: 'Warranty', value: '5 years' }] },
  { name: 'Twin and earth cable 2.5mm, 100m', slug: 'twin-earth-cable-2-5mm', cat: 'electrical', brand: 'Electro Cabos', sku: 'CC-TE25', price: 6200, unit: 'roll',
    summary: 'Copper socket-circuit cable, full 100m roll.',
    description: 'Full 100 metre roll of 2.5mm twin and earth for socket circuits. Solid copper, not copper-clad aluminium.',
    images: [img('twin-earth-cable')],
    specs: [{ label: 'Size', value: '2.5mm²' }, { label: 'Length', value: '100m' }, { label: 'Conductor', value: 'Solid copper' }] },
  { name: 'Consumer unit, 8 way', slug: 'consumer-unit-8-way', cat: 'electrical', brand: 'Schneider', sku: 'SE-CU8', price: 4700, unit: 'piece',
    summary: 'Metal-clad board with main switch and busbar.',
    description: 'Eight-way metal consumer unit supplied with a 63A main switch and busbar. MCBs and RCBOs sold separately.',
    images: [img('consumer-unit-8-way')],
    specs: [{ label: 'Ways', value: '8' }, { label: 'Main switch', value: '63A' }] },
  { name: 'Safety helmet, vented', slug: 'safety-helmet-vented', cat: 'safety-gear', brand: '3M', sku: '3M-H700', price: 850, unit: 'piece',
    summary: 'Ratchet harness, ventilated shell, EN 397.',
    description: 'Vented shell with a six-point ratchet harness that stays put in heat. Certified to EN 397. Printing of your company name available on orders above 20 pieces.',
    images: [img('safety-helmet-vented')],
    specs: [{ label: 'Standard', value: 'EN 397' }, { label: 'Harness', value: '6-point ratchet' }] },
  { name: 'Steel toe safety boots', slug: 'steel-toe-safety-boots', cat: 'safety-gear', brand: 'Vaultex', sku: 'VX-ST9', price: 2600, unit: 'pair',
    summary: 'Steel toe cap and midsole, sizes 39 to 46.',
    description: 'Leather upper, steel toe cap and puncture-resistant midsole. Oil and slip resistant outsole. Sizes 39 to 46 held in stock.',
    images: [img('steel-toe-boots')],
    specs: [{ label: 'Protection', value: 'Steel toe and midsole' }, { label: 'Sizes', value: '39–46' }] },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI missing. Copy .env.example to .env first.');

  await mongoose.connect(uri);
  console.log('Connected.');

  await Promise.all([Category.deleteMany({}), Product.deleteMany({}), User.deleteMany({})]);

  const created = await Category.insertMany(categories);
  const bySlug = new Map(created.map((c: any) => [c.slug, c._id]));

  await Product.insertMany(
    products.map(({ cat, ...p }) => ({ ...p, category: bySlug.get(cat), inStock: true }))
  );

  const email = (process.env.ADMIN_EMAIL || 'Garawan1@gmail.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Garawan@1122';
  await User.create({
    name: 'Store Manager',
    email,
    passwordHash: await bcrypt.hash(password, 10),
  });

  console.log(`Seeded ${created.length} departments and ${products.length} products.`);
  console.log(`Admin sign in: ${email} / ${password}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
