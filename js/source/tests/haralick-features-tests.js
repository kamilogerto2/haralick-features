/**
 * Created by Kamil on 2016-03-15.
 */
'use strict';
var Fiber = require('fibers');
var StatisticalProperties = require('../statistical-properties');
var math = require('mathjs');
var COOCMCalculator = require('../co-oc-matrix');
var HaralickFeaturesCalculator = require('../haralick-features');
var i = 0;

console.time("haralick calculation");
while(i<900) {
    i++;

//objects created correctly
    /*console.log('angularSecondMoment: ' + haralickCalculator.angularSecondMoment());
    console.log('contrast: ' + haralickCalculator.contrast());
    console.log('correlation: ' + haralickCalculator.correlation());
    console.log('differenceEntropy: ' + haralickCalculator.differenceEntropy());
    console.log('entropy: ' + haralickCalculator.entropy());
    console.log('inverseDifferenceMoment: ' + haralickCalculator.inverseDifferenceMoment());
    console.log('sumAverage: ' + haralickCalculator.sumAverage());
    console.log('sumEntropy: ' + haralickCalculator.sumEntropy());
    console.log('SumVariance: ' + haralickCalculator.SumVariance());
    console.log('variance: ' + haralickCalculator.variance());*/
    var y;

    Fiber( function () {
        y = math.matrix([[1, 1, 2], [3, 2, 2], [1, 1, 1]]);
//console.log(y);

        /* COOCM
         | 0  0    0     0    |
         | 0  0.5  0.08  0    |
         | 0  0.08 0.016 0.08 |
         | 0  0    0.08  0    | */
        var coocm = new COOCMCalculator(4, 1, 'horizontally');
        var coocmMatrix = coocm.calculateCOOCM(y);
        /*console.log('---------------1--------------------');
        console.log(coocmMatrix);
        console.log('---------------2--------------------');
        console.log(coocm.coocmMatrix2);*/
        //var haralickCalculator = new HaralickFeaturesCalculator(coocmMatrix);
        //haralickCalculator.angularSecondMoment();
       // haralickCalculator.contrast();
       // haralickCalculator.correlation();
        //haralickCalculator.differenceEntropy();
        //haralickCalculator.entropy();
        //haralickCalculator.inverseDifferenceMoment();
        //haralickCalculator.sumAverage();
        //haralickCalculator.sumEntropy();
        //  haralickCalculator.SumVariance();
        //haralickCalculator.variance();
    }).run();


}
console.timeEnd("haralick calculation");
