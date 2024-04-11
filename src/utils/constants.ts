import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { Factory as FactoryContract } from '../types/templates/Pool/Factory'

export const ZERO_BD = BigDecimal.fromString("0")
export const ONE_BD = BigDecimal.fromString('1')

export const ZERO_BI = BigInt.fromString("0")
export const ONE_BI = BigInt.fromString("1")

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USD_ADDRESS = '0x3355df6D4c9C3035724Fd0e3914dE96A5a83aaf4'

export const PRICEFEED_ADDRESS = '0x3b6Dc8B3fCeb1fcd9Cc41AF5b2F8d38EEF8AF03D'

export const FACTORY_ADDRESS = '0x1A18c4FbfeA8c83f32F94c14b13C7349806dD39A'

export const POSITION_MANAGER_ADDRESS = '0x82BC0a5A912DF3Ae2571b9efd74907FC666d91f3'

export let factoryContract = FactoryContract.bind(Address.fromString('0x1A18c4FbfeA8c83f32F94c14b13C7349806dD39A'))