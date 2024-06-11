// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class AddRequest extends ethereum.Event {
  get params(): AddRequest__Params {
    return new AddRequest__Params(this);
  }
}

export class AddRequest__Params {
  _event: AddRequest;

  constructor(event: AddRequest) {
    this._event = event;
  }

  get pool(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get index(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get owner(): Address {
    return this._event.parameters[2].value.toAddress();
  }

  get quoteToken(): Address {
    return this._event.parameters[3].value.toAddress();
  }

  get liquidity(): BigInt {
    return this._event.parameters[4].value.toBigInt();
  }

  get to(): Address {
    return this._event.parameters[5].value.toAddress();
  }

  get data(): Bytes {
    return this._event.parameters[6].value.toBytes();
  }
}

export class FulfillRequest extends ethereum.Event {
  get params(): FulfillRequest__Params {
    return new FulfillRequest__Params(this);
  }
}

export class FulfillRequest__Params {
  _event: FulfillRequest;

  constructor(event: FulfillRequest) {
    this._event = event;
  }

  get pool(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get index(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class ProcessBatch extends ethereum.Event {
  get params(): ProcessBatch__Params {
    return new ProcessBatch__Params(this);
  }
}

export class ProcessBatch__Params {
  _event: ProcessBatch;

  constructor(event: ProcessBatch) {
    this._event = event;
  }

  get count(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get performData(): Bytes {
    return this._event.parameters[1].value.toBytes();
  }

  get usedGas(): BigInt {
    return this._event.parameters[2].value.toBigInt();
  }

  get gasPrice(): BigInt {
    return this._event.parameters[3].value.toBigInt();
  }
}

export class SetKeeper extends ethereum.Event {
  get params(): SetKeeper__Params {
    return new SetKeeper__Params(this);
  }
}

export class SetKeeper__Params {
  _event: SetKeeper;

  constructor(event: SetKeeper) {
    this._event = event;
  }

  get keeper(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class SetManager extends ethereum.Event {
  get params(): SetManager__Params {
    return new SetManager__Params(this);
  }
}

export class SetManager__Params {
  _event: SetManager;

  constructor(event: SetManager) {
    this._event = event;
  }

  get manager(): Address {
    return this._event.parameters[0].value.toAddress();
  }
}

export class UpdateCallbackResult extends ethereum.Event {
  get params(): UpdateCallbackResult__Params {
    return new UpdateCallbackResult__Params(this);
  }
}

export class UpdateCallbackResult__Params {
  _event: UpdateCallbackResult;

  constructor(event: UpdateCallbackResult) {
    this._event = event;
  }

  get pool(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get index(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }

  get result(): string {
    return this._event.parameters[2].value.toString();
  }
}

export class WithdrawalMonitor__checkUpkeepResult {
  value0: boolean;
  value1: Bytes;

  constructor(value0: boolean, value1: Bytes) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromBoolean(this.value0));
    map.set("value1", ethereum.Value.fromBytes(this.value1));
    return map;
  }

  getUpkeepNeeded(): boolean {
    return this.value0;
  }

  getPerformData(): Bytes {
    return this.value1;
  }
}

export class WithdrawalMonitor__checkerResult {
  value0: boolean;
  value1: Bytes;

  constructor(value0: boolean, value1: Bytes) {
    this.value0 = value0;
    this.value1 = value1;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromBoolean(this.value0));
    map.set("value1", ethereum.Value.fromBytes(this.value1));
    return map;
  }

  getCanExec(): boolean {
    return this.value0;
  }

  getExecPayload(): Bytes {
    return this.value1;
  }
}

export class WithdrawalMonitor__requestResult {
  value0: BigInt;
  value1: Address;
  value2: Address;
  value3: BigInt;
  value4: Address;
  value5: Bytes;

  constructor(
    value0: BigInt,
    value1: Address,
    value2: Address,
    value3: BigInt,
    value4: Address,
    value5: Bytes
  ) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
    this.value4 = value4;
    this.value5 = value5;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromAddress(this.value1));
    map.set("value2", ethereum.Value.fromAddress(this.value2));
    map.set("value3", ethereum.Value.fromUnsignedBigInt(this.value3));
    map.set("value4", ethereum.Value.fromAddress(this.value4));
    map.set("value5", ethereum.Value.fromBytes(this.value5));
    return map;
  }

  getIndex(): BigInt {
    return this.value0;
  }

  getOwner(): Address {
    return this.value1;
  }

  getQuoteToken(): Address {
    return this.value2;
  }

  getLiquidity(): BigInt {
    return this.value3;
  }

  getTo(): Address {
    return this.value4;
  }

  getData(): Bytes {
    return this.value5;
  }
}

export class WithdrawalMonitor extends ethereum.SmartContract {
  static bind(address: Address): WithdrawalMonitor {
    return new WithdrawalMonitor("WithdrawalMonitor", address);
  }

  addRequest(
    _owner: Address,
    _quoteToken: Address,
    _liquidity: BigInt,
    _to: Address,
    _data: Bytes
  ): BigInt {
    let result = super.call(
      "addRequest",
      "addRequest(address,address,uint256,address,bytes):(uint256)",
      [
        ethereum.Value.fromAddress(_owner),
        ethereum.Value.fromAddress(_quoteToken),
        ethereum.Value.fromUnsignedBigInt(_liquidity),
        ethereum.Value.fromAddress(_to),
        ethereum.Value.fromBytes(_data)
      ]
    );

    return result[0].toBigInt();
  }

  try_addRequest(
    _owner: Address,
    _quoteToken: Address,
    _liquidity: BigInt,
    _to: Address,
    _data: Bytes
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "addRequest",
      "addRequest(address,address,uint256,address,bytes):(uint256)",
      [
        ethereum.Value.fromAddress(_owner),
        ethereum.Value.fromAddress(_quoteToken),
        ethereum.Value.fromUnsignedBigInt(_liquidity),
        ethereum.Value.fromAddress(_to),
        ethereum.Value.fromBytes(_data)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  checkUpkeep(param0: Bytes): WithdrawalMonitor__checkUpkeepResult {
    let result = super.call("checkUpkeep", "checkUpkeep(bytes):(bool,bytes)", [
      ethereum.Value.fromBytes(param0)
    ]);

    return new WithdrawalMonitor__checkUpkeepResult(
      result[0].toBoolean(),
      result[1].toBytes()
    );
  }

  try_checkUpkeep(
    param0: Bytes
  ): ethereum.CallResult<WithdrawalMonitor__checkUpkeepResult> {
    let result = super.tryCall(
      "checkUpkeep",
      "checkUpkeep(bytes):(bool,bytes)",
      [ethereum.Value.fromBytes(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new WithdrawalMonitor__checkUpkeepResult(
        value[0].toBoolean(),
        value[1].toBytes()
      )
    );
  }

  checker(): WithdrawalMonitor__checkerResult {
    let result = super.call("checker", "checker():(bool,bytes)", []);

    return new WithdrawalMonitor__checkerResult(
      result[0].toBoolean(),
      result[1].toBytes()
    );
  }

  try_checker(): ethereum.CallResult<WithdrawalMonitor__checkerResult> {
    let result = super.tryCall("checker", "checker():(bool,bytes)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new WithdrawalMonitor__checkerResult(
        value[0].toBoolean(),
        value[1].toBytes()
      )
    );
  }

  currentIndex(param0: Address): BigInt {
    let result = super.call("currentIndex", "currentIndex(address):(uint256)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBigInt();
  }

  try_currentIndex(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "currentIndex",
      "currentIndex(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  factory(): Address {
    let result = super.call("factory", "factory():(address)", []);

    return result[0].toAddress();
  }

  try_factory(): ethereum.CallResult<Address> {
    let result = super.tryCall("factory", "factory():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  keeper(): Address {
    let result = super.call("keeper", "keeper():(address)", []);

    return result[0].toAddress();
  }

  try_keeper(): ethereum.CallResult<Address> {
    let result = super.tryCall("keeper", "keeper():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  manager(): Address {
    let result = super.call("manager", "manager():(address)", []);

    return result[0].toAddress();
  }

  try_manager(): ethereum.CallResult<Address> {
    let result = super.tryCall("manager", "manager():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  poolDeployer(): Address {
    let result = super.call("poolDeployer", "poolDeployer():(address)", []);

    return result[0].toAddress();
  }

  try_poolDeployer(): ethereum.CallResult<Address> {
    let result = super.tryCall("poolDeployer", "poolDeployer():(address)", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }

  request(param0: Address, param1: BigInt): WithdrawalMonitor__requestResult {
    let result = super.call(
      "request",
      "request(address,uint256):(uint256,address,address,uint256,address,bytes)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return new WithdrawalMonitor__requestResult(
      result[0].toBigInt(),
      result[1].toAddress(),
      result[2].toAddress(),
      result[3].toBigInt(),
      result[4].toAddress(),
      result[5].toBytes()
    );
  }

  try_request(
    param0: Address,
    param1: BigInt
  ): ethereum.CallResult<WithdrawalMonitor__requestResult> {
    let result = super.tryCall(
      "request",
      "request(address,uint256):(uint256,address,address,uint256,address,bytes)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new WithdrawalMonitor__requestResult(
        value[0].toBigInt(),
        value[1].toAddress(),
        value[2].toAddress(),
        value[3].toBigInt(),
        value[4].toAddress(),
        value[5].toBytes()
      )
    );
  }

  requestLength(_pool: Address): BigInt {
    let result = super.call(
      "requestLength",
      "requestLength(address):(uint256)",
      [ethereum.Value.fromAddress(_pool)]
    );

    return result[0].toBigInt();
  }

  try_requestLength(_pool: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "requestLength",
      "requestLength(address):(uint256)",
      [ethereum.Value.fromAddress(_pool)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _keeper(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class AddRequestCall extends ethereum.Call {
  get inputs(): AddRequestCall__Inputs {
    return new AddRequestCall__Inputs(this);
  }

  get outputs(): AddRequestCall__Outputs {
    return new AddRequestCall__Outputs(this);
  }
}

export class AddRequestCall__Inputs {
  _call: AddRequestCall;

  constructor(call: AddRequestCall) {
    this._call = call;
  }

  get _owner(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _quoteToken(): Address {
    return this._call.inputValues[1].value.toAddress();
  }

  get _liquidity(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get _to(): Address {
    return this._call.inputValues[3].value.toAddress();
  }

  get _data(): Bytes {
    return this._call.inputValues[4].value.toBytes();
  }
}

export class AddRequestCall__Outputs {
  _call: AddRequestCall;

  constructor(call: AddRequestCall) {
    this._call = call;
  }

  get index(): BigInt {
    return this._call.outputValues[0].value.toBigInt();
  }
}

export class ExecuteCall extends ethereum.Call {
  get inputs(): ExecuteCall__Inputs {
    return new ExecuteCall__Inputs(this);
  }

  get outputs(): ExecuteCall__Outputs {
    return new ExecuteCall__Outputs(this);
  }
}

export class ExecuteCall__Inputs {
  _call: ExecuteCall;

  constructor(call: ExecuteCall) {
    this._call = call;
  }

  get _pool(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class ExecuteCall__Outputs {
  _call: ExecuteCall;

  constructor(call: ExecuteCall) {
    this._call = call;
  }
}

export class PerformUpkeepCall extends ethereum.Call {
  get inputs(): PerformUpkeepCall__Inputs {
    return new PerformUpkeepCall__Inputs(this);
  }

  get outputs(): PerformUpkeepCall__Outputs {
    return new PerformUpkeepCall__Outputs(this);
  }
}

export class PerformUpkeepCall__Inputs {
  _call: PerformUpkeepCall;

  constructor(call: PerformUpkeepCall) {
    this._call = call;
  }

  get _performData(): Bytes {
    return this._call.inputValues[0].value.toBytes();
  }
}

export class PerformUpkeepCall__Outputs {
  _call: PerformUpkeepCall;

  constructor(call: PerformUpkeepCall) {
    this._call = call;
  }
}

export class SetFactoryCall extends ethereum.Call {
  get inputs(): SetFactoryCall__Inputs {
    return new SetFactoryCall__Inputs(this);
  }

  get outputs(): SetFactoryCall__Outputs {
    return new SetFactoryCall__Outputs(this);
  }
}

export class SetFactoryCall__Inputs {
  _call: SetFactoryCall;

  constructor(call: SetFactoryCall) {
    this._call = call;
  }

  get _factory(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetFactoryCall__Outputs {
  _call: SetFactoryCall;

  constructor(call: SetFactoryCall) {
    this._call = call;
  }
}

export class SetKeeperCall extends ethereum.Call {
  get inputs(): SetKeeperCall__Inputs {
    return new SetKeeperCall__Inputs(this);
  }

  get outputs(): SetKeeperCall__Outputs {
    return new SetKeeperCall__Outputs(this);
  }
}

export class SetKeeperCall__Inputs {
  _call: SetKeeperCall;

  constructor(call: SetKeeperCall) {
    this._call = call;
  }

  get _keeper(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetKeeperCall__Outputs {
  _call: SetKeeperCall;

  constructor(call: SetKeeperCall) {
    this._call = call;
  }
}

export class SetManagerCall extends ethereum.Call {
  get inputs(): SetManagerCall__Inputs {
    return new SetManagerCall__Inputs(this);
  }

  get outputs(): SetManagerCall__Outputs {
    return new SetManagerCall__Outputs(this);
  }
}

export class SetManagerCall__Inputs {
  _call: SetManagerCall;

  constructor(call: SetManagerCall) {
    this._call = call;
  }

  get _manager(): Address {
    return this._call.inputValues[0].value.toAddress();
  }
}

export class SetManagerCall__Outputs {
  _call: SetManagerCall;

  constructor(call: SetManagerCall) {
    this._call = call;
  }
}

export class UpdateCallbackResultCall extends ethereum.Call {
  get inputs(): UpdateCallbackResultCall__Inputs {
    return new UpdateCallbackResultCall__Inputs(this);
  }

  get outputs(): UpdateCallbackResultCall__Outputs {
    return new UpdateCallbackResultCall__Outputs(this);
  }
}

export class UpdateCallbackResultCall__Inputs {
  _call: UpdateCallbackResultCall;

  constructor(call: UpdateCallbackResultCall) {
    this._call = call;
  }

  get _index(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }

  get _result(): string {
    return this._call.inputValues[1].value.toString();
  }
}

export class UpdateCallbackResultCall__Outputs {
  _call: UpdateCallbackResultCall;

  constructor(call: UpdateCallbackResultCall) {
    this._call = call;
  }
}
