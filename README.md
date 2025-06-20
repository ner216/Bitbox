# Overview:

Bitbox is an online music web-app; engineered for those who prioritize the sound of their music. Bitbox uses algorithms to intuitively help you discover new music that has the sound characteristics you love.

# Development Setup:

### Clone the repository:

> Run: `git clone https://github.com/ner216/Bitbox.git`  
> Then: `cd Bitbox`

---

### Install tools on your system:

**Windows:**

> Download NVM from: https://github.com/coreybutler/nvm-windows/releases  
> Then, run the `nvm-setup.exe` file. **Be sure to allow nvm to manage system path.**

> To install Node.js, run:  
> `nvm install lts`  
> Then: `nvm use lts`

> Download and install Java from: https://adoptium.net

> Install Visual Studio Code: https://code.visualstudio.com/  
> (Optional) Install Android Studio (for emulator use): https://developer.android.com/studio

> Install Docker Desktop: https://www.docker.com/products/docker-desktop  
> Enable WSL 2 integration during installation

---

### Backend Setup (via Docker):

> Open your **WSL terminal**, navigate to the project directory, and run:  
> `sudo docker compose up`  
> This will start all backend services (API, databases, etc.) automatically.

> **Note:** The first time you run this, Docker will pull and build all necessary images — this may take several minutes.

---

### Install frontend dependencies (Node):

> Navigate to the frontend directory: `cd frontend`  
> Then: `npm install`

---

### Configure environment variables:

> Copy the example file: `cp .env.example .env`  
> Fill in the required values, such as:  
> - `FRONTEND_URL=`  
> - `API_KEY=`  
> - `Any service URLs provided by Docker (e.g., localhost:8000)`

---

### Run the frontend server:

> From the frontend directory, run:  
> `npm start`

---

### (Optional) Run the mobile app:

> Open the `android` folder in Android Studio  
> Launch an emulator or connect a device  
> Then run the app using Android Studio or:  
> `npx react-native run-android`

---

### Troubleshooting:

> **Docker not running?**  
> Make sure Docker Desktop is open and WSL integration is enabled.

> **Can't connect to backend?**  
> Check that `docker compose` is still running and verify ports in `.env`.

> **Frontend build issues?**  
> Try deleting `node_modules` and rerunning `npm install`.

---

### Contact:

> For issues, open a GitHub issue here: https://github.com/ner216/Bitbox/issues
