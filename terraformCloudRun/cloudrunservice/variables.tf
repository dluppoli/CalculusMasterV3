variable "project" { }

variable "region" {
  default = "us-central1"
}

variable "zone" {
    default = "us-central1-a"
}

variable "name" { }

variable "container_image" { }

variable "ingress_traffic" { 
  default = "INGRESS_TRAFFIC_ALL"
}

variable "APP_PORT" {
  default = 80
}

variable "vpc_name" { }

variable "environment" { default = {} }

variable "vpc_access_connector" { }