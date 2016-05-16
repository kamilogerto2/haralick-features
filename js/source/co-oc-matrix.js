/**
 * Created by Kamil on 2016-02-24.
 */
'use strict';
var math = require('mathjs');

//matrix 1st element - verse
//2nd element - column
class COOCMCalculator {
    constructor(greyLevels, distance, orientation) {
        this.ngLevel = greyLevels ? greyLevels : 255;
        this.coocmMatrix = null;
        this.orientation = orientation ? orientation : 'horizontally';
        this.distance =distance ? distance : 1;
    }

    calculateCOOCM(sourceMatrix) {
        var self = this,
            nextValue = 0,
            previousValue = 0,
            sum = 0;

        this.coocmMatrix = math.zeros(this.ngLevel, this.ngLevel);

        sourceMatrix.forEach(function (value, index) {
            //here is the algorithm which calculate COOCM
            //now for only one orientation = horizontally
            switch (self.orientation) {
                case 'horizontally':
                {
                    if (index[1] + self.distance <= sourceMatrix._size[1] - 1) {
                        nextValue = sourceMatrix.subset(math.index(index[0], index[1] + self.distance));
                        self.incrementCOOCMMatrix(value, nextValue);
                    }
                    if (index[1] - self.distance >= 0) {
                        previousValue = sourceMatrix.subset(math.index(index[0], index[1] - self.distance));
                        self.incrementCOOCMMatrix(value, previousValue);
                    }
                    break;
                }

                case 'vertically':
                {
                    //TODO TEST
                    //vertically
                    if (index[0] + self.distance <= sourceMatrix._size[0] - 1) {
                        nextValue = sourceMatrix.subset(math.index(index[0] + self.distance, index[1]));
                        self.incrementCOOCMMatrix(value, nextValue);
                    }
                    if (index[0] - self.distance >= 0) {
                        previousValue = sourceMatrix.subset(math.index(index[0] - self.distance, index[1]));
                        self.incrementCOOCMMatrix(value, previousValue);
                    }
                    break;
                }

                case '45st':
                {
                    //45st
                    if (index[1] + self.distance <= sourceMatrix._size[1] - 1 && index[0] - self.distance >= 0) {
                        nextValue = sourceMatrix.subset(math.index(index[0] - self.distance, index[1] + self.distance));
                        self.incrementCOOCMMatrix(value, nextValue);
                    }
                    if (index[1] - self.distance >= 0 && index[0] + self.distance <= sourceMatrix._size[0] - 1) {
                        previousValue = sourceMatrix.subset(math.index(index[0] + self.distance, index[1] - self.distance));
                        self.incrementCOOCMMatrix(value, previousValue);
                    }
                    break;
                }

                case '135st':
                {
                    //135st
                    if (index[0] - self.distance >= 0 && index[1] - self.distance >= 0) {
                        nextValue = sourceMatrix.subset(math.index(index[0] - self.distance, index[1] - self.distance));
                        self.incrementCOOCMMatrix(value, nextValue);
                    }
                    if (index[0] + self.distance <= sourceMatrix._size[0] - 1 && index[1] + self.distance <= sourceMatrix._size[1] - 1) {
                        previousValue = sourceMatrix.subset(math.index(index[0] + self.distance, index[1] + self.distance));
                        self.incrementCOOCMMatrix(value, previousValue);
                    }
                    break;
                }

                default:
                    return false;
            }
        });

        // old approach

        this.coocmMatrix.forEach(function (value) {
            sum = sum + value;
        });

        //normalize coocmMatrix
        this.coocmMatrix.forEach(function (value, index) {
            self.coocmMatrix.subset(math.index(index[0], index[1]),  value / sum);
        });



        //show matrix in the console
        return this.coocmMatrix;
    }

    //incrementing cooc matrix - remember that this matrix is simmetric
    incrementCOOCMMatrix (verse, column) {
        this.coocmMatrix.subset(math.index(verse, column), this.coocmMatrix.subset(math.index(verse, column)) + 1);


        /*if (verse !== column) {
            this.coocmMatrix.subset(math.index(column, verse), this.coocmMatrix.subset(math.index(verse, column)));
        }*/
    }

    setDistance(distance) {
        this.distance = distance;
    }

    setOrientation(orientation) {
        this.orientation = orientation;
    }
}

module.exports = COOCMCalculator;