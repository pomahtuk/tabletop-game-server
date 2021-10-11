```bash
wget https://raw.githubusercontent.com/dokku/dokku/v0.25.7/bootstrap.sh;
DOKKU_TAG=v0.25.7 bash bootstrap.sh

cat ~/.ssh/authorized_keys | dokku ssh-keys:add admin

dokku domains:set-global konquest.space

dokku apps:create api
dokku apps:create konquest.space

dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
dokku plugin:install https://github.com/dokku/dokku-mysql.git mysql

dokku mysql:create db
dokku mysql:link db api

###### visit web-interface

###### deploy!

dokku proxy:ports-add konquest.space http:80:3030
dokku proxy:ports-add api http:80:8080

dokku letsencrypt:enable api
dokku letsencrypt:enable konquest.space

letsencrypt:cron-job --add
```
