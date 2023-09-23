const Categories = require("../models/categories")
const Items = require("../models/items")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  res.render('index', {title: 'Majour Warehouse'})
})
exports.categories_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Categories.find({}, "name description")
    .sort({ name: 1 })
    .exec();

    res.render("categories_list", {
      title: "Departments",
      categories_list: allCategories
    })
});

exports.categories_detail = asyncHandler(async (req, res, next) => {
  const [category, allItems] = await Promise.all([
    Categories.findById(req.params.id).exec(),
    Items.find({category: req.params.id}).exec(),
  ]);
  res.render("category_detail", {
    title: category.name,
    category: category,
    category_detail: allItems
  })
});

exports.categories_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", {title: "Create Category"})
});

exports.categories_create_post = [ 
  // Validate and sanitize the name field.
  body("name", "Category name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3})
    .escape(),

    //Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    const errors =  validationResult(req);

    const category = new Categories({name: req.body.name})

    if(!errors.isEmpty()) {
      res.render("category_form", {
        title: "Create Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const categoryExists = await Categories.findOne({ name: req.body.name})
        .collation({locale: "en", strength: 2})
        .exec();
      if (categoryExists) {
        res.redirect(categoryExists.url)
      } else {
        await category.save()
        res.redirect(category.url)
      }
    }
  })
]

exports.categories_delete_get = asyncHandler(async (req, res, next) => {
  // console.log(req)
  const [category, allItemsInCategory] = await Promise.all([
    Categories.findById(req.params.id).exec(),
    Items.find({category: req.params.id}, "name").exec(),
  ])

  if( category === null) {
    res.redirect("/catalog/categories")
  }

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    items: allItemsInCategory,
  })
});

exports.categories_delete_post = asyncHandler(async (req, res, next) => {
  const [category, allItemsInCategory] = await Promise.all([
    Categories.findById(req.params.id).exec(),
    Items.find({ category: req.params.id}, "name").exec(),
  ])

  if (allItemsInCategory.length > 0) {
    res.render("category_delete", {
      title: "Category Delete",
      category: category,
      items: allItemsInCategory,
    })
    return;
  } else {
    await Categories.findByIdAndRemove(req.body.categoryid);
    res.redirect("/catalog/categories")
  }
});

exports.categories_update_get = asyncHandler(async (req, res, next) => {
  const category = Categories.findById(req.params.id).exec()

  if(category === null) {
    res.redirect("/catalog/categories")
  }

  res.render("category_form", {
    title: "Update Category",
    category: category,
  })
});

exports.categories_update_post = [
  body("name", "Category name must contain at least 3 characters")
  .trim()
  .isLength({ min: 3})
  .escape(),

  asyncHandler(async (req, res, next) => {
    const errors =  validationResult(req);

    const category = new Categories({
      name: req.body.name,
      _id: req.params.id
    })

    if(!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedCategory = await Categories.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(updatedCategory.url);
    }
  })
]