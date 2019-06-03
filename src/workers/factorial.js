global.isNode = true
const { NrsBridge, converters }  = require("@keyhub/keyhub-vault-nxt")


console.log('Bridge init...')

const bridge = new NrsBridge()
bridge.load()

console.log('Bridge ready')

addEventListener('message', ({ data }) => {
  console.log("test", crypto)
  // safeObj();
  const response = `worker response to ${data}`;
  postMessage(response);
});