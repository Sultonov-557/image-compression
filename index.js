const Canvas = require("canvas");
const fs = require("fs");

const smaller = 1; //how much image resolution will be compressed
const colorLimit = 10; //how color range will be limited

async function start() {
	const img = await simplefy(await imageToArray("./in.png"));
	const canvas = Canvas.createCanvas(
		parseInt(img.length / smaller),
		parseInt(img[0].length / smaller)
	);
	const ctx = canvas.getContext("2d");
	for (let x = 0; x < canvas.width; x++) {
		for (let y = 0; y < canvas.height; y++) {
			setPixel(x, y, img[parseInt(x * smaller)][parseInt(y * smaller)]);
		}
	}

	fs.writeFileSync("./out.png", canvas.toBuffer("image/png"));

	function setPixel(x, y, rbg) {
		ctx.fillStyle = `rgba( ${rbg[0]} , ${rbg[1]} , ${rbg[2]} , ${rbg[3]} )`;
		ctx.fillRect(x, y, 1, 1);
	}
}

async function simplefy(array) {
	for (x in array) {
		for (y in array[x]) {
			for (i in array[x][y]) {
				array[x][y][i] =
					parseInt(array[x][y][i] / colorLimit) * colorLimit;
			}
		}
	}
	return array;
}

async function imageToArray(path) {
	const image = [];
	const img = await Canvas.loadImage(path);
	const canvas = Canvas.createCanvas(img.width, img.height);
	const ctx = canvas.getContext("2d");

	ctx.drawImage(img, 0, 0);
	for (let x = 0; x < canvas.width; x++) {
		image[x] = [];
		for (let y = 0; y < canvas.height; y++) {
			image[x][y] = getPixel(x, y);
		}
	}

	return image;

	function getPixel(x, y) {
		return JSON.parse(
			"[" + ctx.getImageData(x, y, 1, 1).data.toString() + "]"
		);
	}
}

start();
