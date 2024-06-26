
resource "google_compute_backend_service" "default" {
  name                            = "appserverbackend"
  connection_draining_timeout_sec = 0
  load_balancing_scheme           = "EXTERNAL_MANAGED"
  port_name                       = "http"
  protocol                        = "HTTP"
  session_affinity                = "NONE"
  timeout_sec                     = 30
  backend {
    group           = var.network_endpoint_group
    balancing_mode  = "UTILIZATION"
    capacity_scaler = 1.0
    max_utilization = 0.6
  }
  enable_cdn = true
}

resource "google_compute_url_map" "default" {
  name            = "appserver-lb"
  default_service = google_compute_backend_service.default.id
}

resource "google_compute_target_http_proxy" "default" {
  name    = "http-lb-proxy"
  url_map = google_compute_url_map.default.id
}

resource "google_compute_global_address" "default" {
  name       = "lb-ipv4-1"
  ip_version = "IPV4"
}

resource "google_compute_global_forwarding_rule" "default" {
  name                  = "http-content-rule"
  ip_protocol           = "TCP"
  load_balancing_scheme = "EXTERNAL_MANAGED"
  port_range            = "80-80"
  target                = google_compute_target_http_proxy.default.id
  ip_address            = google_compute_global_address.default.id
}

