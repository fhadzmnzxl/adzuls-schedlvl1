# Class Schedule Web Page - SY 2025-2026 (Level 1, First Semester)

This repository hosts a dynamic and responsive web page for displaying a class schedule, built with HTML, CSS, and vanilla JavaScript. The schedule data and motivational quotes are loaded from external JSON files (`schedule.json`, `quotes.json`), making updates easy and separating content from presentation.

**Live Site:** [View Class Schedule](https://fhadzmnzxl.github.io/adzuls-schedlvl1/schedule.html)

## 🎯 Purpose

The goal is to provide a clean, easy-to-read, interactive, and maintainable way to view a weekly class schedule. It also displays special one-time or recurring events with conditional visibility and provides a touch of daily motivation. It's designed to help students quickly identify their classes, access details efficiently, and stay informed about other relevant school activities.

## ✨ Features

*   **Dynamic Data Loading:**
    *   Schedule and general settings are fetched from `schedule.json`.
    *   Motivational quotes are fetched from `quotes.json`.
*   **Weekly Schedule Display:**
    *   Classes are clearly laid out under each day of the week (Sunday to Saturday).
    *   Sunday is displayed as a non-class day.
*   **Advanced Special Classes/Events Section:**
    *   Displays one-off or recurring special events separately.
    *   Events are shown based on sophisticated `displayRule` logic in `schedule.json`, supporting:
        *   **`specificDate`**: Events for a single specific day.
        *   **`dateRange`**: Announcements or events visible for a defined period.
        *   **`multiDate`**: Events occurring on several non-consecutive dates.
        *   **`persistentUntil`**: Announcements visible until a specific date.
    *   Special events for the current day automatically disappear from view after their end time has passed.
*   **Motivational Quotes:** Displays a random motivational quote on each page load, with a button to show a new quote.
*   **Mobile-First Responsive Design:**
    *   **Tabbed Navigation (Mobile):** Intuitive tabs (Sun-Sat) for easy day selection on smaller screens.
    *   **Grid Layout (Desktop):** All days are visible in a grid on larger screens.
*   **"Today" Highlighting:** The current day's tab (mobile) and day column (desktop) are visually marked.
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
*   **Professional & Academic UI:** Uses the "Nunito Sans" font and an Ateneo-inspired color palette (rich blue & gold) for a clean and dignified visual experience.
*   **Maintainable Code:** HTML for structure, CSS for styling, and JavaScript for behavior are in separate files.

## 🛠️ Technology Stack

*   **HTML5 (`schedule.html`):** For the basic structure.
*   **CSS3 (`style.css`):** For all styling, including layout (CSS Grid, Flexbox), visual appearance, and responsiveness.
*   **Vanilla JavaScript (ES6+) (`script.js`):** For:
    *   Fetching and parsing `schedule.json` and `quotes.json`.
    *   Dynamically rendering the schedule, special events (with `displayRule` logic), and quotes.
    *   Handling tab navigation.
    *   Managing tooltips.
    *   Calculating and displaying "time left" / "ongoing" status.
    *   Storing user preferences (last active tab) in `localStorage`.
*   **JSON Files:**
    *   `schedule.json`: Stores all schedule data, special events with their display rules, and general site settings.
    *   `quotes.json`: Stores a collection of motivational quotes.
*   **Google Fonts:** Using the 'Nunito Sans' font family.

## 🚀 How to Use / View

1.  **Online (Recommended):**
    *   Visit the live site URL provided at the top of this README.

2.  **Locally:**
    *   Clone this repository: `git clone https://github.com/your-username/your-repository-name.git`
    *   Navigate to the cloned directory.
    *   Ensure `schedule.html`, `style.css`, `script.js`, `schedule.json`, and `quotes.json` are in the same directory (or adjust paths in `schedule.html` if using subfolders for CSS/JS).
    *   Open `schedule.html` in any modern web browser. (Due to `fetch` API usage for local files, you might need to serve it via a simple local server, e.g., using Python's `http.server`, Node.js `live-server`, or a VS Code extension like "Live Server". Some browsers have security restrictions on `fetch` with `file:///` URLs.)

## 📝 Updating the Content

*   **Schedule & Settings:**
    1.  Open the `schedule.json` file in a text editor.
    2.  Modify weekly class details, or add/update special events, ensuring the `displayRule` for special events is correctly configured for the desired visibility.
    3.  Update general settings like titles or the `officialClassStartDate` in the `settings` object.
    4.  Save the `schedule.json` file.
*   **Motivational Quotes:**
    1.  Open the `quotes.json` file.
    2.  Add new quote objects (`{"text": "...", "author": "..."}`) or modify existing ones.
    3.  Save the `quotes.json` file.
*   **Deploying Changes:** If hosted (e.g., on GitHub Pages), commit and push the changes to the modified JSON file(s). The website will automatically reflect the new data on the next load.

## 📁 File Structure (Main Files for Viewer)

*   `schedule.html`: The main HTML file for viewing the schedule.
*   `style.css`: Contains all CSS styles.
*   `script.js`: Contains all JavaScript logic.
*   `schedule.json`: Contains all the schedule data, special events with display rules, and configuration.
*   `quotes.json`: Contains the list of motivational quotes.
*   `README.md`: This file.
*   `editor.html` (Optional, for local use): A separate HTML file for editing the `schedule.json` data (generates a downloadable JSON).
*   `editor_script.js` (Optional, for local use): JavaScript for `editor.html`.

---

This project provides a robust and user-friendly way to display and manage a dynamic class schedule and related information.
