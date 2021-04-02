#!/usr/bin/env bash

set -e # exit on errors (dont continue script)
set -o xtrace # print every command before exec

headCommit=$(git rev-parse --short HEAD)
branchName=$(git branch --show-current)

npm run build

git switch gh-pages
trap "git switch ${branchName}" EXIT

rm -v *.js
cp -v dist/* ./

git add --verbose index.html *.js
git commit --message="gh-pages: sync with ${branchName} ${headCommit}" --edit

git push
