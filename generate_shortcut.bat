@echo off
set "SCRIPT_NAME=EcovibesXpress.lnk"
set "TARGET_PATH=%~dp0start_app.bat"
set "ICON_PATH=%~dp0resources\logo-ecovibesxpress.ico"
set "WORKING_DIR=%~dp0"

echo.
echo  ====================================================
echo    EcovibesXpress — Shortcut Generator
echo  ====================================================
echo.
echo  Creating shortcut: %SCRIPT_NAME%
echo  Target:           %TARGET_PATH%
echo  Icon:             %ICON_PATH%
echo.

powershell -Command "$s=(New-Object -COM WScript.Shell).CreateShortcut('%~dp0%SCRIPT_NAME%');$s.TargetPath='%TARGET_PATH%';$s.IconLocation='%ICON_PATH%';$s.WorkingDirectory='%WORKING_DIR%';$s.Save()"

if exist "%~dp0%SCRIPT_NAME%" (
    echo  [SUCCESS] Shortcut created successfully in this folder!
    echo            You can now use '%SCRIPT_NAME%' to launch the app.
) else (
    echo  [ERROR] Failed to create the shortcut.
)

echo.
pause
