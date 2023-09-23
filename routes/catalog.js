var express = require('express');
var router = express.Router();
const path = require('path')

const multer = require('multer')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/images')
  },
  filename: (req, file, cb) => {
    console.log(req);
    cb(null, Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({storage: storage})
const categorie_controller = require('../controllers/categoriesController')
const items_controller = require('../controllers/itemController')

/// Categories Routes ///

router.get('/', categorie_controller.index);

router.get('/categories/', categorie_controller.categories_list)

router.get('/categorie/create', categorie_controller.categories_create_get)

router.post('/categorie/create', categorie_controller.categories_create_post)

router.get('/categories/:name/:id/delete', categorie_controller.categories_delete_get)

router.post('/categories/:name/:id/delete', categorie_controller.categories_delete_post)

router.get('/categories/:id/update', categorie_controller.categories_update_get)

router.post('/categories/:id/update', categorie_controller.categories_update_post)

router.get('/categories/:name/:id', categorie_controller.categories_detail)

/// Items Routes ///

router.get('/item/create', items_controller.item_create_get)

router.post('/item/create', upload.single('image'), items_controller.item_create_post)

router.get('/item/:id/delete', items_controller.item_delete_get)

router.post('/item/:id/delete', items_controller.item_delete_post)

router.get('/items/:id/update', items_controller.item_update_get)

router.post('/items/:id/update', items_controller.item_update_post)

router.get('/items/', items_controller.items_list)

router.get('/item/:id', items_controller.item_detail)

router.get('/upload', items_controller.item_upload_get)

router.post('/upload', upload.single('image'), items_controller.item_upload_post)


module.exports = router;