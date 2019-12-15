const ExifImage = require('exif');
const fs = require('fs');
const path = require('path');
const args = require('yargs').argv;

// pull out arguments
if (!args.target) throw new Error('No target folder provided');
if (!args.dest) throw new Error('No destination provided');
const sourceFolder = path.resolve(args.target);
const destinationFile = path.resolve(args.dest);
const minDate = args.min ? new Date(args.min) : null;
const maxDate = args.max ? new Date(args.max) : null;

// load in the custom locations
const customLocations = {};
if (args['custom-locations']) {

    const customLocationsFile = args['custom-locations'];
    try {

        let file = fs.readFileSync(customLocationsFile, 'utf-8');

        // remove comments
        file = file.replace(/#[^\n]\n/g, '');

        // read in each line
        const lines = file.split(/\n/g);
        lines.forEach(line => {

            const split = line.trim().split(/\s+/g);

            // process into "imagename : { lat, long }"
            const image = split[0];
            const lat = parseFloat(split[1]);
            const lon = parseFloat(split[2]);

            let err = split.length !== 3 || Number.isNaN(lat) || Number.isNaN(lon);

            if (err) {

                console.error(`Error prcessing custom-lcations line "${ line }"`);

            } else {

                customLocations[image] = { lat, lon };

            }

        });

    } catch (e) {

        console.error(`Error reading custom-locations file "${ customLocationsFile }"`);
        console.error(e);

    }

}

// helper for processing the exif date to a Date()
const exifDate2Date = str => {

    const split = str.split(' ');
    split[0] = split[0].replace(/:/g, '/');
    return new Date(split.join(' '));

};

// convert dms coordinates into decimal coordinates
// https://en.wikipedia.org/wiki/Decimal_degrees
const dms2dec = (d, m, s, ref) => (ref === 'S' || ref === 'W' ? -1 : 1) * (d + m / 60 + s / 3600);

// synchronous processing of the exif data
const getExif = path => new Promise(done => new ExifImage({ image: path }, (err, data) => done(data)));

(async function() {

    // reduce the exif data down to just the GPS, name, and date
    let data;
    data = fs.readdirSync(sourceFolder);
    console.log(`Found ${ data.length } files`);

    // jpg files only
    data = data.filter(file => /\.jpg$/.test(file));
    console.log(`Found ${ data.length } jpg files`);

    // pull out exif data
    for (const i in data) {

        const file = data[i];
        const filePath = path.join(sourceFolder, file);
        const res = await getExif(filePath);

        if ( res ) {

            res.__filename = file;
            res.__jsDate = res.exif.DateTimeOriginal ? new Date(exifDate2Date(res.exif.DateTimeOriginal)) : null;

        }

        data[i] = res;

    }
    data = data.filter( i => i );
    console.log('Read exif data');

    // filter to data that provides the gps data
    data = data.filter(exif => !!(exif.gps.GPSLatitude || exif.gps.GPSLongitude) || exif.__filename in customLocations);
    console.log(`Found ${ data.length } files with gps data`);

    // filter to the time range
    data = data.filter(exif => (!minDate || exif.date > minDate) && (!maxDate || exif.date < maxDate));
    console.log(`Found ${ data.length } files within the time range`);

    // reduce to a helpful subset of data
    data = data.map(exif => {

        const out = {};
        out.filename = exif.__filename;
        out.date = exif.__jsDate;

        if (exif.__filename in customLocations) {

            out.lat = customLocations[exif.__filename].lat;
            out.lon = customLocations[exif.__filename].lon;
            out.custom = true;

        } else {

            out.lat = dms2dec(...exif.gps.GPSLatitude, exif.gps.GPSLatitudeRef);
            out.lon = dms2dec(...exif.gps.GPSLongitude, exif.gps.GPSLongitudeRef);
            out.custom = false;

        }

        return out;

    })

        // sort in ascending date order
        .sort((a, b) => a.date - b.date);
    console.log('Sorted');

    fs.writeFile(destinationFile, JSON.stringify(data), () => {

        let output = `Wrote GPS exif data for ${ data.length } images to '${ destinationFile }' `;
        if (minDate || maxDate) {

            output += 'for photos taken ';
            if (minDate) output += `after '${ minDate }' `;
            if (minDate && maxDate) output += 'and ';
            if (maxDate) output += `before '${ maxDate }'`;

        }
        console.log(output);

    });
})();
