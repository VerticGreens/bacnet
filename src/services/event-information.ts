import * as baAsn1 from "../asn1";
import * as baEnum from "../enum";

export const encode = (buffer, events, moreEvents) => {
  baAsn1.encodeOpeningTag(buffer, 0);
  events.forEach((event) => {
    baAsn1.encodeContextObjectId(
      buffer,
      0,
      event.objectId.type,
      event.objectId.instance
    );
    baAsn1.encodeContextEnumerated(buffer, 1, event.eventState);
    baAsn1.encodeContextBitstring(buffer, 2, event.acknowledgedTransitions);
    baAsn1.encodeOpeningTag(buffer, 3);
    for (let i = 0; i < 3; i++) {
      baAsn1.encodeApplicationDate(buffer, event.eventTimeStamps[i]);
      baAsn1.encodeApplicationTime(buffer, event.eventTimeStamps[i]);
    }
    baAsn1.encodeClosingTag(buffer, 3);
    baAsn1.encodeContextEnumerated(buffer, 4, event.notifyType);
    baAsn1.encodeContextBitstring(buffer, 5, event.eventEnable);
    baAsn1.encodeOpeningTag(buffer, 6);
    for (let i = 0; i < 3; i++) {
      baAsn1.encodeApplicationUnsigned(buffer, event.eventPriorities[i]);
    }
    baAsn1.encodeClosingTag(buffer, 6);
  });
  baAsn1.encodeClosingTag(buffer, 0);
  baAsn1.encodeContextBoolean(buffer, 1, moreEvents);
};

interface value {
  events?: any[];
  moreEvents?: boolean;
  len?: number;
  objectId?: {
    type: number;
    instance: number;
  };
  eventState?: number;
  acknowledgedTransitions?: number;
  eventTimeStamps?: any[];
  notifyType?: number;
  eventEnable?: number;
  eventPriorities?: number[];
}
export const decode = (buffer, offset, apduLen) => {
  let len = 0;
  let result;
  let decodedValue;
  len++;
  const alarms = [];
  let moreEvents;
  while (apduLen - 3 - len > 0) {
    let value: value = {};
    result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
    len += result.len;
    decodedValue = baAsn1.decodeObjectId(buffer, offset + len);
    len += decodedValue.len;
    value.objectId = {
      type: decodedValue.objectType,
      instance: decodedValue.instance,
    };
    result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
    len += result.len;
    decodedValue = baAsn1.decodeEnumerated(buffer, offset + len, result.value);
    len += decodedValue.len;
    value.eventState = decodedValue.value;
    result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
    len += result.len;
    decodedValue = baAsn1.decodeBitstring(buffer, offset + len, result.value);
    len += decodedValue.len;
    value.acknowledgedTransitions = decodedValue.value;
    result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
    len += result.len;
    value.eventTimeStamps = [];
    for (let i = 0; i < 3; i++) {
      if (result.tagNumber !== baEnum.ApplicationTag.NULL) {
        decodedValue = baAsn1.decodeApplicationDate(buffer, offset + len);
        len += decodedValue.len;
        const date = decodedValue.value.value;
        decodedValue = baAsn1.decodeApplicationTime(buffer, offset + len);
        len += decodedValue.len;
        const time = decodedValue.value.value;
        value.eventTimeStamps[i] = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          time.getHours(),
          time.getMinutes(),
          time.getSeconds(),
          time.getMilliseconds()
        );
      } else {
        len += result.value;
      }
    }
    len++;
    result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
    len += result.len;
    decodedValue = baAsn1.decodeEnumerated(buffer, offset + len, result.value);
    len += decodedValue.len;
    value.notifyType = decodedValue.value;
    result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
    len += result.len;
    decodedValue = baAsn1.decodeBitstring(buffer, offset + len, result.value);
    len += decodedValue.len;
    value.eventEnable = decodedValue.value;
    len++;
    value.eventPriorities = [];
    for (let i = 0; i < 3; i++) {
      result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
      len += result.len;
      decodedValue = baAsn1.decodeUnsigned(buffer, offset + len, result.value);
      len += decodedValue.len;
      value.eventPriorities[i] = decodedValue.value;
    }
    len++;
    alarms.push(value);
  }
  moreEvents = buffer[apduLen - 1] === 1;
  return {
    len,
    alarms,
    moreEvents,
  };
};
