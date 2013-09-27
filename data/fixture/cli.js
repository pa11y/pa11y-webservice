'use strict';

var loadFixtures = require('./load');

loadFixtures(process.env.NODE_ENV, function (err) {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log('Fixtures added');
    process.exit(err ? 1 : 0);
});
