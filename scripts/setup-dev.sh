#!/bin/bash

# DateDreamer Development Setup Script

echo "🚀 Setting up DateDreamer development environment..."

# Install dependencies
echo "📦 Installing dependencies..."
yarn install

# Setup Husky hooks
echo "🔧 Setting up Git hooks..."
npx husky install

# Make pre-commit hook executable
chmod +x .husky/pre-commit

# Run initial linting and formatting
echo "🎨 Running initial code formatting..."
yarn format

echo "✅ Development environment setup complete!"
echo ""
echo "Available commands:"
echo "  yarn start     - Start development server"
echo "  yarn build     - Build for production"
echo "  yarn test      - Run tests"
echo "  yarn lint      - Run linting"
echo "  yarn format    - Format code"
echo ""
echo "Happy coding! 🎉" 