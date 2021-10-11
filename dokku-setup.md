```bash
wget https://raw.githubusercontent.com/dokku/dokku/v0.25.7/bootstrap.sh;
DOKKU_TAG=v0.25.7 bash bootstrap.sh

cat ~/.ssh/authorized_keys | dokku ssh-keys:add admin

dokku domains:set-global konquest.space

dokku apps:create api
dokku apps:create frontend

dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git
sudo dokku plugin:install https://github.com/dokku/dokku-mysql.git mysql

dokku mysql:create konquest
```
