terraform {
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
  }
}

resource "null_resource" "docker_rebuild" {
  provisioner "local-exec"{
    command = "docker build -t streamliste ../app"
  }
}