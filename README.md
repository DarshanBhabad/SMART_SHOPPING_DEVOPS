# Smart Shopping 🛒

A full-stack shopping application built with React, Node.js, and Supabase — containerized with Docker, orchestrated with Kubernetes, automated with Jenkins CI/CD, and infrastructure provisioned with Terraform.

---

## Project Structure

```
SMART_SHOPPING_DEVOPS/
├── backend/                  # Node.js + Express REST API
│   ├── src/
│   │   ├── routes/
│   │   │   ├── products.js
│   │   │   └── cart.js
│   │   ├── index.js
│   │   └── supabase.js
│   ├── tests/
│   │   └── app.test.js       # Jest tests
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/                 # React.js app
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   └── pages/
│   ├── Dockerfile            # Multi-stage build with nginx
│   ├── nginx.conf
│   └── .env.example
├── k8s/                      # Kubernetes manifests
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── secret.yaml
├── terraform/                # Infrastructure as Code
│   ├── main.tf
│   ├── variables.tf
│   └── outputs.tf
├── Jenkinsfile               # CI/CD pipeline
├── docker-compose.yml        # Local development
└── supabase_schema.sql       # Database schema
```

---

## Application Features

- 🔐 Login / Register (Supabase Auth)
- 🛍️ Product listing
- 🛒 Shopping cart (add/remove)
- 🏠 Landing page

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, React Router, Supabase JS |
| Backend | Node.js, Express |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes (Minikube) |
| CI/CD | Jenkins |
| IaC | Terraform |
| Cloud | AWS EC2 |

---

## Local Development Setup

### 1. Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run `supabase_schema.sql`
3. Get your keys from **Settings → API**

### 2. Backend
```bash
cd backend
cp .env.example .env
# Fill in SUPABASE_URL and SUPABASE_SERVICE_KEY
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
cp .env.example .env
# Fill in REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY
npm install
npm start
```

---

## Docker

### Build and run with Docker Compose
```bash
# Add your Supabase keys to root .env file
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

### Build images manually
```bash
docker build -t smart-shopping-backend ./backend
docker build -t smart-shopping-frontend ./frontend
```

### Push to Docker Hub
```bash
docker login
docker tag smart-shopping-backend bboy07/smart-shopping-backend:latest
docker tag smart-shopping-frontend bboy07/smart-shopping-frontend:latest
docker push bboy07/smart-shopping-backend:latest
docker push bboy07/smart-shopping-frontend:latest
```

### Docker Hub Images
- `bboy07/smart-shopping-backend`
- `bboy07/smart-shopping-frontend`

---

## Kubernetes

Deployed on **Minikube** running on AWS EC2 (`t2.medium`).

### Architecture

```
Browser
   ↓
EC2 Port 3000 (port-forward)
   ↓
frontend Service (NodePort :80)
   ↓
frontend Pod (nginx → React static files)
   ↓ (nginx proxies /api requests)
backend Service (ClusterIP :5000)
   ↓
backend Pod (Node.js Express)
   ↓
Supabase (PostgreSQL)
```

### Deploy to Kubernetes

```bash
# Start Minikube
minikube start --driver=docker

# Apply all manifests
kubectl apply -f k8s/secret.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/backend-service.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml

# Check status
kubectl get pods
kubectl get services
```

### Access the app
```bash
kubectl port-forward service/frontend 3000:80 --address 0.0.0.0 &
kubectl port-forward service/backend 5001:5000 --address 0.0.0.0 &
```

Then open: `http://<ec2-public-ip>:3000`

### K8s Files Explained

| File | Purpose |
|------|---------|
| `secret.yaml` | Stores Supabase credentials securely |
| `backend-deployment.yaml` | Runs 1 pod of backend, pulls from Docker Hub |
| `backend-service.yaml` | Exposes backend internally as ClusterIP |
| `frontend-deployment.yaml` | Runs 1 pod of frontend, pulls from Docker Hub |
| `frontend-service.yaml` | Exposes frontend externally as NodePort |

---

## Jenkins CI/CD Pipeline

Jenkins runs on a separate AWS EC2 instance (`t2.medium`) on port `8080`.

### Pipeline Stages

```
1. Clone       → Pull latest code from GitHub
2. Install     → npm install backend dependencies
3. Test        → Run Jest tests
4. Build       → docker build backend + frontend images
5. Push        → docker push to Docker Hub
6. Deploy      → SSH into K8s EC2, kubectl apply + rollout restart
```

### Jenkins Credentials Required

| ID | Type | Value |
|----|------|-------|
| `dockerhub-user` | Secret text | Docker Hub username |
| `dockerhub-pass` | Secret text | Docker Hub password |
| `k8s-server-ip` | Secret text | K8s EC2 public IP |
| `k8s-ssh-key` | SSH Username with private key | EC2 key pair (.pem) |
| `supabase-url` | Secret text | Supabase project URL |
| `supabase-service-key` | Secret text | Supabase service role key |
| `react-supabase-url` | Secret text | Supabase project URL |
| `supabase-anon-key` | Secret text | Supabase anon key |

### Pipeline Setup
1. Install plugins: `Docker Pipeline`, `GitHub Integration`
2. Add all credentials listed above
3. Create new Pipeline job → Pipeline script from SCM → point to this repo
4. Add GitHub webhook: `http://<jenkins-ip>:8080/github-webhook/`
5. Every push to `main` triggers the pipeline automatically

---

## Terraform (Infrastructure as Code)

Terraform provisions the AWS infrastructure — the same EC2 instances, security groups that were manually created are defined as code.

### Resources Provisioned
- 1 Security Group (ports: 22, 80, 8080, 3000, 5000, 30000-32767)
- 1 EC2 instance for Kubernetes (`t2.medium`)
- 1 EC2 instance for Jenkins (`t2.medium`)

### Run Terraform

```bash
cd terraform

# Configure AWS credentials
aws configure

# Initialize Terraform
terraform init

# Preview changes
terraform plan

# Apply infrastructure
terraform apply

# Destroy infrastructure
terraform destroy
```

### Outputs
After `terraform apply`:
```
k8s_server_public_ip     = "x.x.x.x"
jenkins_server_public_ip = "x.x.x.x"
```

---

## AWS Infrastructure

| Resource | Purpose |
|----------|---------|
| EC2 `t2.medium` (K8s) | Runs Minikube + application pods |
| EC2 `t2.medium` (Jenkins) | Runs Jenkins CI/CD server |
| Security Group | Controls inbound/outbound traffic |

### Security Group Ports

| Port | Purpose |
|------|---------|
| 22 | SSH access |
| 8080 | Jenkins UI |
| 3000 | Frontend app |
| 5000 | Backend API |
| 30000-32767 | Kubernetes NodePort range |

---

## CI/CD Flow

```
Developer pushes code to GitHub
           ↓
GitHub webhook triggers Jenkins
           ↓
Jenkins clones repo
           ↓
Jenkins installs dependencies
           ↓
Jenkins runs Jest tests
           ↓
Jenkins builds Docker images
           ↓
Jenkins pushes images to Docker Hub
           ↓
Jenkins SSHs into K8s EC2
           ↓
kubectl apply + rollout restart
           ↓
New pods pull latest images from Docker Hub
           ↓
App is updated with zero manual steps
```
