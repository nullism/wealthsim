#!/bin/bash

die() {
    echo "ERROR $1"
    exit 1
}

cd /home/nullism/github/wealthsim || die "Could not CD"
git pull origin master || die "Could not git pull"
/usr/bin/webpack || die "Could not webpack!"

exit 0
