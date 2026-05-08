#!/bin/bash
echo "================================="
echo "  Instalando dependencias..."
echo "================================="
npm install

echo ""
echo "================================="
echo "  Abrindo Cypress..."
echo "================================="
npx cypress open
