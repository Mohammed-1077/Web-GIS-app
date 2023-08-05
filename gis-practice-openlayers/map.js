// Basemap
var osm = new ol.layer.Tile({
    title: 'OpenStreetMap',
    type: 'base',
    visibile: true,
    source: new ol.source.OSM()
});

// Bing Maps:
var bingRoads = new ol.layer.Tile({ 
    title: 'Bing Maps—Roads', 
    type: 'base', 
    visible: false, 
    source: new ol.source.BingMaps({ 
        key: 'AmqwAqFBb20XzczKxP_6RiIJbp5FuEYfI1ybn1XsHzeW0lCEN4Da0Al5SgqtSBv_',
        imagerySet: 'Road' 
    }) 
});

var bingAerial = new ol.layer.Tile({ 
    title: 'Bing Maps—Aerial', 
    type: 'base', 
    visible: false, 
    source: new ol.source.BingMaps({ 
        key: 'AmqwAqFBb20XzczKxP_6RiIJbp5FuEYfI1ybn1XsHzeW0lCEN4Da0Al5SgqtSBv_', 
        imagerySet: 'Aerial' 
    }) 
}); 

var bingAerialWithLabels = new ol.layer.Tile({ 
    title: 'Bing Maps—Aerial with Labels', 
    type: 'base', 
    visible: false, 
    source: new ol.source.BingMaps({ 
        key: 'AmqwAqFBb20XzczKxP_6RiIJbp5FuEYfI1ybn1XsHzeW0lCEN4Da0Al5SgqtSBv_', 
        imagerySet: 'AerialWithLabels' 
    }) 
}); 

//Stamen
var stamenWatercolor = new ol.layer.Tile({ 
    title: 'Stamen Watercolor', 
    type: 'base', 
    visible: false, 
    source: new ol.source.Stamen({ 
        layer: 'watercolor' 
    }) 
}); 

var stamenToner = new ol.layer.Tile({ 
    title: 'Stamen Toner', 
    type: 'base', 
    visible: false, 
    source: new ol.source.Stamen({ 
        layer: 'toner' 
    }) 
}); 

// Openlayer 
var ghs_clip_int = new ol.layer.Image({
    title: 'GHS CLIP INTEGER',
    visible: false,
    source: new ol.source.ImageWMS({
        url: "http://localhost:8082/geoserver/wms",
        params: {'LAYERS': 'GIS_Project:GHS_CLIP_INT'
        //  'STYLES': 'restricted'
    }
    }),
    //minResolution: 1000,
    //maxResolution: 5000
});

//For addational layer
var worldpop_clip_int = new ol.layer.Image({
    title: 'WORLDPOP CLIP INTEGER',
    visible: false,
    source: new ol.source.ImageWMS({
        url: "http://localhost:8082/geoserver/wms",
        params: {'LAYERS': 'GIS_Project:WORLDPOP_CLIP_INT'}
    })
});

var intercomp_diff = new ol.layer.Image({
    title: 'INTERCOMPARISON DIFFERENCE',
    visible: false,
    source: new ol.source.ImageWMS({
        url: "http://localhost:8082/geoserver/wms",
        params: {'LAYERS': 'GIS_Project:intercomp_diff'}
    })
});


var difference_3scenarios_int = new ol.layer.Image({ 
    title: 'difference_3scenarios_int', 
    visible: false,
    source: new ol.source.ImageWMS({ 
        url: 'http://localhost:8082/geoserver/wms', 
        params: {'LAYERS': 'GIS_Project:difference_3scenarios_int'} 
    }) 
}); 

var ghs_rec_int = new ol.layer.Image({ 
    title: 'GHS RECLASSIFIED INTEGER',
    visible: false, 
    source: new ol.source.ImageWMS({ 
        url: 'http://localhost:8082/geoserver/wms', 
        params: {'LAYERS': 'GIS_Project:ghs_rec_int'} 
    }) 
}); 

var worldpop_rec_int = new ol.layer.Image({ 
    title: 'WORLDPOP RECLASSIFIED INTEGER',
    visible: false, 
    source: new ol.source.ImageWMS({ 
        url: 'http://localhost:8082/geoserver/wms', 
        params: {'LAYERS': 'GIS_Project:worldpop_rec_int'} 
    }) 
}); 

var srscf = new ol.layer.Image({ 
    title: 'stratified_random_sampling_classified1_final', 
    visible: false,
    source: new ol.source.ImageWMS({ 
        url: 'http://localhost:8082/geoserver/wms', 
        params: {'LAYERS': 'GIS_Project:stratified_random_sampling_classified1_final'} 
    }) 
}); 

//
var vectorSource = new ol.source.Vector({
	loader: function(extent, resolution, projection) {
		var url = 'http://localhost:8082/geoserver/GIS_Project/ows?service=WFS&' +
	'version=1.1.0&request=GetFeature&typeName=GIS_Project:value&'
	 +'outputFormat=text/javascript&srsname=EPSG:3857&' +
	'format_options=callback:loadFeatures';
	$.ajax({url: url, dataType: 'jsonp'});
	}
});

var geojsonFormat = new ol.format.GeoJSON(); 
function loadFeatures(response) {
    vectorSource.addFeatures(
        geojsonFormat.readFeatures(response)
    ); 
};
var Tiles= new ol.layer.Vector({
	title: 'Tiles',
	visible: false,
	source: vectorSource,
    style: new ol.style.Style({
		fill: new ol.style.Fill({
			color: [255,150,200],
		}),
		stroke: new ol.style.Stroke({
			color:'white'

		})
	})
});



var map = new ol.Map({
    target: document.getElementById('map'),
    layers: [ new ol.layer.Group({
        title: 'Base Maps',
        layers: [osm, bingRoads, bingAerial, bingAerialWithLabels, 
            stamenToner, stamenWatercolor
        ] 
        }), 
        new ol.layer.Group({
            title: 'Overlay Layers',
            layers: [ ghs_clip_int, worldpop_clip_int, intercomp_diff,
             difference_3scenarios_int, ghs_rec_int, worldpop_rec_int, Tiles, srscf ]
                
        }) 
    ],
    view: new ol.View({
        center: ol.proj.fromLonLat([-66,49]),
        zoom: 3
    }),
    controls: ol.control.defaults().extend([
        new ol.control.ScaleLine(),
        new ol.control.FullScreen(),
        new ol.control.OverviewMap({
            layers: [
                new ol.layer.Tile({
                  source: new ol.source.OSM()
                }) ],
        }), //ol.map, overviewMap have the same source property.
        new ol.control.MousePosition({
            coordinateFormat: ol.coordinate.createStringXY(4),
            projection: 'EPSG: 4326'
        })
    ])
});

var layerSwitcher = new ol.control.LayerSwitcher();
map.addControl(layerSwitcher);

// Display information Pop-up
// needs to be vector layer
var elementPopup = document.getElementById('popup');
var popup = new ol.Overlay({ 
    element: elementPopup 
}); 
map.addOverlay(popup); 

map.on('click', function(event) {
	var feature = map.forEachFeatureAtPixel(event.pixel, function(feature, layer) {
		return feature;
	});
	if (feature != null) {
		var pixel = event.pixel;
		var coord = map.getCoordinateFromPixel(pixel);
		popup.setPosition(coord);
		$(elementPopup).attr('title', 'Correlation Value');
		$(elementPopup).attr('data-bs-content', '<b>tileID: </b>' + feature.get('tileID') + 
		'</br><b>Correlation: </b>' + feature.get('Value'));
		$(elementPopup).popover({'placement': 'top', 'html': true}); 
		$(elementPopup).popover('show');
	}
});

// change the cursor styling on drag 

map.on('pointermove', function(event) {
	if (event.dragging) {
		$(elementPopup).popover('dispose');
		return;
	}
	var pixel = map.getEventPixel(event.originalEvent);
	var hit = map.hasFeatureAtPixel(pixel);
	map.getTarget().style.cursor = hit ? 'pointer' : '';
});
