import { TradePosition, User } from '../../types/schema'
import { ONE_BI } from '../../utils/constants'

export function createTradePosition(id: string, owner: User): TradePosition {
    let trade = TradePosition.load(id)
    if (trade === null) {
        trade = new TradePosition(id)
        trade.owner = owner.id

        trade.save()
        
        owner.tradePositionCount = owner.tradePositionCount.plus(ONE_BI)
        owner.save()
    }
    return trade
}