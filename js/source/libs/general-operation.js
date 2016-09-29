/**
 * Created by Kamil on 2016-03-15.
 */
var math = require('mathjs');
var HaralickFeaturesCalculator = require('./haralick-features');
var COOCMCalculator = require('./co-oc-matrix');

// use math.js
//var x = math.zeros(3, 3);
//console.log(x);
var y = math.matrix([[1, 3, 1], [2, 1, 0], [1, 1, 2]]);
console.log(y);

var coocm = new COOCMCalculator(4, 1, '135st');
coocm.calculateCOOCM(y);
//coocm.calculateFeatures();
