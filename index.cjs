const fs = require('fs');
const parser = require('csv-parse');

const parse = parser.parse;
const habitablePlanets = [];

const isHabitable = planet => {
    let habitable = true;
    // Makes sure the planet exists
    if (planet['koi_disposition'] !== 'CONFIRMED') {
        habitable = false;
    }
    // Makes sure it gets the right amount of light
    if (planet['koi_insol'] < .36 || planet['koi_insol'] > 1.11) {
        habitable = false;
    }
    // Makes sure it's the right size
    if (planet['koi_prad'] > 1.6) {
        habitable = false;
    }
    return habitable;
}

fs.createReadStream('kepler_data.csv')
    .pipe(parse({
         comment: '#',
         columns: true
    }))
    .on('data', (data) => {
        if (isHabitable(data)) {
            habitablePlanets.push(data);
        }
    })
    .on('error', (err) => {
        console.log(`An error has occured: ${err}`);
    })
    .on('end', () => {
        console.log(`${habitablePlanets.length} possibly habitable planets were found`);
        console.log('done');
    });