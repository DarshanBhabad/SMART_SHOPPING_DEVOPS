pipeline {
    agent any

    environment {
        DOCKER_HUB_USER = credentials('dockerhub-user')
        DOCKER_HUB_PASS = credentials('dockerhub-pass')
        BACKEND_IMAGE = 'bboy07/smart-shopping-backend'
        FRONTEND_IMAGE = 'bboy07/smart-shopping-frontend'
        K8S_SERVER = credentials('k8s-server-ip')
        K8S_SSH_KEY = credentials('k8s-ssh-key')
        SUPABASE_URL = credentials('supabase-url')
        SUPABASE_SERVICE_KEY = credentials('supabase-service-key')
    }

    stages {

        stage('Clone') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing backend dependencies...'
                dir('backend') {
                    sh 'npm install'
                }
            }
        }

        stage('Test') {
            steps {
                echo 'Running backend tests...'
                dir('backend') {
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building Docker images...'
                sh 'docker build -t ${BACKEND_IMAGE}:latest ./backend'
                sh '''
                    docker build \
                        --build-arg REACT_APP_SUPABASE_URL=${REACT_APP_SUPABASE_URL} \
                        --build-arg REACT_APP_SUPABASE_ANON_KEY=${REACT_APP_SUPABASE_ANON_KEY} \
                        --build-arg REACT_APP_API_URL=/api \
                        -t ${FRONTEND_IMAGE}:latest ./frontend
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing images to Docker Hub...'
                sh 'echo $DOCKER_HUB_PASS | docker login -u $DOCKER_HUB_USER --password-stdin'
                sh 'docker push ${BACKEND_IMAGE}:latest'
                sh 'docker push ${FRONTEND_IMAGE}:latest'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                echo 'Deploying to Kubernetes...'
                sh '''
                    ssh -o StrictHostKeyChecking=no -i $K8S_SSH_KEY ec2-user@$K8S_SERVER \
                    "cd SMART_SHOPPING_DEVOPS && \
                     git pull origin main && \
                     kubectl apply -f k8s/ && \
                     kubectl rollout restart deployment/backend && \
                     kubectl rollout restart deployment/frontend"
                '''
            }
        }

    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed!'
        }
    }
}
