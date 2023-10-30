const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

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
    } catch (err) {
      res.status(500).json(err);
    }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const newTagData = await Tag.create(req.body);
    res.status(200).json(newTagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value

});

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
