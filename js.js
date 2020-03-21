let platform = new H.service.Platform({
    'apikey': '8rZVAxjaLRtxZm87BNROgq7nHm8fakKQx5K8jlxiKns'
});

// Obtain the default map types from the platform object:
let defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:
const map = new H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map,
    {
        zoom: 10,
        center: {lat: 52.5, lng: 13.4}

    });

const ui = H.ui.UI.createDefault(map, defaultLayers);

// Enable the event system on the map instance:
var mapEvents = new H.mapevents.MapEvents(map);

// Instantiate the default behavior, providing the mapEvents object:
new H.mapevents.Behavior(mapEvents);

loadData();

function loadData() {

    $.ajax({
        dataType: "json",
        url: "https://cors-anywhere.herokuapp.com/https://corona.tum.lol",
        success: function(data){
            let featureArray = data.features;
            for (let feature of featureArray) {
                let attribute = feature.attributes;

                let name = attribute.Country_Region;
                let lat = attribute.Lat;
                let lon = attribute.Long_;
                let active_cases = attribute.Active;
                let deaths = attribute.Deaths;
                let estimated_cases = attribute.Estimated;
                let lastUpdated = new Date(attribute.Last_Update);

                let radius = Math.log2(estimated_cases) * 10000;

                addCase(lat, lon, radius, name, active_cases, deaths, estimated_cases, lastUpdated);
            }
        }
    });

}

function addCase(lat, lon, radius, name, active_cases, deaths, estimated_cases, lastUpdated){

    let circle = new H.map.Circle(
        { lat: lat, lng: lon},
        radius,
        {
            style: {
                strokeColor: 'rgba(0, 0, 0, 0.6)', // Color of the perimeter
                lineWidth: 2,
                fillColor: 'rgba(255, 50, 50, 0.5)'  // Color of the circle
            }
        }
    );
    map.addObject(circle);

    let open = false;
    let bubble = new H.ui.InfoBubble({lng: lon, lat: lat}, {
        content: "<b>" + name + "</b> " +
            "<p>Aktive Fälle (bestätigt): " + active_cases + "</p>" +
            "<p>Dunkelziffer: " + estimated_cases + "</p>" +
            "<p>Bestätigte Tode: " + deaths + "</p>" +
            "<p>Zuletzt aktualisiert: " + lastUpdated.toLocaleString() + "</p>"
    });
    bubble.close();
    ui.addBubble(bubble);
    circle.addEventListener('tap', function(){
        if(bubble.getState() === H.ui.InfoBubble.State.OPEN){
            bubble.close();
        }else{
            for(let otherBubbles of ui.getBubbles()){
                otherBubbles.close();
            }
            bubble.open();
        }
    });
}