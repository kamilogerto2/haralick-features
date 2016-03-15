/**
 * Created by Kamil on 2016-02-24.
 */
'use strict';
// load math.js
var math = require('mathjs');
var HaralickFeaturesCalculator = require('./haralick-features');

// use math.js
//var x = math.zeros(3, 3);
//console.log(x);
var y = math.matrix([[1, 3, 1], [2, 1, 0], [1, 1, 2]]);
console.log(y);

var coocm = new COOCMCalculator(4);
coocm.calculateCOOCM(1, 1, y);
coocm.calculateFeatures();


//matrix 1st element - verse
//2nd element - column
function COOCMCalculator(greyLevels) {
    this.ngLevel = greyLevels;
    this.coocmMatrix = math.zeros(this.ngLevel, this.ngLevel);
    this.featuresCalculator;
    this.orientation;
    this.distance;

    this.calculateCOOCM = function (distance, orientation, sourceMatrix) {
        var self = this,
            nextValue = 0,
            prevoiusValue = 0,
            sum = 0;

        sourceMatrix.forEach(function (value, index, matrix) {
            //here is the algorithm which calculate COOCM
            //now for only one orientation = horizontally
            if (index[1] + distance <= sourceMatrix._size[1] - 1) {
                nextValue = sourceMatrix.subset(math.index(index[0], index[1] + distance));
                self.incrementCOOCMMatrix(value, nextValue);
            }
            if (index[1] - distance >= 0) {
                prevoiusValue = sourceMatrix.subset(math.index(index[0], index[1] - distance));
                self.incrementCOOCMMatrix(value, prevoiusValue);
            }

            /* TODO TEST
            //vertically
            if (index[0] + distance <= sourceMatrix._size[0] - 1) {
                nextValue = sourceMatrix.subset(math.index(index[0], index[0] + distance));
                self.incrementCOOCMMatrix(value, nextValue);
            }
            if (index[0] - distance >= 0) {
                prevoiusValue = sourceMatrix.subset(math.index(index[0], index[0] - distance));
                self.incrementCOOCMMatrix(value, prevoiusValue);
            }

            //45st
            if (index[1] + distance <= sourceMatrix._size[1] - 1 && index[0] - distance >= 0 ) {
                nextValue = sourceMatrix.subset(math.index(index[0] + distance, index[1] - distance));
                self.incrementCOOCMMatrix(value, nextValue);
            }
            if (index[1] - distance >= 0 && index[0] + distance <= sourceMatrix._size[0] - 1) {
                prevoiusValue = sourceMatrix.subset(math.index(index[0] - distance, index[1] + distance));
                self.incrementCOOCMMatrix(value, prevoiusValue);
            }

            //135st
            if (index[0] + distance <= sourceMatrix._size[0] - 1 && index[1] - distance >= 0 ) {
                nextValue = sourceMatrix.subset(math.index(index[0] + distance, index[1] + distance));
                self.incrementCOOCMMatrix(value, nextValue);
            }
            if (index[0] - distance >= 0 && index[1] + distance <= sourceMatrix._size[1] - 1) {
                prevoiusValue = sourceMatrix.subset(math.index(index[0] - distance, index[1] - distance));
                self.incrementCOOCMMatrix(value, prevoiusValue);
            }
            */

            console.log('nextValue:', nextValue, 'previousValue:', prevoiusValue);
        });

        this.coocmMatrix.forEach(function (value) {
            sum = sum + value;
        });

        console.log(this.coocmMatrix._data);
        var self = this;
        this.coocmMatrix.forEach(function (value, index) {
            //console.log(index);
            self.coocmMatrix.subset(math.index(index[0], index[1]),  value / sum);
        });
        console.log(this.coocmMatrix._data);
    };

    //incrementing cooc matrix - remember that this matrix is simmetric
    this.incrementCOOCMMatrix = function (verse, column) {
        //console.log('verse', verse, 'column', column);
        //console.log(this.coocmMatrix._data);
        //console.log(this.coocmMatrix._size);
        this.coocmMatrix.subset(math.index(verse, column), this.coocmMatrix.subset(math.index(verse, column)) + 1);
        if (verse !== column) {
            this.coocmMatrix.subset(math.index(column, verse), this.coocmMatrix.subset(math.index(verse, column)));
        }
    };

    this.calculateFeatures = function () {
        this.featuresCalculator = new HaralickFeaturesCalculator(this.coocmMatrix);
        this.featuresCalculator.angularSecondMoment();
    };
}





