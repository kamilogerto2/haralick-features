/**
 * Created by Kamil on 2016-03-12.
 */
//;
var StatisticalPropertiesNew = require('./statistical-properties');

class HaralickFeaturesCalculatorNew {
	constructor(coocMatrix, ngLevel) {
		this.coocMatrix = coocMatrix;
		this.statisticalProperties = new StatisticalPropertiesNew(coocMatrix, true, ngLevel);
		this.ngLevel = ngLevel;
		this.two_ngLevel = 2 * ngLevel - 2;
	}

	insertCOOCM(coocMatrix) {
		this.coocMatrix = coocMatrix;
		this.statisticalProperties = new StatisticalPropertiesNew(coocMatrix, true, this.ngLevel);
	}

	//aSC - angular Second Moment
	angularSecondMoment() {
		var aSC = 0, self = this,
			ngLevel = this.ngLevel,
			length = this.coocMatrix.length,
			index;

		for (index = 0; index < length; index++) {
			aSC = aSC + Math.pow(self.coocMatrix[Math.floor(index / ngLevel) * ngLevel + index % ngLevel], 2);
		}

		return aSC;
	}

	contrast() {
		var contrast = 0,
			pxmy = this.statisticalProperties.pxmy;

		for (let i = 0; i < this.ngLevel; i++) {
			contrast = contrast + (Math.pow(i, 2) * pxmy[i]);
		}

		return contrast;
	}

	variance() {
		let variance = 0,
			mi = this.statisticalProperties.mi(),
			ngLevel = this.ngLevel,
			length = this.coocMatrix.length,
			index;

		for (index = 0; index < length; index++) {
			variance = variance + Math.pow(Math.floor(index / ngLevel) - mi, 2) * this.coocMatrix[index];
		}

		return variance;
	}

	correlation() {
		let correlation = 0,
			miX = this.statisticalProperties.miX(),
			miY = miX,
			sigmaX = this.statisticalProperties.sigmaX(miX),
			sigmaY = sigmaX,
			ngLevel = this.ngLevel,
			length = this.coocMatrix.length,
			index;

		for (index = 0; index < length; index++) {
			sigmaX = sigmaX === 0 ? 0.000001 : sigmaX;
			correlation = correlation + ((Math.floor(index / ngLevel + 1) - miX) * (index % ngLevel + 1 - miY)) / (sigmaX * sigmaX) * this.coocMatrix[index];
		}

		correlation = correlation > 0 ? correlation : 0;

		return correlation;
	}

	inverseDifferenceMoment() {
		let idMoment = 0,
			ngLevel = this.ngLevel,
			length = this.coocMatrix.length,
			index;

		for (index = 0; index < length; index++) {
			idMoment = idMoment + this.coocMatrix[index] / (1 + Math.pow(Math.floor(index / ngLevel) - index % ngLevel, 2));
		}

		return idMoment;
	}

	sumAverage() {
		let sumAverage = 0,
			pxpy = this.statisticalProperties.pxpy;

		for (let i = 0; i < this.two_ngLevel; i++) {
			sumAverage = sumAverage + i * pxpy[i];
		}

		return sumAverage;
	}

	SumVariance() {
		let sumVariance = 0,
			pxpy = this.statisticalProperties.pxpy,
			i;

		for (i = 0; i < this.two_ngLevel; i++) {
			sumVariance = pxpy[i] > 0 ? sumVariance + Math.pow(i - this.sumEntropy(), 2) * pxpy[i] : sumVariance;
		}

		return sumVariance;
	}

	sumEntropy() {
		let sumEntropy = 0,
			pxpy = this.statisticalProperties.pxpy,
			i;

		for (i = 0; i < this.two_ngLevel; i++) {
			sumEntropy = pxpy[i] > 0 ? sumEntropy + pxpy[i] * Math.log(pxpy[i]) : sumEntropy;
		}

		return -sumEntropy;
	}

	entropy() {
		let entropy = 0,
			length = this.coocMatrix.length,
			index;

		/*this.coocMatrix.forEach(function (value, index) {
		 entropy = value > 0 ? entropy + value * Math.log(value) : entropy;
		 });*/

		for (index = 0; index < length; index++) {
			entropy = this.coocMatrix[index] > 0 ? entropy + this.coocMatrix[index] * Math.log(this.coocMatrix[index]) : entropy;
		}

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
		let diffEntropy = 0,
			pxmy = this.statisticalProperties.pxmy;

		for (let i = 0; i < this.ngLevel - 1; i++) {
			diffEntropy = pxmy[i] > 0 ? diffEntropy + pxmy[i] * Math.log(pxmy[i]) : diffEntropy;
		}

		return -diffEntropy;
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

module.exports = HaralickFeaturesCalculatorNew;