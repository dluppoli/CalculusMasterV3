resource "google_compute_region_network_endpoint_group" "neg" {
  name                  = "appserverneg"
  network_endpoint_type = "SERVERLESS"
  region                = var.region

  cloud_run {
    service = var.cloudrun_service
  }
}

