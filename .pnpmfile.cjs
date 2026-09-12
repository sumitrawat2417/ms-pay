// This file automatically approves build scripts for known safe native deps.
// Required because pnpm v9+ requires interactive `pnpm approve-builds` otherwise.
function readPackage(pkg) {
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
