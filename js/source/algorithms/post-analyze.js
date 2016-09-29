/**
 * Created by Kamil on 2016-09-21.
 */
var Jimp = require("jimp"),
	ip = require('../libs/ip-operations'),
	morph = require('../libs/morphologic-operations');

Jimp.read("../images-results/sv-test.png", function (err, test_image) {
	//create matrix
	var i = 0, image = [];
	test_image.scan(0, 0, test_image.bitmap.width, test_image.bitmap.height, function (x, y, idx) {
		image[i] = test_image.bitmap.data[idx];
		i++;
	});

	//processing data
	/*image = ip.filterBy(image, 475, 430,
		[-1, -1, -1,
		-1, 10, -1,
		-1, -1, -1], 3, false);*/
	/*image = ip.filterBy(image, 475, 430,
		[-1, -1,-1 ,
			-1, 40, -1,
			-1, -1, -1], 3, true);*/

	var invert = true;

	image = ip.filterBy(image, 512, 512,
	 [0.1, 0.1, 0.1,
	 0.1, 0.1, 0.1,
	 0.1, 0.1, 0.1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[0.1, 0.1, 0.1,
			0.1, 0.1, 0.1,
			0.1, 0.1, 0.1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);
	image = ip.filterBy(image, 512, 512,
		[1, 1, 1,
			1, 1, 1,
			1, 1, 1], 3, true);



	image = ip.threshold(image, 105, true);
	var MO = new morph(512, 512, image);
	MO.dilateWithElement();
	MO.dilateWithElement();
	MO.dilateWithElement();
/*	MO.dilateWithElement();
	MO.dilateWithElement();
	MO.dilateWithElement();
	MO.dilateWithElement();
	MO.dilateWithElement();
	MO.dilateWithElement();
	MO.dilateWithElement();
	MO.dilateWithElement();
	MO.dilateWithElement();
	MO.dilateWithElement();*/
	image = MO.data;
	image = ip.detectCannyEdges(image, 512, 512);

	//create image
	i = 0;
	test_image.scan(0, 0, test_image.bitmap.width, test_image.bitmap.height, function (x, y, idx) {
		test_image.bitmap.data[idx] = image[i];
		test_image.bitmap.data[idx + 1] = image[i];
		test_image.bitmap.data[idx + 2] = image[i];
		test_image.bitmap.data[idx + 3] = 255;
		i++;
	});

	//write image
	test_image.write("../images-results/eee-test-sv.png");
});