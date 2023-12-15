import { Address } from '@graphprotocol/graph-ts'
import { Pair } from '../../types/schema'
import { ADDRESS_ZERO, ZERO_BD, ZERO_BI } from '../../utils/constants'
import { getToken } from './token'

export function getPair(baseToken: string, quoteToken: string): Pair {
    let id = baseToken.concat("-").concat(quoteToken)
    let pair = Pair.load(id)
    if (pair === null) {
        pair = new Pair(id)
        let token0 = getToken(baseToken)
        let token1 = getToken(quoteToken)
        pair.ticker = token0.symbol.concat("/").concat(token1.symbol)
        pair.baseToken = Address.fromString(baseToken)
        pair.quoteToken = Address.fromString(quoteToken)
        pair.pool = Address.fromString(ADDRESS_ZERO)
        pair.isPaused = true
        pair.txCount = ZERO_BI
        pair.baseVolume = ZERO_BD
        pair.baseVolumeUSD = ZERO_BD
        pair.quoteVolume = ZERO_BD
        pair.quoteVolumeUSD = ZERO_BD
        pair.fees = ZERO_BD
        pair.feesUSD = ZERO_BD
        pair.protocolFees = ZERO_BD
        pair.protocolFeesUSD = ZERO_BD
        pair.liquidationFees = ZERO_BD
        pair.liquidationFeesUSD = ZERO_BD

        pair.save()
    }
    return pair
}