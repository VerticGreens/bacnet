import * as baAsn1 from "../asn1";
import * as baEnum from "../enum";

export const encode = (
  buffer,
  subscriberProcessId,
  monitoredObjectId,
  cancellationRequest,
  issueConfirmedNotifications,
  lifetime
) => {
  baAsn1.encodeContextUnsigned(buffer, 0, subscriberProcessId);
  baAsn1.encodeContextObjectId(
    buffer,
    1,
    monitoredObjectId.type,
    monitoredObjectId.instance
  );
  if (!cancellationRequest) {
    baAsn1.encodeContextBoolean(buffer, 2, issueConfirmedNotifications);
    baAsn1.encodeContextUnsigned(buffer, 3, lifetime);
  }
};

interface value {
  subscriberProcessId?: number;
  monitoredObjectId?: {
    type: number;
    instance: number;
  };
  cancellationRequest?: boolean;
  issueConfirmedNotifications?: boolean;
  lifetime?: number;
  len?: number;
}

export const decode = (buffer, offset, apduLen) => {
  let len = 0;
  let value: value = {};
  let result;
  let decodedValue;
  if (!baAsn1.decodeIsContextTag(buffer, offset + len, 0)) {
    return undefined;
  }
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  decodedValue = baAsn1.decodeUnsigned(buffer, offset + len, result.value);
  len += decodedValue.len;
  value.subscriberProcessId = decodedValue.value;
  if (!baAsn1.decodeIsContextTag(buffer, offset + len, 1)) {
    return undefined;
  }
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  decodedValue = baAsn1.decodeObjectId(buffer, offset + len);
  len += decodedValue.len;
  value.monitoredObjectId = {
    type: decodedValue.objectType,
    instance: decodedValue.instance,
  };
  value.cancellationRequest = true;
  if (len < apduLen) {
    value.issueConfirmedNotifications = false;
    if (baAsn1.decodeIsContextTag(buffer, offset + len, 2)) {
      value.cancellationRequest = false;
      result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
      len += result.len;
      value.issueConfirmedNotifications = buffer[offset + len] > 0;
      len++;
    }
    value.lifetime = 0;
    if (baAsn1.decodeIsContextTag(buffer, offset + len, 3)) {
      result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
      len += result.len;
      decodedValue = baAsn1.decodeUnsigned(buffer, offset + len, result.value);
      len += decodedValue.len;
      value.lifetime = decodedValue.value;
    }
  }
  value.len = len;
  return value;
};
