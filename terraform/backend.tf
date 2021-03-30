terraform {
  backend "s3" {
    bucket  = "meli-tfstate"
    region  = "us-east-1"
    encrypt = true
    key     = "deploy_stats.tfstate"
  }
}
