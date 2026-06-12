const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
  },
  parentCategory: {
    type: String,
    trim: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  slug: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
  },
  icon: {
    type: String, // lucide icon name or image link
    default: 'Store',
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
  },
  description: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true
});

CategorySchema.pre('save', async function() {
  if (this.isModified('categoryName') || !this.slug) {
    this.slug = this.categoryName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
});

const Category = mongoose.model('Category', CategorySchema);

const seedDefaultCategories = async () => {
  try {
    console.log('Syncing and seeding local category classification...');
    
    // Auto-repair any legacy categories with null or missing slugs to avoid unique index crashes
    const legacyCategories = await Category.find({ $or: [{ slug: null }, { slug: { $exists: false } }] });
    for (const cat of legacyCategories) {
      if (cat.categoryName) {
        cat.slug = cat.categoryName
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/[\s_]+/g, '-')
          .replace(/^-+|-+$/g, '');
        await cat.save();
      }
    }
    const list = [
      // Retail & Shopping (Parent: Shopping)
      { categoryName: 'Grocery Stores', parentCategory: 'Shopping', icon: 'ShoppingBag', description: 'Local grocery and department stores' },
      { categoryName: 'Supermarkets', parentCategory: 'Shopping', icon: 'ShoppingBag', description: 'Supermarkets and larger grocery stores' },
      { categoryName: 'Vegetable & Fruit Shops', parentCategory: 'Shopping', icon: 'ShoppingBag', description: 'Fresh farm fruits and vegetables bazaar' },
      { categoryName: 'Textile & Garments', parentCategory: 'Shopping', icon: 'ShoppingBag', description: 'Textiles, silks, clothing, and readymades' },
      { categoryName: 'Footwear Shops', parentCategory: 'Shopping', icon: 'ShoppingBag', description: 'Shoes, chappals, and footwear showrooms' },
      { categoryName: 'Jewelry Shops', parentCategory: 'Shopping', icon: 'ShoppingBag', description: 'Gold, silver, and diamond jewelry showrooms' },
      { categoryName: 'Gift Shops', parentCategory: 'Shopping', icon: 'ShoppingBag', description: 'Gifts, toys, cards, and fancy items' },
      { categoryName: 'Stationery & Book Stores', parentCategory: 'Shopping', icon: 'ShoppingBag', description: 'Notebooks, textbooks, pens, and office stationery' },
      { categoryName: 'Furniture Shops', parentCategory: 'Shopping', icon: 'ShoppingBag', description: 'Wooden, steel, and office home furniture' },
      { categoryName: 'Hardware Stores', parentCategory: 'Shopping', icon: 'ShoppingBag', description: 'Tools, steel wires, nails, and hardware goods' },
      { categoryName: 'Paint Stores', parentCategory: 'Shopping', icon: 'ShoppingBag', description: 'Wall paints, primers, and home painting supplies' },
      { categoryName: 'Pet Shops', parentCategory: 'Shopping', icon: 'ShoppingBag', description: 'Pets, pet foods, and veterinary accessories' },

      // Electronics (Parent: Electronics)
      { categoryName: 'Mobile Stores', parentCategory: 'Electronics', icon: 'ShoppingBag', description: 'Mobile phones purchase, recharge, and services' },
      { categoryName: 'Computer & Laptop Stores', parentCategory: 'Electronics', icon: 'ShoppingBag', description: 'Computers, laptops, and IT accessories sales' },
      { categoryName: 'Electronics & Appliances', parentCategory: 'Electronics', icon: 'ShoppingBag', description: 'Home appliances, televisions, and electrical appliances' },

      // Food & Restaurants (Parent: Food & Restaurants)
      { categoryName: 'Restaurants', parentCategory: 'Food & Restaurants', icon: 'Utensils', description: 'Dine-in hotels, vegetarian, and non-veg restaurants' },
      { categoryName: 'Hotels & Lodges', parentCategory: 'Food & Restaurants', icon: 'Utensils', description: 'Boarding lodges, rooms, and luxury hotels' },
      { categoryName: 'Bakeries', parentCategory: 'Food & Restaurants', icon: 'Utensils', description: 'Breads, cakes, puffs, and bakery items' },
      { categoryName: 'Cafes & Tea Shops', parentCategory: 'Food & Restaurants', icon: 'Utensils', description: 'Tea stalls, coffee bars, and local chat cafes' },
      { categoryName: 'Sweet Shops', parentCategory: 'Food & Restaurants', icon: 'Utensils', description: 'Traditional Indian sweets and savouries stores' },
      { categoryName: 'Fast Food Centers', parentCategory: 'Food & Restaurants', icon: 'Utensils', description: 'Quick fast food, street food, and evening stalls' },
      { categoryName: 'Catering Services', parentCategory: 'Food & Restaurants', icon: 'Utensils', description: 'Marriage catering and bulk function meals supplies' },
      { categoryName: 'Juice & Ice Cream Parlors', parentCategory: 'Food & Restaurants', icon: 'Utensils', description: 'Fresh juices, milkshakes, and ice creams parlours' },

      // Health & Medical (Parent: Health & Medical)
      { categoryName: 'Hospitals', parentCategory: 'Health & Medical', icon: 'Activity', description: 'Multi-specialty hospitals and emergency care centers' },
      { categoryName: 'Clinics', parentCategory: 'Health & Medical', icon: 'Activity', description: 'Private doctor clinics and consultation centers' },
      { categoryName: 'Dental Clinics', parentCategory: 'Health & Medical', icon: 'Activity', description: 'Dentistry, tooth cleaning, and orthodontic clinics' },
      { categoryName: 'Pharmacies', parentCategory: 'Health & Medical', icon: 'Activity', description: 'Allopathic, homeopathic, and ayurvedic medical shops' },
      { categoryName: 'Diagnostic Labs', parentCategory: 'Health & Medical', icon: 'Activity', description: 'Blood tests, X-rays, and medical diagnostic labs' },
      { categoryName: 'Physiotherapy Centers', parentCategory: 'Health & Medical', icon: 'Activity', description: 'Physiotherapy, muscle healing, and fitness centers' },
      { categoryName: 'Veterinary Clinics', parentCategory: 'Health & Medical', icon: 'Activity', description: 'Pet healthcare, animal hospitals, and clinics' },

      // Beauty & Personal Care (Parent: Beauty & Wellness)
      { categoryName: 'Beauty Parlours', parentCategory: 'Beauty & Wellness', icon: 'Sparkles', description: 'Ladies beauty salons and wedding makeup parlours' },
      { categoryName: 'Salons & Barbers', parentCategory: 'Beauty & Wellness', icon: 'Sparkles', description: 'Men hair cutting salons and barbers shops' },
      { categoryName: 'Spa & Wellness Centers', parentCategory: 'Beauty & Wellness', icon: 'Sparkles', description: 'Massage therapies, spa, and wellness centers' },
      { categoryName: 'Cosmetic Stores', parentCategory: 'Beauty & Wellness', icon: 'Sparkles', description: 'Branded makeups, cosmetics, and perfumes stores' },

      // Education (Parent: Education)
      { categoryName: 'Schools', parentCategory: 'Education', icon: 'GraduationCap', description: 'Matriculation, CBSE, and government schools' },
      { categoryName: 'Colleges', parentCategory: 'Education', icon: 'GraduationCap', description: 'Engineering, Arts & Science, and polytechnic colleges' },
      { categoryName: 'Tuition Centers', parentCategory: 'Education', icon: 'GraduationCap', description: 'School tuition classes and evening subjects centers' },
      { categoryName: 'Coaching Institutes', parentCategory: 'Education', icon: 'GraduationCap', description: 'Competitive exams coaching, IAS, and bank coaching' },
      { categoryName: 'Computer Training Centers', parentCategory: 'Education', icon: 'GraduationCap', description: 'Software programming, Tally, and DTP training centers' },
      { categoryName: 'Driving Schools', parentCategory: 'Education', icon: 'GraduationCap', description: 'Car, bike, and heavy vehicle driving license schools' },

      // Automotive (Parent: Automotive)
      { categoryName: 'Car Showrooms', parentCategory: 'Automotive', icon: 'Car', description: 'New and used car dealers and showrooms' },
      { categoryName: 'Bike Showrooms', parentCategory: 'Automotive', icon: 'Car', description: 'Two-wheeler bike and scooter showrooms' },
      { categoryName: 'Automobile Service Centers', parentCategory: 'Automotive', icon: 'Car', description: 'Car and bike mechanic workshops and service stations' },
      { categoryName: 'Car Wash Services', parentCategory: 'Automotive', icon: 'Car', description: 'Water wash, vacuuming, and car detailing centers' },
      { categoryName: 'Tyre Shops', parentCategory: 'Automotive', icon: 'Car', description: 'Car, bike, and truck tyres and wheel alignment' },
      { categoryName: 'Spare Parts Dealers', parentCategory: 'Automotive', icon: 'Car', description: 'Automobile engine spare parts and accessories shops' },
      { categoryName: 'Petrol Bunks', parentCategory: 'Automotive', icon: 'Car', description: 'Petrol, diesel, and gas filling stations' },

      // Home Services (Parent: Home Services)
      { categoryName: 'Electricians', parentCategory: 'Home Services', icon: 'Wrench', description: 'House wiring, electrical repairs, and inverter services' },
      { categoryName: 'Plumbers', parentCategory: 'Home Services', icon: 'Wrench', description: 'Pipe fittings, tap leakages, and water tank plumbing' },
      { categoryName: 'Carpenters', parentCategory: 'Home Services', icon: 'Wrench', description: 'Wooden doors, modular kitchens, and furniture repairs' },
      { categoryName: 'AC Service & Repair', parentCategory: 'Home Services', icon: 'Wrench', description: 'AC installation, gas filling, and cooling services' },
      { categoryName: 'Home Cleaning Services', parentCategory: 'Home Services', icon: 'Wrench', description: 'Deep home cleaning, sofa, and bathroom washing' },
      { categoryName: 'Interior Designers', parentCategory: 'Home Services', icon: 'Wrench', description: 'Home interior works, wardrobes, and false ceiling' },
      { categoryName: 'Pest Control Services', parentCategory: 'Home Services', icon: 'Wrench', description: 'Termite control, bed bug treatments, and mosquito sprays' },

      // Real Estate (Parent: Real Estate)
      { categoryName: 'Real Estate Agencies', parentCategory: 'Real Estate', icon: 'Building', description: 'Plots, houses, and agricultural land brokers' },

      // Construction (Parent: Construction)
      { categoryName: 'Builders & Contractors', parentCategory: 'Construction', icon: 'Building', description: 'Home builders, building contractors, and civil engineers' },
      { categoryName: 'Construction Material Suppliers', parentCategory: 'Construction', icon: 'Building', description: 'Sand, bricks, blue metal, and aggregates suppliers' },
      { categoryName: 'Cement & Steel Dealers', parentCategory: 'Construction', icon: 'Building', description: 'Branded cements, steel rods, and structural pipes' },
      { categoryName: 'Architects', parentCategory: 'Construction', icon: 'Building', description: 'House elevation plans, 3D designs, and structural drafting' },
      { categoryName: 'Borewell Services', parentCategory: 'Construction', icon: 'Building', description: 'Borewell drilling, flushing, and pump installation' },

      // Agriculture (Parent: Agriculture)
      { categoryName: 'Farm Equipment Dealers', parentCategory: 'Agriculture', icon: 'Leaf', description: 'Tractors, power tillers, and farming tools dealers' },
      { categoryName: 'Coconut Traders', parentCategory: 'Agriculture', icon: 'Leaf', description: 'Raw coconut purchase, copra mills, and coconut coir' },
      { categoryName: 'Fertilizer & Pesticide Shops', parentCategory: 'Agriculture', icon: 'Leaf', description: 'Agricultural fertilizers, seeds, and pest chemicals' },
      { categoryName: 'Dairy Farms', parentCategory: 'Agriculture', icon: 'Leaf', description: 'Fresh cow milk supplies, curd, and local dairy farms' },
      { categoryName: 'Poultry Farms', parentCategory: 'Agriculture', icon: 'Leaf', description: 'Broiler chicken, egg breeding, and local poultry grids' },
      { categoryName: 'Agricultural Consultants', parentCategory: 'Agriculture', icon: 'Leaf', description: 'Organic farm advice, soil testing, and yield mapping' },
      { categoryName: 'Irrigation Equipment Suppliers', parentCategory: 'Agriculture', icon: 'Leaf', description: 'Drip irrigation pipes, sprinklers, and pump sets' },

      // Professional Services (Parent: Professional Services)
      { categoryName: 'Chartered Accountants', parentCategory: 'Professional Services', icon: 'Coins', description: 'GST audits, income tax filing, and corporate accounting' },
      { categoryName: 'Auditors', parentCategory: 'Professional Services', icon: 'Coins', description: 'Business auditing, corporate audit registry' },
      { categoryName: 'Advocates / Lawyers', parentCategory: 'Professional Services', icon: 'Coins', description: 'Civil, criminal, property registry, and legal consultants' },
      { categoryName: 'Tax Consultants', parentCategory: 'Professional Services', icon: 'Coins', description: 'Professional tax, PAN, and trade license registration' },

      // Finance & Insurance (Parent: Finance & Insurance)
      { categoryName: 'Insurance Agents', parentCategory: 'Finance & Insurance', icon: 'Coins', description: 'Life insurance, car/bike third-party vehicle insurance' },
      { categoryName: 'Financial Advisors', parentCategory: 'Finance & Insurance', icon: 'Coins', description: 'Mutual funds, loan consultants, and investments portfolio' },

      // Events & Entertainment (Parent: Events & Entertainment)
      { categoryName: 'Event Organizers', parentCategory: 'Events & Entertainment', icon: 'Camera', description: 'Stage events, birthday parties, and corporate meetings' },
      { categoryName: 'Wedding Planners', parentCategory: 'Events & Entertainment', icon: 'Camera', description: 'Frictionless marriage ceremony arrangements and setups' },
      { categoryName: 'Photography & Videography', parentCategory: 'Events & Entertainment', icon: 'Camera', description: 'Outdoor shoots, wedding coverage, and studio portraits' },
      { categoryName: 'Decoration Services', parentCategory: 'Events & Entertainment', icon: 'Camera', description: 'Marriage stage decorations, balloon and flower setups' },
      { categoryName: 'Sound & Lighting Services', parentCategory: 'Events & Entertainment', icon: 'Camera', description: 'Professional DJ, stage speaker systems, and serial lights' },
      { categoryName: 'Printing & Flex Services', parentCategory: 'Events & Entertainment', icon: 'Camera', description: 'Wedding cards, digital flex banners, and custom printing' },

      // Travel & Hospitality (Parent: Travel & Hospitality)
      { categoryName: 'Travel Agencies', parentCategory: 'Travel & Hospitality', icon: 'Plane', description: 'Flight booking, passport help, and international holiday packages' },
      { categoryName: 'Tours & Travels', parentCategory: 'Travel & Hospitality', icon: 'Plane', description: 'Local sightseeings, Thirumoorthy hills, and Ooty tours' },
      { categoryName: 'Vehicle Rentals', parentCategory: 'Travel & Hospitality', icon: 'Plane', description: 'Self-drive car rentals and two-wheeler rentals' },
      { categoryName: 'Taxi Services', parentCategory: 'Travel & Hospitality', icon: 'Plane', description: 'Call taxis, outstation cabs, and tourist travelers' },
      { categoryName: 'Bus Operators', parentCategory: 'Travel & Hospitality', icon: 'Plane', description: 'Omni buses and private travel bus ticket booking agents' },

      // Sports & Fitness (Parent: Sports & Fitness)
      { categoryName: 'Gyms', parentCategory: 'Sports & Fitness', icon: 'Dumbbell', description: 'Cardio, weight training, and fitness gyms' },
      { categoryName: 'Yoga Centers', parentCategory: 'Sports & Fitness', icon: 'Dumbbell', description: 'Traditional yoga classes, meditation, and mental health' },
      { categoryName: 'Sports Academies', parentCategory: 'Sports & Fitness', icon: 'Dumbbell', description: 'Cricket coaching, badminton courts, and swimming academies' },
      { categoryName: 'Sports Equipment Stores', parentCategory: 'Sports & Fitness', icon: 'Dumbbell', description: 'Bats, balls, nets, and fitness wearables shops' },

      // Others (Parent: Others)
      { categoryName: 'Temples', parentCategory: 'Others', icon: 'Landmark', description: 'Town temples, historical kovils, and worship shrines' },
      { categoryName: 'Marriage Halls', parentCategory: 'Others', icon: 'Landmark', description: 'Traditional Kalyana Mandapams and wedding reception halls' },
      { categoryName: 'Community Halls', parentCategory: 'Others', icon: 'Landmark', description: 'Mini halls, party lawns, and municipal community halls' },
      { categoryName: 'Trusts & NGOs', parentCategory: 'Others', icon: 'Landmark', description: 'Social service organizations, charity trusts, and NGOs' },
      { categoryName: 'Others', parentCategory: 'Others', icon: 'Store', description: 'Special fallback category for custom entries' }
    ];

    for (const item of list) {
      const exists = await Category.findOne({ categoryName: item.categoryName });
      const seededViews = Math.floor(Math.random() * 800) + 150;
      
      const slug = item.categoryName
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/^-+|-+$/g, '');

      const updateFields = {
        parentCategory: item.parentCategory, 
        icon: item.icon, 
        description: item.description,
        slug
      };
      
      if (!exists || !exists.views) {
        updateFields.views = seededViews;
      }
      
      await Category.findOneAndUpdate(
        { categoryName: item.categoryName },
        { $set: updateFields },
        { upsert: true, new: true }
      );
    }
    console.log(`✓ Synchronized ${list.length} categories successfully in the database.`);
  } catch (error) {
    console.error('Error seeding categories list:', error.message);
  }
};

module.exports = Category;
module.exports.seedDefaultCategories = seedDefaultCategories;
