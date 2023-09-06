const baAsn1 = require("../asn1");
const baEnum = require("../enum");

export const encode = (buffer, deviceId, objectId, objectName) => {
  baAsn1.encodeApplicationObjectId(buffer, deviceId.type, deviceId.instance);
  baAsn1.encodeApplicationObjectId(buffer, objectId.type, objectId.instance);
  baAsn1.encodeApplicationCharacterString(buffer, objectName);
};

export const decode = (buffer, offset, apduLen) => {
  let len = 0;
  let result;
  let decodedValue;
  let value = {};
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  decodedValue = baAsn1.decodeObjectId(buffer, offset + len);
  len += decodedValue.len;
  value.deviceId = {
    type: decodedValue.objectType,
    instance: decodedValue.instance,
  };
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
  decodedValue = baAsn1.decodeCharacterString(
    buffer,
    offset + len,
    apduLen - (offset + len),
    result.value
  );
  len += decodedValue.len;
  value.objectName = decodedValue.value;
  value.len = len;
  return value;
};
