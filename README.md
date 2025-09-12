# Binance Futures Position Alerter

This application monitors a Binance user's leaderboard for new or closed futures positions and provides real-time audio and visual alerts.

It is a pure frontend application that runs entirely in your browser. It does not require a backend server. Instead, you manually provide the position data directly from the Binance website.

---

## 🚨 How to Run

This is a pure frontend application. **No backend server is required.**

1.  **Open the application:**
    Simply open the `index.html` file in a modern web browser (like Chrome, Firefox, or Edge).

That's it! The application is ready to use.

---

## ⚙️ How to Use

The application works by processing position data that you copy from the Binance Futures leaderboard page.

1.  **Open the Binance Leaderboard:**
    Navigate to the Binance Futures leaderboard page of the user you want to monitor.

2.  **Open Browser Developer Tools:**
    Press `F12` or right-click on the page and select "Inspect" to open the developer tools.

3.  **Find the Network Request:**
    -   Go to the "Network" tab in the developer tools.
    -   You might need to refresh the page (`F5`) to see the requests.
    -   In the filter box, type `getOtherPosition`.

4.  **Copy the Position Data:**
    -   Click on the `getOtherPosition` request in the list.
    -   A new panel will open. Go to the "**Response**" or "**Preview**" tab.
    -   This will show you the position data in JSON format. Click the "Copy" button or manually select all the text and copy it.

5.  **Paste into the App:**
    -   Go back to the Position Alerter application.
    -   Paste the copied JSON data into the large text area.

6.  **Process Data:**
    -   Click the "Process Data" button.
    -   The app will display the current positions.

7.  **Monitor for Changes:**
    -   To check for updates, repeat steps 3-6.
    -   The app will compare the new data with the previous data and log any new or closed positions.
