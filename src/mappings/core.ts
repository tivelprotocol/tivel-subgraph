/* eslint-disable prefer-const */
import { Burn, Mint, Open, Close, Rollback, UpdateCollateralAmount, UpdateDeadline } from '../types/schema'
import { BigInt } from '@graphprotocol/graph-ts'
import {
    Burn as BurnEvent,
    Mint as MintEvent,
    Open as OpenEvent,
    Close as CloseEvent,
    Rollback as RollbackEvent,
    UpdateCollateralAmount as UpdateCollateralAmountEvent,
    UpdateDeadline as UpdateDeadlineEvent,
    SetBaseToken
} from '../types/templates/Pool/Pool'
import { convertTokenToDecimal, loadTransaction, priceToDecimal } from '../utils'
import { ADDRESS_ZERO, FACTORY_ADDRESS, ONE_BI, ZERO_BD } from '../utils/constants'
import {
    updatePoolDayData,
    updatePoolHourData,
    updateTokenDayData,
    updateTokenHourData,
    updateTivelDayData,
    updatePairDayData,
    updatePairHourData,
    updateUserDayData,
    updateUserHourData
} from '../utils/intervalUpdates'
import { getPool } from './entities/pool'
import { getFactory } from './entities/factory'
import { getToken } from './entities/token'
import { getPair } from './entities/pair'
import { getUser } from './entities/user'
import { createTradePosition } from './entities/tradePosition'

export function handleSetBaseToken(event: SetBaseToken): void {
    let pair = getPair(event.params.baseToken.toHexString(), event.params.quoteToken.toHexString())

    pair.pool = event.address
    pair.isPaused = !event.params.tradeable

    pair.save()
}

export function handleMint(event: MintEvent): void {
    let poolAddress = event.address.toHexString()
    let pool = getPool(poolAddress)
    let factory = getFactory(FACTORY_ADDRESS)
    let user = getUser(event.params.to.toHexString(), factory)

    let quoteToken = getToken(pool.quoteToken)
    let liquidity = convertTokenToDecimal(event.params.liquidity, quoteToken.decimals)

    let liquidityUSD = liquidity.times(quoteToken.priceUSD)

    // reset tvl aggregates until new amounts calculated
    factory.tvlUSD = factory.tvlUSD.minus(pool.liquidityUSD)

    // update globals
    factory.txCount = factory.txCount.plus(ONE_BI)
    user.txCount = user.txCount.plus(ONE_BI)

    // pool data
    pool.txCount = pool.txCount.plus(ONE_BI)

    pool.liquidity = pool.liquidity.plus(liquidity)
    pool.liquidityUSD = pool.liquidity.times(quoteToken.priceUSD)

    // reset aggregates with new amounts
    factory.tvlUSD = factory.tvlUSD.plus(pool.liquidityUSD)

    let transaction = loadTransaction(event)
    let mint = new Mint(transaction.id.toString() + '#' + pool.txCount.toString())
    mint.transaction = transaction.id
    mint.timestamp = transaction.timestamp
    mint.pool = pool.id
    mint.token = pool.quoteToken
    mint.owner = event.params.to
    mint.sender = event.params.sender
    mint.origin = event.transaction.from
    mint.amount = liquidity
    mint.amountUSD = liquidityUSD
    mint.logIndex = event.logIndex

    quoteToken.save()
    pool.save()
    factory.save()
    user.save()
    mint.save()

    // TODO: Update liquidity provider count

    updateTivelDayData(event)
    updateUserDayData(user, event)
    updateUserHourData(user, event)
    updatePoolDayData(pool, event)
    updatePoolHourData(pool, event)
    updateTokenDayData(quoteToken, event)
    updateTokenHourData(quoteToken, event)
}

export function handleBurn(event: BurnEvent): void {
    let poolAddress = event.address.toHexString()
    let pool = getPool(poolAddress)
    let factory = getFactory(FACTORY_ADDRESS)

    let quoteToken = getToken(pool.quoteToken)
    let liquidity = convertTokenToDecimal(event.params.liquidity, quoteToken.decimals)

    let liquidityUSD = liquidity.times(quoteToken.priceUSD)

    // reset tvl aggregates until new amounts calculated
    // updated liquidity when creating burn request
    // factory.tvlUSD = factory.tvlUSD.minus(pool.liquidityUSD)

    // update globals
    factory.txCount = factory.txCount.plus(ONE_BI)

    // pool data
    pool.txCount = pool.txCount.plus(ONE_BI)
    // updated liquidity when creating burn request
    // pool.liquidity = pool.liquidity.minus(liquidity)
    // pool.liquidityUSD = pool.liquidity.times(quoteToken.priceUSD)

    // reset aggregates with new amounts
    // updated liquidity when creating burn request
    // factory.tvlUSD = factory.tvlUSD.plus(pool.liquidityUSD)

    // burn entity
    let transaction = loadTransaction(event)
    let burn = new Burn(transaction.id + '#' + pool.txCount.toString())
    burn.transaction = transaction.id
    burn.timestamp = transaction.timestamp
    burn.pool = pool.id
    burn.token = pool.quoteToken
    burn.origin = event.transaction.from
    burn.amount = liquidity
    burn.amountUSD = liquidityUSD
    burn.logIndex = event.logIndex

    quoteToken.save()
    pool.save()
    factory.save()
    burn.save()

    updateTivelDayData(event)
    updatePoolDayData(pool, event)
    updatePoolHourData(pool, event)
    updateTokenDayData(quoteToken, event)
    updateTokenHourData(quoteToken, event)
}

export function handleOpen(event: OpenEvent): void {
    let factory = getFactory(FACTORY_ADDRESS)
    let user = getUser(event.params.owner.toHexString(), factory)
    let pool = getPool(event.address.toHexString())

    let baseToken = getToken(event.params.baseToken.toHexString())
    let quoteToken = getToken(event.params.quoteToken.toHexString())
    let collateral = getToken(event.params.collateral.toHexString())
    createTradePosition(event.params.positionKey.toHexString(), user)

    let baseVolume = convertTokenToDecimal(event.params.baseAmount, baseToken.decimals)
    let quoteVolume = convertTokenToDecimal(event.params.quoteAmount, quoteToken.decimals)
    let collateralVolume = convertTokenToDecimal(event.params.collateralAmount, collateral.decimals)
    let fees = convertTokenToDecimal(event.params.fee, quoteToken.decimals)
    let protocolFees = convertTokenToDecimal(event.params.protocolFee, quoteToken.decimals)

    let baseVolumeUSD = baseVolume.times(baseToken.priceUSD)
    let quoteVolumeUSD = quoteVolume.times(quoteToken.priceUSD)
    let collateralVolumeUSD = collateralVolume.times(collateral.priceUSD)
    let feesUSD = fees.times(quoteToken.priceUSD)
    let protocolFeesUSD = protocolFees.times(quoteToken.priceUSD)

    // global updates
    factory.totalVolumeUSD = factory.totalVolumeUSD.plus(quoteVolumeUSD)
    factory.totalFeesUSD = factory.totalFeesUSD.plus(feesUSD)
    factory.totalProtocolFeesUSD = factory.totalProtocolFeesUSD.plus(protocolFeesUSD)
    factory.txCount = factory.txCount.plus(ONE_BI)

    user.totalVolumeUSD = user.totalVolumeUSD.plus(quoteVolumeUSD)
    user.totalFeesUSD = user.totalFeesUSD.plus(feesUSD)
    user.totalProtocolFeesUSD = user.totalProtocolFeesUSD.plus(protocolFeesUSD)
    user.txCount = user.txCount.plus(ONE_BI)

    // pool volume
    pool.volume = pool.volume.plus(quoteVolume)
    pool.volumeUSD = pool.volumeUSD.plus(quoteVolumeUSD)
    pool.fees = pool.fees.plus(fees)
    pool.feesUSD = pool.feesUSD.plus(feesUSD)
    pool.protocolFees = pool.protocolFees.plus(protocolFees)
    pool.protocolFeesUSD = pool.protocolFeesUSD.plus(protocolFeesUSD)
    pool.txCount = pool.txCount.plus(ONE_BI)

    baseToken.baseVolume = baseToken.baseVolume.plus(baseVolume)
    baseToken.baseVolumeUSD = baseToken.baseVolumeUSD.plus(baseVolumeUSD)

    quoteToken.quoteVolume = quoteToken.quoteVolume.plus(quoteVolume)
    quoteToken.quoteVolumeUSD = quoteToken.quoteVolumeUSD.plus(quoteVolumeUSD)

    collateral.collateralVolume = collateral.collateralVolume.plus(collateralVolume)
    collateral.collateralVolumeUSD = collateral.collateralVolumeUSD.plus(collateralVolumeUSD)

    // create Open event
    let transaction = loadTransaction(event)
    let open = new Open(transaction.id + '#' + pool.txCount.toString())
    open.transaction = transaction.id
    open.timestamp = transaction.timestamp
    open.pool = pool.id
    open.owner = event.params.owner
    open.positionKey = event.params.positionKey
    open.sender = event.params.sender
    open.baseVolume = baseVolume
    open.baseVolumeUSD = baseVolumeUSD
    open.quoteVolume = quoteVolume
    open.quoteVolumeUSD = quoteVolumeUSD
    open.collateralVolume = collateralVolume
    open.collateralVolumeUSD = collateralVolumeUSD
    open.fees = fees
    open.feesUSD = feesUSD
    open.protocolFees = protocolFees
    open.protocolFeesUSD = protocolFeesUSD
    open.logIndex = event.logIndex

    let pair = getPair(baseToken.id, quoteToken.id)
    pair.baseVolume = pair.baseVolume.plus(baseVolume)
    pair.baseVolumeUSD = pair.baseVolumeUSD.plus(baseVolumeUSD)
    pair.quoteVolume = pair.quoteVolume.plus(quoteVolume)
    pair.quoteVolumeUSD = pair.quoteVolumeUSD.plus(quoteVolumeUSD)
    pair.fees = pair.fees.plus(fees)
    pair.feesUSD = pair.feesUSD.plus(feesUSD)
    pair.protocolFees = pair.protocolFees.plus(protocolFees)
    pair.protocolFeesUSD = pair.protocolFeesUSD.plus(protocolFeesUSD)

    open.save()
    factory.save()
    user.save()
    pool.save()
    pair.save()
    baseToken.save()
    quoteToken.save()
    collateral.save()

    // interval data
    let tivelDayData = updateTivelDayData(event)
    let userDayData = updateUserDayData(user, event)
    let userHourData = updateUserHourData(user, event)
    let poolDayData = updatePoolDayData(pool, event)
    let poolHourData = updatePoolHourData(pool, event)
    let pairDayData = updatePairDayData(pair, event)
    let pairHourData = updatePairHourData(pair, event)
    let baseTokenDayData = updateTokenDayData(baseToken, event)
    let quoteTokenDayData = updateTokenDayData(quoteToken, event)
    let collateralDayData = updateTokenDayData(collateral, event)
    let baseTokenHourData = updateTokenHourData(baseToken, event)
    let quoteTokenHourData = updateTokenHourData(quoteToken, event)
    let collateralHourData = updateTokenHourData(collateral, event)

    // update volume metrics
    tivelDayData.volumeUSD = tivelDayData.volumeUSD.plus(quoteVolumeUSD)
    tivelDayData.feesUSD = tivelDayData.feesUSD.plus(feesUSD)
    tivelDayData.protocolFeesUSD = tivelDayData.protocolFeesUSD.plus(protocolFeesUSD)

    userDayData.volumeUSD = userDayData.volumeUSD.plus(quoteVolumeUSD)
    userDayData.feesUSD = userDayData.feesUSD.plus(feesUSD)
    userDayData.protocolFeesUSD = userDayData.protocolFeesUSD.plus(protocolFeesUSD)

    userHourData.volumeUSD = userHourData.volumeUSD.plus(quoteVolumeUSD)
    userHourData.feesUSD = userHourData.feesUSD.plus(feesUSD)
    userHourData.protocolFeesUSD = userHourData.protocolFeesUSD.plus(protocolFeesUSD)

    poolDayData.volume = poolDayData.volume.plus(quoteVolume)
    poolDayData.volumeUSD = poolDayData.volumeUSD.plus(quoteVolumeUSD)
    poolDayData.fees = poolDayData.fees.plus(fees)
    poolDayData.feesUSD = poolDayData.feesUSD.plus(feesUSD)
    poolDayData.protocolFees = poolDayData.protocolFees.plus(protocolFees)
    poolDayData.protocolFeesUSD = poolDayData.protocolFeesUSD.plus(protocolFeesUSD)

    poolHourData.volume = poolHourData.volume.plus(quoteVolume)
    poolHourData.volumeUSD = poolHourData.volumeUSD.plus(quoteVolumeUSD)
    poolHourData.fees = poolHourData.fees.plus(fees)
    poolHourData.feesUSD = poolHourData.feesUSD.plus(feesUSD)
    poolHourData.protocolFees = poolHourData.protocolFees.plus(protocolFees)
    poolHourData.protocolFeesUSD = poolHourData.protocolFeesUSD.plus(protocolFeesUSD)

    pairDayData.baseVolume = pairDayData.baseVolume.plus(baseVolume)
    pairDayData.baseVolumeUSD = pairDayData.baseVolumeUSD.plus(baseVolumeUSD)
    pairDayData.quoteVolume = pairDayData.quoteVolume.plus(quoteVolume)
    pairDayData.quoteVolumeUSD = pairDayData.quoteVolumeUSD.plus(quoteVolumeUSD)
    pairDayData.fees = pairDayData.fees.plus(fees)
    pairDayData.feesUSD = pairDayData.feesUSD.plus(feesUSD)
    pairDayData.protocolFees = pairDayData.protocolFees.plus(protocolFees)
    pairDayData.protocolFeesUSD = pairDayData.protocolFeesUSD.plus(protocolFeesUSD)

    pairHourData.baseVolume = pairHourData.baseVolume.plus(baseVolume)
    pairHourData.baseVolumeUSD = pairHourData.baseVolumeUSD.plus(baseVolumeUSD)
    pairHourData.quoteVolume = pairHourData.quoteVolume.plus(quoteVolume)
    pairHourData.quoteVolumeUSD = pairHourData.quoteVolumeUSD.plus(quoteVolumeUSD)
    pairHourData.fees = pairHourData.fees.plus(fees)
    pairHourData.feesUSD = pairHourData.feesUSD.plus(feesUSD)
    pairHourData.protocolFees = pairHourData.protocolFees.plus(protocolFees)
    pairHourData.protocolFeesUSD = pairHourData.protocolFeesUSD.plus(protocolFeesUSD)

    baseTokenDayData.baseVolume = baseTokenDayData.baseVolume.plus(baseVolume)
    baseTokenDayData.baseVolumeUSD = baseTokenDayData.baseVolumeUSD.plus(baseVolumeUSD)

    quoteTokenDayData.quoteVolume = quoteTokenDayData.quoteVolume.plus(quoteVolume)
    quoteTokenDayData.quoteVolumeUSD = quoteTokenDayData.quoteVolumeUSD.plus(quoteVolumeUSD)

    collateralDayData.collateralVolume = collateralDayData.collateralVolume.plus(collateralVolume)
    collateralDayData.collateralVolumeUSD = collateralDayData.collateralVolumeUSD.plus(collateralVolumeUSD)

    baseTokenHourData.baseVolume = baseTokenHourData.baseVolume.plus(baseVolume)
    baseTokenHourData.baseVolumeUSD = baseTokenHourData.baseVolumeUSD.plus(baseVolumeUSD)

    quoteTokenHourData.quoteVolume = quoteTokenHourData.quoteVolume.plus(quoteVolume)
    quoteTokenHourData.quoteVolumeUSD = quoteTokenHourData.quoteVolumeUSD.plus(quoteVolumeUSD)

    collateralHourData.collateralVolume = collateralHourData.collateralVolume.plus(collateralVolume)
    collateralHourData.collateralVolumeUSD = collateralHourData.collateralVolumeUSD.plus(collateralVolumeUSD)

    baseTokenDayData.save()
    quoteTokenDayData.save()
    collateralDayData.save()
    tivelDayData.save()
    userDayData.save()
    poolDayData.save()
    pairDayData.save()
    baseTokenHourData.save()
    quoteTokenHourData.save()
    collateralHourData.save()
    userHourData.save()
    poolHourData.save()
    pairHourData.save()
}

export function handleClose(event: CloseEvent): void {
    let poolAddress = event.address.toHexString()
    let pool = getPool(poolAddress)
    let factory = getFactory(FACTORY_ADDRESS)
    let closer = getUser(event.params.closer.toHexString(), factory)
    let owner = getUser(event.params.owner.toHexString(), factory)

    let baseToken = getToken(event.params.baseToken.toHexString())
    let quoteToken = getToken(pool.quoteToken)
    let liquidationFees = convertTokenToDecimal(event.params.liquidationFee, quoteToken.decimals)
    let liquidationFeesUSD = liquidationFees.times(quoteToken.priceUSD)

    // update globals
    factory.totalLiquidationFeesUSD = factory.totalLiquidationFeesUSD.plus(liquidationFeesUSD)
    factory.txCount = factory.txCount.plus(ONE_BI)

    owner.totalLiquidationFeesUSD = owner.totalLiquidationFeesUSD.plus(liquidationFeesUSD)
    closer.txCount = closer.txCount.plus(ONE_BI)

    // pool data
    pool.liquidationFees = pool.liquidationFees.plus(liquidationFees)
    pool.liquidationFeesUSD = pool.liquidationFeesUSD.plus(liquidationFeesUSD)
    pool.txCount = pool.txCount.plus(ONE_BI)

    // burn entity
    let transaction = loadTransaction(event)
    let close = new Close(transaction.id + '#' + pool.txCount.toString())
    close.transaction = transaction.id
    close.timestamp = transaction.timestamp
    close.pool = pool.id
    close.sender = event.params.sender
    close.owner = event.params.owner
    close.positionKey = event.params.positionKey
    close.closer = event.params.closer
    close.logIndex = event.logIndex

    let pair = getPair(baseToken.id, quoteToken.id)
    pair.liquidationFees = pair.liquidationFees.plus(liquidationFees)
    pair.liquidationFeesUSD = pair.liquidationFeesUSD.plus(liquidationFeesUSD)

    close.save()
    factory.save()
    closer.save()
    owner.save()
    pool.save()
    pair.save()
    quoteToken.save()

    let tivelDayData = updateTivelDayData(event)
    updateUserDayData(closer, event)
    updateUserDayData(closer, event)
    let ownerDayData = updateUserDayData(owner, event)
    let ownerHourData = updateUserHourData(owner, event)
    let poolDayData = updatePoolDayData(pool, event)
    let poolHourData = updatePoolHourData(pool, event)
    let pairDayData = updatePairDayData(pair, event)
    let pairHourData = updatePairHourData(pair, event)
    updateTokenDayData(quoteToken, event)
    updateTokenHourData(quoteToken, event)

    tivelDayData.liquidationFeesUSD = tivelDayData.liquidationFeesUSD.plus(liquidationFeesUSD)
    ownerDayData.liquidationFeesUSD = ownerDayData.liquidationFeesUSD.plus(liquidationFeesUSD)
    ownerHourData.liquidationFeesUSD = ownerHourData.liquidationFeesUSD.plus(liquidationFeesUSD)
    poolDayData.liquidationFees = poolDayData.liquidationFees.plus(liquidationFees)
    poolDayData.liquidationFeesUSD = poolDayData.liquidationFeesUSD.plus(liquidationFeesUSD)
    poolHourData.liquidationFees = poolHourData.liquidationFees.plus(liquidationFees)
    poolHourData.liquidationFeesUSD = poolHourData.liquidationFeesUSD.plus(liquidationFeesUSD)
    pairDayData.liquidationFees = pairDayData.liquidationFees.plus(liquidationFees)
    pairDayData.liquidationFeesUSD = pairDayData.liquidationFeesUSD.plus(liquidationFeesUSD)
    pairHourData.liquidationFees = pairHourData.liquidationFees.plus(liquidationFees)
    pairHourData.liquidationFeesUSD = pairHourData.liquidationFeesUSD.plus(liquidationFeesUSD)

    tivelDayData.save()
    ownerDayData.save()
    poolDayData.save()
    pairDayData.save()
    ownerHourData.save()
    poolHourData.save()
    pairHourData.save()
}

export function handleRollback(event: RollbackEvent): void {
    let factory = getFactory(FACTORY_ADDRESS)
    let user = getUser(event.params.rollbacker.toHexString(), factory)

    // update globals
    factory.txCount = factory.txCount.plus(ONE_BI)

    user.txCount = user.txCount.plus(ONE_BI)

    // burn entity
    let transaction = loadTransaction(event)
    let rollback = new Rollback(transaction.id + '#' + factory.txCount.toString())
    rollback.transaction = transaction.id
    rollback.timestamp = transaction.timestamp
    rollback.positionKey = event.params.positionKey
    rollback.rollbacker = event.params.rollbacker
    rollback.serviceToken = event.params.serviceToken.toHexString()
    rollback.logIndex = event.logIndex

    // handle service fees
    let serviceFees = ZERO_BD
    let serviceFeesUSD = ZERO_BD
    if (event.params.serviceToken.toHexString() !== ADDRESS_ZERO) {
        let serviceToken = getToken(event.params.serviceToken.toHexString())
        serviceFees = convertTokenToDecimal(event.params.serviceFee, serviceToken.decimals)
        serviceFeesUSD = serviceFees.times(serviceToken.priceUSD)

        factory.totalRollbackFees = factory.totalRollbackFees.plus(serviceFees)
        factory.totalRollbackFeesUSD = factory.totalRollbackFeesUSD.plus(serviceFeesUSD)
        user.totalRollbackFees = user.totalRollbackFees.plus(serviceFees)
        user.totalRollbackFeesUSD = user.totalRollbackFeesUSD.plus(serviceFeesUSD)
        rollback.serviceFees = serviceFees
        rollback.serviceFeesUSD = serviceFeesUSD

        updateTokenDayData(serviceToken, event)
        updateTokenHourData(serviceToken, event)

        serviceToken.save()
    }

    rollback.save()
    factory.save()
    user.save()

    let tivelDayData = updateTivelDayData(event)
    let userDayData = updateUserDayData(user, event)
    let userHourData = updateUserHourData(user, event)

    tivelDayData.rollbackFees = tivelDayData.rollbackFees.plus(serviceFees)
    tivelDayData.rollbackFeesUSD = tivelDayData.rollbackFeesUSD.plus(serviceFeesUSD)

    userDayData.rollbackFees = userDayData.rollbackFees.plus(serviceFees)
    userDayData.rollbackFeesUSD = userDayData.rollbackFeesUSD.plus(serviceFeesUSD)
    userHourData.rollbackFees = userHourData.rollbackFees.plus(serviceFees)
    userHourData.rollbackFeesUSD = userHourData.rollbackFeesUSD.plus(serviceFeesUSD)

    tivelDayData.save()
    userDayData.save()
    userHourData.save()
}

export function handleUpdateCollateralAmount(event: UpdateCollateralAmountEvent): void {
    let factory = getFactory(FACTORY_ADDRESS)
    let user = getUser(event.params.updater.toHexString(), factory)

    // update globals
    factory.txCount = factory.txCount.plus(ONE_BI)

    user.txCount = user.txCount.plus(ONE_BI)

    // burn entity
    let transaction = loadTransaction(event)
    let update = new UpdateCollateralAmount(transaction.id + '#' + factory.txCount.toString())
    update.transaction = transaction.id
    update.timestamp = transaction.timestamp
    update.positionKey = event.params.positionKey
    update.amount = event.params.amount
    update.newCollateralLiqPrice = priceToDecimal(event.params.newCollateralLiqPrice.toBigDecimal(), BigInt.fromI32(30))
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

        factory.totalUpdateCollateralAmountFees = factory.totalUpdateCollateralAmountFees.plus(serviceFees)
        factory.totalUpdateCollateralAmountFeesUSD = factory.totalUpdateCollateralAmountFeesUSD.plus(serviceFeesUSD)
        user.totalUpdateCollateralAmountFees = user.totalUpdateCollateralAmountFees.plus(serviceFees)
        user.totalUpdateCollateralAmountFeesUSD = user.totalUpdateCollateralAmountFeesUSD.plus(serviceFeesUSD)
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

    tivelDayData.updateCollateralAmountFees = tivelDayData.updateCollateralAmountFees.plus(serviceFees)
    tivelDayData.updateCollateralAmountFeesUSD = tivelDayData.updateCollateralAmountFeesUSD.plus(serviceFeesUSD)

    userDayData.updateCollateralAmountFees = userDayData.updateCollateralAmountFees.plus(serviceFees)
    userDayData.updateCollateralAmountFeesUSD = userDayData.updateCollateralAmountFeesUSD.plus(serviceFeesUSD)
    userHourData.updateCollateralAmountFees = userHourData.updateCollateralAmountFees.plus(serviceFees)
    userHourData.updateCollateralAmountFeesUSD = userHourData.updateCollateralAmountFeesUSD.plus(serviceFeesUSD)

    tivelDayData.save()
    userDayData.save()
    userHourData.save()
}

export function handleUpdateDeadline(event: UpdateDeadlineEvent): void {
    let poolAddress = event.address.toHexString()
    let pool = getPool(poolAddress)
    let pair = getPair(event.params.baseToken.toHexString(), event.params.quoteToken.toHexString())
    let factory = getFactory(FACTORY_ADDRESS)
    let user = getUser(event.params.updater.toHexString(), factory)

    let quoteToken = getToken(pool.quoteToken)
    let fees = convertTokenToDecimal(event.params.fee, quoteToken.decimals)
    let protocolFees = convertTokenToDecimal(event.params.protocolFee, quoteToken.decimals)

    let feesUSD = fees.times(quoteToken.priceUSD)
    let protocolFeesUSD = protocolFees.times(quoteToken.priceUSD)

    // update globals
    factory.totalFeesUSD = factory.totalFeesUSD.plus(feesUSD)
    factory.totalProtocolFeesUSD = factory.totalProtocolFeesUSD.plus(protocolFeesUSD)
    factory.txCount = factory.txCount.plus(ONE_BI)

    user.totalFeesUSD = user.totalFeesUSD.plus(feesUSD)
    user.totalProtocolFeesUSD = user.totalProtocolFeesUSD.plus(protocolFeesUSD)
    user.txCount = user.txCount.plus(ONE_BI)

    // pool data
    pool.fees = pool.fees.plus(fees)
    pool.feesUSD = pool.feesUSD.plus(feesUSD)
    pool.protocolFees = pool.protocolFees.plus(protocolFees)
    pool.protocolFeesUSD = pool.protocolFeesUSD.plus(protocolFeesUSD)
    pool.txCount = pool.txCount.plus(ONE_BI)

    // pair data
    pair.fees = pair.fees.plus(fees)
    pair.feesUSD = pair.feesUSD.plus(feesUSD)
    pair.protocolFees = pair.protocolFees.plus(protocolFees)
    pair.protocolFeesUSD = pair.protocolFeesUSD.plus(protocolFeesUSD)
    pair.txCount = pair.txCount.plus(ONE_BI)

    // burn entity
    let transaction = loadTransaction(event)
    let update = new UpdateDeadline(transaction.id + '#' + factory.txCount.toString())
    update.transaction = transaction.id
    update.timestamp = transaction.timestamp
    update.positionKey = event.params.positionKey
    update.deadline = event.params.newDeadline.toBigDecimal()
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
        factory.totalUpdateDeadlineFees = factory.totalUpdateDeadlineFees.plus(serviceFees)
        factory.totalUpdateDeadlineFeesUSD = factory.totalUpdateDeadlineFees.plus(serviceFeesUSD)
        user.totalUpdateDeadlineFees = user.totalUpdateDeadlineFees.plus(serviceFees)
        user.totalUpdateDeadlineFeesUSD = user.totalUpdateDeadlineFees.plus(serviceFeesUSD)
        update.serviceFees = serviceFees
        update.serviceFeesUSD = serviceFeesUSD

        serviceToken.save()
    }

    update.save()
    factory.save()
    user.save()
    pool.save()
    pair.save()

    // interval data
    let tivelDayData = updateTivelDayData(event)
    let userDayData = updateUserDayData(user, event)
    let userHourData = updateUserHourData(user, event)
    let poolDayData = updatePoolDayData(pool, event)
    let poolHourData = updatePoolHourData(pool, event)
    let pairDayData = updatePairDayData(pair, event)
    let pairHourData = updatePairHourData(pair, event)

    // update volume metrics
    tivelDayData.feesUSD = tivelDayData.feesUSD.plus(feesUSD)
    tivelDayData.protocolFeesUSD = tivelDayData.protocolFeesUSD.plus(protocolFeesUSD)
    tivelDayData.updateDeadlineFees = tivelDayData.updateDeadlineFees.plus(serviceFees)
    tivelDayData.updateDeadlineFeesUSD = tivelDayData.updateDeadlineFeesUSD.plus(serviceFeesUSD)

    userDayData.feesUSD = userDayData.feesUSD.plus(feesUSD)
    userDayData.protocolFeesUSD = userDayData.protocolFeesUSD.plus(protocolFeesUSD)
    userDayData.updateDeadlineFees = userDayData.updateDeadlineFees.plus(serviceFees)
    userDayData.updateDeadlineFeesUSD = userDayData.updateDeadlineFeesUSD.plus(serviceFeesUSD)

    userHourData.feesUSD = userHourData.feesUSD.plus(feesUSD)
    userHourData.protocolFeesUSD = userHourData.protocolFeesUSD.plus(protocolFeesUSD)
    userHourData.updateDeadlineFees = userHourData.updateDeadlineFees.plus(serviceFees)
    userHourData.updateDeadlineFeesUSD = userHourData.updateDeadlineFeesUSD.plus(serviceFeesUSD)

    poolDayData.fees = poolDayData.fees.plus(fees)
    poolDayData.feesUSD = poolDayData.feesUSD.plus(feesUSD)
    poolDayData.protocolFees = poolDayData.protocolFees.plus(protocolFees)
    poolDayData.protocolFeesUSD = poolDayData.protocolFeesUSD.plus(protocolFeesUSD)

    poolHourData.fees = poolHourData.fees.plus(fees)
    poolHourData.feesUSD = poolHourData.feesUSD.plus(feesUSD)
    poolHourData.protocolFees = poolHourData.protocolFees.plus(protocolFees)
    poolHourData.protocolFeesUSD = poolHourData.protocolFeesUSD.plus(protocolFeesUSD)

    pairDayData.fees = pairDayData.fees.plus(fees)
    pairDayData.feesUSD = pairDayData.feesUSD.plus(feesUSD)
    pairDayData.protocolFees = pairDayData.protocolFees.plus(protocolFees)
    pairDayData.protocolFeesUSD = pairDayData.protocolFeesUSD.plus(protocolFeesUSD)

    pairHourData.fees = pairHourData.fees.plus(fees)
    pairHourData.feesUSD = pairHourData.feesUSD.plus(feesUSD)
    pairHourData.protocolFees = pairHourData.protocolFees.plus(protocolFees)
    pairHourData.protocolFeesUSD = pairHourData.protocolFeesUSD.plus(protocolFeesUSD)

    tivelDayData.save()
    userDayData.save()
    userHourData.save()
    poolDayData.save()
    poolHourData.save()
    pairDayData.save()
    pairHourData.save()
}