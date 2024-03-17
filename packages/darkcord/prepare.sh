#!/bin/bash

# Linux version of prepare.bat

# Script to check if the typings folder exists and compile the project, if the folder exists, delete it

echo Compiling...

if [[ -d typings ]]
then
    # Delete typings folder
    rm -R typings
fi

pnpm run c