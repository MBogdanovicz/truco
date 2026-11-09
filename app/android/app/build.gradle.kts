import java.util.Properties

plugins {
    id("com.android.application")
    // The Flutter Gradle Plugin must be applied after the Android and Kotlin Gradle plugins.
    id("dev.flutter.flutter-gradle-plugin")
}

android {
    namespace = "com.mbogdanovicz.truco"
    compileSdk = flutter.compileSdkVersion
    ndkVersion = flutter.ndkVersion

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }

    defaultConfig {
        // TODO: Specify your own unique Application ID (https://developer.android.com/studio/build/application-id.html).
        applicationId = "com.mbogdanovicz.truco"
        // You can update the following values to match your application needs.
        // For more information, see: https://flutter.dev/to/review-gradle-config.
        minSdk = flutter.minSdkVersion
        targetSdk = flutter.targetSdkVersion
        // Uses the version code from pubspec.yaml. When using split APKs, 1000 * ABI_VERSION
        // is added automatically by Flutter. (https://developer.android.com/studio/build/configure-apk-splits#configure-APK-versions)
        // You can force using the value of versionCode by specifying the `-P force-version-code-ignoring-abi=true`
        // flag during build.
        versionCode = flutter.versionCode
        versionName = flutter.versionName
    }

    // Play Store builds (TRUCO_PLAY_SIGNING=1) are signed with the private
    // upload key described by android/key.properties (never committed).
    val keyProps = Properties().apply {
        val f = rootProject.file("key.properties")
        if (f.exists()) f.inputStream().use { load(it) }
    }
    val playSigning = System.getenv("TRUCO_PLAY_SIGNING") == "1"

    signingConfigs {
        // Fixed key for test builds, committed on purpose so every CI/local
        // build can update the previous install. NOT for Play Store releases.
        create("test") {
            storeFile = file("test-signing.keystore")
            storePassword = "trucotest"
            keyAlias = "truco-test"
            keyPassword = "trucotest"
        }
        if (playSigning) {
            check(keyProps.isNotEmpty()) { "android/key.properties is missing" }
            create("upload") {
                storeFile = file(keyProps.getProperty("storeFile"))
                storePassword = keyProps.getProperty("storePassword")
                keyAlias = keyProps.getProperty("keyAlias")
                keyPassword = keyProps.getProperty("keyPassword")
            }
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName(if (playSigning) "upload" else "test")
        }
    }
}

kotlin {
    compilerOptions {
        jvmTarget = org.jetbrains.kotlin.gradle.dsl.JvmTarget.JVM_17
    }
}

flutter {
    source = "../.."
}

dependencies {
    // Nearby Connections: offline scorekeeper rooms between Android phones.
    implementation("com.google.android.gms:play-services-nearby:19.3.0")
    implementation("androidx.core:core-ktx:1.13.1")
}
