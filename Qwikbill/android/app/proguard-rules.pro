# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to the default ProGuard rules.
# For more details, see https://developer.android.com/studio/build/shrink-code

#########################################
# React Native Core
#########################################
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }
-keep class com.facebook.soloader.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }

# Keep Native Modules (Turbo + Fabric)
-keepclassmembers class * implements com.facebook.react.bridge.JavaScriptModule { *; }
-keepclassmembers class * implements com.facebook.react.bridge.NativeModule { *; }
-keepclassmembers class * extends com.facebook.react.bridge.JavaScriptModule { *; }

#########################################
# Reanimated
#########################################
-keep class com.swmansion.reanimated.** { *; }
-keep class com.swmansion.gesturehandler.** { *; }

#########################################
# Firebase (adjust depending on which you use)
#########################################
-keep class com.google.firebase.** { *; }
-dontwarn com.google.firebase.messaging.**
-dontwarn com.google.firebase.iid.**
-dontwarn com.google.firebase.installations.**
-dontwarn com.google.firebase.auth.**

#########################################
# Play Services (Location, Auth, etc.)
#########################################
-keep class com.google.android.gms.** { *; }
-dontwarn com.google.android.gms.**

#########################################
# Razorpay
#########################################
-keep class com.razorpay.** { *; }
-dontwarn com.razorpay.**
# Ignore missing proguard.annotation.Keep / KeepClassMembers
-dontwarn proguard.annotation.Keep
-dontwarn proguard.annotation.KeepClassMembers

#########################################
# OkHttp / Networking
#########################################
-keep class okhttp3.** { *; }
-dontwarn okhttp3.**

#########################################
# Gson / JSON Parsing
#########################################
-keep class com.google.gson.** { *; }
-keepattributes Signature
-keepattributes *Annotation*

#########################################
# Glide / Image Libraries (if using)
#########################################
-keep public class * implements com.bumptech.glide.module.GlideModule
-keep class com.bumptech.glide.** { *; }
-dontwarn com.bumptech.glide.**

#########################################
# Expo Modules
#########################################
-keep class expo.modules.** { *; }
-dontwarn expo.modules.**

#########################################
# Misc
#########################################
# Keep annotations
-keepattributes *Annotation*

# Keep line numbers (useful for crash reporting)
-keepattributes SourceFile,LineNumberTable
