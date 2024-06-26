import * as baAsn1 from "../asn1";
import * as baEnum from "../enum";
import { BufferWithOffset } from "../types";
import { DecodedValue } from "./write-property";

export const encode = (buffer, objectId, propertyId, arrayIndex, values) => {
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

export const decode = (
  buffer: BufferWithOffset,
  offset: number,
  apduLen: number
) => {
  let len = 0;
  let result;
  let decodedValue;
  let value: DecodedValue = {};
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
  value.property = { id: decodedValue.value };
  if (len < apduLen && baAsn1.decodeIsContextTag(buffer, offset + len, 2)) {
    result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
    len += result.len;
    decodedValue = baAsn1.decodeUnsigned(buffer, offset + len, result.value);
    len += decodedValue.len;
    value.property.index = decodedValue.value;
  } else {
    value.property.index = baEnum.ASN1_ARRAY_ALL;
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
      value.objectId.type,
      value.property.id
    );
    if (!result) {
      return undefined;
    }
    len += result.len;
    delete result.len;
    values.push(result);
  }
  value.values = values;
  if (!baAsn1.decodeIsClosingTagNumber(buffer, offset + len, 3)) {
    return undefined;
  }
  len++;
  value.len = len;
  return value;
};
