export async function getTeamEPA(teamNumber) {

    const response = await fetch(
        `https://api.statbotics.io/v3/team_year/${teamNumber}/2026`
    );

    if (!response.ok) {
        throw new Error("Could not load EPA");
    }

    return await response.json();
}