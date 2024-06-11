import { Pool } from '../../types/schema'
import { ADDRESS_ZERO, ZERO_BD, ZERO_BI } from '../../utils/constants'

export function getPool(id: string): Pool {
    let pool = Pool.load(id)
    if (pool === null) {
        pool = new Pool(id)
        pool.quoteToken = ADDRESS_ZERO
        pool.interest = ZERO_BI
        pool.createdAtTimestamp = ZERO_BI
        pool.createdAtBlockNumber = ZERO_BI
        pool.liquidityProviderCount = ZERO_BI
        pool.txCount = ZERO_BI
        pool.liquidity = ZERO_BD
        pool.liquidityUSD = ZERO_BD
        pool.volume = ZERO_BD
        pool.volumeUSD = ZERO_BD
        pool.fees = ZERO_BD
        pool.feesUSD = ZERO_BD
        pool.protocolFees = ZERO_BD
        pool.protocolFeesUSD = ZERO_BD
        pool.liquidationFees = ZERO_BD
        pool.liquidationFeesUSD = ZERO_BD
        pool.collectedFees = ZERO_BD
        pool.collectedFeesUSD = ZERO_BD

        pool.save()
    }
    return pool
}