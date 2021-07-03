#!/bin/bash
echo "yarn install start"
yarn install
echo "yarn install end"
echo "executing aws upload start"
export NODE_ENV=production
nodejs ./src/index.js
echo "executing aws upload end"