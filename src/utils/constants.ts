import { Address, BigDecimal, BigInt } from '@graphprotocol/graph-ts'
import { Factory as FactoryContract } from '../types/templates/Pool/Factory'

export const ZERO_BD = BigDecimal.fromString("0")
export const ONE_BD = BigDecimal.fromString('1')

export const ZERO_BI = BigInt.fromString("0")
export const ONE_BI = BigInt.fromString("1")

export const ADDRESS_ZERO = '0x0000000000000000000000000000000000000000'

export const NULL_CALL_RESULT_VALUE = '0x0000000000000000000000000000000000000000000000000000000000000001'

export const USD_ADDRESS = '0x3355df6d4c9c3035724fd0e3914de96a5a83aaf4'

export const PRICEFEED_ADDRESS = '0x200361205ac08a35551327b2ba2c3c61855b0064'

export const FACTORY_ADDRESS = '0x6160761a70eacd9649b5b83c260d274a644d90e4'

export const POSITION_MANAGER_ADDRESS = '0x92bc1be1551009c9273c3ccf9770a6edcc1ad6a4'

export let factoryContract = FactoryContract.bind(Address.fromString('0x6160761a70eacd9649b5b83c260d274a644d90e4'))