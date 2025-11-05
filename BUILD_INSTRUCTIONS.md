# App Icon and APK Build Guide

## ✅ APK Built Successfully!

Your debug APK is located at:
**`android/app/build/outputs/apk/debug/app-debug.apk`**

## Adding App Icon

### Quick Method: Online Tool

1. Visit: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Upload your icon image (1024x1024px PNG recommended)
3. Configure:
   - **Name**: Tablet Splitter
   - **Shape**: Square or Circle (your choice)
   - **Background Color**: Choose a color or transparent
4. Click **Download** to get the ZIP file
5. Extract the ZIP and replace files in these folders:

   - `android/app/src/main/res/mipmap-mdpi/`
   - `android/app/src/main/res/mipmap-hdpi/`
   - `android/app/src/main/res/mipmap-xhdpi/`
   - `android/app/src/main/res/mipmap-xxhdpi/`
   - `android/app/src/main/res/mipmap-xxxhdpi/`

   Replace both `ic_launcher.png` and `ic_launcher_round.png` in each folder.

### Manual Method

Create icons in these sizes:

- **mdpi**: 48x48px
- **hdpi**: 72x72px
- **xhdpi**: 96x96px
- **xxhdpi**: 144x144px
- **xxxhdpi**: 192x192px

Save as `ic_launcher.png` (square) and `ic_launcher_round.png` (round) in each folder.

## Building APK

### Debug APK (Current - Already Built!)

```bash
cd android
./gradlew assembleDebug
```

**Location**: `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK (For distribution)

1. **Generate keystore** (one-time setup):

```bash
cd android/app
keytool -genkeypair -v -storetype PKCS12 -keystore tablet-splitter-release-key.keystore -alias tablet-splitter-key -keyalg RSA -keysize 2048 -validity 10000
```

2. **Create/Edit** `android/gradle.properties`:

```
MYAPP_RELEASE_STORE_FILE=tablet-splitter-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=tablet-splitter-key
MYAPP_RELEASE_STORE_PASSWORD=your-password-here
MYAPP_RELEASE_KEY_PASSWORD=your-password-here
```

3. **Build Release APK**:

```bash
cd android
./gradlew assembleRelease
```

**Location**: `android/app/build/outputs/apk/release/app-release.apk`

## Installing APK

1. Enable **"Install from unknown sources"** on your Android device
2. Transfer `app-debug.apk` to your device
3. Open the APK file and install

## Notes

- **Debug APK**: Larger size, includes debug symbols, good for testing
- **Release APK**: Optimized, smaller, ready for distribution
- Keep your keystore file safe - you'll need it for app updates!
- The app name is now set to "Tablet Splitter" ✅
