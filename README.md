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
