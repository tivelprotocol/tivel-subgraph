import { log } from '@graphprotocol/graph-ts'
import { Factory, User } from '../../types/schema'
import { ONE_BI, ZERO_BD, ZERO_BI } from '../../utils/constants'

export function getUser(id: string, factory: Factory): User {
    let user = User.load(id)
    if (user === null) {
        user = new User(id)
        user.totalVolumeUSD = ZERO_BD
        user.totalFeesUSD = ZERO_BD
        user.totalProtocolFeesUSD = ZERO_BD
        user.totalLiquidationFeesUSD = ZERO_BD
        user.totalRollbackFees = ZERO_BD
        user.totalRollbackFeesUSD = ZERO_BD
        user.totalUpdateTPnSLPriceFees = ZERO_BD
        user.totalUpdateTPnSLPriceFeesUSD = ZERO_BD
        user.totalUpdateCollateralAmountFees = ZERO_BD
        user.totalUpdateCollateralAmountFeesUSD = ZERO_BD
        user.totalUpdateDeadlineFees = ZERO_BD
        user.totalUpdateDeadlineFeesUSD = ZERO_BD
        user.txCount = ZERO_BI
        user.tradePositionCount = ZERO_BI

        user.save()
        
        factory.userCount = factory.userCount.plus(ONE_BI)
        factory.save()
    }
    return user
}