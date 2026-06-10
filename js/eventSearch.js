import { getEventInfo } from "./tba.js";

export function setupEventSearch() {

    const button = document.getElementById("searchEventBtn");
    const input = document.getElementById("eventCodeInput");
    const status = document.getElementById("eventStatus");
    const results = document.getElementById("eventResults");

    input.addEventListener("keydown", (event) => {

        if (event.key === "Enter") {
            button.click();
        }

    });

    button.addEventListener("click", async () => {

        const eventKey = input.value.trim();

        if (!eventKey) {
            status.textContent = "Enter an event key.";
            return;
        }

        status.textContent = "Searching...";

        try {

            const eventData =
                await getEventInfo(eventKey);

            results.innerHTML = `
                <h3>${eventData.name}</h3>

                <p>
                    <strong>Location:</strong>
                    ${eventData.city},
                    ${eventData.state_prov}
                </p>

                <p>
                    <strong>Dates:</strong>
                    ${eventData.start_date}
                    -
                    ${eventData.end_date}
                </p>

                <p>
                    <strong>Type:</strong>
                    ${eventData.event_type_string}
                </p>
            `;

            status.textContent = "Done";

        } catch (err) {

            console.error(err);

            results.innerHTML = "";
            status.textContent = "Event not found";
        }

    });
}