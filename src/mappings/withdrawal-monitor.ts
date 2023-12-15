/* eslint-disable prefer-const */
import {
    AddRequest,
    UpdateCallbackResult,
    FulfillRequest
} from '../types/WithdrawalMonitor/WithdrawalMonitor'
import { convertTokenToDecimal } from '../utils'
import { getToken } from './entities/token'
import { getWithdrawalRequest } from './entities/withdraw-request'

export function handleAddRequest(event: AddRequest): void {
    let request = getWithdrawalRequest(event.params.pool.toString(), event.params.index)

    let quoteToken = getToken(event.params.quoteToken.toHexString())
    let liquidity = convertTokenToDecimal(event.params.liquidity, quoteToken.decimals)

    request.owner = event.params.owner
    request.quoteToken = quoteToken.id
    request.liquidity = liquidity
    request.to = event.params.to
    request.data = event.params.data

    request.save()
}

export function handleUpdateCallbackResult(event: UpdateCallbackResult): void {
    let request = getWithdrawalRequest(event.params.pool.toString(), event.params.index)

    request.callbackResult = event.params.result

    request.save()
}

export function handleFulfillRequest(event: FulfillRequest): void {
    let request = getWithdrawalRequest(event.params.pool.toString(), event.params.index)

    request.isFulfilled = true

    request.save()
}