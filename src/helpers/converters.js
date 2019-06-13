export function arrayByteToHex(bytes) {
  return bytes.reduce(
    (str, byte) => str + byte.toString(16).padStart(2, "0"),
    ""
  );
}

export function stringToArrayByte(str) {
  str = unescape(encodeURIComponent(str)); //temporary

  var bytes = new Array(str.length);
  for (var i = 0; i < str.length; ++i) bytes[i] = str.charCodeAt(i);

  return Uint8Array.from(bytes);
}
