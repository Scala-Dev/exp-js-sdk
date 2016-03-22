
set -e

cd ..
git clone git@github.com:scalainc/exp-api.git
cd exp-api
git checkout develop
npm install
export NODE_ENV=test
npm start&
sleep 10
cd ..
git clone git@github.com:scalainc/exp-network.git
cd exp-network
npm install
npm start&
sleep 10
cd ../exp-js-sdk
npm run build
