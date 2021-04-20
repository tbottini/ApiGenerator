var bcrypt = require("bcrypt");

async function hash(origin) {
  return await bcrypt.hash(origin, 10);
}

async function verify(hash, neutral) {
  return await bcrypt.compare(neutral, hash);
}

module.exports = {
  hash: hash,
  verify: verify
};
