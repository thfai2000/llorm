import {configure, Entity, Relations, Schema, Types, models, select, raw} from '../../../dist/'
import {snakeCase} from 'lodash'

let shopData = [
  { id: 1, name: 'Shop 1', location: 'Shatin'},
  { id: 2, name: 'Shop 2', location: 'Yuen Long'},
  { id: 3, name: 'Shop 3', location: 'Tsuen Wan'},
  { id: 4, name: 'Shop 4', location: 'Tsuen Wan'},
  { id: 5, name: 'Shop 5', location: 'Tsuen Wan'}
]

let productData = [
  { name: 'Product 1a', shopId: 1},
  { name: 'Product 1b', shopId: 1},
  { name: 'Product 2a', shopId: 2},
  { name: 'Product 2b', shopId: 2}
]


// let colorData = [
//   {code: 'red'},
//   {code: 'orange'},
//   {code: 'yellow'},
//   {code: 'green'},
//   {code: 'blue'},
//   {code: 'black'},
//   {code: 'white'}
// ]



;(async() =>{

    class Shop extends Entity{

      static register(schema: Schema){
        schema.prop('name', Types.String(100))
        schema.prop('location', Types.String(255))
        schema.computedProp('products', Types.Array(Product), Relations.has(Product, 'shopId') )
        schema.computedProp('productCount', Types.Number(), async (shop, applyFilters) => {
            let p = Product.selector()
            return applyFilters( select(raw('COUNT(*)') ).from(p.source).where( raw('?? = ??', [shop.id, p._.shopId])), p) 
        })
      }
    }
    
    class Product extends Entity{
    
      static register(schema: Schema){
        schema.prop('name', Types.String(255, true))
        schema.prop('createdAt', Types.Date())
        schema.prop('shopId', Types.Number() )
        // computeProp - not a actual field. it can be relations' data or formatted value of another field. It even can accept arguments...
        schema.computedProp('shop', Types.Object(Shop), Relations.belongsTo(Shop, 'shopId') )

        schema.computedProp('colors', 
          Types.Array(Color), 
          Relations.relateThrough(Color, ProductColor, 'productId', 'colorId') 
        )
        
        schema.computedProp('mainColor', 
          Types.Object(Color), 
          Relations.relateThrough(Color, ProductColor, 'productId', 'colorId', (stmt, relatedSelector, throughSelector) => {
            return stmt.andWhereRaw('?? = ?', [throughSelector._.type, 'main'])
          })
        )
      }
    }
    
    class Color extends Entity{
      static register(schema: Schema){
        schema.prop('code', Types.String(50))
      }
    }

    class ProductColor extends Entity{
      static register(schema: Schema){
        schema.prop('productId', Types.Number(false))
        schema.prop('colorId', Types.Number(false))
        schema.prop('type', Types.String(50, false))
      }
    }

    await configure({
        models: {Shop, Product, Color},
        createModels: true,
        entityNameToTableName: (className: string) => snakeCase(className),
        propNameTofieldName: (propName: string) => snakeCase(propName),
        knexConfig: {
            client: 'sqlite',
            connection: {
                filename: ':memory:'
            }
        }
    })



    await Promise.all(shopData.map( async(d) => {
      return await models.Shop.createOne(d)
    }))
    

    await Promise.all(productData.map( async(d) => {
      return await models.Product.createOne(d)
    }))

    let records = await models.Shop.find( async (stmt, root) => {
        return stmt.select('*', await root.$.productCount())
    })

    console.log('results', records)

})()