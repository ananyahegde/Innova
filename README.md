# EleganceWear

**EleganceWear** is an e-commerce platform enhanced with a **Data Privacy & Transparency Dashboard** which empowers users to control how their personal data is used while shopping online. <br> 
Check out our website here: [visit website](https://elegancewear.onrender.com/) <br> 

## ✨ Features

- Smooth website experience with account creation, user authentication, product browsing, cart management, and checkout.
- Integrated Data Privacy & Transparency Dashboard for real-time data usage visibility.
- Users can view and control:
  - Consent Settings (email, location, device info)
  - Purpose Limitation (ads, personalization)
  - Access Logs (who accessed data and when)
  - Real-time Data Usage chart (data events tracked)
- Responsive frontend built using Tailwind CSS
- REST API with Express.js and MongoDB
- **Containerized deployment with Docker and Docker Compose**
- **Kubernetes orchestration with automated scaling and load balancing**
- **Infrastructure automation using Ansible**
- **CI/CD pipeline with GitHub Actions for automated builds**
- Deployed using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for the database and [Render](https://render.com/) for hosting both the frontend and backend.

## 🚀 Setup Instructions

### Option 1: Traditional Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/ananyahegde/The-Innovengers.git
cd The-Innovengers
```

#### 2. Backend Setup
```bash
cd backend
npm init -y
npm install express dotenv cors mongoose bcrypt
npm install --save-dev nodemon
```

#### 3. MongoDB Configuration
- Install [MongoDB Compass](https://www.mongodb.com/docs/manual/administration/install-community/).
- run `cd backend` in terminal
- run `node server.js` or  `npm start devStart`.  
- Import the file `frontend/assets/products.json` into the **products** collection using MongoDB Compass.

#### 4. Environment Variables
Create a `.env` file in the `backend/` directory with the following content:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
```

#### 5. Run Backend Server
```bash
npm run devStart
```

#### 6. Run Frontend
Go to `http://localhost:3000` in your browser.

---

### Option 2: Docker Compose
```bash
docker-compose up -d
```

Access the application at `http://localhost:8080`

To stop:
```bash
docker-compose down
```

---

### Option 3: Kubernetes with Ansible

Automated deployment:
```bash
cd ansible
ansible-playbook -i inventory.ini playbook.yml -K
minikube ip  # Use this IP with port 30080
```

Manual deployment:
```bash
minikube start --driver=docker
kubectl apply -f k8s/
minikube ip  # Access at <ip>:30080
```

Check status:
```bash
kubectl get pods
kubectl get services
```

## 📄 License
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

## 🤝 Contributions
PRs and suggestions are welcome.
