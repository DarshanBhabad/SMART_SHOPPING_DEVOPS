output "k8s_server_public_ip" {
  description = "Public IP of K8s server"
  value       = aws_instance.k8s_server.public_ip
}

output "jenkins_server_public_ip" {
  description = "Public IP of Jenkins server"
  value       = aws_instance.jenkins_server.public_ip
}
