# Class Schedule Web Page - SY 2025-2026 (Level 1, First Semester)

This repository hosts a dynamic and responsive web page for displaying a class schedule, built with HTML, CSS, and vanilla JavaScript. The schedule data is loaded from an external `schedule.json` file, making updates easy and separating content from presentation.

**Live Site:** [View Class Schedule](https://your-username.github.io/your-repository-name/)
*(Remember to replace `your-username` and `your-repository-name` with your actual GitHub username and repository name. If your main HTML file is not `index.html`, adjust the link accordingly, e.g., `.../schedule.html`)*

## 🎯 Purpose

The goal is to provide a clean, easy-to-read, interactive, and maintainable way to view a weekly class schedule, along with any special one-time events. It's designed to help students quickly identify their classes and access details efficiently.

## ✨ Features

*   **Dynamic Data Loading:** Schedule and settings are fetched from `schedule.json`, allowing easy updates without touching HTML/JS.
*   **Weekly Schedule Display:**
    *   Classes are clearly laid out under each day of the week (Sunday to Saturday).
    *   Sunday is displayed as a non-class day.
*   **Special Classes Section:** Displays one-time or special events separately.
*   **Mobile-First Responsive Design:**
    *   **Tabbed Navigation (Mobile):** Intuitive tabs (Sun-Sat) for easy day selection on smaller screens.
    *   **Grid Layout (Desktop):** All days are visible in a grid on larger screens.
*   **"Today" Highlighting:** The current day's tab is visually marked.
*   **Default View Logic:**
    *   On mobile, intelligently defaults to showing "today's" schedule if it has classes.
    *   Falls back to the last viewed tab (via `localStorage`) or Monday if "today" is not suitable.
*   **Interactive Tooltips:** Hover over (or tap on touch devices) any class entry to see:
    *   Units
    *   Instructor(s)
    *   Recommended Books
*   **Time-Left & Ongoing Indicators:**
    *   Subtly displays time remaining (e.g., "2h", "45m") for upcoming classes/events *today*.
    *   Indicates if a class/event is *currently ongoing*.
    *   These indicators for regular classes only activate after an official semester start date (configurable in `schedule.json`).
*   **Touch-Friendly Tooltips:** Click/tap to toggle tooltips on touch devices.
*   **Clean & Modern UI:** Uses the "Nunito Sans" font and a defined color palette for a pleasant visual experience.
*   **Maintainable Code:** JavaScript is organized to handle data fetching, rendering, and interactions.

## 🛠️ Technology Stack

*   **HTML5:** For the basic structure.
*   **CSS3:** For all styling, including layout (CSS Grid, Flexbox), visual appearance, and responsiveness.
*   **Vanilla JavaScript (ES6+):** For:
    *   Fetching and parsing `schedule.json`.
    *   Dynamically rendering the schedule and special events.
    *   Handling tab navigation.
    *   Managing tooltips.
    *   Calculating and displaying "time left" / "ongoing" status.
    *   Storing user preferences (last active tab) in `localStorage`.
*   **`schedule.json`:** A local JSON file storing all schedule data and site settings.
*   **Google Fonts:** Using the 'Nunito Sans' font family.

## 🚀 How to Use / View

1.  **Online (Recommended):**
    *   Visit the live site URL provided at the top of this README.

2.  **Locally:**
    *   Clone this repository: `git clone https://github.com/your-username/your-repository-name.git`
    *   Navigate to the cloned directory.
    *   Ensure the `schedule.json` file is in the same directory as your main HTML file (e.g., `index.html` or `schedule.html`).
    *   Open the main HTML file in any modern web browser. (Due to `fetch` API usage for local files, you might need to serve it via a simple local server, e.g., using Python's `http.server`, Node.js `live-server`, or a VS Code extension like "Live Server". Some browsers have security restrictions on `fetch` with `file:///` URLs.)

## 📝 Updating the Schedule

1.  Open the `schedule.json` file in a text editor.
2.  Modify the class details, add new classes, or update special events following the existing JSON structure.
3.  Update settings like titles or the `officialClassStartDate` in the `settings` object within `schedule.json`.
4.  Save the `schedule.json` file.
5.  If hosted (e.g., on GitHub Pages), commit and push the changes to `schedule.json`. The website will automatically reflect the new data on the next load.

## 📁 File Structure

*   `index.html` (or `schedule.html`): The main HTML file.
*   `schedule.json`: Contains all the schedule data and configuration.
*   `README.md`: This file.

---

This project aims for a balance of functionality, aesthetics, and maintainability for a class schedule display.
