define(['openLayers'], function(ol) {
    const london = ol.proj.fromLonLat([-0.12755, 51.507222]);
    var moscow = ol.proj.fromLonLat([37.6178, 55.7517]);
    var istanbul = ol.proj.fromLonLat([28.9744, 41.0128]);
    var rome = ol.proj.fromLonLat([12.5, 41.9]);
    var bern = ol.proj.fromLonLat([7.4458, 46.95]);
    const lonlat = [151.1906677913729, -33.792279535699926];
    var sydney = ol.proj.fromLonLat(lonlat);

    var closer = document.getElementById('popup-closer');
    var content = document.getElementById('popup-content');

    var overlay = new ol.Overlay({
        element: document.getElementById('popup'),
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });


    var view = new ol.View({
        center: sydney,
        zoom: 14,
        //projection: 'EPSG:4326'
    });
    var geoMarker = new ol.Feature({
        type: 'geoMarker',
        geometry: new ol.geom.Point(lonlat)
    });

    var pointFeature = new ol.Feature(new ol.geom.Point(sydney));

    var map = new ol.Map({
        target: 'map',
        overlays: [overlay],
        layers: [
            new ol.layer.Tile({
                preload: 4,
                source: new ol.source.OSM()
            }),
            new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [pointFeature]
                }),
                style: new ol.style.Style({
                    image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
                        anchor: [0.5, 46],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        opacity: 0.95,
                        src: 'https://openlayers.org/en/v4.2.0/examples/data/icon.png'
                    })),
                    stroke: new ol.style.Stroke({
                        width: 3,
                        color: [255, 0, 0, 1]
                    }),
                    fill: new ol.style.Fill({
                        color: [0, 0, 255, 0.6]
                    })
                })
            })
        ],
        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }),
        // Improve user experience by loading tiles while animating. Will make
        // animations stutter on mobile or slow devices.
        loadTilesWhileAnimating: true,
        view: view
    });
    /**
     * Add a click handler to hide the popup.
     * @return {boolean} Don't follow the href.
     */
    closer.onclick = function() {
        overlay.setPosition(undefined);
        closer.blur();
        return false;
    };
    /**
     * Add a click handler to the map to render the popup.
     */
    const ten = 10;
    map.on('singleclick', function(evt) {
        var coordinate = evt.coordinate;
        var hdms = ol.coordinate.toStringXY(ol.proj.transform(
            coordinate, 'EPSG:3857', 'EPSG:4326'), ten);

        content.innerHTML = '<p>You clicked here:</p><code>' + hdms +
            '</code>';
        overlay.setPosition(coordinate);
    });

    map.on('moveend', function() {
        var view = map.getView();
        var center = view.getCenter();

        var lonlat = ol.proj.transform(center, 'EPSG:3857', 'EPSG:4326');
        var lon = lonlat[0];
        var lat = lonlat[1];
        window.location.hash =
            view.getZoom() + ';' + lon + ';' + lat;
    });

    return ol;
});