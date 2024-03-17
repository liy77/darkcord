@echo off

:: Script to check if the typings folder exists and compile the project, if the folder exists, delete it

echo Compiling...

if exist typings\ (
    :: Delete the 'typings' directory
    rd /q /s typings
)

pnpm run c