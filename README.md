![](/src/assets/images/ZooBC-wallet-mobile.png)

# Requirement
  nodejs v10.16.2
  npm 6.9.2
  ionic 5.23
  npm i -g cordova
  npm i -g native-run


How to build

- ionic cordova build android --prod --release
- keytool -genkey -v -keystore my-release-key.keystore -alias alias_name -keyalg RSA -keysize 2048 -validity 10000

- jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore my-release-key.keystore HelloWorld-release-unsigned.apk alias_name

- zipalign -v 4 HelloWorld-release-unsigned.apk HelloWorld.apk

- https://ionicframework.com/docs/publishing/play-store

#1. ionic cordova build android --prod --release

cd  zoobc-wallet-mobile/platforms/android/app/build/outputs/apk/release/

#2. keytool -genkey -v -keystore zoobc-release-key.keystore -alias zoobc_wallet -keyalg RSA -keysize 2048 -validity 10000

password 123jkjkh

keytool -importkeystore -srckeystore zoobc-release-key.keystore -destkeystore zoobc-release-key.keystore -deststoretype pkcs12

#3. jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore zoobc-release-key.keystore app-release-unsigned.apk zoobc_wallet

/Android/Sdk/build-tools/29.0.1/zipalign -v 4 app-release-unsigned.apk zoobc.apk

cd  /zoobc-wallet-mobile



# Technology
  - Ionic Framework v4
  - Angluar 7
  - lib for cryptography crypto-js etc

# Features!

  - Create account
  - Wallet Balance 
  - Send Money
  - Scan Barcode
  - Receive Money
  - Buy coin (redirect to marketplace example https://www.coinbase.com/)
  - Multi Language i18N
  - Multi Currency

### Installation

- Install nodejs 
- npm install -g ionic
- git clone https://github.com/zoobc/zoobc-wallet-mobile.git
- cd zoobc-wallet-mobile
- npm install
- ionic serve


# Android

## Install

1. Node and NPM must be installed (either through your package manager or from [nodejs.org](https://nodejs.org/en/download/)).
2. Android Studio must be installed and an emulator device configured 
3. install cordova: `sudo npm install cordova -g`
4. install ionic: `sudo npm install ionic -g`
5. add the Android Cordova platform : `ionic platform add android@latest`

Note that at least version 6.1.1 of cordova-android is necessary as indicated if using Android 7 or newer (otherwise you will see an app signing error).

## Build

Only necessary first time and when changing native plugin configuration:

```ShellSession
ionic cordova prepare android
ionic cordova build android
```

## Run

The following requires the device to be connected with USB:

```ShellSession
ionic run android --livereload -c -s --debug --device
```

or run using an already configured emulator (note: the emulator is not very useful as it only supports GSM, meaning that bootstrapping through local device discovery does not work):

```ShellSession
ionic emulate android --livereload -c -s --debug
```

Live reload is enabled, allowing you to instantly observe changes in HTML app source files (`*.ts, *.html. *.scss`). While very handy during development, this also means the app will not work on a device that is disconnected from the workstation or if the ionic server is stopped. So if you have problems with the app hanging after start, remove the `--livereload` parameter.


## Icons and graphics

The device decides the name of the icon to show for the specific device type in the overview and
discovery screens, served in the `get_public_device_info.json` query by the device. The icon must be bundled with
the app (in the `src/assets/img` folder).

Base images to use for generation of icons for the app store and on the client device are located in the `resources` project folder:

* icon.png: a 1024x1024 png file
* splash.png: a 2732x2732 png file - your actual image should fit within a 1200x1200 square in the middle, the image is then center cropped to match the various necessary device dimensions (use [this psd template](https://code.ionicframework.com/resources/splash.psd) to get the dimensions right).

Run `ionic cordova resources` to automatically generate the large amount of individual device specific images and icons based on the above 2 files.

See the [Ionic documentation](https://ionicframework.com/docs/cli/cordova/resources/) on `ionic cordova resources` for further details.

# Troubleshooting

## General

### Blank screen stuck at app startup

This has been observed if using an app deployed with the
`--livereload` parameter without being able to reach the live reload
server. So the solution is to either run the app without
`--livereload` or start the server again (see section "Running" above).

It can also be caused by some critical errors in the app at startup -
with modern Ionic tools, this should no longer be an issue though,
such errors would be expclitly reported. If you still observe the
problem, it might yield useful information to attach the Safari web
debugger and view the console.

### Blank screen for 5-10 seconds at app startup

This problem is often observed when using developer builds - the
longer initial startup time is a good tradeof for shorter subsequent
build cycles where AOT optimizations are not performed.

With a production build (`ionic run --prod`), the startup time is
optimized greatly, reducing the initial delay to an insignificant short
time.

### Problems generating icons

When using the [Ionic resources
tool](http://ionicframework.com/docs/cli/icon-splashscreen.html)
(`ionic resource --splash` and `ionic resource --icon`), sometimes
really odd errors about a server upload are seen: The tool uploads
icon and splash base images to a server to slice and dice to match the
individual platform requirements. When the server chokes on input, it
just says "upload error".

So check your input .png files if this error is observed: Compression
should be enabled, interlacing must be disabled.

### Build problems

Make sure you have the latest versions of npm and nodejs - e.g., on linux (as root):

```
apt-get update && apt-get install npm
npm install npm -g
curl -sL https://deb.nodesource.com/setup_6.x | bash -
apt-get install nodejs
```
You may need a symbolic link from nodejs to node:

```
ln -s /usr/bin/nodejs /usr/bin/node
```

## iOS

### Linker error

A linker error like the following means you missed a step in the installation procedure:

```
ld: symbol(s) not found for architecture arm64
clang: error: linker command failed with exit code 1 (use -v to see invocation)
Showing first 200 notices only
Showing first 200 errors only


** ARCHIVE FAILED **


The following build commands failed:

	Ld /Users/Zoobc/Library/Developer/Xcode/DerivedData/AMP_Heat-befzuqlqcagkojfbuvacxskkiqvh/Build/Intermediates/ArchiveIntermediates/AMP\ Heat/IntermediateBuildFilesPath/AMP\ Heat.build/Debug-iphoneos/AMP\ Heat.build/Objects-normal/arm64/AMP\ Heat normal arm64
```

You need to update the linker settings to force load the Cordova library:

```bash
echo 'OTHER_LDFLAGS = -force_load $(BUILT_PRODUCTS_DIR)/libCordova.a -lstdc++' >> \
  platforms/ios/cordova/build.xcconfig
```

### Signing error

The first time you attempt to run the app, you will see the following error:

```
Error: Error code 65 for command: xcodebuild with args: ..." ... " Signing for "AMP Heat" requires a development team. Select a development team in the project editor" 
```

Before the app can be run, a team must be selected for the project in XCode. If you are new to iOS app development, please see section "iOS Devices" in the [Ionic deployment docs](https://ionicframework.com/docs/v2/setup/deploying) for further instructions.

To fix, open the XCode project:

```ShellSession
./scripts/ios-open-xcode.sh
```

Click the project name in the left pane ("AMP Heat" per default) and the corresponding target that appears. On the "General" tab in the "Signing" section, pick a team and a profile.


## Android

### Signing error on Android 7+

Use at least Android 6.1.1 when deploying for Android 7+:

```ShellSession
ionic platform add android@6.1.1
```
### Android license not accepted
If you have Android Studio installed, open the sdk manager from Tools->Android->SDK manager and accept licenses as needed. If you only have the Android command line sdk installed, update the SDK manually with:
```
android update sdk --no-ui --all --filter build-tools-25.0.1,android-25,extra-android-m2repository
```
and accept license agreement when prompted.

### ANDROID_HOME not found
set the android environment variables manually:
```
export ANDROID_HOME=/path/to/android-sdk
export PATH=${PATH}:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

### Hints for misc errors observed

HAXM install errors on macOS when preparing emulator: Upgrade bash (even if using brew's bash).

“HAX is not working and emulator runs in emulation mode”: Re-create
emulator image and be careful to always specify the same amount of
memory to use when prompted and specifying on commandline.

Android SDK license errors: Make sure you have accepted the license
for the specific version of the SDK that Ionic uses if multiple
versions are installed (problems observed as Ionic did not support the
newest SDK which was the one that had the license accepted).


### On Windows when build Android 

- "@angular-devkit/architect": "~0.12.3",
- "@angular-devkit/build-angular": "~0.12.3",
- cd externals/bip32/node_modules/cipher-base && npm i stream
- cd externals/bip32/node_modules/hash-base && npm i stream
- if Duplicate Camera permition: cd cordova-plugin-qrscanner edit plugin.xml and comment this

`<!--
      <uses-permission android:name="android.permission.CAMERA" android:required="false" />
      <uses-feature android:name="android.hardware.camera" android:required="false" />
      <uses-feature android:name="android.hardware.camera.front" android:required="false" />
-->`



1.Upgrade your android SDK api to 28 or 29.
2.Below change into your config.xml 
**Change** 
<engine name="android" spec="7.1.4" />
 **to**
<engine name="android" spec="8.0.0" />


FireBase:

ionic cordova plugin add cordova-plugin-firebasex
npm install @ionic-native/firebase-x

import { FirebaseX } from "@ionic-native/firebase-x/ngx";
constructor(private firebase: FirebaseX)
 
this.firebase.getToken().then(token => console.log(`The token is ${token}`))
this.firebase.onMessageReceived().subscribe(data => console.log(`FCM message: ${data}`));


Note:
https://github.com/dpa99c/cordova-android-play-services-gradle-release#installation

https://www.npmjs.com/package/cordova-plugin-firebasex#ionic-4

https://github.com/dpa99c/cordova-plugin-androidx-adapter

https://github.com/dpa99c/cordova-plugin-androidx
'

camera conflict 

I had to remove inside ..\plugins\phonegap-plugin-barcodescanner\plugin.xml the

<uses-feature android:name="android.hardware.camera">
then removed and added again android platform.
Worked very fine for me.

For test flight


