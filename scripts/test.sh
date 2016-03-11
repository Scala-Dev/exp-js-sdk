#!/bin/bash
set -e
#$(npm bin)/mocha test/setupPairingDevice.js test/pairing.spec.js --timeout 30000
mocha test/setupUser.js test/sanity.spec.js --timeout 5000
mocha test/setupUser.js test/EXP-1511.js --timeout 5000
#$(npm bin)/mocha test/setupDevice.js test/basic.spec.js