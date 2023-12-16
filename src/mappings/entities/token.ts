import { Address, log } from '@graphprotocol/graph-ts'
import { Token } from '../../types/schema'
import { ZERO_BD, ZERO_BI } from '../../utils/constants'
import { fetchTokenDecimals, fetchTokenName, fetchTokenPrice, fetchTokenSymbol, fetchTokenTotalSupply } from '../../utils/token'

export function getToken(id: string): Token {
    let token = Token.load(id)
    if (token === null) {
        token = new Token(id)
        token.symbol = fetchTokenSymbol(Address.fromString(id))
        token.name = fetchTokenName(Address.fromString(id))
        token.totalSupply = fetchTokenTotalSupply(Address.fromString(id))
        let decimals = fetchTokenDecimals(Address.fromString(id))

        // bail if we couldn't figure out the decimals
        if (decimals === null) {
            log.debug('mybug the decimal on token 0 was null', [])
        }
        token.decimals = decimals
        token.priceUSD = ZERO_BD
        token.collateralMUT = ZERO_BI
        token.baseTokenMUT = ZERO_BI
        token.collateralLT = ZERO_BI
        token.baseTokenLT = ZERO_BI
        token.baseVolume = ZERO_BD
        token.baseVolumeUSD = ZERO_BD
        token.quoteVolume = ZERO_BD
        token.quoteVolumeUSD = ZERO_BD
        token.collateralVolume = ZERO_BD
        token.collateralVolumeUSD = ZERO_BD
        token.pairCount = ZERO_BI
    }

    let price = fetchTokenPrice(id, token.decimals)
    if (price.gt(ZERO_BD)) {
        token.priceUSD = price
    }
    token.save()

    return token
}