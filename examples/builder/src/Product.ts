import { TableSchema } from "../../../dist"
import { NumberType, PrimaryKeyType, StringType, StringNotNullType } from "../../../dist/PropertyType"
// import { belongsTo, hasMany } from "../../../dist/Relation"
import { Scalar, Scalarable } from "../../../dist/Builder"
// import { Shop } from "./orm"
import Shop from "./Shop"

export default class Product extends TableSchema {
    id = this.field(PrimaryKeyType)
    ddd = this.field(NumberType)
    uuid = this.field(StringNotNullType)
    name = this.field(StringType)
    shopId = this.field(NumberType)
    get shop(){
        return this.belongsTo(Shop, schema => schema.shopId)
    }
    myABC = this.compute(NumberType, (root, arg?: number): Scalarable<any> => {
        return Scalar.value(`5 + ?`, [arg ?? 0])
    })
}