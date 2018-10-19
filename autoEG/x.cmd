
call yarn install
call mbake admin_www
call tsc
call ts-node index.ts
