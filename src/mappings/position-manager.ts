/* eslint-disable prefer-const */
import {
    Collect,
    AddDecreaseLiquidityRequest,
    DecreaseLiquidity,
    IncreaseLiquidity,
    NonfungiblePositionManager,
    Transfer
} from '../types/NonfungiblePositionManager/NonfungiblePositionManager'
import { Position, PositionSnapshot, Token } from '../types/schema'
import { ADDRESS_ZERO, FACTORY_ADDRESS, factoryContract, ONE_BI, ZERO_BD, ZERO_BI } from '../utils/constants'
import { Address, BigInt, ethereum } from '@graphprotocol/graph-ts'
import { convertTokenToDecimal, loadTransaction } from '../utils'
import { getToken } from './entities/token'
import { getWithdrawalRequest } from './entities/withdraw-request'
import { getUser } from './entities/user'
import { updatePoolDayData, updatePoolHourData, updateTivelDayData, updateTokenDayData, updateTokenHourData, updateUserDayData, updateUserHourData } from '../utils/intervalUpdates'
import { getFactory } from './entities/factory'
import { getPool } from './entities/pool'

function getPosition(event: ethereum.Event, tokenId: BigInt): Position | null {
    let position = Position.load(tokenId.toString())
    if (position === null) {
        let contract = NonfungiblePositionManager.bind(event.address)
        let positionCall = contract.try_positions(tokenId)

        // the following call reverts in situations where the position is minted
        // and deleted in the same block
        if (!positionCall.reverted) {
            let positionResult = positionCall.value
            let poolAddress = factoryContract.poolByQuoteToken(positionResult.value2)

            position = new Position(tokenId.toString())
            // The owner gets correctly updated in the Transfer handler
            position.owner = Address.fromString(ADDRESS_ZERO)
            position.pool = poolAddress.toHexString()
            position.token = positionResult.value2.toHexString()
            position.liquidity = ZERO_BD
            position.withdrawingLiquidity = ZERO_BD
            position.depositedToken = ZERO_BD
            position.withdrawnToken = ZERO_BD
            position.collectedFees = ZERO_BD
            position.transaction = loadTransaction(event).id
        }
    }

    return position
}

function savePositionSnapshot(position: Position, event: ethereum.Event): void {
    let positionSnapshot = new PositionSnapshot(position.id.concat('#').concat(event.block.number.toString()))
    positionSnapshot.owner = position.owner
    positionSnapshot.pool = position.pool
    positionSnapshot.position = position.id
    positionSnapshot.blockNumber = event.block.number
    positionSnapshot.timestamp = event.block.timestamp
    positionSnapshot.liquidity = position.liquidity
    positionSnapshot.withdrawingLiquidity = position.withdrawingLiquidity
    positionSnapshot.depositedToken = position.depositedToken
    positionSnapshot.withdrawnToken = position.withdrawnToken
    positionSnapshot.collectedFees = position.collectedFees
    positionSnapshot.transaction = loadTransaction(event).id
    positionSnapshot.save()
}

export function handleIncreaseLiquidity(event: IncreaseLiquidity): void {
    let position = getPosition(event, event.params.tokenId)

    // position was not able to be fetched
    if (position == null) {
        return
    }

    let token = getToken(position.token)

    let amount = convertTokenToDecimal(event.params.liquidity, token.decimals)

    position.liquidity = position.liquidity.plus(amount)
    position.depositedToken = position.depositedToken.plus(amount)

    position.save()

    savePositionSnapshot(position, event)
}

export function handleAddDecreaseLiquidityRequest(event: AddDecreaseLiquidityRequest): void {
    let position = getPosition(event, event.params.tokenId)

    // position was not able to be fetched
    if (position == null) {
        return
    }
    let poolAddress = position.pool
    let pool = getPool(poolAddress)
    let factory = getFactory(FACTORY_ADDRESS)

    let token = getToken(position.token)
    let liquidity = convertTokenToDecimal(event.params.liquidity, token.decimals)

    // reset tvl aggregates until new amounts calculated
    factory.tvlUSD = factory.tvlUSD.minus(pool.liquidityUSD)

    // pool data
    pool.liquidity = pool.liquidity.minus(liquidity)
    pool.liquidityUSD = pool.liquidity.times(token.priceUSD)

    // reset aggregates with new amounts
    factory.tvlUSD = factory.tvlUSD.plus(pool.liquidityUSD)

    let user = getUser(position.owner.toHexString(), factory)
    user.txCount = user.txCount.plus(ONE_BI)

    position.withdrawingLiquidity = position.withdrawingLiquidity.plus(liquidity)

    let request = getWithdrawalRequest(position.pool, event.params.requestIndex)
    request.position = position.id

    updateTivelDayData(event)
    updatePoolDayData(pool, event)
    updatePoolHourData(pool, event)
    updateTokenDayData(token, event)
    updateTokenHourData(token, event)
    updateUserDayData(user, event)
    updateUserHourData(user, event)

    token.save()
    pool.save()
    factory.save()
    request.save()
    position.save()
    user.save()
    savePositionSnapshot(position, event)
}

export function handleDecreaseLiquidity(event: DecreaseLiquidity): void {
    let position = getPosition(event, event.params.tokenId)

    // position was not able to be fetched
    if (position == null) {
        return
    }

    let token = getToken(position.token)
    let amount = convertTokenToDecimal(event.params.liquidity, token.decimals)

    position.liquidity = position.liquidity.minus(amount)
    position.withdrawingLiquidity = position.withdrawingLiquidity.minus(amount)
    position.withdrawnToken = position.withdrawnToken.plus(amount)

    position.save()
    savePositionSnapshot(position, event)
}

export function handleCollect(event: Collect): void {
    let factory = getFactory(FACTORY_ADDRESS)
    let position = getPosition(event, event.params.tokenId)
    // position was not able to be fetched
    if (position == null) {
        return
    }
    let user = getUser(position.owner.toHexString(), factory)
    user.txCount = user.txCount.plus(ONE_BI)

    let token = getToken(position.token)
    let amount = convertTokenToDecimal(event.params.amount, token.decimals)
    position.collectedFees = position.collectedFees.plus(amount)

    updateUserDayData(user, event)
    updateUserHourData(user, event)

    position.save()
    user.save()
    savePositionSnapshot(position, event)
}

export function handleTransfer(event: Transfer): void {
    let position = getPosition(event, event.params.tokenId)

    // position was not able to be fetched
    if (position == null) {
        return
    }

    position.owner = event.params.to
    position.save()

    savePositionSnapshot(position, event)
}