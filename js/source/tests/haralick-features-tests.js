/**
 * Created by Kamil on 2016-03-15.
 */
'use strict';
var StatisticalProperties = require('../statistical-properties');
var math = require('mathjs');
var COOCMCalculator = require('../co-oc-matrix');
var HaralickFeaturesCalculator = require('../haralick-features');

var y = math.matrix([[1, 1, 2], [3, 2, 2], [1, 1, 1]]);
//console.log(y);

/* COOCM
 | 0  0    0     0    |
 | 0  0.5  0.08  0    |
 | 0  0.08 0.016 0.08 |
 | 0  0    0.08  0    | */
var coocm = new COOCMCalculator(4, 1, 'horizontally');
var coocmMatrix = coocm.calculateCOOCM(y);

var haralickCalculator = new HaralickFeaturesCalculator(coocmMatrix);
//objects created correctly

haralickCalculator.angularSecondMoment();
haralickCalculator.contrast();
haralickCalculator.correlation();
haralickCalculator.differenceEntropy();
haralickCalculator.entropy();
haralickCalculator.inverseDifferenceMoment();
haralickCalculator.sumAverage();
haralickCalculator.sumEntropy();
haralickCalculator.SumVariance();
haralickCalculator.variance();