module "vpc" {
  source = "./vpc"

  project = var.project
  region = var.region
  zone = var.zone
}

module "sqlvm" {
  source = "./vm"

  project = var.project
  region = var.region
  zone = var.zone

  vm_name = "dbserver"
  vpc_name = module.vpc.vpc_name
  startupscripturl = var.startupscripturl_mysql
}

module "neg" {
  source = "./cloudrunneg"

  project = var.project
  region = var.region
  zone = var.zone

  cloudrun_service = module.frontend.service_name
}

module "lb" {
  source = "./cloudrunlb"

  project = var.project
  region = var.region
  zone = var.zone

  network_endpoint_group = module.neg.neg_id
}

module "frontend" {
  source = "./cloudrunservice"

  project = var.project
  region = var.region
  zone = var.zone

  name = "frontend"

  container_image = "dluppoli/frontend:q"

  vpc_name = module.vpc.vpc_name
  vpc_access_connector = google_vpc_access_connector.connector.self_link

  environment = {
    API_URL = module.apigateway.service_uri
  }
}

module "authservice" {
  source = "./cloudrunservice"

  project = var.project
  region = var.region
  zone = var.zone

  name = "authservice"

  container_image = "dluppoli/authservice:q"

  vpc_name = module.vpc.vpc_name
  vpc_access_connector = google_vpc_access_connector.connector.self_link
  ingress_traffic = "INGRESS_TRAFFIC_INTERNAL_ONLY"

  environment = {
    DB_HOST = module.sqlvm.private_ip_address
    DB_USER = var.DB_USER
    DB_PASSWORD = var.DB_PASSWORD
    DB = var.DB
    KEYS_BUCKET = var.KEYS_BUCKET
    PUB_KEY_FILE = var.PUB_KEY_FILE
    PRV_KEY_FILE = var.PRV_KEY_FILE
  }
}

module "eratosteneservice" {
  source = "./cloudrunservice"

  project = var.project
  region = var.region
  zone = var.zone

  name = "eratosteneservice"

  container_image = "dluppoli/eratosteneservice:q"

  vpc_name = module.vpc.vpc_name
  vpc_access_connector = google_vpc_access_connector.connector.self_link
  ingress_traffic = "INGRESS_TRAFFIC_INTERNAL_ONLY"
}

module "pigrecoservice" {
  source = "./cloudrunservice"

  project = var.project
  region = var.region
  zone = var.zone

  name = "pigrecoservice"

  container_image = "dluppoli/pigrecoservice:q"

  vpc_name = module.vpc.vpc_name
  vpc_access_connector = google_vpc_access_connector.connector.self_link
  ingress_traffic = "INGRESS_TRAFFIC_INTERNAL_ONLY"
}

module "apigateway" {
  source = "./cloudrunservice"

  project = var.project
  region = var.region
  zone = var.zone

  name = "apigateway"

  container_image = "dluppoli/apigateway:q"

  environment = {
    AUTH_API = module.authservice.service_uri
    ERATOSTENE_API = module.eratosteneservice.service_uri
    PIGRECO_API = module.pigrecoservice.service_uri
    KEYS_BUCKET = var.KEYS_BUCKET
    PUB_KEY_FILE = var.PUB_KEY_FILE
  }
  vpc_access_connector = google_vpc_access_connector.connector.self_link
  vpc_name = module.vpc.vpc_name
}

resource "google_vpc_access_connector" "connector" {
  name          = "vpc-con"
  ip_cidr_range = "10.8.0.0/28"
  network       = module.vpc.vpc_name
}
