/**
 * Created by Kamil on 2016-03-15.
 */
//;
'use strict';
var COOCMCalculatorNew = require('../libs/co-oc-matrix'),
	HaralickFeaturesCalculatorNew = require('../libs/haralick-features'),
	Jimp = require("jimp"),
	fs = require('fs'),
	ip = require('../libs/ip-operations'),
	jsfeat = require('jsfeat');

const EventEmitter = require('events');
const myEmitter = new EventEmitter();

// methods angularSecondMoment (p-255, a-global)
// contrast (p-0.1, a-local)
// correlation
//entropy

var config = JSON.parse(fs.readFileSync('config.json', 'utf8')),
	loopConfig = JSON.parse(fs.readFileSync(process.argv[3], 'utf8')),
	weights = [],
	//jimpImage = new Jimp(475, 300, 0xFF0000FF, function (err, image) {
	jimpImage = new Jimp(512, 512, 0xFF0000FF, function (err, image) {
	//jimpImage = new Jimp(300, 300, 0xFF0000FF, function (err, image) {
	//jimpImage = new Jimp(274, 184, 0xFF0000FF, function (err, image) {
	}),
	images = [],
	actualConfig = loopConfig.pop(), tempWeight;

//event loop
//first process
do {
	tempWeight = actualConfig.weight;
	config.orientation = actualConfig.orientation;
	config.method = actualConfig.method;
	if (!tempWeight) {
		actualConfig = loopConfig.pop()
	} else {
		weights.push(tempWeight);
	}
} while (!tempWeight);

processImage(config, jimpImage);

myEmitter.on('end-process', function (image) {
	images.push(image);

	if (config.savePartialImages) {
		image = convertToMaxRange(image);
		/*if (config.method == 'correlation') {
			image = revertColors(image);
		}*/
		transformToDisplay(image);
		saveImage(jimpImage);
	}

	if (loopConfig.length) {
		actualConfig = loopConfig.pop();
		do {
			tempWeight = actualConfig.weight;
			config.orientation = actualConfig.orientation;
			config.method = actualConfig.method;
			if (!tempWeight) {
				actualConfig = loopConfig.pop()
			} else {
				weights.push(tempWeight);
			}
		} while (!tempWeight && loopConfig != 0);
		processImage(config, jimpImage);
	} else {
		console.log('mamy wag ' + weights.length);

		var newImage = [], imageToConvert = [], actualWeight, count = weights.length;
		for (var i = 0; i < count; i++) {
			imageToConvert = images.shift();
			actualWeight = weights.shift();
			console.log(i);
			if (i == 0) {
				for (var j = 0; j < image.length; j++) {
					newImage[j] = imageToConvert[j] * actualWeight;
				}
			} else {
				for (var j = 0; j < image.length; j++) {
					newImage[j] += imageToConvert[j] * actualWeight;
				}
			}
		}

		image = newImage;
		//image = detectCannyEdges(image);
		transformToDisplay(image);
		saveImage(jimpImage, Date.now() + '-linked' + '.png');
	}
});

function processImage(config, tocor_image) {
	var coocm = new COOCMCalculatorNew(config.ngLevel, config.distance, config.orientation),
		haralickCalculator = new HaralickFeaturesCalculatorNew(coocm.coocmMatrix2, config.ngLevel), image_data = [],
		cages = [], i = 0, stream = fs.createWriteStream("test.txt")/*, tocor_image = new Jimp(475, 300, 0xFF0000FF, function (err, image) {
	 })*/;

	console.time("haralick calculation");
//check if cage is odd and bigger than 1

	if (config.cageSize < 2 && config.cageSize % 2 == 0) {
	}
	else {
		Jimp.read("../images-database/" + config.processedImage, function (err, test_image) {
			if (err) throw err;
			test_image.greyscale();// set greyscale
			var cage, halfSize = Math.floor(config.cageSize / 2);
			cage = new Uint8Array(config.cageSize * config.cageSize);

			test_image.write('../images-results/' + 'grey' + config.resultImage);
			var range, length, i;

			calculateMinimum(test_image);

			//global approach
			if (config.approach == 'global') {
				range = config.max - config.min;
				if (range < config.ngLevel)
					range = config.ngLevel;
			}


			var index = 0, data;
			test_image.scan(0, 0, test_image.bitmap.width, test_image.bitmap.height, function (x, y, idx) {
				//define cage (is odd and bigger than 1
				if (x > ((halfSize) - 1) && y > ((halfSize) - 1) && x < test_image.bitmap.width - (halfSize) && y < test_image.bitmap.height - (halfSize)) {
					calculateActualCage(cage, this.bitmap, idx);

					if (config.approach == 'local') {
						config.min = Math.min.apply(null, cage);
						config.max = Math.max.apply(null, cage);
						range = config.max - config.min;
						if (range < config.ngLevel)
							range = config.ngLevel;
					}

					length = cage.length;
					for (i = 0; i < length; i++) {
						cage[i] = Math.ceil((cage[i] - config.min + 1) / (range / config.ngLevel));
					}

					haralickCalculator.insertCOOCM(coocm.calculateCOOCM(cage, config.cageSize));

					stream.write(haralickCalculator[config.method]().toFixed(2) + ' ', function (err) {
						if (err) {
							return console.log(err);
						}
					});

					data = haralickCalculator[config.method]();
					image_data[index] = data;
				} else {
					image_data[index] = 0;
				}
				index++;
			});
			console.timeEnd("haralick calculation");
			normalize(image_data);
		});
	}
}

function calculateMinimum(image) {
	config.min = 255;
	config.max = 0;
	image.scan(0, 0, image.bitmap.width, image.bitmap.height, function (x, y, idx) {
		image.bitmap.data[idx] < config.min ? config.min = image.bitmap.data[idx] : config.min;
		image.bitmap.data[idx] > config.max ? config.max = image.bitmap.data[idx] : config.max;
	});
	return config.max;
}

function calculateActualCage(cage, bitmap, idx) {
	var halfLength = Math.floor(config.cageSize * config.cageSize / 2), halfSize = Math.floor(config.cageSize / 2), i = 0, j = 0;

	for (i = 0; i < (halfSize) + 1; i++) {
		if (i == 0) {
			for (j = (halfSize); j > -1; j--) {
				if (j == 0) {
					cage[halfLength] = bitmap.data[idx];
				} else {
					cage[halfLength + j] = bitmap.data[idx + 4 * j];
					cage[halfLength - j] = bitmap.data[idx - 4 * j];
				}
			}
		} else {
			for (j = (halfSize); j > -1; j--) {
				if (j == 0) {
					cage[halfLength - i * config.cageSize] = bitmap.data[idx - 4 * i * bitmap.width];
				} else {
					cage[halfLength + j - i * config.cageSize] = bitmap.data[idx - 4 * i * bitmap.width + 4 * j];
					cage[halfLength - j - i * config.cageSize] = bitmap.data[idx - 4 * i * bitmap.width - 4 * j];
				}
			}
			for (j = (halfSize); j > -1; j--) {
				if (j == 0) {
					cage[halfLength + i * config.cageSize] = bitmap.data[idx + 4 * i * bitmap.width];
				} else {
					cage[halfLength + j + i * config.cageSize] = bitmap.data[idx + 4 * i * bitmap.width + 4 * j];
					cage[halfLength - j + i * config.cageSize] = bitmap.data[idx + 4 * i * bitmap.width - 4 * j];
				}
			}
		}
	}
}

function normalize(image) {
	var max = ip.maximum(image);
	for (var i = 0; i < image.length; i++) {
		image[i] = image[i] / max;
		if (isNaN(image[i])) {
			image[i] = 0;
		}
	}
	myEmitter.emit('end-process', image);
}

function convertToMaxRange(image) {
	for (var i = 0; i < image.length; i++) {
		image[i] = image[i] * 255;
	}
	return image;
}


function revertColors(image) {
	for (var i = 0; i < image.length; i++) {
		image[i] = 255 - image[i];
	}
	return image;
}

function transformToDisplay(image) {
	var i = 0;
	jimpImage.scan(0, 0, jimpImage.bitmap.width, jimpImage.bitmap.height, function (x, y, idx) {
		this.bitmap.data[idx] = (image[i]);
		this.bitmap.data[idx + 1] = (image[i]);
		this.bitmap.data[idx + 2] = (image[i]);
		this.bitmap.data[idx + 3] = 255;
		i++;
	});
	return image;
}

function saveImage(image, filename) {
	filename = filename ? filename : config.method + '-' + config.ngLevel + '-c' + config.cageSize + '-d' + config.distance + '-o' + config.orientation + '-' + config.resultImage;
	//console.log('../images-results/' + process.argv[3].split('/')[1].split('.')[0] + '/' + filename);
	image.write('../images-results/' + process.argv[3].split('/')[1].split('.')[0] + '/' + filename);
}