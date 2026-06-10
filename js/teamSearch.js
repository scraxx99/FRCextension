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

    // Enter key triggers search
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            button.click();
        }
    });

    // Event matches
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

                const scoreText = `${redScore} - ${blueScore}`;

                let result = "Tie";

                if (
                    (onRed && redScore > blueScore) ||
                    (!onRed && blueScore > redScore)
                ) {
                    result = "✅ Win";
                } else if (
                    (onRed && redScore < blueScore) ||
                    (!onRed && blueScore < redScore)
                ) {
                    result = "❌ Loss";
                }

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
                    <div style="margin-bottom:12px;padding:10px;border:1px solid #ccc;border-radius:8px;">
                        <strong>${match.comp_level.toUpperCase()} ${match.match_number}</strong><br>
                        Result: ${result}<br>
                        Score: ${scoreText}<br>
                        ${videoHtml}
                    </div>
                `;
            });

        } catch (err) {
            console.error(err);
            matchResults.innerHTML = "<p>Could not load matches.</p>";
        }
    });

    // Main search
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

            // Events dropdown
            eventDropdown.innerHTML = `<option value="">Select Event...</option>`;

            events.forEach(event => {
                const option = document.createElement("option");
                option.value = event.key;
                option.textContent = event.name;
                eventDropdown.appendChild(option);
            });

            // Robot image
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

            // Team info
            results.innerHTML = `
                <h3>${team.nickname}</h3>
                <p>Team ${team.team_number}</p>
                <p>Rookie Year: ${team.rookie_year ?? "Unknown"}</p>
                <p>${team.city ?? ""}${team.state_prov ? ", " + team.state_prov : ""}</p>
            `;

            if (imageUrl) {
                results.innerHTML += `
                    <img src="${imageUrl}" style="max-width:100%;margin-top:10px;border-radius:8px;">
                `;
            }

            // =========================
            // FIXED EPA + WORLD RANK
            // =========================

            const epaData = epa?.epa ?? {};

            const meanEPA =
                epaData?.total_points?.mean ?? "N/A";

            const sdEPA =
                epaData?.total_points?.sd ?? "N/A";

            const worldRank =
                epaData?.ranks?.total?.rank ?? "N/A";

            results.innerHTML += `
                <h3>EPA Statistics</h3>
                <p>EPA: ${meanEPA} ± ${sdEPA}</p>
                <p>World Rank: ${worldRank}</p>
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