#!/bin/bash

git add --all :/
if [ -z "$1" ]; then
    git commit -m "Automated push (lin)"
else
    git commit -m "$1"
fi
git push origin master
