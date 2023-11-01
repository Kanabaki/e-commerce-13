const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');
// Productag is being imported bc we need a many to many relationship between
// many products and many tags. ProductTag is a join table holding product and tag id's

// According to EdX, You can use the ProductTag model in the route methods that involve 
// creating, updating, or deleting the association between products and tags. For example,
// you can use it in the POST route to create a new tag and associate it with a product, 
// or in the DELETE route to remove a tag association from a product.





// The `/api/tags` endpoint

// GET tags works ===========================================================
router.get('/', async (req, res) => {
  // find all tags & include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product}]
    });
    res.status(200).json(tagData)
      } catch (err) {
        res.status(500).json(err);
      }
});

// GET ONE tag works =====================================================
router.get('/:id', async (req, res) => {
  // find a single tag by its `id` & include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{model:Product}]
    });
    if (!tagData) {
      res.status(404).json({ message: "No Tags found with that id! ぞのIDのタグは見つかりませんでした!"})
    return;
    }
    res.status(200).json(tagData);
    } catch (err) {
      res.status(500).json(err);
    }
});

// POST route works =================================================================
router.post('/', async (req, res) => {
  // create a new tag
// use it in the POST route to create a new tag and associate it with a product
// I might need to use ProductTag.create? to make a product association?

  //{
//tag_name:""
  //}

  try {
    const newTagData = await Tag.create(req.body);

    res.status(200).json(newTagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT works, tag name changed ===============================================================
// this method is to update a tag name say, the tag 'blue(3)' will be changed to a tag of 'gold(3)'
router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value
  // you use the id in the url thing /:id to put by id it looks like

try {
const tagData = await Tag.update(req.body, {
  where: {id: req.params.id}
})
if (!tagData) {
  res.status(404).json({message: "No Tag found with that ID! そのIDのタグが見つかりませんでした"})
  return;
}
res.status(200).json(tagData);
} catch (err) {
  res.status(500).json(err);
}
});


// DELETE works ========================================================================
router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const deleteData = await Tag.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteData) {
      res.status(404).json({ message: 'No Tag found with that id! そのIDのタグは見つかりませんでした。' });
      return;
    }

    res.status(200).json(deleteData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
