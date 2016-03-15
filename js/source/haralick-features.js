/**
 * Created by Kamil on 2016-03-12.
 */
'use strict';
var StatisticalProperties = require('./statistical-properties');

class HaralickFeaturesCalculator {
    constructor(coocMatrix) {
        this.coocMatrix = coocMatrix;
        this.statisticalProperties = new StatisticalProperties(coocMatrix);
    }

    //aSC - angular Second Moment
    angularSecondMoment() {
        var aSC = 0, self = this;

        this.coocMatrix.forEach(function (value, index, matrix) {
            aSC = aSC + Math.pow(self.statisticalProperties.p(index[0], index[1]),2);
        });

        return aSC;
    }

    contrast(){
        var contrast = 0;

        for(let i = 0; i < this.coocMatrix._size[0] - 1; i++ ) {
            contrast = contrast + (Math.pow(i, 2) * this.statisticalProperties.pxmy(i));
        }

        return contrast;
    }

    variance() {
        let variance = 0;

        this.coocMatrix.forEach(function (value, index, matrix) {
            variance = variance + Math.pow(index[0] - this.statisticalProperties.mi(),2) * value;
        });

        return variance;
    }

    correlation() {
        let correlation = 0;

        this.coocMatrix.forEach(function (value, index, matrix) {
            correlation = correlation + ((index[0] - this.statisticalProperties.miX()) * (index[1] - this.statisticalProperties.miY())) / (this.statisticalProperties.sigmaX() * this.statisticalProperties.sigmaY()) * value;
        });

        return correlation;
    }

    inverseDifferenceMoment() {
        let idMoment = 0;

        this.coocMatrix.forEach(function (value, index) {
            idMoment = idMoment + value / (1 + Math.pow(index[0] - index[1], 2));
        });

        return idMoment;
    }

    sumAverage() {
        let sumAverage = 0;

        this.coocMatrix.forEach(function (value, index) {
            sumAverage = sumAverage;
        });

        return sumAverage;
    }

    SumVariance() {
        let sumVariance = 0;

        for (let i = 0; i < 2 * this.coocMatrix._size[0] - 2; i++) {
            sumVariance = sumVariance + Math.pow(i - this.sumEntropy(), 2) * this.statisticalProperties.pxpy(i);
        }

        return sumVariance;
    }

    sumEntropy() {
        let sumEntropy = 0;

        for (let i = 0; i < 2 * this.coocMatrix._size[0] - 2; i++) {
            sumEntropy = sumEntropy + this.statisticalProperties.pxpy(i) * Math.log(this.statisticalProperties.pxpy(i));
        }

        return -sumEntropy;
    }

    entropy() {
        let entropy = 0;

        this.coocMatrix.forEach(function (value, index) {
            entropy = entropy + value * Math.log(value);
        });

        return -entropy;
    }

    /* leave it for a moment
    differenceVariance() {
        let diffVariance = 0;

        this.coocMatrix.forEach(function (value, index) {
            diffVariance = diffVariance;
        });

        return diffVariance;
    } */

    differenceEntropy() {
        let diffEntropy = 0;

        for (let i = 0; i < this.coocMatrix._size[0] - 1; i++) {
            diffEntropy = diffEntropy + this.statisticalProperties.pxmy(i) * Math.log(this.statisticalProperties.pxmy());
        }

        return diffEntropy;
    }

    /* leave for latest version
    infoMeasureOfCorrelation1() {
        let iMOC = 0;

        this.coocMatrix.forEach(function (value, index) {
            iMOC = iMOC = ;
        });

        return iMOC;
    }

    infoMeasureOfCorrelation2() {
        let sumAverage = 0;

        this.coocMatrix.forEach(function (value, index) {
            sumAverage = sumAverage;
        });

        return sumAverage;
    }

    maxCorrelationCoeff() {
        let sumAverage = 0;

        this.coocMatrix.forEach(function (value, index) {
            sumAverage = sumAverage;
        });

        return sumAverage;
    }

    hx() {

    }
    */
}

module.exports = HaralickFeaturesCalculator;