        var map = L.map('map').setView([40.764, 30.394], 12);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
        }).addTo(map);

        var allLocations = [];

        fetch('fetch_veri.php')
            .then(response => response.json())
            .then(data => {
                allLocations = data;
                displayLocations(allLocations);
            });

        function displayLocations(locations) {
            $('#locationsList').empty();

            locations.forEach(function(place) {
                var coords = place.geometry.coordinates;
                var lat = coords[1];
                var lng = coords[0];
                var name = place.properties.ad || "";
                var address = place.properties.adres || "";
                var description = place.properties.aciklama || "";

                if (!name && !address && !description) {
                    return;
                }

                var popupContent = "<div class='popup-content'>";
                if (name) {
                    popupContent += `<b>${name}</b><br>`;
                }
                if (address) {
                    popupContent += `${address}<br>`;
                }
                if (description) {
                    popupContent += `${description}`;
                }
                popupContent += "</div>";

                var icon = L.divIcon({
                    className: 'custom-icon',
                    html: '<i class="ri-map-pin-2-fill" style="color: #007bff; font-size: 24px;"></i>',
                    iconSize: [24, 24],
                    iconAnchor: [12, 24]
                });

                var marker = L.marker([lat, lng], {icon: icon})
                    .bindPopup(popupContent)
                    .addTo(map);

                var listItemContent = `<div class="col-md-4">
                    <div class="card">
                        <div class="card-body">`;
                
                if (name) {
                    listItemContent += `<h5 class="card-title"><i class="ri-community-line"></i> ${name}</h5>`;
                }
                if (address) {
                    listItemContent += `<p class="card-text">${address}</p>`;
                }
                listItemContent += `<button class="btn btn-success" onclick="focusOnLocation(${lat}, ${lng})"><i class="ri-map-pin-2-line"></i> Haritada Göster</button>
                        </div>
                    </div>
                </div>`;

                $('#locationsList').append(listItemContent);
            });
        }

        $('#searchInput').on('keyup', function() {
            var query = $(this).val().toLowerCase();
            var filteredLocations = allLocations.filter(function(place) {
                var name = place.properties.ad || '';
                var address = place.properties.adres || '';
                return name.toLowerCase().includes(query) || address.toLowerCase().includes(query);
            });
            displayLocations(filteredLocations);
        });

        function focusOnLocation(lat, lng) {
            map.setView([lat, lng], 15);
        }

        document.getElementById('toggleTheme').addEventListener('click', function() {
            if (document.body.classList.contains('night-mode')) {
                document.body.classList.remove('night-mode');
                document.body.classList.add('day-mode');
                this.innerText = 'Gece Modu';
            } else {
                document.body.classList.remove('day-mode');
                document.body.classList.add('night-mode');
                this.innerText = 'Gündüz Modu';
            }
        });