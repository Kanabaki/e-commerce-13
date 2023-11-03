const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// GET all products works ==================================
router.get('/', async (req, res) => {
  // find all products & include its associated Category and Tag data
  try {
const productData = await Product.findAll({
  include: [{ model: Category}, {model: Tag}]
});
res.status(200).json(productData)
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET one product works =================================
router.get('/:id', async (req, res) => {
  // find a single product by its `id` and include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });

    if (!productData) {
      res.status(404).json({ message: 'No Product found with that id! そのIDの製品は見つかりませんでした。' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product works ===============================================
router.post('/', (req, res) => {
  /* req.body should look like this...
  this is a product create
{
	"product_name": "Nobue Ito Figure",
	"price": 175.99,
	"stock": 3,
	"category_id": 7 idk about this one if it's needed
  tagIds: []
}
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
  Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// update product works =======================================================
// what is even happenning here????? We're importing ProductTag...for what?

router.put('/:id', (req, res) => {
  // update product data, I guess this .update targets a product by id
  // 1st update param is the new data to update with
  // 2nd param is is an argument object that holds options. Here we specify WHERE
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  }) // if the update is successful it turns into a promise here and then you can .then
    .then((product) => {
      if (req.body.tagIds && req.body.tagIds.length) {
// find all Product & Tag associations. If you update products then you also need to update
// the tags is what I'm guessing 
        ProductTag.findAll({
          where: { product_id: req.params.id }
        }).then((productTags) => {
          // create filtered list of new tag_ids
          const productTagIds = productTags.map(({ tag_id }) => tag_id);
          const newProductTags = req.body.tagIds
            .filter((tag_id) => !productTagIds.includes(tag_id))
            .map((tag_id) => {
              return {
                product_id: req.params.id,
                tag_id,
              };
            });

          // figure out which ones to remove
          const productTagsToRemove = productTags
            .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
            .map(({ id }) => id);
          // run both actions
          return Promise.all([
            ProductTag.destroy({ where: { id: productTagsToRemove } }),
            ProductTag.bulkCreate(newProductTags),
          ]);
        });
      }

      return res.json(product);
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

// delete one product works ===================================================
router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const deleteData = await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteData) {
      res.status(404).json({ message: 'No Product found with that id! そのIDの製品は見つかりませんでした。' });
      return;
    }

    res.status(200).json(deleteData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
