import { User } from '../../types/schema'
import { FACTORY_ADDRESS, ONE_BI, ZERO_BD, ZERO_BI } from '../../utils/constants'
import { getFactory } from './factory'

export function getUser(id: string): User {
    let user = User.load(id)
    if (user === null) {
        user = new User(id)
        user.totalVolumeUSD = ZERO_BD
        user.totalFeesUSD = ZERO_BD
        user.totalProtocolFeesUSD = ZERO_BD
        user.totalLiquidationFeesUSD = ZERO_BD
        user.totalRollbackFees = ZERO_BD
        user.totalRollbackFeesUSD = ZERO_BD
        user.totalUpdateStoplossPriceFees = ZERO_BD
        user.totalUpdateStoplossPriceFeesUSD = ZERO_BD
        user.totalUpdateDeadlineFees = ZERO_BD
        user.totalUpdateDeadlineFeesUSD = ZERO_BD
        user.txCount = ZERO_BI

        let factory = getFactory(FACTORY_ADDRESS)
        factory.userCount = factory.userCount.plus(ONE_BI)

        user.save()
        factory.save()
    }
    return user
}