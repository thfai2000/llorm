import {Scalar, isScalar, makeScalar, makeRaw as raw, ExpressionResolver, Expression} from './Builder'
import {Knex} from 'knex'
import { BooleanType } from './PropertyType'
import { thenResult, thenResultArray } from './util'
import { EntityRepository } from '.'


abstract class SQLFunction<Props, SourcePropMap> {
    // abstract toRaw(resolver: ExpressionResolver<Props>): Knex.Raw
    // abstract toScalar(resolver: ExpressionResolver<Props>): Scalar
    abstract toRaw(repository: EntityRepository<any>, resolver: ExpressionResolver<Props, SourcePropMap>): Knex.Raw | Promise<Knex.Raw>
    abstract toScalar(repository: EntityRepository<any>, resolver: ExpressionResolver<Props, SourcePropMap>): Scalar | Promise<Scalar>
}

export abstract class ConditionOperator<Props, SourcePropMap> {
    // abstract toRaw(resolver: ExpressionResolver<Props>): Knex.Raw
    // abstract toScalar(resolver: ExpressionResolver<Props>): Scalar

    abstract toRaw(repository: EntityRepository<any>, resolver: ExpressionResolver<Props, SourcePropMap>): Knex.Raw | Promise<Knex.Raw>
    abstract toScalar(repository: EntityRepository<any>, resolver: ExpressionResolver<Props, SourcePropMap>): Scalar | Promise<Scalar>
}

export abstract class ValueOperator {
    // abstract toRaw(leftOperand: Scalar ): Knex.Raw
    // abstract toScalar(leftOperand: Scalar ): Scalar
    abstract toRaw(repository: EntityRepository<any>, leftOperand: Scalar ): Knex.Raw | Promise<Knex.Raw>
    abstract toScalar(repository: EntityRepository<any>, leftOperand: Scalar ): Scalar | Promise<Scalar>
}

export class AndOperator<Props, PropMap> extends ConditionOperator<Props, PropMap>{
    args: Array<Expression<Props, PropMap> >
    constructor(...args: Array<Expression<Props, PropMap> >){
        super()
        this.args = args
    }
    toRaw(repository: EntityRepository<any>, resolver: ExpressionResolver<Props, PropMap>): Knex.Raw | Promise<Knex.Raw>{
        return thenResultArray(this.args, (args: Array<Expression<Props, PropMap> >) => raw(repository,
            args.map(arg => `${resolver(arg).toString()}`).join(' AND ')
        ))
        // return raw( 
        //     this.args.map(arg => `${resolver(arg).toString()}`).join(' AND ')
        // )
    }
    toScalar(repository: EntityRepository<any>, resolver: ExpressionResolver<Props, PropMap>): Scalar | Promise<Scalar>{
        const p = this.toRaw(repository, resolver)
        return thenResult(p, r => makeScalar(repository, r, new BooleanType()))
        // return makeScalar(p, new BooleanType())
    }
}

export class OrOperator<Props, PropMap> extends ConditionOperator<Props, PropMap>{
    args: Array<Expression<Props, PropMap>>
    constructor(...args: Array<Expression<Props, PropMap>>){
        super()
        this.args = args
    }
    toRaw(repository: EntityRepository<any>,resolver: ExpressionResolver<Props, PropMap>): Knex.Raw | Promise<Knex.Raw>{
        return thenResultArray(this.args, (args: Array<Expression<Props, PropMap> >) => raw(repository,
            `(${args.map(arg => `${resolver(arg).toString()}`).join(' OR ')})`
        ))
        // return raw( 
        //     this.args.map(arg => `${resolver(arg).toString()}`).join(' OR ')
        // )
    }
    
    toScalar(repository: EntityRepository<any>,resolver: ExpressionResolver<Props, PropMap>): Scalar | Promise<Scalar>{
        const p = this.toRaw(repository, resolver)
        return thenResult(p, r => makeScalar(repository, r, new BooleanType()))
        // return makeScalar(p, new BooleanType())
    }
}

export class NotOperator<Props, PropMap> extends ConditionOperator<Props, PropMap>{
    arg: Expression<Props, PropMap>
    constructor(arg: Expression<Props, PropMap> ){
        super()
        this.arg = arg
    }

    toRaw(repository: EntityRepository<any>, resolver: ExpressionResolver<Props, PropMap>): Knex.Raw | Promise<Knex.Raw>{
        return thenResult(this.arg, arg => raw(repository, `NOT (${resolver(arg).toString()})`) )
        // return raw( `NOT (${resolver(this.arg).toString()})`)
    }
    
    toScalar(repository: EntityRepository<any>, resolver: ExpressionResolver<Props, PropMap>): Scalar | Promise<Scalar>{
        const p = this.toRaw(repository, resolver)
        return thenResult(p, r => makeScalar(repository, r, new BooleanType()))
        // return makeScalar(p, new BooleanType())
    }
}

export class ContainOperator extends ValueOperator {
    rightOperands: any[]
    constructor(...rightOperands: any[]){
        super()
        this.rightOperands = rightOperands
    }

    toRaw(repository: EntityRepository<any>, leftOperand: Scalar): Knex.Raw | Promise<Knex.Raw>{
        // return  raw( `${leftOperand} IN (${this.rightOperands.map(o => '?')})`, [...this.rightOperands])
        return thenResultArray(this.rightOperands, rightOperands => raw(repository, `${leftOperand} IN (${rightOperands.map(o => '?')})`, [...rightOperands]) )
    }

    toScalar(repository: EntityRepository<any>, leftOperand: Scalar): Scalar | Promise<Scalar>{
        const p = this.toRaw(repository, leftOperand)
        // return makeScalar(p, new BooleanType())
        return thenResult(p, r => makeScalar(repository, r, new BooleanType()))
    }
}

export class NotContainOperator extends ValueOperator {
    rightOperands: any[]
    constructor(...rightOperands: any[]){
        super()
        this.rightOperands = rightOperands
    }

    toRaw(repository: EntityRepository<any>, leftOperand: Scalar){
        return  raw(repository, `${leftOperand} NOT IN (${this.rightOperands.map(o => '?')})`, [...this.rightOperands])
        // return thenResultArray(this.rightOperands, rightOperands => raw( `${leftOperand} NOT IN (${rightOperands.map(o => '?')})`, [...rightOperands]) )
    }

    toScalar(repository: EntityRepository<any>, leftOperand: Scalar){
        const p = this.toRaw(repository, leftOperand)
        return makeScalar(repository, p, new BooleanType())
    }
}

export class LikeOperator extends ValueOperator {
    rightOperand: any
    constructor(rightOperand: any[]){
        super()
        this.rightOperand = rightOperand
    }

    toRaw(repository: EntityRepository<any>, leftOperand: Scalar){
        return raw(repository, `${leftOperand} LIKE ?`, [this.rightOperand])
        // return thenResult(this.rightOperand, rightOperand => raw( `${leftOperand} LIKE ?`, [rightOperand]) )
    }
    
    toScalar(repository: EntityRepository<any>, leftOperand: Scalar){
        const p = this.toRaw(repository, leftOperand)
        return makeScalar(repository, p, new BooleanType())
    }
}

export class NotLikeOperator extends ValueOperator {
    rightOperand: any
    constructor(rightOperand: any[]){
        super()
        this.rightOperand = rightOperand
    }

    toRaw(repository: EntityRepository<any>, leftOperand: Scalar){
        return raw(repository, `${leftOperand} NOT LIKE ?`, [this.rightOperand])
        // return thenResult(this.rightOperand, rightOperand => raw( `${leftOperand} NOT LIKE ?`, [rightOperand]) )
    }
    
    toScalar(repository: EntityRepository<any>, leftOperand: Scalar){
        const p = this.toRaw(repository, leftOperand)
        return makeScalar(repository, p, new BooleanType())
    }
}

export class EqualOperator extends ValueOperator {
    rightOperand: any
    constructor(rightOperand: any){
        super()
        this.rightOperand = rightOperand
    }

    toRaw(repository: EntityRepository<any>, leftOperand: Scalar){
        // return thenResult(this.rightOperand, (value: any) => {
        //     if(isScalar(value)){
        //         return raw( `${leftOperand} = ??`, [value.toString()])
        //     }
        //     else return raw( `${leftOperand} = ?`, [value])
        // })
        
        if(isScalar(this.rightOperand)){
            return raw(repository, `${leftOperand} = ??`, [this.rightOperand.toString()])
        }
        else return raw(repository, `${leftOperand} = ?`, [this.rightOperand])
    
    }

    toScalar(repository: EntityRepository<any>, leftOperand: Scalar){
        const p = this.toRaw(repository, leftOperand)
        return makeScalar(repository, p, new BooleanType())
    }
}

export class NotEqualOperator extends ValueOperator {
    rightOperand: any
    constructor(rightOperand: any){
        super()
        this.rightOperand = rightOperand
    }

    toRaw(repository: EntityRepository<any>, leftOperand: Scalar): Knex.Raw {
        // return thenResult(this.rightOperand, (value: any) => {
        //     if(isScalar(value)){
        //         return raw( `${leftOperand} <> ??`, [value.toString()])
        //     }
        //     else return raw( `${leftOperand} <> ?`, [value])
        // })
        if(isScalar(this.rightOperand)){
            return raw(repository, `${leftOperand} <> ??`, [this.rightOperand.toString()])
        }
        else return raw(repository, `${leftOperand} <> ?`, [this.rightOperand])
    }

    toScalar(repository: EntityRepository<any>, leftOperand: Scalar){
        const p = this.toRaw(repository, leftOperand)
        return makeScalar(repository, p, new BooleanType())
    }
}

export class IsNullOperator extends ValueOperator {
    constructor(){
        super()
    }

    toRaw(repository: EntityRepository<any>, leftOperand: Scalar): Knex.Raw {
        return raw(repository, `${leftOperand} IS NULL`)
    }

    toScalar(repository: EntityRepository<any>, leftOperand: Scalar){
        const p = this.toRaw(repository, leftOperand)
        return makeScalar(repository, p, new BooleanType())
    }
}

export class IsNotNullOperator extends ValueOperator {
    constructor(){
        super()
    }

    toRaw(repository: EntityRepository<any>, leftOperand: Scalar): Knex.Raw {
        return raw(repository, `${leftOperand} IS NOT NULL`)
    }

    toScalar(repository: EntityRepository<any>, leftOperand: Scalar){
        const p = this.toRaw(repository, leftOperand)
        return makeScalar(repository, p, new BooleanType())
    }
}

//TODO: GreaterThan
//TODO: LessThan
//TODO: GreaterThanOrEqual
//TODO: LessThanOrEqual

// export type ConditionOperatorCall<Props> = (...condition: Array<Expression<Props> > ) => ConditionOperator<Props>


// const Or = (...condition: Array<Expression<any>>) => new OrOperator<any>(...condition)
// const Not = (condition: Expression<any>) => new NotOperator<any>(condition)
// const Equal = (rightOperand: any) => new EqualOperator(rightOperand)
// const NotEqual = (rightOperand: any) => new NotEqualOperator(rightOperand)
// const Contain = (...rightOperands: Array<any>) => new ContainOperator(...rightOperands)
// const NotContain = (...rightOperands: Array<any>) => new NotContainOperator(...rightOperands)
// const Like = (rightOperand: any) => new LikeOperator(rightOperand)
// const NotLike = (rightOperand: any) => new NotLikeOperator(rightOperand)
// const IsNull = () => new IsNullOperator()
// const IsNotNull = () => new IsNotNullOperator()

// export {And, Or, Not, Equal, NotEqual, Contain, NotContain, Like, NotLike, IsNull, IsNotNull, AndOperator, OrOperator, NotOperator}
