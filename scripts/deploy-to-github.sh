#!/usr/bin/env bash

set -e # exit on errors (dont continue script)
set -o xtrace # print every command before exec

hasOldFiles='true'
createGhPages() {
  # based on https://gist.github.com/ramnathv/2227408
  git symbolic-ref HEAD refs/heads/gh-pages
  rm .git/index
  git clean -fdx
  hasOldFiles='false'
}

headCommit=$(git rev-parse --short HEAD)
branchName=$(git branch --show-current)

npm run build

git switch gh-pages || createGhPages
trap "git switch ${branchName}" EXIT # on error, return to last branch

$hasOldFiles && rm -v *.js
cp -v dist/* ./

git add --verbose index.html *.js
git commit --message="gh-pages: sync with ${branchName} ${headCommit}" --edit

git push
