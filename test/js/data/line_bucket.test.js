'use strict';

const test = require('mapbox-gl-js-test').test;
const fs = require('fs');
const path = require('path');
const Protobuf = require('pbf');
const VectorTile = require('vector-tile').VectorTile;
const Point = require('point-geometry');
const LineBucket = require('../../../js/data/bucket/line_bucket');
const StyleLayer = require('../../../js/style/style_layer');

// Load a line feature from fixture tile.
const vt = new VectorTile(new Protobuf(fs.readFileSync(path.join(__dirname, '/../../fixtures/mbsv5-6-18-23.vector.pbf'))));
const feature = vt.layers.road.feature(0);

test('LineBucket', function(t) {
    const layer = new StyleLayer({ id: 'test', type: 'line', layout: {} });
    const bucket = new LineBucket({
        buffers: {},
        layer: layer,
        childLayers: [layer]
    });
    bucket.createArrays();

    const pointWithScale = new Point(0, 0);
    pointWithScale.scale = 10;

    // should throw in the future?
    t.equal(bucket.addLine([
        new Point(0, 0)
    ], {}), undefined);

    // should also throw in the future?
    // this is a closed single-segment line
    t.equal(bucket.addLine([
        new Point(0, 0),
        new Point(0, 0)
    ], {}), undefined);

    t.equal(bucket.addLine([
        new Point(0, 0),
        new Point(10, 10),
        new Point(10, 20)
    ], {}), undefined);

    t.equal(bucket.addLine([
        new Point(0, 0),
        new Point(10, 10),
        new Point(10, 20),
        new Point(0, 0)
    ], {}), undefined);

    t.equal(bucket.addFeature(feature), undefined);

    t.end();
});
