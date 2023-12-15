/* eslint-disable prefer-const */
import { FACTORY_ADDRESS, ONE_BI } from '../utils/constants'
import { CreatePool, SetBaseTokenLT, SetCollateralLT } from '../types/Factory/Factory'
import { Pool as PoolTemplate } from '../types/templates'
import { getFactory } from './entities/factory'
import { getToken } from './entities/token'
import { getPool } from './entities/pool'

export function handleCreatePool(event: CreatePool): void {
  let factory = getFactory(FACTORY_ADDRESS)

  factory.poolCount = factory.poolCount.plus(ONE_BI)

  let pool = getPool(event.params.pool.toHexString())
  let quoteToken = getToken(event.params.quoteToken.toHexString())

  pool.quoteToken = quoteToken.id
  pool.interest = event.params.interest
  pool.createdAtTimestamp = event.block.timestamp
  pool.createdAtBlockNumber = event.block.number

  pool.save()
  // create the tracked contract based on the template
  PoolTemplate.create(event.params.pool)
  quoteToken.save()
  factory.save()
}

export function handleSetBaseTokenLT(event: SetBaseTokenLT): void {
  let token = getToken(event.params.baseToken.toHexString())

  token.baseTokenLT = event.params.lt

  token.save()
}

export function handleSetCollateralLT(event: SetCollateralLT): void {
  let token = getToken(event.params.collateral.toHexString())

  token.collateralLT = event.params.lt

  token.save()
}