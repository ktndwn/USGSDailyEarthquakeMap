


L.mapbox.accessToken = 'pk.eyJ1Ijoia3RuZHduIiwiYSI6ImNqajZjeDQxczIybjIzcXBncXcwMGdycnUifQ.-1gqjlqOHsmFHwj0sfp68A'

let map = L.mapbox.map('map', 'mapbox.dark', {
    minZoom: 2,
    maxZoom: 16
}).setView([15, 0], 2)


let pastHourAPI = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_hour.geojson'
let pastDayAPI = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'


//
//
// Too much data to populate a smooth map
//
//
// let pastWeekAPI = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
// let pastMonthAPI = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson'

let data = null
let markers = []




//
//
// Fetch data from USGS
//
//








let getData = function (api) {
    fetch(api).then(function(response) {
        if (response.status !== 200) {
            console.log(`Error: ${response.status}`)
        } else {
            response.json().then(function(fetch) {
                data = fetch
                populateMap(data)
            })
        }
    })
}

getData(pastDayAPI)



//
//
// Populate map with markers and add info
//
//





let populateMap = function (data) {
    data.features.forEach(function(quake) {
        let long = quake.geometry.coordinates[0]
        let lat = quake.geometry.coordinates[1]
        let date = new Date(quake.properties.time).toString().slice(4, 24)
        let marker = L.marker([lat, long], {
            title: `${quake.properties.place}`
        })
        markers.push(marker)
        marker.bindPopup(`<div class="title">Location</div>
            <div>${quake.properties.place}</div>
            <div class="title">Magnitude</div>
            <div>${quake.properties.mag}</div>
            <div class="title">Date/Time</div>
            <div>${date}</div>`, {
                closeButton: true,
                closeOnClick: false
            }).addTo(map)



        //
        //
        // Can't get delay timer to work properly if selecting checkbox while still populating :(
        //
        //



        // setTimeout(function() {
        //     marker.bindPopup(`<div class="title">Location</div>
        //     <div>${quake.properties.place}</div>
        //     <div class="title">Magnitude</div>
        //     <div>${quake.properties.mag}</div>
        //     <div class="title">Date/Time</div>
        //     <div>${date}</div>`, {
        //         closeButton: true,
        //         closeOnClick: false
        //     }).addTo(map)
        // }, (data.features.indexOf(quake)+1)*10)
    })
}



//
//
// Removes markers and clears array
//
//





let removeMarkers = function() {
    markers.forEach(function (marker) {
        marker.remove()
    })
    markers = []
}



//
//
// Checkbox event listener
//
//




document.querySelector('#checkbox').addEventListener('change', function(e) {
    if(e.target.checked) {
        removeMarkers()
        getData(pastHourAPI)
    } else {
        removeMarkers()
        getData(pastDayAPI)
    }
})

