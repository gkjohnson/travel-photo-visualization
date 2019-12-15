# travel-photo-visualization

Processes EXIF data from a set of images into a thinner JSON blob that can be used to plot the locations on a map! Built to help visualize and document trips.

![example](docs/example.png)

## To Run

Install the npm packages with `npm install`

Run `node index.js --target=".../images/trip" --dest=".../dest.json"` with the arguments described below to generate a JSON file that can be graphed!

## Command Line Arguments
### target
*Required*

The source folder to read images from.

### dest
*Required*

Destination file to output the JSON to.

### min
*Optional*

Javascript parse-able date string that will be used to define the min bound of which images should be considered relevant.

### max
*Optional*

Javascript parse-able date string that will be used to define the max bound of which images should be considered relevant.

### custom-locations
*Optional*

File path to load with each line containing a filename and the latitude and longitude separated by whitespace to map the a particular image.

## Output
The output file is an array of JSON objects that define the image name, date, lat / lon sorted in date-ascending order, and a boolean indicating whether or not the lat / lon are from the custom locations file.
```
[{
  filename: <original filename>,
  date:     <date string>,
  lat:      <latitude>,
  lon:      <longitude>,
  custom:   <boolean>
},
...]
```

## Plans
- Display image on hover
- Animated trip playback
- An "interpolation" or "nearest-time" mode where photos without data are not dropped but grouped together
- Save view locations and zoom level for easy sharing
