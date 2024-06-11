/* eslint-disable prefer-const */
import {
    UpdateTPnSLPrice as UpdateTPnSLPriceEvent
} from '../types/PositionStorage/PositionStorage'
import { UpdateTPnSLPrice } from '../types/schema'
import { ADDRESS_ZERO, FACTORY_ADDRESS, ONE_BI, ZERO_BD } from '../utils/constants'
import { BigInt } from '@graphprotocol/graph-ts'
import { convertTokenToDecimal, loadTransaction, priceToDecimal } from '../utils'
import { getToken } from './entities/token'
import { getUser } from './entities/user'
import { updateTivelDayData, updateTokenDayData, updateTokenHourData, updateUserDayData, updateUserHourData } from '../utils/intervalUpdates'
import { getFactory } from './entities/factory'

export function handleUpdateTPnSLPrice(event: UpdateTPnSLPriceEvent): void {
    let factory = getFactory(FACTORY_ADDRESS)
    let user = getUser(event.params.updater.toHexString(), factory)

    // update globals
    factory.txCount = factory.txCount.plus(ONE_BI)

    user.txCount = user.txCount.plus(ONE_BI)

    // burn entity
    let transaction = loadTransaction(event)
    let update = new UpdateTPnSLPrice(transaction.id + '#' + factory.txCount.toString())
    update.transaction = transaction.id
    update.timestamp = transaction.timestamp
    update.positionKey = event.params.positionKey
    update.stoplossPrice = priceToDecimal(event.params.newStoplossPrice.toBigDecimal(), BigInt.fromI32(30))
    update.takeProfitPrice = priceToDecimal(event.params.newTakeProfitPrice.toBigDecimal(), BigInt.fromI32(30))
    update.updater = event.params.updater
    update.serviceToken = event.params.serviceToken.toHexString()
    update.logIndex = event.logIndex

    // handle service fees
    let serviceFees = ZERO_BD
    let serviceFeesUSD = ZERO_BD
    if (event.params.serviceToken.toHexString() !== ADDRESS_ZERO) {
        let serviceToken = getToken(event.params.serviceToken.toHexString())
        serviceFees = convertTokenToDecimal(event.params.serviceFee, serviceToken.decimals)
        serviceFeesUSD = serviceFees.times(serviceToken.priceUSD)

        factory.totalUpdateTPnSLPriceFees = factory.totalUpdateTPnSLPriceFees.plus(serviceFees)
        factory.totalUpdateTPnSLPriceFeesUSD = factory.totalUpdateTPnSLPriceFeesUSD.plus(serviceFeesUSD)
        user.totalUpdateTPnSLPriceFees = user.totalUpdateTPnSLPriceFees.plus(serviceFees)
        user.totalUpdateTPnSLPriceFeesUSD = user.totalUpdateTPnSLPriceFeesUSD.plus(serviceFeesUSD)
        update.serviceFees = serviceFees
        update.serviceFeesUSD = serviceFeesUSD

        updateTokenDayData(serviceToken, event)
        updateTokenHourData(serviceToken, event)

        serviceToken.save()
    }

    update.save()
    factory.save()
    user.save()

    let tivelDayData = updateTivelDayData(event)
    let userDayData = updateUserDayData(user, event)
    let userHourData = updateUserHourData(user, event)

    tivelDayData.updateTPnSLPriceFees = tivelDayData.updateTPnSLPriceFees.plus(serviceFees)
    tivelDayData.updateTPnSLPriceFeesUSD = tivelDayData.updateTPnSLPriceFeesUSD.plus(serviceFeesUSD)

    userDayData.updateTPnSLPriceFees = userDayData.updateTPnSLPriceFees.plus(serviceFees)
    userDayData.updateTPnSLPriceFeesUSD = userDayData.updateTPnSLPriceFeesUSD.plus(serviceFeesUSD)
    userHourData.updateTPnSLPriceFees = userHourData.updateTPnSLPriceFees.plus(serviceFees)
    userHourData.updateTPnSLPriceFeesUSD = userHourData.updateTPnSLPriceFeesUSD.plus(serviceFeesUSD)

    tivelDayData.save()
    userDayData.save()
    userHourData.save()
}