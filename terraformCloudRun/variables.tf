variable "project" { }

variable "region" {
  default = "us-central1"
}

variable "zone" {
    default = "us-central1-a"
}

variable "startupscripturl_mysql" { }

variable "db_root_password" { }

variable "APP_PORT" { default="80" }
variable "DB" { }
variable "DB_USER" { }
variable "DB_PASSWORD" { }

variable "SESSION_SECRET" { }

variable "KEYS_BUCKET" { }
variable "PUB_KEY_FILE" { }
variable "PRV_KEY_FILE" { }