@echo off
setlocal enabledelayedexpansion

set "source=assets\RescuePC_Logo_Light.png"
set "target_dir=assets\icons"

rem Create target directory if it doesn't exist
if not exist "%target_dir%" mkdir "%target_dir%"

rem List of sizes to create
set sizes=72 96 128 144 152 192 384 512

rem Copy and resize the logo for each size
for %%s in (%sizes%) do (
    echo Creating icon-%%sx%%s.png
    copy "%source%" "%target_dir%\icon-%%sx%%s.png" >nul
)

echo Icons created in %target_dir%\
pause
