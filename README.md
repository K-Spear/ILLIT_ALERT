# Binance Futures Position Alerter

This application monitors a Binance user's leaderboard for new or closed futures positions and provides real-time audio and visual alerts.

It uses a two-part architecture to fetch real data while respecting browser security policies.

-   **Frontend**: A React application that provides the user interface.
-   **Backend**: A Node.js server that scrapes the Binance leaderboard page to get live position data, bypassing browser CORS restrictions.

---

## 🚨 How to Run

To run this application, you must start **both** the backend server and the frontend application.

### Step 1: Run the Backend Server

The backend server is responsible for fetching the data from Binance.

1.  **Navigate to the server directory:**
    Open a terminal and change to the `server` directory.
    ```bash
    cd server
    ```

2.  **Install dependencies:**
    You'll need to have Node.js installed. Run this command to install the required packages (`express`, `cors`, `axios`, `cheerio`).
    ```bash
    npm install
    ```

3.  **Start the server:**
    Run the following command.
    ```bash
    node index.js
    ```

    You should see a message like `🚀 Server is running on http://localhost:3001`. Keep this terminal window open.

### Step 2: Run the Frontend Application

The frontend is what you see and interact with in your browser.

1.  **Open a new terminal window.**
    Do not close the terminal running the server.

2.  **Run the frontend:**
    You can run the frontend application using the provided development environment. The frontend will automatically connect to your backend server running on `localhost:3001`.

---

Once both parts are running, you can open the application in your browser, log in (simulated), enter a Binance User Encrypted UID, and start monitoring.
