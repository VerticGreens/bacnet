/**
 * The whoIs event represents the request for an IAm reponse to detect all
 * devices in a BACNET network.
 *
 * @event bacnet.whoIs
 * @param {number=} lowLimit - The lowest BACnet ID being queried.
 * @param {number=} highLimit - The highest BACnet ID being queried.
 *
 * @example
 * const bacnet = require('ts-bacnet');
 * const client = new bacnet();
 *
 * client.on('whoIs', (msg) => {
 *   console.log(
 *     'address: ', msg.header.address,
 *     ' - lowLimit: ', msg.payload.lowLimit,
 *     ' - highLimit: ', msg.payload.highLimit
 *   );
 * });
 */



import * as baAsn1 from "../asn1";
import * as baEnum from "../enum";

export const encode = (buffer, lowLimit, highLimit) => {
  if (
    lowLimit >= 0 &&
    lowLimit <= baEnum.ASN1_MAX_INSTANCE &&
    highLimit >= 0 &&
    highLimit <= baEnum.ASN1_MAX_INSTANCE
  ) {
    baAsn1.encodeContextUnsigned(buffer, 0, lowLimit);
    baAsn1.encodeContextUnsigned(buffer, 1, highLimit);
  }
};

interface value {
  lowLimit?: number | Buffer;
  highLimit?: number;
  len?: number;
}

export const decode = (buffer, offset, apduLen) => {
  let len = 0;
  let value: value = {};
  if (apduLen <= 0) {
    return {}; // TODO: why??
  }
  let result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  if (result.tagNumber !== 0) {
    return undefined;
  }
  if (apduLen <= len) {
    return undefined;
  }
  let decodedValue = baAsn1.decodeUnsigned(buffer, offset + len, result.value);
  len += decodedValue.len;
  if ((decodedValue.value as number) <= baEnum.ASN1_MAX_INSTANCE) {
    value.lowLimit = decodedValue.value as number;
  }
  if (apduLen <= len) {
    return undefined;
  }
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  if (result.tagNumber !== 1) {
    return undefined;
  }
  if (apduLen <= len) {
    return undefined;
  }
  decodedValue = baAsn1.decodeUnsigned(buffer, offset + len, result.value);
  len += decodedValue.len;
  if ((decodedValue.value as number) <= baEnum.ASN1_MAX_INSTANCE) {
    value.highLimit = decodedValue.value as number;
  }
  value.len = len;
  return value;
};
