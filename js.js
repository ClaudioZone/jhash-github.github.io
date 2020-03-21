const LANDKREISE_URL = "https://services7.arcgis.com/mOBPykOjAyBO2ZKk/ArcGIS/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&objectIds=&time=&geometry=&geometryType=esriGeometryPoint&inSR=&spatialRel=esriSpatialRelContains&resultType=none&distance=0.0&units=esriSRUnit_Meter&returnGeodetic=false&outFields=BEZ%2C+GEN%2C+RS%2C+BL%2C+SDV_RS%2C+cases%2C+cases_per_100k%2C+cases_per_population%2C+deaths%2C+death_rate&returnGeometry=true&returnCentroid=true&featureEncoding=esriDefault&multipatchOption=none&maxAllowableOffset=&geometryPrecision=&outSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=2000&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pjson&token=";
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
    $.getJSON(LANDKREISE_URL, function (data) {

        let featureArray = data.features;

        for (let feature of featureArray) {
            let attribute = feature.attributes;
            let name = attribute.BEZ + " " + attribute.GEN;
            let deaths = attribute.deaths;

            let estimated = Math.round(100 * deaths * Math.pow(2, 17.3/6.2));

            let cases = attribute.cases;
            //let cases_per_100k = attribute.cases_per_100k;

            if(cases < estimated){
                cases = estimated;
            }

            let death_rate = attribute.death_rate;

            let geometry = feature.geometry;
            let ringArray = geometry.rings[0];
            let centroid = feature.centroid;
            let centerX = centroid.x;
            let centerY = centroid.y;
            let marker = addCase(name, cases, deaths, ringArray, centerX, centerY);
        }

    });
}

function addCase(name, cases, deaths, ringArray, centerX, centerY){
    require([
        "esri/geometry/webMercatorUtils"
    ], function(webMercatorUtils) {
        let lineString = new H.geo.LineString();
        for(let point of ringArray){
            let latlon = webMercatorUtils.xyToLngLat(point[0], point[1]);
            lineString.pushLatLngAlt(latlon[1], latlon[0], 100);
        }

        let poly = new H.map.Polygon(lineString, {
            style: {
                fillColor: '#FFF',
                strokeColor: '#000',
                lineWidth: 1
            }
        });
        map.addObject(poly);

        let centerLatLon = webMercatorUtils.xyToLngLat(centerX, centerY);

        let open = false;
        let bubble = deaths > 0 ? new H.ui.InfoBubble({lng: centerLatLon[0], lat: centerLatLon[1]}, {
            content: "<b>" + name + "</b> <p>Dunkelziffer: " + cases + "</p><p>Bestätigte Tode: " + deaths + "</p>"
        }) : new H.ui.InfoBubble({lng: centerLatLon[0], lat: centerLatLon[1]}, {
            content: "<b>" + name + "</b> <p>Bestätigte Tode: " + cases + "</p><p>Bestätigte Tode: " + deaths + "</p>"
        });
        bubble.close();
        ui.addBubble(bubble);
        poly.addEventListener('tap', function(){
            if(bubble.getState() === H.ui.InfoBubble.State.OPEN){
                bubble.close();
            }else{
                for(let otherBubbles of ui.getBubbles()){
                    otherBubbles.close();
                }
                bubble.open();
            }
        });

    });
}