This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

### NOTICE
This application is dockorized. you can build and run this app seperate from the backend using the dockerfile in this directory.

### Running ONLY the react-frontend docker image
**If you would like to build and run the docker image for the front end WITHOUT the backend:**
*Move to the directory with the dockerfile.*
1. Build the dockerfile
   ```bash
   sudo docker build -t bit-front .
   ```
2. Run the newly built image
   ```bash
   sudo docker run bit-front
   ```

### Running without docker
You can run this application on your system without docker for testing and development using these steps.
If you are only trying to run the application with the back-end, DO NOT DO THIS, use the docker-compose.yaml file instead.

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the app
   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).