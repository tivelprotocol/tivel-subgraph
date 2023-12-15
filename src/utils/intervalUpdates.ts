import { ZERO_BD, ZERO_BI, ONE_BI } from './constants'
/* eslint-disable prefer-const */
import {
    TivelDayData,
    PoolDayData,
    Token,
    TokenDayData,
    TokenHourData,
    PoolHourData,
    PairDayData,
    Pair,
    PairHourData,
    UserDayData,
    UserHourData,
    User
} from './../types/schema'
import { FACTORY_ADDRESS } from './constants'
import { Address, ethereum } from '@graphprotocol/graph-ts'
import { getFactory } from '../mappings/entities/factory'
import { getPool } from '../mappings/entities/pool'
import { getUser } from '../mappings/entities/user'

/**
 * Tracks global aggregate data over daily windows
 * @param event
 */
export function updateTivelDayData(event: ethereum.Event): TivelDayData {
    let tivel = getFactory(FACTORY_ADDRESS)
    let timestamp = event.block.timestamp.toI32()
    let dayID = timestamp / 86400 // rounded
    let dayStartTimestamp = dayID * 86400
    let tivelDayData = TivelDayData.load(dayID.toString())
    if (tivelDayData === null) {
        tivelDayData = new TivelDayData(dayID.toString())
        tivelDayData.date = dayStartTimestamp
        tivelDayData.volumeUSD = ZERO_BD
        tivelDayData.feesUSD = ZERO_BD
        tivelDayData.protocolFeesUSD = ZERO_BD
        tivelDayData.liquidationFeesUSD = ZERO_BD
        tivelDayData.rollbackFees = ZERO_BD
        tivelDayData.rollbackFeesUSD = ZERO_BD
        tivelDayData.updateStoplossPriceFees = ZERO_BD
        tivelDayData.updateStoplossPriceFeesUSD = ZERO_BD
        tivelDayData.updateDeadlineFees = ZERO_BD
        tivelDayData.updateDeadlineFeesUSD = ZERO_BD
    }
    tivelDayData.tvlUSD = tivel.tvlUSD
    tivelDayData.txCount = tivel.txCount
    tivelDayData.save()
    return tivelDayData as TivelDayData
}

export function updateUserDayData(user: User, event: ethereum.Event): UserDayData {
    let timestamp = event.block.timestamp.toI32()
    let dayID = timestamp / 86400
    let dayStartTimestamp = dayID * 86400
    let dayUserID = user.id
        .concat('-')
        .concat(dayID.toString())
    let userDayData = UserDayData.load(dayUserID)
    if (userDayData === null) {
        userDayData = new UserDayData(dayUserID)
        userDayData.date = dayStartTimestamp
        userDayData.user = user.id
        // things that dont get initialized always
        userDayData.volumeUSD = ZERO_BD
        userDayData.feesUSD = ZERO_BD
        userDayData.protocolFeesUSD = ZERO_BD
        userDayData.liquidationFeesUSD = ZERO_BD
        userDayData.rollbackFees = ZERO_BD
        userDayData.rollbackFeesUSD = ZERO_BD
        userDayData.updateStoplossPriceFees = ZERO_BD
        userDayData.updateStoplossPriceFeesUSD = ZERO_BD
        userDayData.updateDeadlineFees = ZERO_BD
        userDayData.updateDeadlineFeesUSD = ZERO_BD
        userDayData.txCount = ZERO_BI
    }

    userDayData.txCount = userDayData.txCount.plus(ONE_BI)
    userDayData.save()

    return userDayData as UserDayData
}

export function updateUserHourData(user: User, event: ethereum.Event): UserHourData {
    let timestamp = event.block.timestamp.toI32()
    let hourIndex = timestamp / 3600 // get unique hour within unix history
    let hourStartUnix = hourIndex * 3600 // want the rounded effect
    let hourUserID = user.id
        .concat('-')
        .concat(hourIndex.toString())
    let userHourData = UserHourData.load(hourUserID)
    if (userHourData === null) {
        userHourData = new UserHourData(hourUserID)
        userHourData.periodStartUnix = hourStartUnix
        userHourData.user = user.id
        // things that dont get initialized always
        userHourData.volumeUSD = ZERO_BD
        userHourData.feesUSD = ZERO_BD
        userHourData.protocolFeesUSD = ZERO_BD
        userHourData.liquidationFeesUSD = ZERO_BD
        userHourData.rollbackFees = ZERO_BD
        userHourData.rollbackFeesUSD = ZERO_BD
        userHourData.updateStoplossPriceFees = ZERO_BD
        userHourData.updateStoplossPriceFeesUSD = ZERO_BD
        userHourData.updateDeadlineFees = ZERO_BD
        userHourData.updateDeadlineFeesUSD = ZERO_BD
        userHourData.txCount = ZERO_BI
    }

    userHourData.txCount = userHourData.txCount.plus(ONE_BI)
    userHourData.save()

    return userHourData as UserHourData
}

export function updatePoolDayData(event: ethereum.Event): PoolDayData {
    let timestamp = event.block.timestamp.toI32()
    let dayID = timestamp / 86400
    let dayStartTimestamp = dayID * 86400
    let dayPoolID = event.address
        .toHexString()
        .concat('-')
        .concat(dayID.toString())
    let pool = getPool(event.address.toHexString())
    let poolDayData = PoolDayData.load(dayPoolID)
    if (poolDayData === null) {
        poolDayData = new PoolDayData(dayPoolID)
        poolDayData.date = dayStartTimestamp
        poolDayData.pool = pool.id
        // things that dont get initialized always
        poolDayData.volume = ZERO_BD
        poolDayData.volumeUSD = ZERO_BD
        poolDayData.fees = ZERO_BD
        poolDayData.feesUSD = ZERO_BD
        poolDayData.protocolFees = ZERO_BD
        poolDayData.protocolFeesUSD = ZERO_BD
        poolDayData.liquidationFees = ZERO_BD
        poolDayData.liquidationFeesUSD = ZERO_BD
        poolDayData.rollbackFees = ZERO_BD
        poolDayData.rollbackFeesUSD = ZERO_BD
        poolDayData.updateStoplossPriceFees = ZERO_BD
        poolDayData.updateStoplossPriceFeesUSD = ZERO_BD
        poolDayData.updateDeadlineFees = ZERO_BD
        poolDayData.updateDeadlineFeesUSD = ZERO_BD
        poolDayData.txCount = ZERO_BI
    }

    poolDayData.liquidity = pool.liquidity
    poolDayData.liquidityUSD = pool.liquidityUSD
    poolDayData.txCount = poolDayData.txCount.plus(ONE_BI)
    poolDayData.save()

    return poolDayData as PoolDayData
}

export function updatePoolHourData(event: ethereum.Event): PoolHourData {
    let timestamp = event.block.timestamp.toI32()
    let hourIndex = timestamp / 3600 // get unique hour within unix history
    let hourStartUnix = hourIndex * 3600 // want the rounded effect
    let hourPoolID = event.address
        .toHexString()
        .concat('-')
        .concat(hourIndex.toString())
    let pool = getPool(event.address.toHexString())
    let poolHourData = PoolHourData.load(hourPoolID)
    if (poolHourData === null) {
        poolHourData = new PoolHourData(hourPoolID)
        poolHourData.periodStartUnix = hourStartUnix
        poolHourData.pool = pool.id
        // things that dont get initialized always
        poolHourData.volume = ZERO_BD
        poolHourData.volumeUSD = ZERO_BD
        poolHourData.fees = ZERO_BD
        poolHourData.feesUSD = ZERO_BD
        poolHourData.protocolFees = ZERO_BD
        poolHourData.protocolFeesUSD = ZERO_BD
        poolHourData.liquidationFees = ZERO_BD
        poolHourData.liquidationFeesUSD = ZERO_BD
        poolHourData.rollbackFees = ZERO_BD
        poolHourData.rollbackFeesUSD = ZERO_BD
        poolHourData.updateStoplossPriceFees = ZERO_BD
        poolHourData.updateStoplossPriceFeesUSD = ZERO_BD
        poolHourData.updateDeadlineFees = ZERO_BD
        poolHourData.updateDeadlineFeesUSD = ZERO_BD
        poolHourData.txCount = ZERO_BI
    }

    poolHourData.liquidity = pool.liquidity
    poolHourData.liquidityUSD = pool.liquidityUSD
    poolHourData.txCount = poolHourData.txCount.plus(ONE_BI)
    poolHourData.save()

    // test
    return poolHourData as PoolHourData
}

export function updatePairDayData(pair: Pair, event: ethereum.Event): PairDayData {
    let timestamp = event.block.timestamp.toI32()
    let dayID = timestamp / 86400
    let dayStartTimestamp = dayID * 86400
    let dayPairID = pair.id
        .toString()
        .concat('-')
        .concat(dayID.toString())
    let pairDayData = PairDayData.load(dayPairID)
    if (pairDayData === null) {
        pairDayData = new PairDayData(dayPairID)
        pairDayData.date = dayStartTimestamp
        pairDayData.pair = pair.id
        // things that dont get initialized always
        pairDayData.baseVolume = ZERO_BD
        pairDayData.baseVolumeUSD = ZERO_BD
        pairDayData.quoteVolume = ZERO_BD
        pairDayData.quoteVolumeUSD = ZERO_BD
        pairDayData.fees = ZERO_BD
        pairDayData.feesUSD = ZERO_BD
        pairDayData.protocolFees = ZERO_BD
        pairDayData.protocolFeesUSD = ZERO_BD
        pairDayData.liquidationFees = ZERO_BD
        pairDayData.liquidationFeesUSD = ZERO_BD
        pairDayData.txCount = ZERO_BI
    }

    pairDayData.txCount = pairDayData.txCount.plus(ONE_BI)
    pairDayData.save()

    return pairDayData as PairDayData
}

export function updatePairHourData(pair: Pair, event: ethereum.Event): PairHourData {
    let timestamp = event.block.timestamp.toI32()
    let hourIndex = timestamp / 3600 // get unique hour within unix history
    let hourStartUnix = hourIndex * 3600 // want the rounded effect
    let hourPairID = pair.id
        .toString()
        .concat('-')
        .concat(hourIndex.toString())
    let pairHourData = PairHourData.load(hourPairID)
    if (pairHourData === null) {
        pairHourData = new PairHourData(hourPairID)
        pairHourData.periodStartUnix = hourStartUnix
        pairHourData.pair = pair.id
        // things that dont get initialized always
        pairHourData.baseVolume = ZERO_BD
        pairHourData.baseVolumeUSD = ZERO_BD
        pairHourData.quoteVolume = ZERO_BD
        pairHourData.quoteVolumeUSD = ZERO_BD
        pairHourData.fees = ZERO_BD
        pairHourData.feesUSD = ZERO_BD
        pairHourData.protocolFees = ZERO_BD
        pairHourData.protocolFeesUSD = ZERO_BD
        pairHourData.liquidationFees = ZERO_BD
        pairHourData.liquidationFeesUSD = ZERO_BD
        pairHourData.txCount = ZERO_BI
    }

    pairHourData.txCount = pairHourData.txCount.plus(ONE_BI)
    pairHourData.save()

    return pairHourData as PairHourData
}

export function updateTokenDayData(token: Token, event: ethereum.Event): TokenDayData {
    let timestamp = event.block.timestamp.toI32()
    let dayID = timestamp / 86400
    let dayStartTimestamp = dayID * 86400
    let tokenDayID = token.id
        .toString()
        .concat('-')
        .concat(dayID.toString())

    let tokenDayData = TokenDayData.load(tokenDayID)
    if (tokenDayData === null) {
        tokenDayData = new TokenDayData(tokenDayID)
        tokenDayData.date = dayStartTimestamp
        tokenDayData.token = token.id
        tokenDayData.baseVolume = ZERO_BD
        tokenDayData.baseVolumeUSD = ZERO_BD
        tokenDayData.quoteVolume = ZERO_BD
        tokenDayData.quoteVolumeUSD = ZERO_BD
        tokenDayData.collateralVolume = ZERO_BD
        tokenDayData.collateralVolumeUSD = ZERO_BD
    }

    tokenDayData.priceUSD = token.priceUSD
    tokenDayData.save()

    return tokenDayData as TokenDayData
}

export function updateTokenHourData(token: Token, event: ethereum.Event): TokenHourData {
    let timestamp = event.block.timestamp.toI32()
    let hourIndex = timestamp / 3600 // get unique hour within unix history
    let hourStartUnix = hourIndex * 3600 // want the rounded effect
    let tokenHourID = token.id
        .toString()
        .concat('-')
        .concat(hourIndex.toString())
    let tokenHourData = TokenHourData.load(tokenHourID)

    if (tokenHourData === null) {
        tokenHourData = new TokenHourData(tokenHourID)
        tokenHourData.periodStartUnix = hourStartUnix
        tokenHourData.token = token.id
        tokenHourData.baseVolume = ZERO_BD
        tokenHourData.baseVolumeUSD = ZERO_BD
        tokenHourData.quoteVolume = ZERO_BD
        tokenHourData.quoteVolumeUSD = ZERO_BD
        tokenHourData.collateralVolume = ZERO_BD
        tokenHourData.collateralVolumeUSD = ZERO_BD
    }

    tokenHourData.priceUSD = token.priceUSD
    tokenHourData.save()

    return tokenHourData as TokenHourData
}