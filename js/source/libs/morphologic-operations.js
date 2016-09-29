/**
 * Created by Kamil on 2016-09-19.
 */
/**
 * Created by Kamil on 2016-03-12.
 */
//;

	'use strict';
class StructuringElement {
	constructor(d, data) {
		if (d) {
			this.dim = d;
		}
		else {
			this.dim = 3;
		}
		if (data) {
			this.data = data;
		}
		else {
			this.data = [];
			// this.integerRepresentation = new UintArray(32);
			for (var ind = 0; ind < this.dim * this.dim; ind++) {
				this.data.push(1);
			}
		}
	}

	dilateOp(el) {
		MorphologicOperations.SECheck(el);
		for (var j = 0; j < 9; j++) {
			if (el.data[j] == -1)continue;
			if (el.data[j] == 1 && this.data[j] == 255) {
				return 255;
			}
		}
		return 0;
	}

	erodeOp(el) {
		MorphologicOperations.SECheck(el);
		for (var i = 0; i < 9; i++) {
			if (el.data[i] == -1)continue;
			if (el.data[i] != this.data[i] && el.data[i] != 1) {
				return 0;
			}
		}
		return 1;
	}

	equivalenceOp(el) {
		MorphologicOperations.SECheck(el);
		for (var i = 0; i < 9; i++) {
			if (el.data[i] == -1)continue;
			if (el.data[i] != this.data[i]) {
				return 0;
			}
		}
		return 1;
	}
}

class Contours {
	constructor() {
		this.contours = [[]];
	}

	totalPoints() {
		var len = 0;
		this.contours.forEach(function (contour) {
			len += contour.length;
		});
		return len;
	}
}

Array.prototype.compare = function (array) {
	// if the other array is a false value, return

	if (this.length == array.length) {
		for (var i = 0; i < Math.max(this.length, array.length); i++) {
			if (this[i] != array[i])return false;
		}
	}
	else {
		return false;
	}
	return true;
};

var MORPH_3x3_CROSS_ELEMENT = new StructuringElement(3,[0, 1, 0,
	1, 1, 1,
	0, 1, 0]);

var MORPH_3x3_RECT_ELEMENT = new StructuringElement();

var MORPH_3x3_TOP_RIGHT_CORNER_ELEMENT = new StructuringElement(3,[-1, 1,-1,
	0, 1, 1,
	0, 0,-1]);

var MORPH_3x3_BOTTOM_LEFT_CORNER_ELEMENT = new StructuringElement(3,[-1, 0, 0,
	1, 1, 0,
	-1, 1,-1]);

var MORPH_3x3_TOP_LEFT_CORNER_ELEMENT = new StructuringElement(3,[ -1, 1,-1,
	1, 1, 0,
	-1, 0, 0]);

var MORPH_3x3_BOTTOM_RIGHT_CORNER_ELEMENT = new StructuringElement(3,[ 0, 0,-1,
	0, 1, 1,
	-1, 1,-1]);

class MorphologicOperations {
	constructor(height, width, bits) {
		this.height = height;
		this.width = width;
		if (bits) {
			this.data = bits;
			if (this.height * this.width != this.data.length)throw 'MORPH_DIMENSION_ERROR: incorrect dimensions';
		}
		else {
			this.data = Array.apply(null, new Array(this.height * this.width)).map(Number.prototype.valueOf, 0);
		}
	}

	constructMatrixForIndex(ind, d) {
		if (!d) {
			d = 3;
		}
		var mat = new StructuringElement(d, 0);
		var halfDim = Math.floor(d / 2);
		var upperLeft = ((ind - (this.height * halfDim))) - 1;

		var count = 0;
		for (var x = 0; x < d * d; x++) {

			var j = upperLeft + (x % d) + this.height * Math.floor(x / d);
			if (j < this.data.length && j >= 0) {
				mat.data[count] = this.data[j];
			}
			count++;
		}
		return mat;
	}

	subtract(mo) {
		this.MorphCheck(mo);
		for (var ind = 0; ind < this.data.length && ind < mo.data.length; ind++) {
			if (this.data[ind] == 1 && mo.data[ind] == 0) {
				continue;
			}
			this.data[ind] = 0;
		}
		return this;
	}

	add(mo) {
		this.MorphCheck(mo);
		for (var ind = 0; ind < this.data.length && ind < mo.data.length; ind++) {

			if (mo.data[ind] == 1) {
				this.data[ind] = 1;
			}
		}
	}

	erodeWithElement(el) {
		if (el) {
			MorphologicOperations.SECheck(el);
		}
		else {
			el = new StructuringElement();
		}

		var result = [];
		var i = this.height * this.width;
		while (i > 0) {
			result.push(0);
			i--;
		}


		for (var x = 1; x < this.width - 1; x++) {
			for (var y = 1; y < this.height - 1; y++) {

				var i = y * this.width + x;
				var mat = this.constructMatrixForIndex(i, el.dim);
				result[i] = el.erodeOp(mat);

			}
		}
		this.data = result;
		return this;
	}

	dilateWithElement(el) {
		if (el) {
			MorphologicOperations.SECheck(el);
		}
		else {
			el = new StructuringElement();
		}

		//var result = Array.apply(null, new Array(this.height * this.width)).map(Number.prototype.valueOf, 0);
		var result = new Array(this.height * this.width);

		for (var x = 1; x < this.width - 1; x++) {
			for (var y = 1; y < this.height - 1; y++) {
				var ind = x * this.height + y;
				var mat = this.constructMatrixForIndex(ind, el.dim);
				result[ind] = mat.dilateOp(el);
			}
		}
		//console.log(result);
		this.data = result;
		return this;
	}

	openingWithElement(el) {
		this.dilateWithElement(el);
		this.erodeWithElement(el);
	}

	closingWithElement(el) {
		this.erodeWithElement(el);
		this.dilateWithElement(el);
	}

	getSubImageInRect(top, left, height, width) {
		if (left + width > this.width || top + height > this.height) {
			throw "MORPH_SUBIMAGE_BOUND_ERROR: check subimage bounds)"
		}
		var startIndex = top * this.width + left;
		var endIndex = (top + height) * this.width + (left + width)
		var subImage = []
		var i = startIndex
		while (i < endIndex) {
			subImage.append(this.data.splice(i, i + width))
			i += this.width
		}
		return subImage;
	}

	hitMissTransform() {
		var result = Array.apply(null, new Array(this.height * this.width)).map(Number.prototype.valueOf, 0);


		for (var x = 1; x < this.width - 1; x++) {
			for (var y = 1; y < this.height - 1; y++) {

				var i = y * this.width + x;
				var mat = this.constructMatrixForIndex(i, 3);
				result[i] = mat.equivalenceOp(MORPH_3x3_BOTTOM_LEFT_CORNER_ELEMENT) || mat.equivalenceOp(MORPH_3x3_BOTTOM_RIGHT_CORNER_ELEMENT) || mat.equivalenceOp(MORPH_3x3_TOP_LEFT_CORNER_ELEMENT) || mat.equivalenceOp(MORPH_3x3_TOP_RIGHT_CORNER_ELEMENT);

			}
		}
		return result;
	}

	labelConnectedComponents() {
		var copy = new this.constructor(this.height, this.width, this.data);
		var labelIndex = 2;

		var equivalenceClasses = new Array();


		for (var y = 1; y < this.height - 1; y++) {
			for (var x = 1; x < this.width - 1; x++) {

				var i = y * this.width + x;
				if (copy.data[i] > 0) {

					var mat = copy.constructMatrixForIndex(i, 3);
					var connectedNeighborCount = 0;
					var assignEquivalenceClass = function (label, i) {
						if (connectedNeighborCount > 0) {
							equivalenceClasses[String(label)] = Math.min(equivalenceClasses[String(label)], Math.min(label, copy.data[i]));
							equivalenceClasses[String(copy.data[i])] = Math.min(equivalenceClasses[String(label)], Math.min(label, copy.data[i]));
							copy.data[i] = Math.min(equivalenceClasses[String(label)], Math.min(label, copy.data[i]));
						}
						else {
							equivalenceClasses[String(label)] = label;
							copy.data[i] = label;
						}

					}
					var neighborCopy0;

					if (mat.data[0] > 2) {
						assignEquivalenceClass(mat.data[0], i);
						connectedNeighborCount++;
					}
					if (mat.data[1] > 2) {
						assignEquivalenceClass(mat.data[1], i);
						connectedNeighborCount++;
					}
					if (mat.data[2] > 2) {
						assignEquivalenceClass(mat.data[2], i);
						connectedNeighborCount++;
					}
					if (mat.data[3] > 2) {
						assignEquivalenceClass(mat.data[3], i);
						connectedNeighborCount++;
					}
					if (connectedNeighborCount == 0) {
						labelIndex++;
						assignEquivalenceClass(labelIndex, i);
					}
				}
			}
		}

		var connectedSegments = new Contours();

		for (var y = 1; y < this.height - 1; y++) {
			for (var x = 1; x < this.width - 1; x++) {
				var i = x * this.height + y;

				if (copy.data[i] > 0) {
					copy.data[i] = equivalenceClasses[String(copy.data[i])]
					if (!(connectedSegments.contours[String(equivalenceClasses[String(copy.data[i])])] instanceof Array)) {
						connectedSegments.contours[String(equivalenceClasses[String(copy.data[i])])] = [[(2.0 * x) / this.width, (2.0 * y) / this.height]]
					}
					else {
						connectedSegments.contours[String(equivalenceClasses[String(copy.data[i])])].push([(2.0 * x) / this.width, (2.0 * y) / this.height])
					}
				}
			}
		}
		return {labeledMorph: copy, maxLabel: labelIndex, contours: connectedSegments.contours};
	}

	printDataAsMatrix() {
		for (var y = 0; y < this.height; y++) {
			var str = ""
			for (var x = 0; x < this.width; x++) {
				var i = y * this.width + x;
				str += this.data[i] + '  '
			}
			console.log(str)
		}
	}

	iterativeThinning(iterations) {
		var hitmiss = new Morph(this.height, this.width, this.data);
		var copy = new Morph(this.height, this.width, this.data);
		hitmiss.data = hitmiss.hitMissTransform();
		var c = 0;
		while (c < iterations) {
			copy.subtract(hitmiss);
			hitmiss.data = copy.hitMissTransform();
			c++;
		}
		this.data = copy.data;
	}

	morphFromContext() {
		var data = this.createImageData(context.width, context.height);
		return new Morph(context.height, context.width, context.createImageData(this.width, this.height));
	}

	static SECheck(el) {
		if (!(el instanceof StructuringElement)) {
			throw 'MORPH_TYPE_ERROR: input must be a "StructuringElement"';
			return;
		}
	}

	MorphCheck(mo) {
		if (!(mo instanceof Morph)) {
			throw 'MORPH_TYPE_ERROR: input must be a "Morph" object';
			return;
		}
	}
}



module.exports = MorphologicOperations;

/*



 /!********************************* morphological operations constructor / methods *************************************!/




 var morph = new Morph(1, 1, [1]);
 */
