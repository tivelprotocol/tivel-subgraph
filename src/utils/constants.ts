import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { Factory as FactoryContract } from '../types/templates/Pool/Factory'

export const ZERO_BD = BigDecimal.fromString("0")
export const ONE_BD = BigDecimal.fromString('1')

export const ZERO_BI = BigInt.fromString("0")
export const ONE_BI = BigInt.fromString("1")

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USD_ADDRESS = '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9'

export const PRICEFEED_ADDRESS = '0x4B3EFE8235c9B8dbb767b62dF32DBCf47fF889de'

export const FACTORY_ADDRESS = '0xDE71539defe750063Ab6663A858e6E34f7765C89'

export const POSITION_MANAGER_ADDRESS = '0x87A2b65Dc58da298d0246966Ea1601af9fD4675A'

export let factoryContract = FactoryContract.bind(Address.fromString('0xDE71539defe750063Ab6663A858e6E34f7765C89'))