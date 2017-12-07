:: @author Philip Van Raalte
:: This script removes/empties the build folder then copies the files for the build into a fresh build folder.
@echo off
cd "../"
if exist "build" rmdir "build" /S /Q
mkdir "build"
cd "build"
del *.* /F /Q
if not exist "style" mkdir "style"
if not exist "assets" mkdir "assets"
cd "../"
For %%a in (bundle.js, index.html, LICENSE) do xcopy %%a build /Y
xcopy "style" "build/style" /E /F /C /Q /Y
xcopy "assets" "build/assets" /E /F /C /Q /Y
:: "c:\Program Files\7-Zip\7z.exe" a -tzip "build/build.zip" "./build/*"
echo "Build was successful"