const mongoose = require('mongoose');

const atlasUri = 'mongodb+srv://udumalpetbusinesstour:xsjTZAsfHMc1wr6Z@udumalpetbusinesstour.tggc5t5.mongodb.net/udtbusiness?retryWrites=true&w=majority&appName=udumalpetbusinesstour';

const defaultUnsplashBusiness = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80';

async function cleanImageUrls() {
  console.log('Connecting to MongoDB Atlas database to clean up image URLs...');
  const conn = await mongoose.connect(atlasUri);
  console.log('Connected to Atlas database.');

  // 1. Clean Businesses Collection
  console.log('\nCleaning Businesses image URLs...');
  const Business = conn.models.Business || conn.model('Business', new mongoose.Schema({}, { strict: false }));
  
  const businesses = await Business.find({});
  let businessUpdatesCount = 0;

  for (const biz of businesses) {
    let modified = false;

    // Check coverImageUrl
    if (biz.coverImageUrl && biz.coverImageUrl.includes('localhost:5000')) {
      biz.coverImageUrl = ''; // Triggers frontend placeholder
      modified = true;
    }

    // Check logoUrl
    if (biz.logoUrl && biz.logoUrl.includes('localhost:5000')) {
      biz.logoUrl = '';
      modified = true;
    }

    // Check galleryUrls
    if (biz.galleryUrls && biz.galleryUrls.length) {
      const originalLength = biz.galleryUrls.length;
      biz.galleryUrls = biz.galleryUrls.filter(url => !url.includes('localhost:5000'));
      if (biz.galleryUrls.length !== originalLength) modified = true;
    }

    // Check galleryImages
    if (biz.galleryImages && biz.galleryImages.length) {
      const originalLength = biz.galleryImages.length;
      biz.galleryImages = biz.galleryImages.filter(url => !url.includes('localhost:5000'));
      if (biz.galleryImages.length !== originalLength) modified = true;
    }

    if (modified) {
      await biz.save();
      businessUpdatesCount++;
      console.log(`- Cleaned image URLs for business: "${biz.name || biz.businessName || biz._id}"`);
    }
  }
  console.log(`✓ Cleaned ${businessUpdatesCount} business documents.`);

  // 2. Clean Blogs Collection
  console.log('\nCleaning Blogs image URLs...');
  const Blog = conn.models.Blog || conn.model('Blog', new mongoose.Schema({}, { strict: false }));
  const blogs = await Blog.find({});
  let blogUpdatesCount = 0;

  for (const blog of blogs) {
    if (blog.imageUrl && blog.imageUrl.includes('localhost:5000')) {
      blog.imageUrl = '';
      await blog.save();
      blogUpdatesCount++;
      console.log(`- Cleaned image URL for blog: "${blog.title}"`);
    }
  }
  console.log(`✓ Cleaned ${blogUpdatesCount} blog documents.`);

  // 3. Clean Events Collection
  console.log('\nCleaning Events image URLs...');
  const Event = conn.models.Event || conn.model('Event', new mongoose.Schema({}, { strict: false }));
  const events = await Event.find({});
  let eventUpdatesCount = 0;

  for (const event of events) {
    if (event.imageUrl && event.imageUrl.includes('localhost:5000')) {
      event.imageUrl = '';
      await event.save();
      eventUpdatesCount++;
      console.log(`- Cleaned image URL for event: "${event.title}"`);
    }
  }
  console.log(`✓ Cleaned ${eventUpdatesCount} event documents.`);

  // 4. Clean Testimonials Collection
  console.log('\nCleaning Testimonials image URLs...');
  const Testimonial = conn.models.Testimonial || conn.model('Testimonial', new mongoose.Schema({}, { strict: false }));
  const testimonials = await Testimonial.find({});
  let testimonialUpdatesCount = 0;

  for (const t of testimonials) {
    let modified = false;
    if (t.avatar && t.avatar.includes('localhost:5000')) {
      t.avatar = '';
      modified = true;
    }
    if (t.imageUrl && t.imageUrl.includes('localhost:5000')) {
      t.imageUrl = '';
      modified = true;
    }
    if (modified) {
      await t.save();
      testimonialUpdatesCount++;
      console.log(`- Cleaned image URL for testimonial from: "${t.authorName}"`);
    }
  }
  console.log(`✓ Cleaned ${testimonialUpdatesCount} testimonial documents.`);

  await conn.disconnect();
  console.log('\n🎉 Image URLs cleanup on MongoDB Atlas completed successfully!');
  process.exit(0);
}

cleanImageUrls().catch(err => {
  console.error('Cleanup failed:', err);
  process.exit(1);
});
