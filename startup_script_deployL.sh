# Aggiornamento repository
apt-get update
# Installazione git
apt-get install -yq git

# Installazione node.js (estratto da https://cloud.google.com/nodejs/getting-started/getting-started-on-compute-engine?hl=it)
mkdir /opt/nodejs
curl https://nodejs.org/dist/v20.11.0/node-v20.11.0-linux-x64.tar.gz | tar xvzf - -C /opt/nodejs --strip-components=1
ln -s /opt/nodejs/bin/node /usr/bin/node
ln -s /opt/nodejs/bin/npm /usr/bin/npm

# Installazione nginx
apt install nginx -y

# Installazione angular CLI
sudo npm config set prefix /usr/local
npm install -g @angular/cli
ng completion

# Clonazione repository CalculusMaster Versione 2
git clone https://github.com/dluppoli/CalculusMasterV3
cd CalculusMasterV3

DB_IP=$(curl http://metadata.google.internal/computeMetadata/v1/instance/attributes/db_ip -H "Metadata-Flavor: Google")

openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private.key -out public.key

# Creazione del file di environment per API Gateway. Personalizzare i valori secondo le necessità 
cd api-gateway
cat > .env << EOF
#Server config
PORT=4000

#API Config
AUTH_API = "http://localhost:4010"
ERATOSTENE_API = "http://localhost:4020"
PIGRECO_API = "http://localhost:4030"

#Keys
PUB_KEY_FILE = "../public.key"
EOF
npm install
npm start&

# Creazione del file di environment per Auth Microservice. Personalizzare i valori secondo le necessità 
cd ../authService
cat > .env << EOF
#Server config
PORT=4010

#Database config
DB_HOST = $DB_IP
DB_USER = calculusmaster
DB_PASSWORD = pigreco
DB = CalculusMaster

#Keys
PUB_KEY_FILE = "../public.key"
PRV_KEY_FILE = "../private.key"
EOF
npm install
npm start&

# Creazione del file di environment per Eratostene Microservice. Personalizzare i valori secondo le necessità 
cd ../eratosteneService
cat > .env << EOF
#Server config
PORT=4020
EOF
npm install
npm start&

# Creazione del file di environment per Pigreco Microservice. Personalizzare i valori secondo le necessità 
cd ../pigrecoService
cat > .env << EOF
#Server config
PORT=4030
EOF
npm install
npm start&

# Creazione del file di environment per Applicazione frontend. Personalizzare i valori secondo le necessità 
MY_IP=$(curl http://metadata.google.internal/computeMetadata/v1/instance/network-interfaces/0/access-configs/0/external-ip -H "Metadata-Flavor: Google")
cd ../frontend/src/environments
cat > environment.ts << EOF
export const environment = {
    backendUrl:'http://$MY_IP/api'
};
EOF
cd ../..
npm install
ng build

# Configurazione nginx per servire l'applicazione
cd /etc/nginx/sites-available
cat > default << EOF
server {
    listen 80 default_server;
    server_name $MY_IP;

    #server_name _;

    root /CalculusMasterV3/frontend/dist/frontend/browser;

    index index.html index.htm index.nginx-debian.html;

    location / {
        try_files \$uri\$args \$uri\$args/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:4000/;
    }
}
EOF
systemctl reload nginx



