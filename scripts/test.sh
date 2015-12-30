#!/bin/bash
set -e
#$(npm bin)/mocha test/setupPairingDevice.js test/pairing.spec.js --timeout 30000
$(npm bin)/mocha test/setupUser.js test/basic.spec.js
$(npm bin)/mocha test/setupDevice.js test/basic.spec.js