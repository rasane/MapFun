requirejs.config({
    paths: {
        'viewAnimation': 'viewAnimation',
        'openLayers': '../../node_modules/openlayers/dist/ol'
    },
    shim: {
        openLayers: {
            exports: 'OpenLayers'
        },
    }
});