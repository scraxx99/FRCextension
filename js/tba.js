const AUTH_CODE = "PFw69SmCGCnb5iUGfvoPGpT2Newsu4BloRLnPQoPI5lPZz53tXkPyqWdxthIHS1A";

/**
 * Makes a request to The Blue Alliance API.
 */
async function tbaRequest(endpoint) {

    const response = await fetch(
        `https://www.thebluealliance.com/api/v3${endpoint}`,
        {
            headers: {
                "X-TBA-Auth-Key": AUTH_CODE
            }
        }
    );

    if (!response.ok) {
        throw new Error(
            `TBA API Error: ${response.status} ${response.statusText}`
        );
    }

    return await response.json();
}

/**
 * Converts:
 * 4188      -> frc4188
 * "4188"    -> frc4188
 * "frc4188" -> frc4188
 */
function normalizeTeamKey(teamInput) {

    const input = String(teamInput).trim();

    if (input.startsWith("frc")) {
        return input;
    }

    return `frc${input}`;
}

/**
 * Get team information.
 *
 * Example:
 * getTeamInfo(4188)
 * getTeamInfo("4188")
 * getTeamInfo("frc4188")
 */
export async function getTeamInfo(teamInput) {

    const teamKey = normalizeTeamKey(teamInput);

    return await tbaRequest(
        `/team/${teamKey}`
    );
}

/**
 * Get team media for a season.
 *
 * Example:
 * getTeamMedia(4188, 2025)
 */
export async function getTeamMedia(teamInput, year) {

    const teamKey = normalizeTeamKey(teamInput);

    return await tbaRequest(
        `/team/${teamKey}/media/${year}`
    );
}