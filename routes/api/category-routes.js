const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// GET WORKS ===============================================
router.get('/', async (req, res) => {
  // finds all categories & includes its associated Products
try {
const categoryData = await Category.findAll({include: [{model: Product}]})
res.status(200).json(categoryData);
} catch (err) {
  res.status(500).json(err);
}
});

// GET ONE WORKS ==============================================
router.get('/:id', async (req, res) => {
  // find one category by its `id` value & includes its associated Products
try {
const categoryData = await Category.findByPk(req.params.id, {
  include: [{model:Product}],
});
if (!categoryData) {
  res.status(404).json({ message: "No Categories found with that id! ぞのIDのカテゴリは見つかりませんでした！"})
return;
}
res.status(200).json(categoryData);
} catch (err) {
  res.status(500).json(err);
}
});

// CREATE CATEGORY WORKS ========================================
router.post('/', async (req, res) => {
  // create a new category
   /* req.body should look like this...
    {
      category_name: "Basketball",
    }
  */
  try {
// every category has an id and a category_name
const newCategory = await Category.create(req.body);
res.status(200).json(newCategory);
  } catch (err) {
    res.status(400).json(err);
  }
});


// PUT ROUTE WORKS =================================================
router.put('/:id', async (req, res) => {
  // update a category by its `id` value
try {
  const categoryData = await Category.update(req.body, {
where: { id: req.params.id}
});
if (!categoryData) {
  res.status(404).json({message: "No Category found with that ID! そのIDのカテゴリが見つかりませんでした"})
return;
}
res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE route works ==================================================
router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
const deleteCategoryData = await Category.destroy({
where: {id: req.params.id}
});
if (!deleteCategoryData) {
  res.status(404).json({message: "No Category found with that ID! そのIDのカテゴリが見つかりませんでした"})
return;
}
res.status(200).json(deleteCategoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
