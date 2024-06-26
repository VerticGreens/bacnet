import * as baAsn1 from "../asn1";
import * as baEnum from "../enum";

export const encode = (buffer, state, password) => {
  baAsn1.encodeContextEnumerated(buffer, 0, state);
  if (password && password !== "") {
    baAsn1.encodeContextCharacterString(buffer, 1, password);
  }
};

interface value {
  state?: number | Buffer;
  password?: number;
  len?: number;
}

export const decode = (buffer, offset, apduLen) => {
  let len = 0;
  let value: value = {};
  let result;
  if (!baAsn1.decodeIsContextTag(buffer, offset + len, 0)) {
    return undefined;
  }
  result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
  len += result.len;
  let decodedValue = baAsn1.decodeEnumerated(
    buffer,
    offset + len,
    result.value
  );
  value.state = decodedValue.value;
  len += decodedValue.len;
  if (len < apduLen) {
    if (!baAsn1.decodeIsContextTag(buffer, offset + len, 1)) {
      return undefined;
    }
    result = baAsn1.decodeTagNumberAndValue(buffer, offset + len);
    len += result.len;
    // @ts-ignore
    decodedValue = baAsn1.decodeCharacterString(
      buffer,
      offset + len,
      apduLen - (offset + len),
      result.value
    );
    value.password = decodedValue.value as number;
    len += decodedValue.len;
  }
  value.len = len;
  return value;
};
