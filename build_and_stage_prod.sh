#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "--- Building Angular application (Production) ---"
cd angular
ng build mock-bar --configuration production
cd ..

echo "--- Cleaning up old build artifacts in /bar ---"
rm -rf bar/*

echo "--- Copying new build artifacts to /bar ---"
cp -r angular/dist/mock-bar/. bar/

echo "--- Staging all changes ---"
git add --all

echo "--- Committing changes ---"
git commit -m "feat: Automated production build and stage for Angular application changes"

echo "--- Pushing changes to remote ---"
git push origin HEAD:master

echo "--- Production build, staging, commit, and push complete. ---"
