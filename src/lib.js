import * as math from 'mathjs'


// old
const _render = (scene, rayVector, imageData, w = 400) => {
	const {xSize, ySize, zSize} = scene;
	const yMax = ySize + zSize;
	for (let y = 0; y < yMax; y++) {
		for (let x = xSize; x > -xSize; x--) {
			for (let z = 0; z < zSize; z++) {
				const dx = x + z;
				const dy = y - z;
				const dz = zSize - z;

				const intesectedObj = scene.objects.find(obj => obj.intersect([dx, dy, dz])) || null;
				const nx = 50 + (dx + dy);
				const ny = 50 + (dy - dx - dz);
				const pixelIndex = (ny * w + nx) * 4;
				// console.log(nx, ny, color,pixelIndex );
				if (intesectedObj) {
					const color = intesectedObj.getColor([dx, dy, dz]);

					imageData[pixelIndex] = color[0];
					imageData[pixelIndex + 1] = color[1];
					imageData[pixelIndex + 2] = color[2];
					imageData[pixelIndex + 3] = color[3];

					imageData[pixelIndex + 4] = color[0];
					imageData[pixelIndex + 5] = color[1];
					imageData[pixelIndex + 6] = color[2];
					imageData[pixelIndex + 7] = color[3];

					break;
				} else {
					// plot empty
					// imageData[pixelIndex] = 255;
					// imageData[pixelIndex+1] = 255;
					// imageData[pixelIndex+2] = 255;
					// imageData[pixelIndex+3] = 255;
				}

			}
		}
	}
};


// x = x,-y  upp right
// y = x,y  down left
// z = y up


// 90 degree surfaces only use case


// distance fields
// use the closest object. min(all distances)
// min = union
// max = intersection

const a = math.dot([2, 4, 1], [2, 2, 3]);
// math.multiply([2, 4, 1], [2, 2, 3])

// TODO: direction as a vector


const sphere = (point, dimensions, texture) => {
	const [x, y, z] = point;
	const {radius} = dimensions;

	const intersect = ([px, py, pz]) => {
		const dx = px - x;
		const dy = py - y;
		const dz = pz - z;
		return Math.sqrt(dx * dx + dy * dy + dz * dz) < radius;
	};
	const getColor = ([px, py, pz]) => {
		const r = Math.min(Math.abs(px) * 4, 255);
		const g = Math.min(Math.abs(py) * 4, 255);
		const b = Math.min(Math.abs(pz) * 4, 255);
		const a = 255;
		// return [r, g, b, a];
		return [0, 0, 255, a];

	};
	return {
		intersect,
		getColor
	};
};

const floor = (point, dimensions, texture) => {
	const {zPos} = dimensions;

	const intersect = ([px, py, pz]) => {
		return px >= 0 && py >= 0 && pz <= zPos;
	};
	const getColor = ([px, py, pz]) => {
		const f = ((Math.floor(Math.abs(px) / 10) + Math.floor(Math.abs(py) / 10)) % 2) * 255;
		const f2 = Math.min(Math.abs(px) * 8, 255);
		const a = 255;
		return [f2, f2, f, a];
	};
	return {
		intersect,
		getColor
	};
};

const insideRect = function ([x, y, z], [x0, y0, z0, x1, y1, z1]) {
	return (
		x0 <= x && x <= x1 &&
		y0 <= y && y <= y1 &&
		z0 <= z && z <= z1
	);
};

// TODO: use this maybe later
//float dist = dotProduct(p.normal, (vectorSubtract(point, p.point)));
const box = (point, dimensions, texture) => {
	const [x, y, z] = point;
	const {xMax, yMax, zMax} = dimensions;
	const rect = [x, y, z, x + xMax, y + yMax, z + zMax];

	const intersect = (p) => {
		return insideRect(p, rect);

	};
	const getColor = ([px, py, pz]) => {
		// const max = Math.max(...p);
		// const colors = p.map(c => c===max?255:0).concat(255);
		// return colors;

		// const dx = px - x;
		// const dy = py - y;
		// const dz = pz - z;
		// const f = Math.min(Math.sqrt(dx * dx + dy * dy + dz * dz) * 4, 255);
		// const a = 255;

		const dx = Math.min((px - x) * 16, 255);
		const dy = Math.min((py - y) * 16, 255);
		const dz = Math.min((pz - z) * 16, 255);
		const a = 255;

		return [dx, dy, dz, a];
	};

	return {
		intersect,
		getColor
	};
};

// IDEA axonometric projection by object
// project all surfaces to the camera, by object


// IDEA
// for each x,y   not z
// get all distances
// use the closest one


const render = (scene, rayVector, imageData, w = 400) => {
	const {xSize, ySize, zSize} = scene;
	const yMax = ySize + zSize;
	for (let y = 0; y < yMax; y++) {
		for (let x = 0; x < xSize; x++) {
			let origin = [x, y, zSize];
			for (let i = 0; i < zSize; i++) {
				origin = math.add(origin, rayVector);
				const intesectedObj = scene.objects.find(obj => obj.intersect(origin)) || null;
				const pixelIndex = (y * w + x) * 4;
				if (intesectedObj) {
					const color = intesectedObj.getColor(origin);
					imageData[pixelIndex] = color[0];
					imageData[pixelIndex + 1] = color[1];
					imageData[pixelIndex + 2] = color[2];
					imageData[pixelIndex + 3] = color[3];
					break;
				} else {
					imageData[pixelIndex] = 255;
					imageData[pixelIndex + 1] = 255;
					imageData[pixelIndex + 2] = 255;
					imageData[pixelIndex + 3] = 100;
				}

			}
		}
	}
};
const test = (imageData) => {

// scene
//
	const scene = {
		xSize: 100,
		ySize: 100,
		zSize: 20,
		objects: []
	};


	const sp = sphere([30, 20, 10], {radius: 10}, null);
	const fl = floor([], {zPos: 2}, null);
	// top
	const xbox = box([10, 20, 10], {xMax: 10, yMax: 1, zMax: 10}, null);
	// side
	const ybox = box([20, 30, 10], {xMax: 1, yMax: 10, zMax: 10}, null);
	// front
	const zbox = box([30, 40, 10], {xMax: 10, yMax: 10, zMax: 1}, null);

	const b = box([20, 40, 10], {xMax: 10, yMax: 10, zMax: 10}, null);
	// scene.objects.push(sp);
	scene.objects.push(fl);
	// scene.objects.push(b);
	scene.objects.push(xbox);
	scene.objects.push(ybox);
	scene.objects.push(zbox);
	const t0 = new Date().getTime();
	render(scene, [1, -1, -1], imageData.data);
	const t1 = new Date().getTime();
	console.log('render time', (t1 - t0), 'ms');
};

// direction front,side,top
const plane = (point, direction, size, texture) => {
	const [x, y, z] = point;
	const {width, height} = size;
	const widthAdd = [1, 0, 0];
	const heightAdd = [0, 1, 0];

	const render = (projection, depthMap, colorDict) => {
		for (let h = 0; h < height; h++) {
			let point = [x, y, z];
			const heightOffset = math.multiply(heightAdd, h);
			point = math.add(heightOffset, point);
			for (let w = 0; w < width; w++) {
				const widthOffset = math.multiply(widthAdd, w);
				point = math.add(widthOffset, point);
				// project point to depthMap projection to get dx,dy
				// get distance between point and dx,dy
				// if(distance < depthMap[dx,dy].depth)
				//   get color from texture
				//   get colorIndex from colorDict[color] or create new index
				//   depthMap[dx,dy].depth = distance
				//   depthMap[dx,dy].colorIndex = colorIndex

				// move to next point to fill holes
				// point = math.add(widthAdd, point);
				// if(distance < depthMap[dx,dy].depth)
				//   get color from texture
				//   get colorIndex from colorDict[color] or create new index
				//   depthMap[dx,dy].depth = distance
				//   depthMap[dx,dy].colorIndex = colorIndex

				//
			}
		}

	}

};


export default {
	test
}