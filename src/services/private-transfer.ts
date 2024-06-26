import * as baAsn1 from "../asn1";
import * as baEnum from "../enum";

export const encode = (buffer, vendorId, serviceNumber, data) => {
  baAsn1.encodeContextUnsigned(buffer, 0, vendorId);
  baAsn1.encodeContextUnsigned(buffer, 1, serviceNumber);
  baAsn1.encodeOpeningTag(buffer, 2);
  for (let i = 0; i < data.length; i++) {
    buffer.buffer[buffer.offset++] = data[i];
  }
  baAsn1.encodeClosingTag(buffer, 2);
};

interface value {
  vendorId?: number;
  serviceNumber?: number;
  data?: number[];
  len?: number;
}

export const decode = (buffer, offset, apduLen) => {
  let len = 0;
  let result;
  let decodedValue;
  let value: value = {};
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  decodedValue = baAsn1.decodeUnsigned(buffer, offset + len, result.value);
  len += decodedValue.len;
  value.vendorId = decodedValue.value;
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  decodedValue = baAsn1.decodeUnsigned(buffer, offset + len, result.value);
  len += decodedValue.len;
  value.serviceNumber = decodedValue.value;
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  const size = apduLen - (offset + len + 1);
  const data = [];
  for (let i = 0; i < size; i++) {
    data.push(buffer[offset + len++]);
  }
  value.data = data;
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  value.len = len;
  return value;
};
