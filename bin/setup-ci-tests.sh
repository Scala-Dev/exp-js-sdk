
set -e

cd ..
mkdir exp-api
cd exp-api
git archive --format=tar --remote=git@github.com:/scalainc/exp-api.git develop | tar xf -
npm install
export NODE_ENV=test
npm start&
sleep(5)
cd ..
mkdir exp-network
cd exp-network
git archive --format=tar --remote=git@github.com:/scalainc/exp-network.git develop | tar xf -
npm install
npm start&
sleep(5)
cd ../exp-js-sdk


