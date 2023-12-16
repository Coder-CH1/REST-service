document.addEventListener("DOMContentLoaded", function() {
    // Fetch gateway data from the API
    fetch("http://localhost:5501/gateways")
        .then(response => response.json())
        .then(data => {
            // Update the HTML content with the fetched data
            const gatewayContainer = document.getElementById("gatewayContainer");
            data.forEach(gateway => {
                const gatewayDiv = document.createElement("div");
                gatewayDiv.innerHTML = `<p>${gateway.serialNumber} - ${gateway.name} - ${gateway.ipAddress}</p>`;
                gatewayContainer.appendChild(gatewayDiv);
            });
        })
        .catch(error => console.error("Error fetching data:", error));
});
