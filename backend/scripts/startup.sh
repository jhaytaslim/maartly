#!/bin/bash

# Maartly Backend Startup Script
# This script handles the complete setup and startup of the backend

set -e  # Exit on error

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}$1${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Banner
clear
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║              🚀 maartly BACKEND SETUP 🚀               ║"
echo "║                                                            ║"
echo "║         Inventory Management System Backend v1.0           ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is installed
print_header "Step 1: Checking Prerequisites"

if command -v docker &> /dev/null; then
    print_success "Docker is installed"
    DOCKER_VERSION=$(docker --version)
    print_info "$DOCKER_VERSION"
else
    print_error "Docker is not installed"
    print_info "Please install Docker from https://docker.com"
    exit 1
fi

if command -v docker-compose &> /dev/null; then
    print_success "Docker Compose is installed"
else
    print_error "Docker Compose is not installed"
    exit 1
fi

if command -v node &> /dev/null; then
    print_success "Node.js is installed"
    NODE_VERSION=$(node --version)
    print_info "$NODE_VERSION"
else
    print_error "Node.js is not installed"
    print_info "Please install Node.js from https://nodejs.org"
    exit 1
fi

# Check for .env file
print_header "Step 2: Environment Configuration"

if [ ! -f ".env" ]; then
    print_info ".env file not found, creating from template..."
    cp .env.example .env
    print_success ".env file created"
    print_info "⚠️  Please edit .env file with your configuration before proceeding"
    print_info "Press Enter to continue after editing .env, or Ctrl+C to exit"
    read
else
    print_success ".env file exists"
fi

# Start Docker services
print_header "Step 3: Starting Docker Services"

print_info "Starting MongoDB, Redis, and RabbitMQ..."

if docker-compose up -d; then
    print_success "Docker services started successfully"
else
    print_error "Failed to start Docker services"
    exit 1
fi

# Wait for services to be ready
print_info "Waiting for services to be ready..."
sleep 5

# Check if services are running
print_info "Checking service status..."

if docker ps | grep -q "maartly-mongodb"; then
    print_success "MongoDB is running"
else
    print_error "MongoDB failed to start"
    exit 1
fi

if docker ps | grep -q "maartly-redis"; then
    print_success "Redis is running"
else
    print_error "Redis failed to start"
    exit 1
fi

if docker ps | grep -q "maartly-rabbitmq"; then
    print_success "RabbitMQ is running"
else
    print_error "RabbitMQ failed to start"
    exit 1
fi

# Install dependencies
print_header "Step 4: Installing Dependencies"

if [ ! -d "node_modules" ]; then
    print_info "Installing npm packages..."
    if npm install; then
        print_success "Dependencies installed"
    else
        print_error "Failed to install dependencies"
        exit 1
    fi
else
    print_success "Dependencies already installed"
fi

# Generate Prisma Client
print_header "Step 5: Setting up Database"

print_info "Generating Prisma Client..."
if npx prisma generate; then
    print_success "Prisma Client generated"
else
    print_error "Failed to generate Prisma Client"
    exit 1
fi

print_info "Pushing schema to database..."
if npx prisma db push; then
    print_success "Database schema updated"
else
    print_error "Failed to update database schema"
    exit 1
fi

# Start the backend
print_header "Step 6: Starting Backend Server"

print_info "Starting NestJS backend in development mode..."
print_info "Press Ctrl+C to stop the server"
echo ""

npm run start:dev &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Check if backend is running
if curl -s http://localhost:3000/api/v1/health > /dev/null 2>&1; then
    print_success "Backend server is running!"
else
    print_error "Backend server failed to start"
    print_info "Check the logs above for errors"
    exit 1
fi

# Display information
print_header "✨ Setup Complete!"

echo ""
echo "🎉 Maartly Backend is now running!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📍 Service URLs:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  Backend API:         http://localhost:3000/api/v1"
echo "  RabbitMQ Management: http://localhost:15672"
echo "  Mongo Express:       http://localhost:8081"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔐 Default Credentials:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  RabbitMQ: maartly / maartly_rabbitmq_password"
echo "  Mongo Express: admin / admin123"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 Next Steps:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "  1. Test the API: ./test-api.sh"
echo "  2. Check the logs in this terminal"
echo "  3. Start the frontend application"
echo "  4. Read BACKEND_INTEGRATION_COMPLETE.md for full docs"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
print_info "Press Ctrl+C to stop the server and exit"
echo ""

# Wait for the backend process
wait $BACKEND_PID
