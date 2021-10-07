import { Dataset, makeRaw, Scalar } from "../../../dist/Builder"
import {snakeCase} from 'lodash'
import { ORM } from "../../../dist"
import Shop from './Shop'
import Product from './Product'
import { PropertyTypeDefinition, UnknownPropertyTypeDefinition } from "../../../dist/PropertyType"


(async() => {


    // let a = Object.assign({e:8},{a:5},{b:6},Object.assign({c:7},{h:0}))
    // console.log('aaa', a)

    const orm = new ORM({
        models: {Shop, Product},
        enableUuid: true,
        entityNameToTableName: (className: string) => snakeCase(className),
        propNameTofieldName: (propName: string) => snakeCase(propName),
        knexConfig: {
            client: 'sqlite3',
            connection: {
                filename: ':memory:'
            }
        }
    })

    let repository = orm.getRepository()
    // repository.outputSchema('/schema')
    await repository.createModels()
    
    let s = repository.models.Shop.datasource('shop')
    
    let p = repository.models.Product.datasource('product')
    
    let myShopDS = new Dataset().from(s).selectProps("shop.id", "shop.name")
    
    const builder = await myShopDS.toNativeBuilder(repository)
    console.log('test1', builder.toString() )


    let shop1 = await repository.models.Shop.createOne({
        name: '333',
        hour: 5
    })

    console.log('finished-1', shop1)
    
    for (let i = 0; i < 5; i++) {      
        await repository.models.Product.createOne({
            ddd: 5,
            name: 'hello',
            shopId: shop1.id
        })
    }

    console.log('finished')

    let myShop = myShopDS.datasource("myShop")


    let dd = new Dataset()
            .from(s)
            .innerJoin(p, ({product, shop}) => product.shopId.equals(shop.id))
            // .innerJoin(p, ({And}) => And({"product.id": 5}) )
            // .innerJoin(p, ({product}) => product.id.equals(6) )
            // .innerJoin(
            //     myShop,
            //     ({myShop, product, shop, And}) => And( myShop.id.equals(product.id), product.myABC(5) )
            // )
            // .filter(
            //     ({And, product, shop}) => And({
            //         "shop.id": 5,
            //         "shop.name": "ssss"
            //     }, product.name.equals(shop.name) )
            // )
            .selectProps(
                // "product.id",
                // "shop.id",
                "shop.name"
            )
            .where(
                ({shop, product, And}) => And(
                    shop.id.equals(1),
                    product.name.equals('hello')
                )
            )
            .select(
                ({shop, product}) => ({
                    // shop.id.value(),
                    ...shop.hour.value(),
                    ...product.shopId.equals(10).asColumn('nini').value(),
                    // xxx: xxx!,
                    ...product.ddd.value()
                })
            ).offset(0).limit(4000)
    
    let result = await orm.getRepository().execute(dd, {
        onSqlRun: console.log
    })
    console.log('xxx', result)


    let allShops = await repository.models.Shop.find({
        where: ({root}) => root.name.equals('helloShopx')
    })
    console.log('aaa', allShops)
    console.time('simple')
    let allShopsX = await repository.models.Shop.find({
        select: {
            products: (P) => ({
                select: {
                    myABC: 5,
                    shop: {
                        // props: {
                        //     products: {}
                        // },
                        // filter: ({root}) => root.name.equals(P.name)
                    }
                }
            })
        },
        where: ({root, Exists}) => Exists(
            new Dataset().from(
                repository.models.Product.datasource('product')
            ).where( ({product}) => root.id.equals(product.shopId) )
        ),
        offset: 0,
        limit: 5000
    })
    console.log('aaaa', allShopsX[0].products.length)
    console.timeEnd('simple')


    let d = new Dataset()
        

    await orm.getRepository()
        .dataset()
        .from(repository.models.Shop.datasource("myShop"))
        .where(({myShop}) => myShop.id.equals(1))
        .update({
            name: new Scalar(new UnknownPropertyTypeDefinition(), makeRaw(repository, '?', 'hello') )
        }).execute({
            onSqlRun: console.log
        })



})()


// let c = {
//         ...{a: 5},
//         ...{b: 5},
//         ...{c: 5},
//         ...{d: 6},
//         ...{e: 8},
//         ...{f: 5}
//     }
// console.log(c)