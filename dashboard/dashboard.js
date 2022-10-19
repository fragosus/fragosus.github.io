map = null; 

function initWebPage(){
	console.log("initWebPage");
	initMap();
	}

function initMap(){
	console.log("initMap");
	
	var map = L.map('map').setView([-3.702829, 32.775559], 8); 

	var openstreetmap = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
		maxZoom: 19, attribution: 'OSM', id: 'OSM Base Maps' 	});
	
	var WorldImagery = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
		attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community' 	});

	var api_key = 'pk.eyJ1IjoiZGlnaXRhbGdsb2JlIiwiYSI6ImNpcmNrbWp2dzAxZ3dnN20zdzRvdTA5Z2IifQ.efQ78Neg0uAIhk98JKIizQ';
	var digitalglobe = L.tileLayer('https://{s}.tiles.mapbox.com/v4/digitalglobe.nal0g75k/{z}/{x}/{y}.png?access_token=' + api_key, {
    minZoom: 1, maxZoom: 19, attribution: '(c) <a href="https://microsites.digitalglobe.com/interactive/basemap_vivid/">DigitalGlobe</a> , (c) OpenStreetMap, (c) Mapbox'
	});
	

	var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
	});


	
	//All wards map

	var info = L.control({position: 'bottomleft'});

		info.onAdd = function (map) {
			this._div = L.DomUtil.create('div', 'info');
			this.update();
			return this._div;
		};

		info.update = function (props) {
			this._div.innerHTML = '<h4>Socioeconomic data by ward</h4>' +  (props ?
				'Ward name: ' + '<b>' + props.Ward_Name + '</b><br/>' + 'Region: ' + props.Region_Nam + '</b><br />' + 'District: ' + props.District_N + '</b><br/>' + 'Area in sq. km: ' + props.Area + '</b><br/>' + 'Post code: ' + props.PCode + '</b><br/>' + 'Total population: ' + props.total_both + '</b><br/>' + 'Total population - male: ' + props.total_male + '</b><br/>' + 'Total population - female: ' + props.total_fema + '</b><br/>' + 'Population density: ' + props.Pop_Den + '</b><br />' + 'Ward Type: ' + props.ward_type
				: 'Turn on census data and move the mouse over the ward');
		};

		info.addTo(map);

		
	function PopDensColor(d) {
			return d > 500 ? '#990000' :
			       d > 250 ? '#d7301f' :
			       d > 100 ? '#ef6548' :
			       d > 50 ? '#fc8d59' :
			       d > 25 ? '#fdbb84' :
			       d > 10 ? '#fdd49e' :
				   			'#fef0d9'; 	
		}

	function Allwardsstyle(feature) {						
			return {
				fillColor: PopDensColor((feature.properties.Pop_Den)),
				weight: 0.5, opacity: 1, color: 'black', fillOpacity: 0.35 };
		}

		function totalColor(d) {
			return d > 50000 ? '#084594' :
			       d > 25000 ? '#2171b5' :
			       d > 12500 ? '#4292c6' :
			       d > 10000 ? '#6baed6' :
			       d > 7500 ? '#9ecae1' :
			       d > 5000 ? '#c6dbef' :
				   			'#eff3ff'; 	
		}

	


	function totalwardsstyle(feature) {						
			return {
				fillColor: totalColor((feature.properties.total_both)),
				weight: 0.5, opacity: 1, color: 'black', fillOpacity: 0.35 };
		}




	function highlightFeature(e) {
			var layer = e.target;
			layer.setStyle({ weight: 3, color: '#666', dashArray: '', fillOpacity: 0.7 });        
			info.update(layer.feature.properties);
			}

		var Allwards;

		function resetHighlight(e) {						
			Allwards.resetStyle(e.target);
			info.update();
			}

		function zoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
			}

		function onEachFeature(feature, layer) {
			layer.on({
				mouseover: highlightFeature,
				mouseout: resetHighlight,
				click: zoomToFeature
			});
		}

		
	Allwards = L.esri.featureLayer({ url: 'https://services6.arcgis.com/qnuLPzqZhawWzvJ1/arcgis/rest/services/TNZ_ward_pop2012/FeatureServer/0/', style: Allwardsstyle, onEachFeature: onEachFeature  });

	function ThighlightFeature(e) {
			var layer = e.target;
			layer.setStyle({ weight: 3, color: '#666', dashArray: '', fillOpacity: 0.7 });        
			info.update(layer.feature.properties);
			}


		var Totalpop;

		function TresetHighlight(e) {						
			Totalpop.resetStyle(e.target);
			info.update();
			}

		function TzoomToFeature(e) {
			map.fitBounds(e.target.getBounds());
			}

		function poponEachFeature(feature, layer) {
			layer.on({ mouseover: ThighlightFeature, mouseout: TresetHighlight, click: TzoomToFeature });
		}

	Totalpop = L.esri.featureLayer({ url: 'https://services6.arcgis.com/qnuLPzqZhawWzvJ1/arcgis/rest/services/TNZ_ward_pop2012/FeatureServer/0/', style: totalwardsstyle, onEachFeature: poponEachFeature  });

	//selected wards and popup
	
	var MaraStyle = { "opacity": 0.75, "fillopacity": 0.75 };
	var Marabuilding = L.tileLayer('https://services6.arcgis.com/qnuLPzqZhawWzvJ1/arcgis/rest/services/Marabuilding_Density/MapServer/tile/{z}/{y}/{x}', {
		style: MaraStyle, attribution: 'Tiles &copy; Esri &mdash; Source: Esri' });

//------------------------------------------------------------------------------------------------------------------------------------


      function geoJson2heat(geojson, weight) {
          return geojson.features.map(function(feature) {
            return [
              feature.geometry.coordinates[1],
              feature.geometry.coordinates[0],
              feature.properties[weight]
            ];
          });
        }


        function style_Kapcsoltrteg0_0(feature) {
            if (feature.properties['count'] >= 1.000000 && feature.properties['count'] <= 65.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0', opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1.0, fillOpacity: 1, fillColor: 'rgba(240,249,33,0.101960784314)',}}
            if (feature.properties['count'] >= 65.000000 && feature.properties['count'] <= 141.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0', opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1.0, fillOpacity: 1, fillColor: 'rgba(250,219,36,0.278431372549)',}}
            if (feature.properties['count'] >= 141.000000 && feature.properties['count'] <= 216.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0', opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1.0, fillOpacity: 1, fillColor: 'rgba(254,188,43,0.466666666667)',}}
            if (feature.properties['count'] >= 216.000000 && feature.properties['count'] <= 297.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0',opacity: 1,color: 'rgba(0,0,0,1.0)',dashArray: '',lineCap: 'butt',lineJoin: 'miter',weight: 1.0, fillOpacity: 1,fillColor: 'rgba(252,162,56,0.647058823529)',}}
            if (feature.properties['count'] >= 297.000000 && feature.properties['count'] <= 387.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0',opacity: 1,color: 'rgba(0,0,0,1.0)',dashArray: '',lineCap: 'butt',lineJoin: 'miter',weight: 1.0, fillOpacity: 1,fillColor: 'rgba(244,136,73,0.83137254902)',}}
            if (feature.properties['count'] >= 387.000000 && feature.properties['count'] <= 489.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0',opacity: 1,color: 'rgba(0,0,0,1.0)',dashArray: '',lineCap: 'butt',lineJoin: 'miter',weight: 1.0, fillOpacity: 1,fillColor: 'rgba(233,113,88,1.0)',}}
            if (feature.properties['count'] >= 489.000000 && feature.properties['count'] <= 614.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0',opacity: 1,color: 'rgba(0,0,0,1.0)',dashArray: '',lineCap: 'butt',lineJoin: 'miter',weight: 1.0, fillOpacity: 1,fillColor: 'rgba(219,92,104,1.0)',}}
            if (feature.properties['count'] >= 614.000000 && feature.properties['count'] <= 757.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0',opacity: 1,color: 'rgba(0,0,0,1.0)',dashArray: '',lineCap: 'butt',lineJoin: 'miter',weight: 1.0, fillOpacity: 1,fillColor: 'rgba(203,71,120,1.0)',}}
            if (feature.properties['count'] >= 757.000000 && feature.properties['count'] <= 921.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0',opacity: 1,color: 'rgba(0,0,0,1.0)',dashArray: '',lineCap: 'butt',lineJoin: 'miter',weight: 1.0, fillOpacity: 1,fillColor: 'rgba(185,50,137,1.0)',}}
            if (feature.properties['count'] >= 921.000000 && feature.properties['count'] <= 1153.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0',opacity: 1,color: 'rgba(0,0,0,1.0)',dashArray: '',lineCap: 'butt',lineJoin: 'miter',weight: 1.0, fillOpacity: 1,fillColor: 'rgba(163,30,153,1.0)',}}
            if (feature.properties['count'] >= 1153.000000 && feature.properties['count'] <= 1517.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0',opacity: 1,color: 'rgba(0,0,0,1.0)',dashArray: '',lineCap: 'butt',lineJoin: 'miter',weight: 1.0, fillOpacity: 1,fillColor: 'rgba(139,9,165,1.0)',}}
            if (feature.properties['count'] >= 1517.000000 && feature.properties['count'] <= 2090.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0',opacity: 1,color: 'rgba(0,0,0,1.0)',dashArray: '',lineCap: 'butt',lineJoin: 'miter',weight: 1.0, fillOpacity: 1,fillColor: 'rgba(112,0,168,1.0)',}}
            if (feature.properties['count'] >= 2090.000000 && feature.properties['count'] <= 3122.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0',opacity: 1,color: 'rgba(0,0,0,1.0)',dashArray: '',lineCap: 'butt',lineJoin: 'miter',weight: 1.0, fillOpacity: 1,fillColor: 'rgba(83,1,164,1.0)',}}
            if (feature.properties['count'] >= 3122.000000 && feature.properties['count'] <= 4596.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0', opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1.0,  fillOpacity: 1, fillColor: 'rgba(52,4,153,1.0)',}}
            if (feature.properties['count'] >= 4596.000000 && feature.properties['count'] <= 5759.000000 ) {
                return {pane: 'pane_Kapcsoltrteg0', opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1.0, fillOpacity: 1, fillColor: 'rgba(13,8,135,1.0)',}}
        }
        map.createPane('pane_Kapcsoltrteg0');
        map.getPane('pane_Kapcsoltrteg0').style.zIndex = 400;
        map.getPane('pane_Kapcsoltrteg0').style['mix-blend-mode'] = 'normal';
    var layer_Kapcsoltrteg0 = new L.geoJson(json_Kapcsoltrteg0, {
        attribution: '<a href=""></a>',
        pane: 'pane_Kapcsoltrteg0',
        style: style_Kapcsoltrteg0_0,
    });



//------------------------------------------------------------------------------------------------------------------------------------		

//ADM01 - regions

	var TNZADM1colour = { "fillColor": "yellow", "color": "black", "weight": 2.0, "opacity": 0.25 };
	var TNZADM1 = L.esri.featureLayer({ url: 'https://services6.arcgis.com/qnuLPzqZhawWzvJ1/arcgis/rest/services/TZA_ADM_1/FeatureServer/0/', style: TNZADM1colour 	});

	TNZADM1.bindPopup(function (layer) {
    return L.Util.template('<p>Region name: <strong>{NAME_1}</strong><br> Name in Swahili: <strong>{VARNAME_1}</strong> <br> <br><strong>Socioeconomic data</strong> <br> Area in sq km: <strong>{Area}</strong> <br> Population in 2012 (census data): <strong>{F2012_cens}</strong><br> Projected population in 2017: <strong>{Pop_proj17}</strong><br><br><br><strong>Downloadable content</strong> <br> <a href="http://www.fragosus.com/tanzania/dashboard/data/regions/GEOJSON/TZA_adm1_{NAME_1}.geojson" target="_blank">Region boundary (GeoJSON extension)</a></p>', layer.feature.properties); 
  	});

		
	var TNZADM2colour = { "fillColor": ' #ba4a00 ', "color": "black", "weight": 2.0, "opacity": 0.25 };
	var TNZADM2 = L.esri.featureLayer({ url: 'https://services6.arcgis.com/qnuLPzqZhawWzvJ1/arcgis/rest/services/TZA_ADM_2/FeatureServer/0/', style: TNZADM2colour 	});

	TNZADM2.bindPopup(function (layer) {
    return L.Util.template('<p>Region name: <strong>{NAME_1}</strong><br>District name: <strong>{NAME_2}</strong></p>', layer.feature.properties);   
  	});


//------------------------------------------------------------------------------------------------------------------------------------		


	//selected wards and popup
	var greenStyle = { "color": "red", "weight": 1.5, "opacity": 0.95 };
	var wards = L.esri.featureLayer({ url: 'https://services6.arcgis.com/qnuLPzqZhawWzvJ1/arcgis/rest/services/Tanzania_selected_wards/FeatureServer/0/', style: greenStyle 	});

	wards.bindPopup(function (layer) {
    return L.Util.template('<p>Region name: <strong>{Region_Nam}</strong><br>District name: <strong>{District_N}</strong><br>Ward name: <strong>{Ward_Name}</strong><br><a href="http://www.fragosus.com/tanzania/dashboard/data/{Ward_Code}.kml" target="_blank">Download</a></p>', layer.feature.properties);   
  	}); 


//------------------------------------------------------------------------------------------------------------------------------------		

	//Mapswipe tasks
	var SwipeStyle = { "color": "#31a354", "weight": 2, "opacity": 0.95, "fillopacity": 1 };
	var TanzaniaMapSwipe = L.esri.featureLayer({ url: '	https://services6.arcgis.com/qnuLPzqZhawWzvJ1/arcgis/rest/services/TanzaniaMapSwipe/FeatureServer/0/', style: SwipeStyle 	});
	
	TanzaniaMapSwipe.bindPopup(function (layer) {
		return L.Util.template('<p>MapSwipe project ID: <strong>{project_id}</strong><br>Progress: <strong>{progress}</strong> percent <br>Contributors: <strong>{contributo}</strong><br> Project name: <strong>{name}</strong> <br><br> <strong>GIScience MapSwipe Analytics</strong> <br> <a href="//mapswipe.geog.uni-heidelberg.de/?id={project_id}" target="_blank">Jump to the task dashboard</a> <br> <br>Download data <li><a href="//mapswipe.geog.uni-heidelberg.de/download/{project_id}/final_{project_id}.geojson" target="_blank">Processed results for HOT Tasking Manager</a></li><li><a href="//mapswipe.geog.uni-heidelberg.de/download/{project_id}/results_{project_id}.json" target="_blank">Results of the project including: User, cell, timestamp</a></li></p>', layer.feature.properties);   
		  }); 
	
	TanzaniaMapSwipe.addTo(map);

//------------------------------------------------------------------------------------------------------------------------------------
	//AI cucc
	
	var AIstyle = { "color": "red", "weight": 2, "opacity": 0.55 };
	var crowdai = L.esri.featureLayer({ url: 'https://services6.arcgis.com/qnuLPzqZhawWzvJ1/arcgis/rest/services/ihanja/FeatureServer/0/', style: AIstyle 	});


		

//------------------------------------------------------------------------------------------------------------------------------------

	//Missing maps tasks visualisation
	var DevelopmentTrust = { "color": "orange", "weight": 2, "opacity": 0.55 };
	var TNZDevelopmentTrust = L.esri.featureLayer({ url: 'https://services6.arcgis.com/qnuLPzqZhawWzvJ1/arcgis/rest/services/TNZ_Development_Trust_Missing_Maps_tasks/FeatureServer/0/', style: DevelopmentTrust 	});

	TNZDevelopmentTrust.bindPopup(function (layer) {
    return L.Util.template('<p>HOT OSM task number: <strong>{HOTcode}</strong><br>Number of buildings: <strong>{Buildings}</strong><br>Number of places: <strong>{places}</strong><br><a href="http://tasks.hotosm.org/project/{HOTcode}" target="_blank">Open on Tasking manager</a></p>', layer.feature.properties);   
  	}); 

	TNZDevelopmentTrust.addTo(map);
	
//------------------------------------------------------------------------------------------------------------------------------------

	//Field papers
	var TNZFieldpaperstyle = { "color": "red", "weight": 2, "opacity": 0.55 };
	var TNZFieldpaper = L.esri.featureLayer({ url: 'https://services6.arcgis.com/qnuLPzqZhawWzvJ1/arcgis/rest/services/TDT_fieldpapers/FeatureServer/0/', style: TNZFieldpaperstyle 	});

	TNZFieldpaper.bindPopup(function (layer) {
    return L.Util.template('<p>Task title: <strong>{title}</strong><br>Zoom level: <strong>{zoom}</strong><br>Number of pages: <strong>{pages}</strong><br><a href="{url}" target="_blank">Open on http://fieldpapers.org</a><br><a href="{url_pdf}" target="_blank">Open in PDF</a></p>', layer.feature.properties);   
  	}); 

	
	
//------------------------------------------------------------------------------------------------------------------------------------



	//Missing maps tasks visualisation II
	var maholistyle = { "color": "blue", "weight": 2, "opacity": 0.55 };
	var TNZmaholi = L.esri.featureLayer({ url: 'https://services6.arcgis.com/qnuLPzqZhawWzvJ1/arcgis/rest/services/maholi/FeatureServer/0/', style: maholistyle 	});

	TNZmaholi.bindPopup(function (layer) {
    return L.Util.template('<p>HOT OSM task number: <strong>{projectId}</strong><br>Name: <strong>{name}</strong><br>Created: <strong>{created}</strong><br><a href="http://tasks.hotosm.org/project/{projectId}" target="_blank">Open on Tasking manager</a></p>', layer.feature.properties);   
  	}); 

	TNZmaholi.addTo(map);
	
//------------------------------------------------------------------------------------------------------------------------------------

	//Missing maps tasks visualisation III Tanzania mini grids

	var myStyle = {"color": "#A0522D", "weight": 1.5, "opacity": 0.45};
    var TNZMinigrids = new L.GeoJSON.AJAX("./data/TNZMinigrids.geojson" ,{onEachFeature: MapSwipeOnEachFeatureFunction, style: myStyle 
    }).addTo(map);

    function MapSwipeOnEachFeatureFunction(feature, layer){
        if (feature.properties.name) {
            layer.bindPopup("Project ID: " + feature.properties.tasknumber + "<br>" + "Project name: " + feature.properties.name + "<br>" + "Level: " + feature.properties.level + "%" + "<br>" + "Created by: " + feature.properties.created + "<br>" + "Campaign: " + feature.properties.campaign + "<br>" + "<a href=//tasks.hotosm.org/project/+ feature.properties.tasknumber</a>");
        }
    }

    
    TNZMinigrids.addTo(map);
	
	
//------------------------------------------------------------------------------------------------------------------------------------
	


	      function pop_FGMfeb170(feature, layer) {
            var popupText = 'Village: ' + feature.properties.village_name  + "<br />" + 'Total case: ' + feature.properties.total + "<br />" + 'Refused: ' + feature.properties.refused + "<br />" + 'Cut: ' + feature.properties.cut + "<br>" + 'Died: ' + feature.properties.died;
			layer.bindPopup(popupText);
        }


        function style_FGMfeb170_0(feature) {
            if (feature.properties['total'] >= 1.000000 && feature.properties['total'] <= 25.000000 ) {
                return {pane: 'pane_FGMfeb170', radius: 4.0, opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1, fillOpacity: 1, fillColor: 'rgba(247,251,255,1.0)' }
            }
            if (feature.properties['total'] >= 25.000000 && feature.properties['total'] <= 50.000000 ) {
                return {pane: 'pane_FGMfeb170', radius: 5.0, opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1, fillOpacity: 1, fillColor: 'rgba(220,234,247,1.0)' }
            }
            if (feature.properties['total'] >= 50.000000 && feature.properties['total'] <= 75.000000 ) {
                return {pane: 'pane_FGMfeb170', radius: 6.0, opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1, fillOpacity: 1, fillColor: 'rgba(190,216,237,1.0)' }
            }
            if (feature.properties['total'] >= 75.000000 && feature.properties['total'] <= 100.000000 ) {
                return {pane: 'pane_FGMfeb170', radius: 7.0, opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1, fillOpacity: 1, fillColor: 'rgba(143,194,222,1.0)' }
            }
            if (feature.properties['total'] >= 100.000000 && feature.properties['total'] <= 150.000000 ) {
                return {pane: 'pane_FGMfeb170', radius: 8.0, opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1, fillOpacity: 1, fillColor: 'rgba(91,163,208,1.0)' }
            }
            if (feature.properties['total'] >= 150.000000 && feature.properties['total'] <= 200.000000 ) {
                return {pane: 'pane_FGMfeb170', radius: 9.0, opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1, fillOpacity: 1, fillColor: 'rgba(49,130,190,1.0)' }
            }
            if (feature.properties['total'] >= 200.000000 && feature.properties['total'] <= 250.000000 ) {
                return {pane: 'pane_FGMfeb170', radius: 10.0, opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1, fillOpacity: 1, fillColor: 'rgba(16,92,165,1.0)' }
            }
            if (feature.properties['total'] >= 250.000000 && feature.properties['total'] <= 330.000000 ) {
                return {pane: 'pane_FGMfeb170', radius: 11.0, opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1, fillOpacity: 1, fillColor: 'rgba(8,48,107,1.0)' }
            }
        }
        
        map.createPane('pane_FGMfeb170');
        map.getPane('pane_FGMfeb170').style.zIndex = 400;
        map.getPane('pane_FGMfeb170').style['mix-blend-mode'] = 'normal';
        
        var layer_FGMfeb170 = new L.geoJson(fgmcut, {
            attribution: '<a href=""></a>',
            pane: 'pane_FGMfeb170',
            onEachFeature: pop_FGMfeb170,
            pointToLayer: function (feature, latlng) {
                var context = {
                    feature: feature,
                    variables: {}
                };
                return L.circleMarker(latlng, style_FGMfeb170_0(feature))
            },
        });
        
		
	
//------------------------------------------------------------------------------------------------------------------------------------


        function pop_hospital(feature, layer) {
 			var popupText = '<strong> Hospital name: </strong>' + feature.properties.name + "<br><br>" + '<strong>DATA INFORMATION</strong>' + '<br>' + '<strong> Timestamp: </strong>' + feature.properties.timestamp + '<br>' + '<strong> Creator: </strong>' + feature.properties.user + '<br>' + '<strong> Changeset: </strong>' + feature.properties.changeset + '<br>' + '<strong> Element type and ID num: </strong>' + feature.properties.id + '<br><br>'  +   '<strong>CHECK AND/OR EDIT IN OSM</strong>'  + '<br>'  +  '<a href="http://www.openstreetmap.org/' + feature.properties.id + ' " target="_blank">Check this POI in OpenStreetMap</a>' + '<br>' +  '<a href="http://www.openstreetmap.org/edit?' + feature.properties.id + ' " target="_blank">Edit with iD (in-browser editor)</a>' ;  
			layer.bindPopup(popupText);
        }

        function style_hospital() {
            return {pane: 'pane_hospital', radius: 5.0, opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1, fillOpacity: 0.55, fillColor: 'rgba(228,8,63,1.0)' }
        }
        
        map.createPane('pane_hospital');
        map.getPane('pane_hospital').style.zIndex = 402;
        map.getPane('pane_hospital').style['mix-blend-mode'] = 'normal';
        var layer_hospital = new L.geoJson(hospital, {
            attribution: '<a href=""></a>',
            pane: 'pane_hospital',
            onEachFeature: pop_hospital,
            pointToLayer: function (feature, latlng) {
                var context = {
                    feature: feature,
                    variables: {}
                };
                return L.circleMarker(latlng, style_hospital(feature))
            },
        });
        var cluster_hospital = new L.MarkerClusterGroup({showCoverageOnHover: true});
        cluster_hospital.addLayer(layer_hospital);


//------------------------------------------------------------------------------------------------------------------------------------

        function pop_schoolKigoma3(feature, layer) {
			var popupText = '<strong> School name: </strong>' + feature.properties.name + "<br><br>" + '<strong>DATA INFORMATION</strong>' + '<br>' + '<strong> Timestamp: </strong>' + feature.properties.timestamp + '<br>' + '<strong> Creator: </strong>' + feature.properties.user + '<br>' + '<strong> Changeset: </strong>' + feature.properties.changeset + '<br>' + '<strong> Element type and ID num: </strong>' + feature.properties.id + '<br><br>'  +   '<strong>CHECK AND/OR EDIT IN OSM</strong>'  + '<br>'  +  '<a href="http://www.openstreetmap.org/' + feature.properties.id + ' " target="_blank">Check this POI in OpenStreetMap</a>' + '<br>' +  '<a href="http://www.openstreetmap.org/edit?' + feature.properties.id + ' " target="_blank">Edit with iD (in-browser editor)</a>' ;  
			layer.bindPopup(popupText);
        }

        function style_schoolKigoma3_0() {
            return { pane: 'pane_schoolKigoma3', radius: 5.0, opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1, fillOpacity: 0.55, fillColor: 'rgba(134,83,104,1.0)'}
            }
        
        map.createPane('pane_schoolKigoma3');
        map.getPane('pane_schoolKigoma3').style.zIndex = 403;
        map.getPane('pane_schoolKigoma3').style['mix-blend-mode'] = 'normal';
     
        var layer_schoolKigoma3 = new L.geoJson(school, {
            attribution: '<a href=""></a>',
            pane: 'pane_schoolKigoma3',
            onEachFeature: pop_schoolKigoma3,
            pointToLayer: function (feature, latlng) {
                var context = {
                    feature: feature,
                    variables: {}
                };
                return L.circleMarker(latlng, style_schoolKigoma3_0(feature))
            },
        });
        var cluster_school = new L.MarkerClusterGroup({showCoverageOnHover: false});
        cluster_school.addLayer(layer_schoolKigoma3);

//-----------------------------------------------------------------------------------------------------------------------------------

		function pop_clinic(feature, layer) {
			var popupText = '<strong> Clinic name: </strong>' + feature.properties.name + "<br><br>" + '<strong>DATA INFORMATION</strong>' + '<br>' + '<strong> Timestamp: </strong>' + feature.properties.timestamp + '<br>' + '<strong> Creator: </strong>' + feature.properties.user + '<br>' + '<strong> Changeset: </strong>' + feature.properties.changeset + '<br>' + '<strong> Element type and ID num: </strong>' + feature.properties.id + '<br><br>'  +   '<strong>CHECK AND/OR EDIT IN OSM</strong>'  + '<br>'  +  '<a href="http://www.openstreetmap.org/' + feature.properties.id + ' " target="_blank">Check this POI in OpenStreetMap</a>' + '<br>' +  '<a href="http://www.openstreetmap.org/edit?' + feature.properties.id + ' " target="_blank">Edit with iD (in-browser editor)</a>' ;  
   			layer.bindPopup(popupText);
		}

     
        function style_clinic() {
            return { pane: 'pane_clinic', radius: 5.0, opacity: 1, color: 'rgba(0,0,0,1.0)', dashArray: '', lineCap: 'butt', lineJoin: 'miter', weight: 1, fillOpacity: 0.55, fillColor: 'rgba(0, 255, 0, 3.3)' }
        }
        
        map.createPane('pane_clinic');
        map.getPane('pane_clinic').style.zIndex = 401;
        map.getPane('pane_clinic').style['mix-blend-mode'] = 'normal';
        var layer_clinic = new L.geoJson(clinic, {
            attribution: '<a href=""></a>',
            pane: 'pane_clinic',
            onEachFeature: pop_clinic,
            pointToLayer: function (feature, latlng) {
                var context = {
                    feature: feature,
                    variables: {}
                };
                return L.circleMarker(latlng, style_clinic(feature))
            },
        });
        var clusterclinic = new L.MarkerClusterGroup({showCoverageOnHover: false});
        clusterclinic.addLayer(layer_clinic);

//-------------------------------------------------------------------------------------------------------------------------------

	//Voronoi - water source 
	var stylewatersource = { "color": "purple", "weight": 0.5, "opacity": 0.75 };
	var watersourcePop = L.esri.featureLayer({ url: 'https://services6.arcgis.com/qnuLPzqZhawWzvJ1/arcgis/rest/services/Pop%20for%20each%20water%20source%20-%20voronoi/FeatureServer/0/', style: stylewatersource 	});

	var labels = {};

  	watersourcePop.on('createfeature', function(e){
    var id = e.feature.id;
    var feature = watersourcePop.getFeature(id);
    var center = feature.getBounds().getCenter();
    var label = L.marker(center, {
      icon: L.divIcon({
        iconSize: null,
        className: 'label',
        html: '<div>' + e.feature.properties.Population + '</div>'
      })
    }).addTo(map);
    labels[id] = label;
  	});

 	 watersourcePop.on('addfeature', function(e){
  	  var label = labels[e.feature.id];
  	  if(label){
   	   label.addTo(map);
 	   }
 	 });

  	watersourcePop.on('removefeature', function(e){
   	 var label = labels[e.feature.id];
  	  if(label){
   	   map.removeLayer(label);
 	   }
 	 });


	// listen for when all features have been retrieved from the server
  	watersourcePop.once("load", function(evt) {
    // create a new empty Leaflet bounds object
    var bounds = L.latLngBounds([]);
    // loop through the features returned by the server
    watersourcePop.eachFeature(function(layer) {
      // get the bounds of an individual feature
      var layerBounds = layer.getBounds();
      // extend the bounds of the collection to fit the bounds of the new feature
      bounds.extend(layerBounds);
    });

    // once we've looped through all the features, zoom the map to the extent of the collection
    map.fitBounds(bounds);
  });

//-------------------------------------------------------------------------------------------------------------------------------

	//Sukuma ward - population density

	function PopDensColorSukuma(d) {
			return d > 200 ? '#6e016b' :
			       d > 150 ? '#88419d' :
			       d > 100 ? '#8c6bb1' :
			       d > 50 ? '#8c96c6' :
			       d > 25 ? '#9ebcda' :
			       d > 10 ? '#bfd3e6' :
				   			'#edf8fb'; 	
		}

	function styleSukumadens(feature) {								// tematic map details - import the average age properties
		return { fillColor: PopDensColorSukuma((feature.properties.density)), weight: 0.5, opacity: 1, color: 'black', fillOpacity: 0.45 };
		}

	var Sukumadens = L.esri.featureLayer({ url: 'https://services6.arcgis.com/qnuLPzqZhawWzvJ1/arcgis/rest/services/Sukuma%20weighted%20Density/FeatureServer/0/', style: styleSukumadens 	});

	// listen for when all features have been retrieved from the server
  Sukumadens.once("load", function(evt) {
    // create a new empty Leaflet bounds object
    var bounds = L.latLngBounds([]);
    // loop through the features returned by the server
    Sukumadens.eachFeature(function(layer) {
      // get the bounds of an individual feature
      var layerBounds = layer.getBounds();
      // extend the bounds of the collection to fit the bounds of the new feature
      bounds.extend(layerBounds);
    });

    // once we've looped through all the features, zoom the map to the extent of the collection
    map.fitBounds(bounds);
  	});
	
//-------------------------------------------------------------------------------------------------------------------------------
	  
	//Bing maps key and import
	var bing_key = 'AopsdXjtTu-IwNoCTiZBtgRJ1g7yPkzAi65nXplc-eLJwZHYlAIf2yuSY_Kjg3Wn'
	var imagerySet = "Aerial";
	var	bing = L.tileLayer.bing(bing_key, {type: imagerySet});

	//Basemaps are added
	// olda basamap with digitalglobe: var baseMaps = {"OpenStreetMap": openstreetmap, "DarkMatter": CartoDB_DarkMatter, "Bing map - Aerial": bing, "ESRI - Aerial": WorldImagery, "DigitalGlobe": digitalglobe };
	var baseMaps = {"OpenStreetMap": openstreetmap, "DarkMatter": CartoDB_DarkMatter, "Bing map - Aerial": bing, "ESRI - Aerial": WorldImagery };
	
	// Overlay layers are grouped
    var groupedOverlays = {
        "Administrative divisions of Tanzania": {
        "Tanzania Regions": TNZADM1,
		"Tanzania Districts": TNZADM2
		 },
		"Socioeconomic data - ward level": {
        "Population density": Allwards,
		"Total population": Totalpop
		 },
        "Crowdsourced data": {
		  "CrowdAI test data - Ihanja ward": crowdai, 
		  "Field papers": TNZFieldpaper,
		  "Mapswipe tasks in Tanzania": TanzaniaMapSwipe,
		  "Selected wards": wards,
		  "Missing Maps tasks - Tanzania Development Trust": TNZDevelopmentTrust,
		  "Missing Maps tasks - PEPFAR project": TNZmaholi, 
		  "Missing Maps tasks - Tanzania Mini-Grids project": TNZMinigrids,
		  ' FGM last season <br /> Legend: Total cases<table><tr><td style="text-align: center;"><img src="legend/FGMfeb170_1250.png" /></td><td> 1 - 25 </td></tr><tr><td style="text-align: center;"><img src="legend/FGMfeb170_25501.png" /></td><td> 25 - 50 </td></tr><tr><td style="text-align: center;"><img src="legend/FGMfeb170_50752.png" /></td><td> 50 - 75 </td></tr><tr><td style="text-align: center;"><img src="legend/FGMfeb170_751003.png" /></td><td> 75 - 100 </td></tr><tr><td style="text-align: center;"><img src="legend/FGMfeb170_1001504.png" /></td><td> 100 - 150 </td></tr><tr><td style="text-align: center;"><img src="legend/FGMfeb170_1502005.png" /></td><td> 150 - 200 </td></tr><tr><td style="text-align: center;"><img src="legend/FGMfeb170_2002506.png" /></td><td> 200 - 250 </td></tr><tr><td style="text-align: center;"><img src="legend/FGMfeb170_2507.png" /></td><td> 250 - </td></tr></table>': layer_FGMfeb170
		},
		"OSM building distribution - Mara region": {
		  "Mara region OSM building density": Marabuilding,
		  "Mara region OSM building grid": layer_Kapcsoltrteg0
		},
		"Education and health data (based on OSM)":{
		' <img src="legend/hospital.png" /> Hospitals in Tanzania' : cluster_hospital,
		' <img src="legend/school.png" /> Schools in Tanzania' : cluster_school,
		' <img src="legend/clinic.png" /> Clinics in Tanzania' : clusterclinic
		},
		"MapSwipe data analysis for Sukuma ward":{
		"Pop for each water source - Voronoi tessellation": watersourcePop,
		"Population density": Sukumadens		
		}
      };

	//var options = {
      // Make the "Landmarks" group exclusive (use radio inputs)
//      exclusiveGroups: ["Socioeconomic data"]  
  //    };



	//Control panel
	var control = L.control.groupedLayers(baseMaps, groupedOverlays )
	control.addTo(map);
	openstreetmap.addTo(map);


	//print option
	L.easyPrint({
	title: 'Print the map you see ...',
	position: 'topleft',
	elementsToHide: 'p, h2'
	}).addTo(map);



	var drawnItems = new L.FeatureGroup();
     map.addLayer(drawnItems);
     
	 var drawControl = new L.Control.Draw({
		polygon: {
			shapeOptions: {color: 'gray'},
			allowIntersection: false,
			drawError: {color: 'orange', timeout: 1000},
			showArea: true,
			metric: false
			},
		edit: {
            featureGroup: drawnItems
         	}
     });
     map.addControl(drawControl);

	map.on('draw:created', function (e) {
    	var type = e.layerType,
            layer = e.layer;
        drawnItems.addLayer(layer);
    });

	document.getElementById('export').onclick = function(e) {
    	var data = drawnItems.toGeoJSON();
    	var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data));
		document.getElementById('export').setAttribute('href', 'data:' + convertedData);
    	document.getElementById('export').setAttribute('download','data.geojson');
        }





	//OSM Geocoder 
	var osmGeocoder = new L.Control.OSMGeocoder({collapsed:false, position: 'topright', text: 'Find!', placeholder: 'OSMGeocoder Search...'});
	osmGeocoder.addTo(map);
	

	//The Leaflet.FileLayer plugin adds the ability to load a gps trace in the form of a KML, GPX or GeoJSON file to a Leaflet map. 
	//The idea being that if you have gone on a journey and captured the trip using a gps it can be loaded easily onto a map for viewing.
	var style = {color:'grey', opacity: 1.0, fillOpacity: 0.5, weight: 2, clickable: false};
	L.Control.FileLayerLoad.LABEL = '<img class="icon" src="folder.svg" alt="file icon"/>';
    L.Control.fileLayerLoad({
            fitBounds: true,
            layerOptions: {
                style: style,
                pointToLayer: function (data, latlng) {
                    return L.circleMarker(
                    latlng,
                    { style: style }
                    );
                }
            }
        }).addTo(map);



// Call the getContainer routine.
var htmlObject = control.getContainer();
// Get the desired parent node.
var a = document.getElementById('layerselector');

}


		

