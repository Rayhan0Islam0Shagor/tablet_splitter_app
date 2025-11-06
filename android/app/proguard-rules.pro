# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# Keep react-native-gesture-handler classes
-keep class com.swmansion.gesturehandler.** { *; }
-keep class com.swmansion.reanimated.** { *; }
-dontwarn com.swmansion.gesturehandler.**

# Keep React Native classes
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-dontwarn com.facebook.react.**

# Keep your app classes
-keep class com.tablet_splitter.** { *; }

# Prevent R8 from optimizing JavaScript bridge calls
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable
-keep class com.facebook.react.bridge.** { *; }
-keep class com.facebook.react.uimanager.** { *; }

# Keep all JavaScript functions that might be called from native code
-keepclassmembers class * {
    @com.facebook.react.bridge.ReactMethod *;
}
