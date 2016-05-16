/**
 * Created by Kamil on 2016-02-24.
 */
'use strict';
var math = require('mathjs');

//matrix 1st element - verse
//2nd element - column
class COOCMCalculatorNew {
    constructor(greyLevels, distance, orientation) {
        this.ngLevel = greyLevels ? greyLevels : 255;
        this.coocmMatrix2 = new Float32Array([this.ngLevel * this.ngLevel]*1).fill(0);
        this.orientation = orientation ? orientation : 'horizontally';
        this.distance =distance ? distance : 1;
    }

    //assume that it is square
    calculateCOOCM(sourceMatrix, size) {
        var nextValue = 0,
            previousValue = 0,
            sum = 0,
            length,
            index = 0;

        length = sourceMatrix.length;
        for (index = 0; index < length; index++) {
            switch (this.orientation) {
                case 'horizontally':
                {
                    if (index % size + this.distance <= size - 1) {
                        nextValue = sourceMatrix[index + this.distance];
                        this.incrementCOOCMMatrix(sourceMatrix[index] - 1, nextValue - 1);
                    }
                    if (index % size - this.distance >= 0) {
                        previousValue = sourceMatrix[index - this.distance];
                        this.incrementCOOCMMatrix(sourceMatrix[index] - 1, previousValue - 1);
                    }
                    break;
                }
            }
        }



        /*sourceMatrix.forEach(function (value, index) {
            //here is the algorithm which calculate COOCM
            //now for only one orientation = horizontally
            switch (self.orientation) {
                case 'horizontally':
                {
                    if (index % size + self.distance <= sourceMatrix._size[1] - 1) {
                        nextValue = sourceMatrix.subset(math.index(index[0], index % size + self.distance));
                        self.incrementCOOCMMatrix(value, nextValue);
                    }
                    if (index % size - self.distance >= 0) {
                        previousValue = sourceMatrix.subset(math.index(index[0], index % size - self.distance));
                        self.incrementCOOCMMatrix(value, previousValue);
                    }
                    break;
                }

                case 'vertically':
                {
                    //TODO TEST
                    //vertically
                    if (index[0] + self.distance <= sourceMatrix._size[0] - 1) {
                        nextValue = sourceMatrix.subset(math.index(index[0] + self.distance, index % size));
                        self.incrementCOOCMMatrix(value, nextValue);
                    }
                    if (index[0] - self.distance >= 0) {
                        previousValue = sourceMatrix.subset(math.index(index[0] - self.distance, index % size));
                        self.incrementCOOCMMatrix(value, previousValue);
                    }
                    break;
                }

                case '45st':
                {
                    //45st
                    if (index % size + self.distance <= sourceMatrix._size[1] - 1 && index[0] - self.distance >= 0) {
                        nextValue = sourceMatrix.subset(math.index(index[0] - self.distance, index % size + self.distance));
                        self.incrementCOOCMMatrix(value, nextValue);
                    }
                    if (index % size - self.distance >= 0 && index[0] + self.distance <= sourceMatrix._size[0] - 1) {
                        previousValue = sourceMatrix.subset(math.index(index[0] + self.distance, index % size - self.distance));
                        self.incrementCOOCMMatrix(value, previousValue);
                    }
                    break;
                }

                case '135st':
                {
                    //135st
                    if (index[0] - self.distance >= 0 && index % size - self.distance >= 0) {
                        nextValue = sourceMatrix.subset(math.index(index[0] - self.distance, index % size - self.distance));
                        self.incrementCOOCMMatrix(value, nextValue);
                    }
                    if (index[0] + self.distance <= sourceMatrix._size[0] - 1 && index % size + self.distance <= sourceMatrix._size[1] - 1) {
                        previousValue = sourceMatrix.subset(math.index(index[0] + self.distance, index % size + self.distance));
                        self.incrementCOOCMMatrix(value, previousValue);
                    }
                    break;
                }

                default:
                    return false;
            }
        });*/
        length = this.coocmMatrix2.length;
        //ready for new approach
        //1600ms better
        for (index = 0; index < length; index++) {
            sum = sum + this.coocmMatrix2[index];
        }


        /*this.coocmMatrix2.forEach(function (value) {
         sum = sum + value;
         });*/

        //1500ms better
        if (sum) {
            for (index = 0; index < length; index++) {
                this.coocmMatrix2[index] = this.coocmMatrix2[index] / sum;
            }
        }

        /*this.coocmMatrix2.forEach(function (value, index) {
            //self.coocmMatrix.subset(math.index(index[0], index % size),  value / sum);
            self.coocmMatrix2[index] = value / sum;
        });*/

        //show matrix in the console
        //console.log(this.coocmMatrix2);
        return this.coocmMatrix2;
    }

    //incrementing cooc matrix - remember that this matrix is simmetric
    incrementCOOCMMatrix (verse, column) {
        //ready for new approach
        this.coocmMatrix2[verse * this.ngLevel + column] = this.coocmMatrix2[verse * this.ngLevel + column] + 1;


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

module.exports = COOCMCalculatorNew;