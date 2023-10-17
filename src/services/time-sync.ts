/**
 * The timeSync event represents the request to synchronize the local time to
 * the received time.
 *
 * @event bacnet.timeSync
 * @param {date} dateTime - The time to be synchronized to.
 *
 * @example
 * const bacnet = require('ts-bacnet');
 * const client = new bacnet();
 *
 * client.on('timeSync', (msg) => {
 *   console.log(
 *     'address: ', msg.header.address,
 *     ' - dateTime: ', msg.payload.dateTime
 *   );
 * });
 */


import * as baAsn1 from "../asn1";
import * as baEnum from "../enum";

export const encode = (buffer, time) => {
  baAsn1.encodeApplicationDate(buffer, time);
  baAsn1.encodeApplicationTime(buffer, time);
};

export const decode = (buffer, offset, length) => {
  let len = 0;
  let result;
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  if (result.tagNumber !== baEnum.ApplicationTag.DATE) {
    return undefined;
  }
  const date = baAsn1.decodeDate(buffer, offset + len);
  len += date.len;
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  if (result.tagNumber !== baEnum.ApplicationTag.TIME) {
    return undefined;
  }
  const time = baAsn1.decodeBacnetTime(buffer, offset + len);
  len += time.len;
  return {
    len,
    value: new Date(
      date.value.getFullYear(),
      date.value.getMonth(),
      date.value.getDate(),
      time.value.getHours(),
      time.value.getMinutes(),
      time.value.getSeconds(),
      time.value.getMilliseconds()
    ),
  };
};
