/**
 * Created by Kamil on 2016-02-24.
 */
//;
var math = require('mathjs');

//matrix 1st element - verse
//2nd element - column
class COOCMCalculatorNew {
	constructor(greyLevels, distance, orientation) {
		this.ngLevel = greyLevels ? greyLevels : 255;
		this.coocmMatrix2 = new Float32Array([this.ngLevel * this.ngLevel] * 1).fill(0);
		this.orientation = orientation ? orientation : 'horizontally';
		this.distance = distance ? distance : 1;
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
				case 'vertically':
				{
					//TODO TEST
					//vertically
					if (index > this.distance * size - 1) {
						previousValue = sourceMatrix[index - this.distance * size];
						this.incrementCOOCMMatrix(previousValue - 1, sourceMatrix[index] - 1);
					}
					if (index < length - this.distance * size) {
						nextValue = sourceMatrix[index + this.distance * size];
						this.incrementCOOCMMatrix(previousValue - 1, sourceMatrix[index] - 1);
					}
					break;
				}
				case '45st':
				{
					if (index % size > this.distance - 1 && index < length - this.distance * size) {
						previousValue = sourceMatrix[index + size * this.distance - this.distance];
						this.incrementCOOCMMatrix(sourceMatrix[index] - 1, previousValue - 1);
					}
					if (index % size < size - this.distance && index > this.distance * size - 1) {
						nextValue = sourceMatrix[index - size * this.distance + this.distance];
						this.incrementCOOCMMatrix(sourceMatrix[index] - 1, previousValue - 1);
					}
					break;
				}
				case '135st':
				{
					if (index % size > this.distance - 1 && index > this.distance * size - 1) {
						previousValue = sourceMatrix[index - size * this.distance - this.distance];
						this.incrementCOOCMMatrix(previousValue - 1, sourceMatrix[index] - 1);
					}
					if (index % size < size - this.distance && index < length - this.distance * size) {
						nextValue = sourceMatrix[index + size * this.distance + this.distance];
						this.incrementCOOCMMatrix(previousValue - 1, sourceMatrix[index] - 1);
					}
					break;
				}
			}
		}
		length = this.coocmMatrix2.length;
		//ready for new approach
		//1600ms better
		for (index = 0; index < length; index++) {
			sum = sum + this.coocmMatrix2[index];
		}

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
	incrementCOOCMMatrix(verse, column) {
		//ready for new approach
		this.coocmMatrix2[verse * this.ngLevel + column] = this.coocmMatrix2[verse * this.ngLevel + column] + 1;

	}


	setDistance(distance) {
		this.distance = distance;
	}

	setOrientation(orientation) {
		this.orientation = orientation;
	}
}

module.exports = COOCMCalculatorNew;