//google maps api
var map;
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: new google.maps.LatLng(50.864, 4.3517),
        zoom: 13,
        //snazzymaps candy
        styles: [
    {
        "featureType": "landscape",
        "stylers": [
            {
                "hue": "#FFE100"
            },
            {
                "saturation": 34.48275862068968
            },
            {
                "lightness": -1.490196078431353
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.highway",
        "stylers": [
            {
                "hue": "#FF009A"
            },
            {
                "saturation": -2.970297029703005
            },
            {
                "lightness": -17.815686274509815
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "stylers": [
            {
                "hue": "#FFE100"
            },
            {
                "saturation": 8.600000000000009
            },
            {
                "lightness": -4.400000000000006
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "road.local",
        "stylers": [
            {
                "hue": "#00C3FF"
            },
            {
                "saturation": 29.31034482758622
            },
            {
                "lightness": -38.980392156862735
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "water",
        "stylers": [
            {
                "hue": "#0078FF"
            },
            {
                "saturation": 0
            },
            {
                "lightness": 0
            },
            {
                "gamma": 1
            }
        ]
    },
    {
        "featureType": "poi",
        "stylers": [
            {
                "hue": "#00FF19"
            },
            {
                "saturation": -30.526315789473685
            },
            {
                "lightness": -22.509803921568633
            },
            {
                "gamma": 1
            }
        ]
    }
]
    });
    
    var script = document.createElement('script');
    script.src="comic-book-route_geojson.js";
    document.getElementsByTagName('head')[0].appendChild(script);
    
    window.eqfeed_callback = function(results) {
        function pause(i){
            setTimeout(function(){
                var coords = results.features[i].geometry.coordinates;
                var latLng = new google.maps.LatLng(coords[1],coords[0]);
              
                var marker = new google.maps.Marker({
                    position: latLng,
                    animation: google.maps.Animation.DROP,
                    map: map
                });
                
                var character = '<div id=bubbleText>' + results.features[i].properties.personnage_s + '</div>' ;
                var infowindow = new google.maps.InfoWindow({
                    content: character
                });

                marker.addListener('mouseover', function(){
                    var picture = '<img src="images/' + results.features[i].properties.photo.filename + '">';
                    infowindow.setContent(infowindow.content + picture);
                    infowindow.open(map, marker);
                });
                marker.addListener('mouseout', function(){
                    infowindow.close(map, marker);
                    infowindow.setContent(character);
                });

                var counter = 0;

                var picture = document.createElement('img');
                picture.src = 'images/' + results.features[i].properties.photo.filename;
                picture.id = 'float';

                var popup = document.createElement('div');
                popup.id = 'popup';

                var blocker = document.createElement('div');
                blocker.id = 'blocker';

                blocker.addEventListener('click', function(){
                    document.getElementById('popup').remove();
                    document.getElementById('blocker').remove();
                });
                marker.addListener('click', function(){
                    infowindow.close();

                    if(counter != 0 && document.getElementById('blocker') != null){
                            document.getElementById('popup').remove();
                            document.getElementById('blocker').remove();
                            document.getElementById('float').remove();
                    }
                    document.getElementsByTagName('body')[0].appendChild(blocker);
                    document.getElementsByTagName('body')[0].appendChild(popup);
                    var div = document.createElement('div');
                    document.getElementById('popup').append(div);
                    div.id = 'wiki';
                    
                    new function wikiArt(){
                        var api = 'https://en.wikipedia.org/w/api.php?action=query&prop=extracts&format=json&exsentences=10&list=search&origin=*&srsearch=';
                        var toon = results.features[i].properties.personnage_s;
                        var artist = results.features[i].properties.auteur_s;
                        var titleSearch = api  + toon.replace(/\s/g, '%20') + '%20' + artist.replace(/\s/g, '%20') + '%20' + 'comic';

                        var name = {};
                        var api2 = 'https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exchars=1000&explaintext&origin=*&titles=';

                        var xhttp1 = new XMLHttpRequest();
                        xhttp1.onreadystatechange = function(){
                            if(this.readyState == 4 && this.status == 200){
                                var xmlProps1 = this.responseText;
                                var obj1 = JSON.parse(xmlProps1);
                                name.title = (obj1.query.search[0].title);
                            }
                        }                       
                        xhttp1.open('GET', titleSearch, true);
                        xhttp1.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                        xhttp1.send();
                       
                        
                        var sentenceSearch;
                        
                        setTimeout(function(){
                            sentenceSearch = api2 + name.title;
                        }, 500);
                        

                        var xhttp = new XMLHttpRequest();
                        xhttp.onreadystatechange = function(){
                            if (this.readyState == 4 && this.status == 200) {
                                var xmlProps = this.responseText;
                                var obj = JSON.parse(xmlProps);
                    
                                console.log(obj);

                                document.getElementById('wiki').innerHTML = character + '<p>' + obj.query + '</p>';
                                document.getElementById('wiki').prepend(picture);
                                
                                picture.style.width= '40%';
                                picture.style.margin='3% auto 2%';
                            }
                          }
                        xhttp.open('GET', sentenceSearch, true);
                        xhttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
                        xhttp.send();
                        
                    }
                    counter++;
                });

            }, i * 60);   
        }
        for(i = 0; i < results.features.length; i++){
            pause(i);
        }
    } 
}