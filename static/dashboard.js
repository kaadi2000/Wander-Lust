document.addEventListener("DOMContentLoaded", function() {
    let searchInput = document.getElementById("search");
    let nameInput = document.getElementById("name");
    let latInput = document.getElementById("lat");
    let lngInput = document.getElementById("lng");
    let searchResults = document.getElementById("search-results");
    let locationForm = document.getElementById("location-form");

    if (!locationForm) {
        console.error("Error: Location form not found! Make sure #location-form exists in dashboard.html.");
        return;
    }

    let debounceTimer;
    searchInput.addEventListener("input", function() {
        let query = searchInput.value.trim();
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (query.length > 2) {
                fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`)
                    .then(response => response.json())
                    .then(data => {
                        searchResults.innerHTML = "";
                        searchResults.style.display = "block";

                        if (data.length === 0) {
                            let noResult = document.createElement("li");
                            noResult.textContent = "No results found";
                            noResult.style.padding = "10px";
                            searchResults.appendChild(noResult);
                            return;
                        }

                        data.forEach(place => {
                            let li = document.createElement("li");
                            li.textContent = place.display_name;
                            li.style.cursor = "pointer";
                            li.style.padding = "10px";
                            li.style.borderBottom = "1px solid #ddd";
                            li.style.background = "white";
                            li.style.color = "black";

                            li.onclick = function() {
                                nameInput.value = place.display_name;
                                latInput.value = place.lat;
                                lngInput.value = place.lon;
                                searchInput.value = place.display_name;
                                searchResults.style.display = "none";
                            };
                            searchResults.appendChild(li);
                        });
                    })
                    .catch(error => console.error("Error fetching location:", error));
            } else {
                searchResults.style.display = "none";
            }
        }, 300);
    });

    document.addEventListener("click", function(event) {
        if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
            searchResults.style.display = "none";
        }
    });

    locationForm.addEventListener("submit", function(event) {
        event.preventDefault();
        
        let name = document.getElementById("name").value;
        let lat = document.getElementById("lat").value;
        let lng = document.getElementById("lng").value;
        let notes = document.getElementById("notes").value;
        let visited = document.getElementById("visited").checked;

        if (!name || !lat || !lng) {
            alert("Please select a location from the search results.");
            return;
        }

        let data = {
            name: name,
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            notes: notes,
            visited: visited
        };

        fetch("/add_location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            alert("Location added successfully!");
            window.location.reload();
        })
        .catch(error => console.error("Error adding location:", error));
    });
});