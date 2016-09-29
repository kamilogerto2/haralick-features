/**
 * Created by Kamil on 2016-09-26.
 */

const process = require('child_process'),
	fs = require('fs');
function getFiles (dir, files_){
	files_ = files_ || [];
	var files = fs.readdirSync(dir);
	for (var i in files){
		var name = dir + '/' + files[i];
		if (fs.statSync(name).isDirectory()){
			getFiles(name, files_);
		} else {
			files_.push(name);
		}
	}
	return files_;
}

function fileExists(filePath)
{
	try
	{
		return fs.statSync(filePath).isFile();
	}
	catch (err)
	{
		return false;
	}
}

var mkdirSync = function (path) {
	try {
		fs.mkdirSync(path);
	} catch(e) {
		if ( e.code != 'EEXIST' ) throw e;
	}
};

listToProcess = getFiles('configs/');


for(var i = 0; i < listToProcess.length; i++) {
	/*if (!fileExists('../images-results/' + listToProcess[i].split('.')[0])){
		fs.mkdir('../images-results/' + listToProcess[i].split('.')[0]);
	}*/

	mkdirSync('../images-results/' + listToProcess[i].split('//')[1].split('.')[0]);
	process.exec('node --use-strict haralick-features-tests.js -config configs/' + listToProcess[i].split('//')[1]);
}
