# Laboratorio di piattaforme e metodologie cloud - AA 2023-24
Applicazione demo per laboratori di deploy su Google Cloud Platform.

|Versione App|Lezione di riferimento|
|-|-|
|1|Lezione 2 - Virtualizzazione e IaaS|
|2|Lezione 3 - Storage dei dati|
|3|Lezione 6 - Architetture moderne|
|||

## Deploy L - Porting da monolitico a microservizi
1. L'intero deploy è gestito tramite terraform. Eseguire pertanto i relativi comandi:
```sh
terraform init
terraform validate
terraform plan
terraform apply
```
2. Verificare il corretto funzionamento dell'infrastruttura creata
3. Cancellare l'infrastruttura con `terraform destroy`

## Deploy Q - Applicazione a microservizi su Cloud Run
1. L'intero deploy è gestito tramite terraform (cartella terraformCloudRun). Eseguire pertanto i relativi comandi:
2. La condivisione delle chiavi tra i microservizi (authservice e api-gateway) è realizzata tramite bucket Cloud Storage. E' pertanto necessario creare le chiavi e caricarle sul bucket:
```sh
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private.key -out public.key
gsutil cp private.key gs://NOMEBUCKET
gsutil cp publlic.key gs://NOMEBUCKET
```
3. Aggiornare il file `terraform.tfvars` ed eseguire i seguenti comandi:
```sh
terraform init
terraform validate
terraform plan
terraform apply
```
4. Verificare il corretto funzionamento dell'infrastruttura creata
5. Cancellare l'infrastruttura con `terraform destroy`

## Esercizio per casa - Aggiunta di un sistema CI/CD al deploy Q
Con il deploy Q operativo eseguire i seguenti passi:
1. Creare un repository chiamato CalculusMasterV3 su Cloud Source Repositories. Prendere nota dell'indirizzo del repository, che dovrebbe essere simile a `https://source.developers.google.com/p/unibocloud2024-422006/r/CalculusMasterV3`
2. Caricare il codice di CalculusMaster sul nuovo repository:
```sh
#Clonare il repository di CalculusMasterV3 (se non già fatto in precedenza). Utilizzare CloudShell per comodità nelle autorizzazioni
git clone https://github.com/dluppoli/CalculusMasterV3
cd CalculusMasterV3

# Autenticare cloud shell verso il nuovo repo
git config --global credential.https://source.developers.google.com.helper gcloud.sh

# Aggiungere il nuovo repository remoto ed effettuare il push
git remote add google https://source.developers.google.com/p/unibocloud2024-422006/r/CalculusMasterV3
git push --all google
```
3. Creare il seguente file cloudbuild.yaml
```yaml
steps:
  - name: "gcr.io/cloud-builders/docker"
    args:
      ["build", "-t", "gcr.io/$PROJECT_ID/pigrecoservice:${SHORT_SHA}", "./pigrecoService"]

  - name: "gcr.io/cloud-builders/docker"
    args:
      ["build", "-t", "gcr.io/$PROJECT_ID/eratosteneservice:${SHORT_SHA}", "./eratosteneService"]

  - name: "gcr.io/cloud-builders/docker"
    args:
      ["build", "-t", "gcr.io/$PROJECT_ID/authservice:${SHORT_SHA}", "./authService"]

  - name: "gcr.io/cloud-builders/docker"
    args:
      ["build", "-t", "gcr.io/$PROJECT_ID/apigateway:${SHORT_SHA}", "./api-gateway"]

  - name: "gcr.io/cloud-builders/docker"
    args:
      ["build", "-t", "gcr.io/$PROJECT_ID/frontend:${SHORT_SHA}", "./frontend"]

  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/pigrecoservice:${SHORT_SHA}"]

  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/eratosteneservice:${SHORT_SHA}"]

  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/authservice:${SHORT_SHA}"]

  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/apigateway:${SHORT_SHA}"]

  - name: "gcr.io/cloud-builders/docker"
    args: ["push", "gcr.io/$PROJECT_ID/frontend:${SHORT_SHA}"]

  - name: "gcr.io/cloud-builders/gcloud"
    args:
      [
        "run",
        "deploy",
        "pigrecoservice",
        "--image",
        "gcr.io/$PROJECT_ID/pigrecoservice:${SHORT_SHA}",
        "--region",
        "us-central1",
        "--platform",
        "managed",
        "--allow-unauthenticated",
      ]

  - name: "gcr.io/cloud-builders/gcloud"
    args:
      [
        "run",
        "deploy",
        "eratosteneservice",
        "--image",
        "gcr.io/$PROJECT_ID/eratosteneservice:${SHORT_SHA}",
        "--region",
        "us-central1",
        "--platform",
        "managed",
        "--allow-unauthenticated",
      ]

  - name: "gcr.io/cloud-builders/gcloud"
    args:
      [
        "run",
        "deploy",
        "authservice",
        "--image",
        "gcr.io/$PROJECT_ID/authservice:${SHORT_SHA}",
        "--region",
        "us-central1",
        "--platform",
        "managed",
        "--allow-unauthenticated",
      ]

  - name: "gcr.io/cloud-builders/gcloud"
    args:
      [
        "run",
        "deploy",
        "apigateway",
        "--image",
        "gcr.io/$PROJECT_ID/apigateway:${SHORT_SHA}",
        "--region",
        "us-central1",
        "--platform",
        "managed",
        "--allow-unauthenticated",
      ]

  - name: "gcr.io/cloud-builders/gcloud"
    args:
      [
        "run",
        "deploy",
        "frontend",
        "--image",
        "gcr.io/$PROJECT_ID/frontend:${SHORT_SHA}",
        "--region",
        "us-central1",
        "--platform",
        "managed",
        "--allow-unauthenticated",
      ]
```
4. Creare un Cloud Build, avviato (trigger) dai push sul repository precedentemente creato
5. Effettuare il push di cloudbuild.yaml e verificare il corretto funzionamento del deploy
```sh
git add cloudbuild.yaml
git commit -m "aggiunta cloud build"
git push google
```
6. (Opzionalmente) Apportare modifiche al codice, effettuare il push e verificare il corretto aggiornamento dei servizi cloud run
