resource "google_cloud_run_v2_service" "default" {
  name     = var.name
  location = var.region
  ingress = var.ingress_traffic
  launch_stage = "BETA"

  template {
    containers {
      image = var.container_image

      ports {
        container_port = var.APP_PORT
      }
      
      dynamic "env" {
          for_each = var.environment
          content {
            name = env.key
            value = env.value
          }
      }
    }

    vpc_access{
      connector = var.vpc_access_connector
      egress = "ALL_TRAFFIC"
    }
  }
}

resource "google_cloud_run_service_iam_binding" "default" {
  location = google_cloud_run_v2_service.default.location
  service  = google_cloud_run_v2_service.default.name
  role     = "roles/run.invoker"
  members = [
    "allUsers"
  ]
}