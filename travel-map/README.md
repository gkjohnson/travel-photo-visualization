# Travel Map

Map of traveled and hopeful world destinations.

## APIs

### Getting the location paths

APIs found [here](https://gis.stackexchange.com/questions/183248/getting-polygon-boundaries-of-city-in-json-from-google-maps-api).

- Search for the location on https://nominatim.openstreetmap.org/ (ie [Los Angeles](https://nominatim.openstreetmap.org/search.php?q=los+angeles&polygon_geojson=1&viewbox=)).

- Paste the relation id into the url `http://polygons.openstreetmap.fr/get_geojson.py?id=<rel id>&params=0` to load geo json (ie [Los Angeles](http://polygons.openstreetmap.fr/get_geojson.py?id=207359&params=0)) (original search page [here](http://polygons.openstreetmap.fr)).

## TODO

- Load the world map via Leaflet

- Add visited cities with larger context regions into a file with location names, relation ids, and trip years (if applicable)

- Add load bar to account for load latency

### Places
- Japan 2006
- Japan 2016
- New Zealand 2018
- London 2018
- Puerto Vallarta 2014?
- New York City 2008?
- Salt Lake City Utah
- Las Vegas, Arizona
- Seattle Washington
- Huston, Texas
- Whitefish Montana
- Cabo, Mexico
- Kauai, Hawaii
- San Francisco, California
- San Diego, California
- Sacramento, California
- New Mexico
