import * as baEnum from "./enum";
import { BufferWithOffset } from "./types";

const DEFAULT_HOP_COUNT = 0xff;
const BACNET_PROTOCOL_VERSION = 1;
const BACNET_ADDRESS_TYPES = {
  NONE: 0,
  IP: 1,
};

interface target {
  type?: number;
  net?: number;
  adr?: number[];
}

const decodeTarget = (buffer, offset) => {
  let len = 0;
  const target: target = {
    type: BACNET_ADDRESS_TYPES.NONE,
    net: (buffer[offset + len++] << 8) | (buffer[offset + len++] << 0),
  };
  const adrLen = buffer[offset + len++];
  if (adrLen > 0) {
    target.adr = [];
    for (let i = 0; i < adrLen; i++) {
      target.adr.push(buffer[offset + len++]);
    }
  }
  return {
    target,
    len,
  };
};

const encodeTarget = (
  buffer: BufferWithOffset,
  target: destinationOrSource
) => {
  buffer.buffer[buffer.offset++] = (target.net & 0xff00) >> 8;
  buffer.buffer[buffer.offset++] = (target.net & 0x00ff) >> 0;
  if (target.net === 0xffff || !target.adr) {
    buffer.buffer[buffer.offset++] = 0;
  } else {
    buffer.buffer[buffer.offset++] = target.adr.length;
    if (target.adr.length > 0) {
      for (let i = 0; i < target.adr.length; i++) {
        buffer.buffer[buffer.offset++] = target.adr[i];
      }
    }
  }
};

export const decodeFunction = (buffer: BufferWithOffset, offset: number) => {
  if (buffer[offset + 0] !== BACNET_PROTOCOL_VERSION) {
    return undefined;
  }
  return buffer[offset + 1];
};

export const decode = (buffer: BufferWithOffset, offset: number) => {
  let adrLen;
  const orgOffset = offset;
  offset++;
  const funct = buffer[offset++];
  let destination;
  if (funct & baEnum.NpduControlBit.DESTINATION_SPECIFIED) {
    const tmpDestination = decodeTarget(buffer, offset);
    offset += tmpDestination.len;
    destination = tmpDestination.target;
  }
  let source;
  if (funct & baEnum.NpduControlBit.SOURCE_SPECIFIED) {
    const tmpSource = decodeTarget(buffer, offset);
    offset += tmpSource.len;
    source = tmpSource.target;
  }
  let hopCount = 0;
  if (funct & baEnum.NpduControlBit.DESTINATION_SPECIFIED) {
    hopCount = buffer[offset++];
  }
  let networkMsgType = baEnum.NetworkLayerMessageType.WHO_IS_ROUTER_TO_NETWORK;
  let vendorId = 0;
  if (funct & baEnum.NpduControlBit.NETWORK_LAYER_MESSAGE) {
    networkMsgType = buffer[offset++];
    if (networkMsgType >= 0x80) {
      vendorId = (buffer[offset++] << 8) | (buffer[offset++] << 0);
    } else if (
      networkMsgType === baEnum.NetworkLayerMessageType.WHO_IS_ROUTER_TO_NETWORK
    ) {
      offset += 2;
    }
  }
  if (buffer[orgOffset + 0] !== BACNET_PROTOCOL_VERSION) {
    return undefined;
  }
  return {
    len: offset - orgOffset,
    funct,
    destination,
    source,
    hopCount,
    networkMsgType,
    vendorId,
  };
};

export interface destinationOrSource {
  type?: number;
  net?: number;
  adr?: number[];
}

export const encode = (
  buffer: BufferWithOffset,
  funct: number,
  destination?: destinationOrSource,
  source?: destinationOrSource,
  hopCount?: number,
  networkMsgType?: number,
  vendorId?: number
) => {
  const hasDestination = destination && destination.net > 0;
  const hasSource = source && source.net > 0 && source.net !== 0xffff;

  buffer.buffer[buffer.offset++] = BACNET_PROTOCOL_VERSION;
  buffer.buffer[buffer.offset++] =
    funct |
    (hasDestination ? baEnum.NpduControlBit.DESTINATION_SPECIFIED : 0) |
    (hasSource ? baEnum.NpduControlBit.SOURCE_SPECIFIED : 0);

  if (hasDestination) {
    encodeTarget(buffer, destination);
  }

  if (hasSource) {
    encodeTarget(buffer, source);
  }

  if (hasDestination) {
    buffer.buffer[buffer.offset++] = hopCount || DEFAULT_HOP_COUNT;
  }

  if ((funct & baEnum.NpduControlBit.NETWORK_LAYER_MESSAGE) > 0) {
    buffer.buffer[buffer.offset++] = networkMsgType;

    if (networkMsgType >= 0x80) {
      buffer.buffer[buffer.offset++] = (vendorId & 0xff00) >> 8;
      buffer.buffer[buffer.offset++] = (vendorId & 0x00ff) >> 0;
    }
  }
};
