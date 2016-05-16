/**
 * Created by Kamil on 2016-03-15.
 */
'use strict';
var StatisticalProperties = require('../statistical-properties');
var math = require('mathjs');
var COOCMCalculator = require('../co-oc-matrix');
var COOCMCalculatorNew = require('../co-oc-matrix-new');
var HaralickFeaturesCalculator = require('../haralick-features');
var HaralickFeaturesCalculatorNew = require('../haralick-features-new');
var Jimp = require("jimp");

var i = 0;

//new approach
var ngLevel = 14;
var cageSize = 5; //matrix 3x3
var coocm = new COOCMCalculatorNew(ngLevel, 1, 'horizontally');
var haralickCalculator = new HaralickFeaturesCalculatorNew(coocm.coocmMatrix2, ngLevel);
var cages = [];
var fs = require('fs');
var stream = fs.createWriteStream("test.txt");


console.time("haralick calculation");
var tocor_image =  new Jimp(300, 300, 0xFF0000FF, function (err, image) {
    // this image is 256 x 256, every pixel is set to 0xFF0000FF
});

//check if cage is odd and bigger than 1
if(cageSize < 2 && cageSize % 2 == 0 ) {}
else {
    Jimp.read("test_text2.png", function (err, test_image) {
        if (err) throw err;
        test_image.greyscale();// set greyscale
        var cage, flag = true, cageLength = cageSize*cageSize, j, counter, halfLength = Math.floor(cageLength / 2), halfSize = Math.floor(cageSize / 2);

        test_image.scan(0, 0, test_image.bitmap.width, test_image.bitmap.height, function (x, y, idx) {
            // x, y is the position of this pixel on the image
            // idx is the position start position of this rgba tuple in the bitmap Buffer
            // this is the image
            cage = new Uint8Array(cageLength);
            var red = this.bitmap.data[idx + 0];
            var green = this.bitmap.data[idx + 1];
            var blue = this.bitmap.data[idx + 2];
            var alpha = this.bitmap.data[idx + 3];
            var color_upper = this.bitmap.data[idx + 4 * test_image.bitmap.width] ? this.bitmap.data[idx + 4 * test_image.bitmap.width] : 'none';

            //define cage (is odd and bigger than 1
            if (x > ((halfSize) - 1) && y > ((halfSize) - 1) && x < test_image.bitmap.width - (halfSize) && y < test_image.bitmap.height - (halfSize)) {

                for (i = 0; i < (halfSize) + 1; i++) {
                    if (i == 0) {
                        for (j = (halfSize); j > -1; j--) {
                            if (j == 0) {
                                cage[halfLength ] = this.bitmap.data[idx];
                            } else {
                                cage[halfLength + j ] = this.bitmap.data[idx + 4 * j];
                                cage[halfLength - j ] = this.bitmap.data[idx - 4 * j];
                            }
                        }
                    } else {
                        for (j = (halfSize); j > -1; j--) {
                            if (j == 0) {
                                cage[halfLength - i * cageSize] = this.bitmap.data[idx - 4 * i * test_image.bitmap.width];
                            } else {
                                cage[halfLength + j - i * cageSize] = this.bitmap.data[idx - 4 * i * test_image.bitmap.width + 4 * j];
                                cage[halfLength - j - i * cageSize] = this.bitmap.data[idx - 4 * i * test_image.bitmap.width - 4 * j];
                            }
                        }
                        for (j = (halfSize); j > -1; j--) {
                            if (j == 0) {
                                cage[halfLength + i * cageSize] = this.bitmap.data[idx + 4 * i * test_image.bitmap.width];
                            } else {
                                cage[halfLength + j + i * cageSize] = this.bitmap.data[idx + 4 * i * test_image.bitmap.width + 4 * j];
                                cage[halfLength - j + i * cageSize] = this.bitmap.data[idx + 4 * i * test_image.bitmap.width - 4 * j];
                            }
                        }
                    }
                }

                    var min, max, range, length, i;
                    min = Math.min.apply(null, cage);
                    max = Math.max.apply(null, cage);
                    range = max - min;
                    if (range < ngLevel)
                        range = ngLevel;

                    length = cage.length;
                    for (i = 0; i < length; i++) {
                        cage[i] = Math.ceil((cage[i] - min + 1) / (range / ngLevel));
                    }

                    haralickCalculator.insertCOOCM(coocm.calculateCOOCM(cage, cageSize));
                
                    stream.write(haralickCalculator.correlation().toFixed(2) + ' ', function (err) {
                        if (err) {
                            return console.log(err);
                        }
                    });

                    var data = haralickCalculator.angularSecondMoment();
                    tocor_image.bitmap.data[idx] = data * 255;
                    tocor_image.bitmap.data[idx + 1] = data * 255;
                    tocor_image.bitmap.data[idx + 2] = data * 255;
                    tocor_image.bitmap.data[idx + 3] = data * 255;
                    /* console.log('angularSecondMoment: ' + haralickCalculator.angularSecondMoment());
                     console.log('contrast: ' + haralickCalculator.contrast());*/
                    //console.log('correlation: ' + haralickCalculator.correlation());
                    /*console.log('differenceEntropy: ' + haralickCalculator.differenceEntropy());
                     console.log('entropy: ' + haralickCalculator.entropy());
                     console.log('inverseDifferenceMoment: ' + haralickCalculator.inverseDifferenceMoment());
                     console.log('sumAverage: ' + haralickCalculator.sumAverage());
                     console.log('sumEntropy: ' + haralickCalculator.sumEntropy());
                     console.log('SumVariance: ' + haralickCalculator.SumVariance());
                     console.log('variance: ' + haralickCalculator.variance());*/

                }


            //console.log('x: ' + x + ' y: ' + y + ' idx: ' + idx + ' color ' + red);
            //console.log('color_upper ' + color_upper);
            // rgba values run from 0 - 255
            // e.g. this.bitmap.data[idx] = 0; // removes red from this pixel
        });

        /*console.log('cages: ' + console.log(cages.length));

        tocor_image.write('cor.png');*/});
}



/*while(i<900000) {
    i++;
    var y;

    /!* COOCM
     | 0  0    0     0    |
     | 0  0.5  0.08  0    |
     | 0  0.08 0.016 0.08 |
     | 0  0    0.08  0    | *!/

    //old approach
    /!*y = math.matrix([[1, 1, 2], [3, 2, 2], [1, 1, 1]]);
     var coocm = new COOCMCalculator(4, 1, 'horizontally');
     var coocmMatrix = coocm.calculateCOOCM(y);
     var haralickCalculator = new HaralickFeaturesCalculator(coocmMatrix);*!/

    //new approach
    y = new Int8Array([1, 1, 2, 3, 2, 2, 1, 1, 1]);
    haralickCalculator.insertCOOCM(coocm.calculateCOOCM(y, 3));
    //haralickCalculator.insertCOOCM(coocm.calculateCOOCM(y));


    /!*console.log('---------------1--------------------');
     console.log(coocmMatrix);
     console.log('---------------2--------------------');
     console.log(coocm.coocmMatrix2);*!/
    //

    haralickCalculator.angularSecondMoment(); //150ms Energy
    haralickCalculator.contrast(); //20ms
    haralickCalculator.correlation(); //1500ms -> 500ms
    haralickCalculator.differenceEntropy(); //60ms
    haralickCalculator.entropy(); //160ms
    haralickCalculator.inverseDifferenceMoment(); //160ms
    haralickCalculator.sumAverage(); //5ms
    haralickCalculator.sumEntropy(); //90ms
    haralickCalculator.SumVariance(); //90ms
    haralickCalculator.variance(); //400ms

    /!*console.log('angularSecondMoment: ' + haralickCalculator.angularSecondMoment());
    console.log('contrast: ' + haralickCalculator.contrast());
    console.log('correlation: ' + haralickCalculator.correlation());
    console.log('differenceEntropy: ' + haralickCalculator.differenceEntropy());
    console.log('entropy: ' + haralickCalculator.entropy());
    console.log('inverseDifferenceMoment: ' + haralickCalculator.inverseDifferenceMoment());
    console.log('sumAverage: ' + haralickCalculator.sumAverage());
    console.log('sumEntropy: ' + haralickCalculator.sumEntropy());
    console.log('SumVariance: ' + haralickCalculator.SumVariance());
    console.log('variance: ' + haralickCalculator.variance());*!/

//objects created correctly
}*/

console.timeEnd("haralick calculation");
