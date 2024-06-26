import * as baAsn1 from "../asn1";
import * as baEnum from "../enum";

export const encode = (
  buffer,
  objectType,
  objectInstance,
  propertyId,
  arrayIndex
) => {
  if (objectType <= baEnum.ASN1_MAX_OBJECT) {
    baAsn1.encodeContextObjectId(buffer, 0, objectType, objectInstance);
  }
  if (propertyId <= baEnum.ASN1_MAX_PROPERTY_ID) {
    baAsn1.encodeContextEnumerated(buffer, 1, propertyId);
  }
  if (arrayIndex !== baEnum.ASN1_ARRAY_ALL) {
    baAsn1.encodeContextUnsigned(
      buffer,
      2,
      arrayIndex || arrayIndex === 0 ? arrayIndex : baEnum.ASN1_ARRAY_ALL
    );
  }
};

interface property {
  id?: number;
  index?: number;
}

export const decode = (buffer, offset, apduLen) => {
  let len = 0;
  let result;
  let decodedValue;
  if (apduLen < 7) {
    return undefined;
  }
  if (!baAsn1.decodeIsContextTag(buffer, offset + len, 0)) {
    return undefined;
  }
  len++;
  decodedValue = baAsn1.decodeObjectId(buffer, offset + len);
  len += decodedValue.len;
  let objectId = {
    type: decodedValue.objectType,
    instance: decodedValue.instance,
  };
  let property: property = {};
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  if (result.tagNumber !== 1) {
    return undefined;
  }
  decodedValue = baAsn1.decodeEnumerated(buffer, offset + len, result.value);
  len += decodedValue.len;
  property.id = decodedValue.value;
  property.index = baEnum.ASN1_ARRAY_ALL;
  if (len < apduLen) {
    result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
    len += result.len;
    if (result.tagNumber === 2 && len < apduLen) {
      decodedValue = baAsn1.decodeUnsigned(buffer, offset + len, result.value);
      len += decodedValue.len;
      property.index = decodedValue.value;
    } else {
      return undefined;
    }
  }
  if (len < apduLen) {
    return undefined;
  }
  return {
    len,
    objectId,
    property,
  };
};

export const encodeAcknowledge = (
  buffer,
  objectId,
  propertyId,
  arrayIndex,
  values
) => {
  baAsn1.encodeContextObjectId(buffer, 0, objectId.type, objectId.instance);
  baAsn1.encodeContextEnumerated(buffer, 1, propertyId);
  if (arrayIndex !== baEnum.ASN1_ARRAY_ALL) {
    baAsn1.encodeContextUnsigned(buffer, 2, arrayIndex);
  }
  baAsn1.encodeOpeningTag(buffer, 3);
  values.forEach((value) => {
    baAsn1.bacappEncodeApplicationData(buffer, value);
  });
  baAsn1.encodeClosingTag(buffer, 3);
};

interface objectId {
  type?: number;
  instance?: number;
}

export const decodeAcknowledge = (buffer, offset, apduLen) => {
  let result;
  let decodedValue;
  let objectId: objectId = {};
  let property: property = {};
  if (!baAsn1.decodeIsContextTag(buffer, offset, 0)) {
    return undefined;
  }
  let len = 1;
  result = baAsn1.decodeObjectId(buffer, offset + len);
  len += result.len;
  objectId.type = result.objectType;
  objectId.instance = result.instance;
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  if (result.tagNumber !== 1) {
    return undefined;
  }
  result = baAsn1.decodeEnumerated(buffer, offset + len, result.value);
  len += result.len;
  property.id = result.value;
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  if (result.tagNumber === 2) {
    len += result.len;
    decodedValue = baAsn1.decodeUnsigned(buffer, offset + len, result.value);
    len += decodedValue.len;
    property.index = decodedValue.value;
  } else {
    property.index = baEnum.ASN1_ARRAY_ALL;
  }
  const values = [];
  if (!baAsn1.decodeIsOpeningTagNumber(buffer, offset + len, 3)) {
    return undefined;
  }
  len++;
  while (apduLen - len > 1) {
    result = baAsn1.bacappDecodeApplicationData(
      buffer,
      offset + len,
      apduLen + offset,
      objectId.type,
      property.id
    );
    if (!result) {
      return undefined;
    }
    len += result.len;
    delete result.len;
    values.push(result);
  }
  if (!baAsn1.decodeIsClosingTagNumber(buffer, offset + len, 3)) {
    return undefined;
  }
  len++;
  return {
    len,
    objectId,
    property,
    values,
  };
};
