import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { Factory as FactoryContract } from '../types/templates/Pool/Factory'

export const ZERO_BD = BigDecimal.fromString("0")
export const ONE_BD = BigDecimal.fromString('1')

export const ZERO_BI = BigInt.fromString("0")
export const ONE_BI = BigInt.fromString("1")

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USD_ADDRESS = '0x0000000000000000000000000000000000000000'

export const PRICEFEED_ADDRESS = '0x0000000000000000000000000000000000000000'

export const FACTORY_ADDRESS = '0x0000000000000000000000000000000000000000'

export const POSITION_MANAGER_ADDRESS = '0x0000000000000000000000000000000000000000'

export let factoryContract = FactoryContract.bind(Address.fromString('0x0000000000000000000000000000000000000000'))