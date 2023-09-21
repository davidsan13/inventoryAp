const Items = require("../models/items")
const asyncHandler = require("express-async-handler")
const { body, validationResult } = require("express-validator");

exports.items_list = asyncHandler(async (req, res, next) => {
  const allItems = await Items.find({}, "name description")
    .sort({ name: 1 })
    .exec();

    res.render("items_list", {
      title: "Products",
      items_list: allItems
    })
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Items.findById(req.params.id).exec()

  res.render("item_detail", {
    title: item.name,
    item: item
  })
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  res.render("item_form", {title: "Create Item"})
});

exports.item_create_post = [
  body("name", "Item name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3})
    .escape(),
  body("description", "description must not be empty.")
    .trim()
    .isLength({ min: 1})
    .escape(),
  body("category", "Category must not be empty")
    .trim()
    .isLength({ min: 1})
    .escape(),
  body("price", "Price must not be empty")
    .trim()
    .isLength({ min: 1})
    .escape(),
  body("stock", "Stock must not be empty")
    .trim()
    .isLength({ min: 1})
    .escape(),

    asyncHandler(async (req, res, next) => {
      const errors = validationResult(req);

      const item = new Items({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
      })

      if (!errors.isEmpty()) {
        res. render("item_form", {
          title: "Create Item",
          item: item,
        })
        return;
      } else {
        const itemExists = await Items.findOne({ name: req.body.name})
          .collation({locale: "en", strength: 2})
          .exec()
        if (itemExists) {
          res.redirect(itemExists.url)
        } else {
          await item.save()
          res.redirect(item.url)
        }
      }
    })
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = Items.findById(req.params.id).exec()

  if( item === null) {
    res.redirect("/cataglog/items")
  }

  res.render("item_delete", {
    title: "Delete Item",
    item: item,
  })
})

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  const item = Items.findById(req.params.id).exec()

  await Items.findByIdAndRemove(req.body.itemid);
  res.redirect("/catalog/items/")
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const item = Items.findById(req.params.id).exec()

  if (item === null) {
    res.redirect("/catalog/items")
  }

  res.render("item_form", {
    title: "Update Item",
    item: item,
  })
});

exports.item_update_post = [
  body("name", "Item name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3})
    .escape(),
  body("description", "description must not be empty.")
    .trim()
    .isLength({ min: 1})
    .escape(),
  body("category", "Category must not be empty")
    .trim()
    .isLength({ min: 1})
    .escape(),
  body("price", "Price must not be empty")
    .trim()
    .isLength({ min: 1})
    .escape(),
  body("stock", "Stock must not be empty")
    .trim()
    .isLength({ min: 1})
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Items({
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      stock: req.body.stock,
    })

    if (!errors.isEmpty()) {
      res.render("item_form", {
        title: "Update Item",
        item: item,
        errors: errors.array(),
      })
      return;
    } else {
      const updatedItem = await Items.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updateItem.url)
    }
  })
]