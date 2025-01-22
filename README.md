# HODLAI

HODLAI is a dashboard for tracking and predicting wallet balances across multiple chains.

## Features

- Multi-chain wallet tracking (Polygon, BSC, Ethereum)
- Balance prediction using TensorFlow.js
- Subscription system with smart contract integration
- Real-time wallet monitoring
- Docker containerization

## Stack

- React.js
- TailwindCSS
- Express.js
- JWT
- PostgreSQL
- Hardhat
- Solidity
- Docker

## Local Development Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd crypto-dashboard
```

2. Create environment files:

Create `.env` file in the root directory:
```bash
CONTRACT_ADDRESS=
POLYGON_RPC=
BSC_RPC=
ETH_RPC=
PRIVATE_KEY=
POLYGONSCAN_API_KEY=
DATABASE_URL=
NODE_ENV=
JWT_SECRET=
SESSION_SECRET=
MORALIS_API_KEY=
```

3. Install dependencies:
```bash
cd smart-contracts
npm install

cd ../backend
npm install

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
cd ../backend
npm run dev

cd ../frontend
npm start

# For db run container from root directory
sudo docker-compose up db
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
