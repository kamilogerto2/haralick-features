'use strict';
var math = require('mathjs');

//all ready to testing
class StatisticalPropertiesNew {

    constructor(coocMatrix, normalized, ngLevel) {
        this.ngLevel = ngLevel;
        this.coocMatrix = coocMatrix;
        this.normalized = normalized ? normalized : false;
        this.pxpy = this.pxpy();
        this.pxmy = this.pxmy();
    }

    /**
     * This function is needed if COOCM is not normalized
     *
     * @returns {number} sum of all values in co-occurence matrix
     */
    r() {
        var r = 0,
            length = this.coocMatrix.length,
            index;

        /*this.coocMatrix.forEach(function (value) {
            r = r + value;
        });*/

        for (index = 0; index < length; index++) {
            r = r + this.coocMatrix[index];
        }


        return r;
    }

    /**
     *
     * @param i - verse
     * @param j - column
     * @returns {number} value at specific index
     */
    p(i, j) {
        var r = this.r();

        return this.normalized ? this.coocMatrix[i * this.ngLevel + j] : this.coocMatrix[i * this.ngLevel + j] / r;
    }

    /**
     *
     * @param i - verse
     * @returns {number} sum of the element in specific verse
     */
    px(i) {
        var j, px = 0;

        for (j = 0; j < this.ngLevel; j++) {
            //px = px + this.p(i, j);
            px = px + this.coocMatrix[i * this.ngLevel + j];
        }

        return px;
    }

    /**
     *
     * @param j - column
     * @returns {number} sum of the element in specific column
     */
    py(j) {
        var i, p = 0;

        for (i = 0; i < this.ngLevel; i++) {
            //p = p + this.p(i, j);
            p = p + this.coocMatrix[i * this.ngLevel + j];
        }

        return p;
    }

    /**
     * @returns vector where new index is sum of the both indexes and value is value from this indexes
     */
    pxpy() {
        var pxpy = new Float32Array( this.ngLevel + this.ngLevel - 1 ).fill(0),
            ngLevel = this.ngLevel,
            length = this.coocMatrix.length,
            index;

        /*this.coocMatrix.forEach(function (value, index) {
            pxpy[Math.floor(index / ngLevel) + index % ngLevel] = pxpy[Math.floor(index / ngLevel) + index % ngLevel] + value;
        });*/

        for (index = 0; index < length; index++) {
            pxpy[Math.floor(index / ngLevel) + index % ngLevel] = pxpy[Math.floor(index / ngLevel) + index % ngLevel] + this.coocMatrix[index];
        }

        return pxpy;
    }

    /**
     * @returns vector where new index is difference of the both indexes and value is value from this indexes
     */
    pxmy() {
        var pxmy = new Array(this.ngLevel).fill(0),
            ngLevel = this.ngLevel,
            length = this.coocMatrix.length,
            index;

        /*this.coocMatrix.forEach(function (value, index) {
            pxmy[Math.abs(Math.floor(index / ngLevel) - index % ngLevel)] = pxmy[Math.abs(Math.floor(index / ngLevel) - index % ngLevel)] + value;
        });*/

        for (index = 0; index < length; index++) {
            pxmy[Math.abs(Math.floor(index / ngLevel) - index % ngLevel)] = pxmy[Math.abs(Math.floor(index / ngLevel) - index % ngLevel)] + this.coocMatrix[index];
        }

        return pxmy;
    }

    /**
     *
     * @returns {number} helper HXY1
     */
    hxy1 () {
        var px = 0,
            py = 0,
            HXY1 = 0,
            self = this,
            ngLevel = this.ngLevel;

        this.coocMatrix.forEach(function (value, index) {
            px = self.px(Math.floor(index / ngLevel));
            py = self.py(index % ngLevel);
            HXY1 = (px === 0 || py === 0) ? HXY1 : HXY1 + value * Math.log(px * py);
        });

        return -HXY1;
    }

    /**
     *
     * @returns {number} helper HXY2
     */
    hxy2() {
        var px = 0,
            py = 0,
            HXY2 = 0,
            self = this,
            ngLevel = this.ngLevel;

        this.coocMatrix.forEach(function (value, index) {
            px = self.px(Math.floor(index / ngLevel));
            py = self.py(index % ngLevel);
            HXY2 = (px === 0 || py === 0) ? HXY2 : HXY2 + px * py * Math.log(px * py);
        });

        return -HXY2;
    }

    /**
     *
     * @returns {number} mean along x
     */
    miX() {
        let miX = 0,
            ngLevel = this.ngLevel,
            length = this.coocMatrix.length,
            index;

        /*this.coocMatrix.forEach(function (value, index) {
            miX = miX + value * Math.floor(index / ngLevel);
        });*/

        for (index = 0; index < length; index++) {
            miX = miX + this.coocMatrix[index] * Math.floor(index / ngLevel);
        }

        return miX;
    }

    /**
     *
     * @returns {number} mean along y
     */
    miY() {
        let miY = 0,
            ngLevel = this.ngLevel,
            length = this.coocMatrix.length,
            index;

        /*this.coocMatrix.forEach(function (value, index) {
            miY = miY + value * index % ngLevel;
        });*/

        for (index = 0; index < length; index++) {
            miY = miY + this.coocMatrix[index] * index % ngLevel;
        }

        return miY;
    }

    /**
     *
     * @returns {number} general mean
     */
    mi() {
        return Math.sqrt(this.miX() * this.miY());
    }

    /**
     *
     * @returns {number} standard deviation of x
     */
    sigmaX(mi) {
        var mi = mi, sigmaX = 0,
            ngLevel = this.ngLevel,
            length = this.coocMatrix.length,
            index;

        /*this.coocMatrix.forEach(function (value, index) {
            sigmaX = sigmaX + Math.pow(Math.floor(index / ngLevel) - mi, 2) * value;
        });*/

        for (index = 0; index < length; index++) {
            sigmaX = sigmaX + Math.pow(Math.floor(index / ngLevel + 1) - mi, 2) * this.coocMatrix[index];
        }

        return Math.sqrt(sigmaX);
    }

    /**
     *
     * @returns {number} standard deviation of y
     */
    sigmaY(mi) {
        var mi = mi, sigmaY = 0,
            ngLevel = this.ngLevel,
            length = this.coocMatrix.length,
            index;

       /* this.coocMatrix.forEach(function (value, index) {
            sigmaY = sigmaY + Math.pow(Math.floor(index / ngLevel) - mi, 2) * value;
        });*/

        for (index = 0; index < length; index++) {
            sigmaY = sigmaY + Math.pow(Math.floor(index / ngLevel + 1) - mi, 2) * this.coocMatrix[index];
        }

        return Math.sqrt(sigmaY);
    }
}

module.exports = StatisticalPropertiesNew;