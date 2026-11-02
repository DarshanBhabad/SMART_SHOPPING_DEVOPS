variable "aws_region" {
  description = "AWS region to deploy resources"
  default     = "eu-north-1"
}

variable "ami_id" {
  description = "Amazon Linux 2 AMI ID for eu-north-1"
  default     = "ami-0c1ac8728ef7f3d8d"
}

variable "key_name" {
  description = "EC2 Key Pair name"
  default     = "devopskp"
}
