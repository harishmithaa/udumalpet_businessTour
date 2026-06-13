const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/auth');
const Category = require('../models/Category');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res, next) => {
  try {
    const { seedDefaultCategories } = require('../models/Category');
    await seedDefaultCategories();
    const categories = await Category.find().sort({ categoryName: 1 });
    return sendSuccess(res, 200, 'Categories retrieved successfully', categories);
  } catch (err) {
    next(err);
  }
});

// @desc    Get category details by slug
// @route   GET /api/categories/:slug
// @access  Public
router.get('/:slug', async (req, res, next) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) {
      return sendError(res, 404, 'Category classification not found');
    }
    return sendSuccess(res, 200, 'Category details retrieved', category);
  } catch (err) {
    next(err);
  }
});

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, admin, async (req, res, next) => {
  try {
    const { categoryName, icon, image, description, parentCategory } = req.body;
    if (!categoryName) {
      return sendError(res, 400, 'Category name is required');
    }

    const exists = await Category.findOne({ categoryName });
    if (exists) {
      return sendError(res, 400, 'Category with this name already exists');
    }

    const category = await Category.create({ 
      categoryName, 
      icon, 
      image, 
      description,
      parentCategory: parentCategory || 'Others'
    });
    return sendSuccess(res, 201, 'Category classification created successfully', category);
  } catch (err) {
    next(err);
  }
});

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res, next) => {
  try {
    const { categoryName, icon, image, description, parentCategory } = req.body;
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return sendError(res, 404, 'Category classification not found');
    }

    if (categoryName) category.categoryName = categoryName;
    if (icon !== undefined) category.icon = icon;
    if (image !== undefined) category.image = image;
    if (description !== undefined) category.description = description;
    if (parentCategory !== undefined) category.parentCategory = parentCategory;

    await category.save();
    return sendSuccess(res, 200, 'Category classification updated successfully', category);
  } catch (err) {
    next(err);
  }
});

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return sendError(res, 404, 'Category classification not found');
    }

    await category.deleteOne();
    return sendSuccess(res, 200, 'Category classification removed successfully');
  } catch (err) {
    next(err);
  }
});

// Levenshtein Distance logic for fuzzy similarity checks
function levenshteinDistance(s1, s2) {
  const m = s1.length;
  const n = s2.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (s1[i - 1].toLowerCase() === s2[j - 1].toLowerCase()) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,    // deletion
          dp[i][j - 1] + 1,    // insertion
          dp[i - 1][j - 1] + 1 // substitution
        );
      }
    }
  }
  return dp[m][n];
}

function checkFuzzySimilarity(name1, name2) {
  const n1 = name1.toLowerCase().trim();
  const n2 = name2.toLowerCase().trim();
  
  if (n1 === n2) return true;
  if (n1.includes(n2) || n2.includes(n1)) return true; // substring check
  
  const maxLen = Math.max(n1.length, n2.length);
  if (maxLen === 0) return true;
  const distance = levenshteinDistance(n1, n2);
  const similarity = 1 - distance / maxLen;
  return similarity > 0.75; // 75% similarity threshold
}

// @desc    Fuzzy duplicate check before creating a new category
// @route   POST /api/categories/check-duplicate
// @access  Public
router.post('/check-duplicate', async (req, res, next) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) {
      return sendError(res, 400, 'categoryName is required');
    }

    const categories = await Category.find();
    let duplicateMatch = null;

    for (const cat of categories) {
      if (checkFuzzySimilarity(categoryName, cat.categoryName)) {
        duplicateMatch = cat;
        break;
      }
    }

    if (duplicateMatch) {
      return res.json({
        success: true,
        isDuplicate: true,
        existingCategoryName: duplicateMatch.categoryName,
        message: `This category already exists. Please select '${duplicateMatch.categoryName}' from the available categories.`
      });
    }

    return res.json({
      success: true,
      isDuplicate: false
    });
  } catch (err) {
    next(err);
  }
});

// @desc    Autocomplete suggestions from existing categories while typing
// @route   GET /api/categories/suggestions
// @access  Public
router.get('/autocomplete/suggestions', async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.json({ success: true, data: [] });
    }

    const searchRegex = new RegExp(q, 'i');
    const matched = await Category.find({ categoryName: searchRegex }).limit(10);
    return res.json({ success: true, data: matched });
  } catch (err) {
    next(err);
  }
});

// @desc    Increment category view count by name
// @route   POST /api/categories/view
// @access  Public
router.post('/view', async (req, res, next) => {
  try {
    const { categoryName } = req.body;
    if (!categoryName) {
      return sendError(res, 400, 'categoryName is required');
    }
    
    const category = await Category.findOne({
      $or: [
        { categoryName: { $regex: new RegExp(`^${categoryName}$`, 'i') } },
        { slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
      ]
    });
    
    if (category) {
      category.views = (category.views || 0) + 1;
      await category.save();
      return sendSuccess(res, 200, 'Category view count incremented successfully', category);
    }
    
    return sendError(res, 404, 'Category not found');
  } catch (err) {
    next(err);
  }
});

module.exports = router;
