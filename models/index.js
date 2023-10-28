// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');

// Products belongsTo Category
Product.belongsTo(Category,{
  foreignKey: 'category_id'
})
// Categories have many Products
Category.hasMany(Product,{
  foreignKey: 'category_id',
  onDelete: 'cascade'
})
// Products belongToMany Tags (through ProductTag)
// so about the foreign keys below ...the associations have the Junction Table ProductTag,
// so is there a need to add foreign keys if the ProductTag already has the keys? But if I go by this
// logic, then I don't need to do so for the associations above. It looks like since we're using a 
// junction table, we don't need to give it the foreign keys
// ref https://www.youtube.com/watch?v=HJGWu0cZUe8&t=3074s&ab_channel=WittCode
Product.belongsToMany(Tag,{ through: ProductTag, }) // foreignKey: 'product_id'
// Tags belongToMany Products (through ProductTag)
Tag.belongsToMany(Product,{ through: ProductTag, }) // foreignKey: 'tag_id'

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag,
};
