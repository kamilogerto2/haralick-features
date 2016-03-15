/**
 * Created by Kamil on 2016-03-15.
 */
'use strict';
var StatisticalProperties = require('../statistical-properties');
var math = require('mathjs');
var COOCMCalculator = require('../co-oc-matrix');

var y = math.matrix([[1, 1, 2], [3, 2, 2], [1, 1, 1]]);
//console.log(y);

/* COOCM
 | 0  0    0     0    |
 | 0  0.5  0.08  0    |
 | 0  0.08 0.016 0.08 |
 | 0  0    0.08  0    | */
var coocm = new COOCMCalculator(4, 1, 'horizontally');
var coocmMatrix = coocm.calculateCOOCM(y);
var statisticalProperties = new StatisticalProperties(coocmMatrix, true);

//should be 0.16
console.log('p(2,2): ' + statisticalProperties.p(2,2));

//should be 0.8
console.log('p(3,2): ' + statisticalProperties.p(3,2));

//should be 0.33
console.log('px(2): ' + statisticalProperties.px(2));

//should be 0.8
console.log('px(3): ' + statisticalProperties.px(3));

//should be 0.33
console.log('py(2): ' + statisticalProperties.py(2));

//should be 0.8
console.log('py(3): ' + statisticalProperties.py(3));

//should be 1
console.log('r: ' + statisticalProperties.r());

//should be [0 0 0.5 0.16 0.16 0.16 0]
console.log('pxpy: ' + statisticalProperties.pxpy());

//should be [0.66 0.33 0 0]
console.log('pxmy: ' + statisticalProperties.pxmy());