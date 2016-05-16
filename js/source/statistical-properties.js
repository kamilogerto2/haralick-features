'use strict';
var math = require('mathjs');

//all ready to testing
class StatisticalProperties {

    constructor(coocMatrix, normalized) {
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
        var r = 0;

        this.coocMatrix.forEach(function (value) {
            r = r + value;
        });

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

        return this.normalized ? this.coocMatrix.subset(math.index(i, j)) : this.coocMatrix.subset(math.index(i, j)) / r;
    }

    /**
     *
     * @param i - verse
     * @returns {number} sum of the element in specific verse
     */
    px(i) {
        var j, px = 0;

        for (j = 0; j < this.coocMatrix._size[0]; j++) {
            px = px + this.p(i, j);
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

        for (i = 0; i < this.coocMatrix._size[0]; i++) {
            p = p + this.p(i, j);
        }

        return p;
    }

    /**
     * @returns vector where new index is sum of the both indexes and value is value from this indexes
     */
    pxpy() {
        var pxpy = new Float32Array( this.coocMatrix._size[0] + this.coocMatrix._size[0] - 1 ).fill(0);

        this.coocMatrix.forEach(function (value, index) {
            pxpy[index[0] + index[1]] = pxpy[index[0] + index[1]] + value;
        });

        return pxpy;
    }

    /**
     * @returns vector where new index is difference of the both indexes and value is value from this indexes
     */
    pxmy() {
        var pxmy = new Array(this.coocMatrix._size[0]).fill(0);

        this.coocMatrix.forEach(function (value, index) {
            pxmy[Math.abs(index[0] - index[1])] = pxmy[Math.abs(index[0] - index[1])] + value;
        });

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
            self = this;

        this.coocMatrix.forEach(function (value, index) {
            px = self.px(index[0]);
            py = self.py(index[1]);
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
            self = this;

        this.coocMatrix.forEach(function (value, index) {
            px = self.px(index[0]);
            py = self.py(index[1]);
            HXY2 = (px === 0 || py === 0) ? HXY2 : HXY2 + px * py * Math.log(px * py);
        });

        return -HXY2;
    }

    /**
     *
     * @returns {number} mean along x
     */
    miX() {
        let miX = 0;
        this.coocMatrix.forEach(function (value, index) {
            miX = miX + value * index[0];
        });

        return miX;
    }

    /**
     *
     * @returns {number} mean along y
     */
    miY() {
        let miY = 0;
        this.coocMatrix.forEach(function (value, index) {
            miY = miY + value * index[1];
        });
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
    sigmaX() {
        var mi = this.mi(), sigmaX = 0;

        this.coocMatrix.forEach(function (value, index) {
            sigmaX = sigmaX + Math.pow(index[0] - mi, 2) * value;
        });

        return Math.sqrt(sigmaX);
    }

    /**
     *
     * @returns {number} standard deviation of y
     */
    sigmaY() {
        var mi = this.mi(), sigmaY = 0;

        this.coocMatrix.forEach(function (value, index) {
            sigmaY = sigmaY + Math.pow(index[0] - mi, 2) * value;
        });

        return Math.sqrt(sigmaY);
    }
}

module.exports = StatisticalProperties;