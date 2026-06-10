import {
    getTeamInfo,
    getTeamMedia,
    getTeamEvents,
    getTeamMatches
} from "./tba.js";

import { getTeamEPA } from "./statbotics.js";

export function setupTeamSearch() {

    const button = document.getElementById("searchTeamBtn");
    const input = document.getElementById("teamNumberInput");
    const status = document.getElementById("status");
    const results = document.getElementById("results");
    const eventDropdown = document.getElementById("eventDropdown");
    const matchResults = document.getElementById("matchResults");

    let currentTeamNumber = null;

    // Enter key support
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            button.click();
        }
    });

    // EVENT MATCHES
    eventDropdown.addEventListener("change", async () => {

        if (!currentTeamNumber) return;

        const eventKey = eventDropdown.value;
        if (!eventKey) return;

        matchResults.innerHTML = "<p>Loading matches...</p>";

        try {

            const matches = await getTeamMatches(
                currentTeamNumber,
                eventKey
            );

            matches.sort((a, b) => {
                if (a.comp_level !== b.comp_level) {
                    return a.comp_level.localeCompare(b.comp_level);
                }
                return a.match_number - b.match_number;
            });

            const lastFive = matches.slice(-5);

            matchResults.innerHTML = "<h3>Last 5 Matches</h3>";

            lastFive.forEach(match => {

                const teamKey = `frc${currentTeamNumber}`;

                const onRed = match.alliances.red.team_keys.includes(teamKey);

                const redScore = match.alliances.red.score;
                const blueScore = match.alliances.blue.score;

                let result = "Tie";

                if (
                    (onRed && redScore > blueScore) ||
                    (!onRed && blueScore > redScore)
                ) {
                    result = "Win";
                } else if (
                    (onRed && redScore < blueScore) ||
                    (!onRed && blueScore < redScore)
                ) {
                    result = "Loss";
                }

                // ✅ JS CHANGE 4 — card styling
                const cardClass =
                    result === "Win" ? "match-card win"
                    : result === "Loss" ? "match-card loss"
                    : "match-card";

                let videoHtml = "<p>No video available.</p>";

                const youtubeVideo = match.videos?.find(
                    v => v.type === "youtube"
                );

                if (youtubeVideo) {
                    videoHtml = `
                        <a href="https://www.youtube.com/watch?v=${youtubeVideo.key}" target="_blank">
                            <img
                                src="https://img.youtube.com/vi/${youtubeVideo.key}/mqdefault.jpg"
                                style="width:220px;margin-top:8px;border-radius:8px;cursor:pointer;"
                            >
                        </a>
                    `;
                }

                matchResults.innerHTML += `
                    <div class="${cardClass}">
                        <strong>${match.comp_level.toUpperCase()} ${match.match_number}</strong><br>
                        Result: ${result}<br>
                        Score: ${redScore} - ${blueScore}<br>
                        ${videoHtml}
                    </div>
                `;
            });

        } catch (err) {
            console.error(err);
            matchResults.innerHTML = "<p>Could not load matches.</p>";
        }
    });

    // MAIN SEARCH
    button.addEventListener("click", async () => {

        const teamNumber = input.value.trim();

        if (!teamNumber) {
            status.textContent = "Enter a team number.";
            return;
        }

        currentTeamNumber = teamNumber;
        status.textContent = "Searching...";

        try {

            const [team, robotPic, events, epa] = await Promise.all([
                getTeamInfo(teamNumber),
                getTeamMedia(teamNumber, new Date().getFullYear()),
                getTeamEvents(teamNumber, new Date().getFullYear()),
                getTeamEPA(teamNumber)
            ]);

            console.log("Statbotics RAW:", epa);

            // EVENTS DROPDOWN
            eventDropdown.innerHTML = `<option value="">Select Event...</option>`;

            events.forEach(event => {
                const option = document.createElement("option");
                option.value = event.key;
                option.textContent = event.name;
                eventDropdown.appendChild(option);
            });

            // ROBOT IMAGE
            const imageMedia = robotPic.filter(item =>
                item.direct_url &&
                (
                    item.direct_url.endsWith(".jpg") ||
                    item.direct_url.endsWith(".jpeg") ||
                    item.direct_url.endsWith(".png")
                )
            );

            const preferred = imageMedia.find(i => i.preferred);

            const imageUrl = preferred
                ? preferred.direct_url
                : (imageMedia[0]?.direct_url || "");

            // TEAM CARD
            results.innerHTML = `
                <div class="team-card">
                    <h2>${team.nickname}</h2>
                    <p>Team ${team.team_number}</p>
                    <p>${team.city ?? ""}${team.state_prov ? ", " + team.state_prov : ""}</p>
                </div>
            `;

            if (imageUrl) {
                results.innerHTML += `
                    <img src="${imageUrl}" style="max-width:100%;margin-top:10px;border-radius:8px;">
                `;
            }

            // =========================
            // EPA + WORLD RANK FIXED
            // =========================

            const epaData = epa?.epa ?? {};

            const meanEPA = epaData?.total_points?.mean ?? "N/A";
            const sdEPA = epaData?.total_points?.sd ?? "N/A";

            const worldRank = epaData?.ranks?.total?.rank ?? "N/A";

            results.innerHTML += `
                <div class="team-card">
                    <h3>EPA Statistics</h3>
                    <span class="epa-badge">EPA: ${meanEPA} ± ${sdEPA}</span>
                    <span class="epa-badge">World Rank: ${worldRank}</span>
                </div>
            `;

            matchResults.innerHTML = "";
            status.textContent = "Done";

        } catch (err) {
            console.error(err);
            results.innerHTML = "";
            matchResults.innerHTML = "";
            status.textContent = "Team not found";
        }
    });
}