ssh jpages-server
cd ~/T01-JPages/
git pull origin main
cd app
npm run build
sudo rm -rf /var/www/app/*
sudo mv build/* /var/www/app
sudo chown -R nginx:nginx /var/www/app
sudo chmod -R 775 /var/www/app/assets/img/logo
cd ../admin/
npm run build
sudo rm -rf /var/www/admin/*
sudo mv dist/* /var/www/admin/