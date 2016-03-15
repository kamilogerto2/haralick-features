/**
 * Created by Kamil on 2016-03-15.
 */

var HaralickFeaturesCalculator = require('./haralick-features');

// use math.js
//var x = math.zeros(3, 3);
//console.log(x);
var y = math.matrix([[1, 3, 1], [2, 1, 0], [1, 1, 2]]);
console.log(y);

var coocm = new COOCMCalculator(4);
coocm.calculateCOOCM(1, 1, y);
coocm.calculateFeatures();
