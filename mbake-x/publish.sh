# zip up the sample apps, update Base.ts version
# ncu -u
tsc
node mbake-x.js
npm publish
#sudo npm i -g mbake --unsafe-perm=true --allow-root
# if changed node version do this:
# sudo 

yarn global add mbake-x
mbake-x

# find . -type f -name 'package-lock.json' 