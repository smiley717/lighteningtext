#!/usr/bin/env sh

# abort on errors
set -e

npm run build
cd dist

if [ -d ".git" ]; then
  rm -rf .git
else
  git init
fi

git add -A
git commit -m 'deploy'

BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push -f git@github.com:SidneyNemzer/enlighteningfacts.com.git "$BRANCH:gh-pages"
