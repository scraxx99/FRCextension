import { getTeamInfo } from "./tba.js";

export function setupTeamSearch() {

    const button = document.getElementById("searchTeamBtn");
    const input = document.getElementById("teamNumberInput");
    const status = document.getElementById("status");
    const results = document.getElementById("results");

    console.log("Team search loaded");

    button.addEventListener("click", async () => {

        const teamNumber = input.value.trim();

        console.log("Clicked, team:", teamNumber);

        if (!teamNumber) {
            status.textContent = "Enter a team number.";
            return;
        }

        status.textContent = "Searching...";

        try {
            const team = await getTeamInfo(teamNumber);

            console.log(team);

            results.innerHTML = `
                <h3>${team.nickname}</h3>
                <p>Team ${team.team_number}</p>
                <p>Rookie Year: ${team.rookie_year}</p>
                <p>${team.city}, ${team.state_prov}</p>
            `;

            status.textContent = "Done";

        } catch (err) {
            console.error(err);
            status.textContent = "Team not found";
        }
    });
}