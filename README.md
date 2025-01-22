# HODLAI

HODLAI is a dashboard for tracking and predicting wallet balances across multiple chains.

## Features

- Multi-chain wallet tracking (Polygon, BSC, Ethereum)
- Balance prediction using TensorFlow.js
- Subscription system with smart contract integration
- Real-time wallet monitoring
- Docker containerization

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-dashboard
```

2. Create environment files:

Create `.env` file in the root directory:
```bash
# Smart Contract
CONTRACT_ADDRESS=your_contract_address
USDT_ADDRESS=your_usdt_address

# JWT
JWT_SECRET=your_jwt_secret

# RPCs
POLYGON_RPC=your_polygon_rpc_url
BSC_RPC=your_bsc_rpc_url
ETH_RPC=your_eth_rpc_url
```

3. Install dependencies:
```bash
# Install smart contract dependencies
cd smart-contracts
npm install

# Install backend dependencies
cd ../backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

4. Deploy smart contract (on Polygon network):
```bash
cd smart-contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network polygon
```

5. Start the development environment:
```bash
# From root directory
docker-compose up -d
```

The application will be available at:
- Frontend: http://localhost
- API: http://localhost/api

## Testing

1. Smart Contract Tests:
```bash
cd smart-contracts
npx hardhat test
```

## Google Cloud Deployment

1. Prerequisites:
- Google Cloud account
- Google Cloud CLI installed
- Docker installed locally

2. Initial Setup:

```bash
# Install Google Cloud CLI (if not installed)
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init

# Configure Docker to use Google Container Registry
gcloud auth configure-docker
```

3. Create GCP Resources:

```bash
# Set project ID
export PROJECT_ID=your-project-id
gcloud config set project $PROJECT_ID

# Enable required services
gcloud services enable compute.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable cloudrun.googleapis.com

# Create Cloud SQL instance (PostgreSQL)
gcloud sql instances create crypto-dashboard-db \
    --database-version=POSTGRES_14 \
    --tier=db-f1-micro \
    --region=us-central1 \
    --root-password=your-root-password

# Create database
gcloud sql databases create web3dashboard \
    --instance=crypto-dashboard-db
```

4. Build and Push Docker Images:

```bash
# Build images
docker-compose build

# Tag images
docker tag crypto-dashboard_frontend gcr.io/$PROJECT_ID/frontend:latest
docker tag crypto-dashboard_backend gcr.io/$PROJECT_ID/backend:latest

# Push to Container Registry
docker push gcr.io/$PROJECT_ID/frontend:latest
docker push gcr.io/$PROJECT_ID/backend:latest
```

5. Deploy to Cloud Run:

```bash
# Deploy backend
gcloud run deploy backend \
    --image gcr.io/$PROJECT_ID/backend:latest \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars "DATABASE_URL=postgresql://user:password@/web3dashboard?host=/cloudsql/$PROJECT_ID:us-central1:crypto-dashboard-db" \
    --add-cloudsql-instances $PROJECT_ID:us-central1:crypto-dashboard-db

# Deploy frontend
gcloud run deploy frontend \
    --image gcr.io/$PROJECT_ID/frontend:latest \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated
```

6. Set up HTTPS Load Balancer:

```bash
# Reserve IP address
gcloud compute addresses create crypto-dashboard-ip \
    --global

# Create SSL certificate (if you have a domain)
gcloud compute ssl-certificates create crypto-dashboard-cert \
    --domains=yourdomain.com

# Create backend services
gcloud compute backend-services create frontend-backend \
    --global
gcloud compute backend-services create backend-backend \
    --global

# Create URL map
gcloud compute url-maps create crypto-dashboard-lb \
    --default-service frontend-backend

# Create target proxy
gcloud compute target-https-proxies create crypto-dashboard-proxy \
    --url-map crypto-dashboard-lb \
    --ssl-certificates crypto-dashboard-cert
```

7. Environment Variables:

Create a `.env.prod` file for Cloud Run:
```bash
# Add to Cloud Run secrets
gcloud secrets create crypto-dashboard-env \
    --data-file .env.prod
```

8. Monitoring and Maintenance:

```bash
# View logs
gcloud logging tail "resource.type=cloud_run_revision"

# Update deployment
gcloud run services update backend \
    --image gcr.io/$PROJECT_ID/backend:latest
gcloud run services update frontend \
    --image gcr.io/$PROJECT_ID/frontend:latest

# Database backup
gcloud sql export sql crypto-dashboard-db \
    gs://$PROJECT_ID-backups/backup.sql \
    --database=web3dashboard
```

## Security Considerations

1. Environment Variables:
   - Use Google Cloud Secret Manager
   - Rotate keys regularly
   - Use service accounts with minimal permissions

2. Smart Contract:
   - Contract is audited and uses OpenZeppelin standards
   - Implements reentrancy protection
   - Owner access control for critical functions

3. Google Cloud:
   - Enable Cloud Audit Logs
   - Use VPC Service Controls
   - Configure Identity and Access Management (IAM)
   - Enable Cloud Armor for DDoS protection
   - Regular security scans

## Troubleshooting

1. Cloud Run Issues:
```bash
# Check service status
gcloud run services describe backend
gcloud run services describe frontend

# View logs
gcloud logging read "resource.type=cloud_run_revision"

# Redeploy service
gcloud run deploy backend --image gcr.io/$PROJECT_ID/backend:latest
```

2. Database Issues:
```bash
# Connect to database
gcloud sql connect crypto-dashboard-db --user=user

# Backup database
gcloud sql export sql crypto-dashboard-db gs://$PROJECT_ID-backups/backup.sql
```

## Support

For issues and feature requests, please create an issue in the repository. 