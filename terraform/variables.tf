locals {
  function_name = "${var.app_id}-${var.app_env}"
  common_tags = {
    environment     = var.app_env
    product_name    = "${var.app_id}-${var.app_env}"
    deployment_type = "terraform"
  }
}

variable "app_id" {
  description = "Nombre Lambda"
  type        = string
  default     = "meli-magneto-api"
}

variable "app_env" {
  description = "Ambiente Despliegue"
  type        = string
  default     = "dev"
}

variable "s3_tf" {
  description = "S3 Bucket para almacenar el estado del despliegue de terraform"
  type        = string
}

variable "region" {
  description = "Región de despliegue"
  type        = string
  default     = "us-east-1"
}

variable "lambda_package" {
  description = "Path archivo ZIP a ser desplegado en AWS"
  type        = string
}

variable "stat_name" {
  description = "Nombre de la estadistica a consultar"
  type        = string
}

variable "stats_table" {
  description = "Nombre de la tabla de estadisticas"
  type        = string
}





