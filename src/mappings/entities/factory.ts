import { Factory } from '../../types/schema'
import { ADDRESS_ZERO, ZERO_BD, ZERO_BI } from '../../utils/constants'

export function getFactory(id: string): Factory {
    let factory = Factory.load(id)
    if (factory === null) {
        factory = new Factory(id)
        factory.poolCount = ZERO_BI
        factory.totalVolumeUSD = ZERO_BD
        factory.totalFeesUSD = ZERO_BD
        factory.totalProtocolFeesUSD = ZERO_BD
        factory.totalLiquidationFeesUSD = ZERO_BD
        factory.totalRollbackFees = ZERO_BD
        factory.totalRollbackFeesUSD = ZERO_BD
        factory.totalUpdateStoplossPriceFees = ZERO_BD
        factory.totalUpdateStoplossPriceFeesUSD = ZERO_BD
        factory.totalUpdateDeadlineFees = ZERO_BD
        factory.totalUpdateDeadlineFeesUSD = ZERO_BD
        factory.tvlUSD = ZERO_BD
        factory.txCount = ZERO_BI
        factory.userCount = ZERO_BI
        factory.manager = ADDRESS_ZERO

        factory.save()
    }
    return factory
}