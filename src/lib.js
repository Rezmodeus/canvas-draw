import * as math from 'mathjs'

// ***************************************************
// notes
// ***************************************************
// const _projectIso = ([x, y, z]) => {
// 	return [Math.floor(x - y), Math.floor((x / 2) + (y / 2) - z)];
// };


const _projectIso = ([x, y, z]) => {
	return [x + y, y - x - z];
};


const projectIso = ([x, y, z], w, h) => {
	return [x + y, y - x - z, (w - x) + (z * h)];
};


// x = x,-y  upp right
// y = x,y  down left
// z = y up


const insideRect = function ([x, y, z], [x0, y0, z0, x1, y1, z1]) {
	return (
		x0 <= x && x <= x1 &&
		y0 <= y && y <= y1 &&
		z0 <= z && z <= z1
	);
};

// maybe use this maybe later
//float dist = dotProduct(p.normal, (vectorSubtract(point, p.point)));

// from stack overflow
// function projectIso(x, y, z) {
// 	return {
// 		x: x - y,
// 		y: (x / 2) + (y / 2) - z
// 	};
// }

// pigeon hole sort
// sort(entities)
// 	buckets = new Array(MaxDistance)
//
// 	for index in buckets
// 		buckets[index] = new Array
// 	end
//
// 	// distribute to buckets
// 	for entity in entities
// 		distance = calculateDistance(entity)
// 	buckets[distance].add(entity)
// 	end
//
// 	// flatten
// 	result = new Array
// 	for bucket in buckets
// 		for entity in bucket
// 			result.add(entity)
// 		end
// 	end
// end

// ***************************************************
//  end notes
// ***************************************************


const direction = {
	front: {
		widthVector: [1, 0, 0],
		heightVector: [0, 0, 1]
	},
	top: {
		widthVector: [1, 0, 0],
		heightVector: [0, 1, 0]
	},
	side: {
		widthVector: [0, 1, 0],
		heightVector: [0, 0, 1]
	}
};


// Main idea here
// project all surfaces to the camera, by object
// use a depth parameter to decide if overwrite point

// create a plane top, side or front
// TODO: use shader instead of just color
const plane = (point, size, color, {widthVector, heightVector}) => {
	const [x, y, z] = point;
	const {width, height} = size;
	const render = (renderSetup) => {
		for (let h = 0; h < height; h++) {
			let point = [x, y, z];
			// go to right pos along height
			const heightOffset = math.multiply(heightVector, h);
			point = math.add(heightOffset, point);
			for (let w = 0; w < width; w++) {
				// go to right pos along width
				point = math.add(widthVector, point);
				renderSetup.addToMap(point, color)
			}
		}
	};
	return {
		render
	}
};


// IMPORTANT
// isoItem = depth,z,color/colorIndex

const newRenderSetup = (isoMap, projectionType = 'iso1') => {

	// TODO: select projection function and depth function based on projectionType
	const projectIso = ([x, y, z]) => {
		return [x + y, y - x - z];
	};

	const getDepth = ([x, y, z]) => y + z;

	const willRender = (point) => {
		const isoPoint = projectIso(point);
		const depth = getDepth(point);
		const inBounds = isoPoint[0] >= 0 &&
			isoPoint[0] < isoMap[0].length &&
			isoPoint[1] >= 0 &&
			isoPoint[1] < isoMap.length;
		// isoItem = depth,z,color/colorIndex
		const prevDepth = inBounds
			? isoMap[isoPoint[1]][isoPoint[0]][0]
			: -1;
		return (depth > prevDepth);
	};

	const pointToIntPoint = ([x, y, z]) => [x | 0, y | 0, z | 0];
	const addToMap = (p, color) => {
		const point = pointToIntPoint(p);
		const prevIsoItem = getIsoItem(point);
		const depth = getDepth(point);
		if (prevIsoItem && depth >= prevIsoItem[0]) {
			const item = [depth, point[2], color];
			setIsoItem(point, item);
		}
	};

	const setIsoItem = (point, item) => {
		const isoPoint = projectIso(point);
		isoMap[isoPoint[1]][isoPoint[0]] = item;
	};

	const getIsoItem = (point) => {
		const isoPoint = projectIso(point);
		const inBounds = isoPoint[0] >= 0 &&
			isoPoint[0] < isoMap[0].length &&
			isoPoint[1] >= 0 &&
			isoPoint[1] < isoMap.length;
		return inBounds
			? isoMap[isoPoint[1]][isoPoint[0]]
			: null;
	};

	return {
		willRender,
		addToMap,
		setIsoItem,
		getIsoItem
	}

};

const newIsoMap = (width, height) => {
	const repeat = (fn, n) => Array(n).fill(0).map(fn);
	// isoItem = depth,z,color/colorIndex
	const onePos = () => [-1, 0, [50, 50, 50, 255]];
	const isoMap = (w, h) => repeat(() => repeat(onePos, w), h);
	return isoMap(width, height);
};

const isoMapToImage = (isoMap, imageData) => {
	const w = imageData.width;
	isoMap.forEach((row, y) => {
		row.forEach((isoPos, x) => {
			const color = isoPos[2];
			const pixelIndex = (y * w + x) * 4;
			imageData.data[pixelIndex] = color[0];
			imageData.data[pixelIndex + 1] = color[1];
			imageData.data[pixelIndex + 2] = color[2];
			imageData.data[pixelIndex + 3] = color[3];
		})
	})
};

// TODO:
// higher end functions using plane
// top
// front
// side

// even higher
// box
// frustum

// hole shader
// extrude
// circles


const test = (imageData) => {

	const isoMap = newIsoMap(imageData.width, imageData.height);

	// create objects
	const p0 = plane([5, 25, 5], {width: 8, height: 7}, [255, 0, 0, 255], direction.front);
	const p1 = plane([5, 26, 5], {width: 8, height: 8}, [0, 255, 0, 255], direction.side);
	const p2 = plane([5, 27, 5], {width: 10, height: 10}, [0, 0, 255, 255], direction.top);


	// render setup
	const projectionType = 'iso1';
	const renderSetup = newRenderSetup(isoMap, projectionType);

	// render isoMap
	const objectsToRender = [p0, p1, p2];
	// const objectsToRender = [p0];
	objectsToRender.forEach(obj => obj.render(renderSetup));

	// isoMap to image
	isoMapToImage(isoMap, imageData);

};

export default {
	test: test
}

