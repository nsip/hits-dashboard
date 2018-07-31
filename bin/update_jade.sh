#!/bin/sh

set -e

git pull

cd right

gulp build

git add dist
git commit -am 'Automatic build output files'
git push
