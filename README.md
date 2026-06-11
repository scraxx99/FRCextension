# ScoutBuddy

A scouting dashboard for FIRST Robotics Competition teams that combines team information, robot media, match history, EPA analytics, and team comparison tools in a single interface.

![ScoutBuddy Screenshot](Screenshot%20from%202026-06-11%2014-33-37.png)

## 🚀 Try It

**GitHub Repository:**
https://github.com/scraxx99/ScoutBuddy

**Latest Source Code:**
https://github.com/scraxx99/ScoutBuddy/archive/refs/heads/main.zip

---

## Quick Start

### Firefox

1. Download or clone the repository.
2. Open Firefox.
3. Navigate to:

```text
about:debugging
```

4. Click **This Firefox**.
5. Click **Load Temporary Add-on**.
6. Select `manifest.json`.

ScoutBuddy will now appear in your browser toolbar.

---

## Features

* 🔍 Search any FRC team by team number
* 📷 View team robot photos and media
* 📅 Browse current season events
* 🎥 Watch recent match videos
* 🟢🔴 View win/loss results for recent matches
* 📊 Display Statbotics EPA ratings
* 🌎 Display world EPA rankings
* 🌙 Dark mode support
* 🎨 Modern card-based scouting interface

---

## Running Locally

### Requirements

* Firefox
* Internet connection
* The Blue Alliance API key

### Clone the Repository

```bash
git clone https://github.com/scraxx99/ScoutBuddy.git
cd ScoutBuddy
```

### Configure API Access

Create a file named:

```text
.env
```

Add:

```env
TBA_API_KEY=YOUR_API_KEY
```

### Load the Extension

Open:

```text
about:debugging
```

Then:

```text
This Firefox
→ Load Temporary Add-on
→ Select manifest.json
```

---

## How It Works

ScoutBuddy combines multiple FRC data sources into a single scouting workflow.

### Team Information

Team information, events, robot media, and match history are retrieved through The Blue Alliance API.

### Performance Analytics

EPA (Expected Points Added) and world rankings are retrieved from Statbotics. These metrics allow scouts and strategists to evaluate team performance beyond win/loss records.

### Match Analysis

For each event, ScoutBuddy displays:

* Match scores
* Alliance color
* Win/Loss results
* Available YouTube match videos

### Team Comparison

ScoutBuddy includes a side-by-side comparison mode that allows users to compare:

* EPA
* World Rank
* Team Information
* Historical performance metrics

This helps drive coaches, scouts, and alliance captains make more informed decisions during qualification rounds and alliance selection.

---

## Future Plans

* 📈 EPA trend graphs
* 📝 Team scouting notes
* 📋 Automated picklists
* 🏆 Alliance selection assistant
* 🤖 Team recommendation engine
* 📤 Exportable scouting reports

---

## Credits

### Data Sources

* The Blue Alliance
* Statbotics

### Built With

* HTML
* CSS
* JavaScript
* Firefox WebExtensions API

### Inspiration

Built for the FIRST Robotics Competition community to make scouting data more accessible and easier to analyze during competitions.

---

## License

MIT License

See the LICENSE file for details.
