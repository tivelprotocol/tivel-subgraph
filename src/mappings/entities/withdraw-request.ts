import { Address, BigInt } from "@graphprotocol/graph-ts"
import { WithdrawalRequest } from "../../types/schema"
import { ADDRESS_ZERO, ZERO_BD } from "../../utils/constants"

export function getWithdrawalRequest(poolAddress: string, requestIndex: BigInt): WithdrawalRequest {
    let requestId = poolAddress.concat("-").concat(requestIndex.toString())
    let request = WithdrawalRequest.load(requestId)
    if (request === null) {
        request = new WithdrawalRequest(requestId)
        request.index = requestIndex
        request.owner = Address.fromString(ADDRESS_ZERO)
        request.quoteToken = ADDRESS_ZERO
        request.liquidity = ZERO_BD
        request.to = Address.fromString(ADDRESS_ZERO)
        request.isFulfilled = false

        request.save()
    }

    return request
}