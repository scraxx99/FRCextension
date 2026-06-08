const AUTH_CODE = "PFw69SmCGCnb5iUGfvoPGpT2Newsu4BloRLnPQoPI5lPZz53tXkPyqWdxthIHS1A";

const button = document.getElementById("searchTeamBtn");
const status = document.getElementById("status");
const image = document.getElementById("resultImage");

button.addEventListener("click", async () => {

    status.textContent = "Loading...";

    try {

        const response = await fetch(
            "https://www.thebluealliance.com/api/v3/team/frc4188/media/2026",
            {
                headers: {
                    "X-TBA-Auth-Key": AUTH_CODE
                }
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const media = await response.json();
        console.log("Media returned:", media);  

        if (media.length === 0) {
            status.textContent = "No media found.";
            return;
        }

        const imageMedia = media.filter(item =>
    item.type === "imgur" ||
    item.type === "instagram-image" ||
    item.direct_url
);

if (imageMedia.length === 0) {
    status.textContent = "No supported images found.";
    return;
}

const randomItem =
    imageMedia[Math.floor(Math.random() * imageMedia.length)];

        let imageUrl = null;

        if (randomItem.type === "imgur") {
            imageUrl =
                `https://i.imgur.com/${randomItem.foreign_key}.jpg`;
        } else if (randomItem.direct_url) {
            imageUrl = randomItem.direct_url;
        }

        if (!imageUrl) {
            status.textContent =
                `Unsupported media type: ${randomItem.type}`;
            return;
        }

        image.src = imageUrl;
        image.style.display = "block";

        status.textContent = "Success!";

    } catch (error) {

        console.error(error);

        status.textContent =
            `Error: ${error.message}`;
    }
});