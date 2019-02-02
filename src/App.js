import React, {Component} from 'react';
import './App.css';

class App extends Component {

	constructor(props) {
		super(props);
		// Don't call this.setState() here!
		this.state = {
			height: 400,
			width: 400
		}
		;
		this.setPixel = this.setPixel.bind(this);
		this.drawRect = this.drawRect.bind(this);
		this.updateImage = this.updateImage.bind(this);
	}

	componentDidMount() {
		this.imagedata = this.ctx.createImageData(this.state.width, this.state.height);
	}

	updateImage() {
		this.ctx.putImageData(this.imagedata, 0, 0);
	};

	drawRect(x0, y0, x1, y1) {
		for (let x = x0; x < x1; x++) {
			for (let y = y0; y < y1; y++) {
				this.setPixel(x, y);
			}
		}
		this.updateImage();

	}

	setPixel(x, y) {
		const pixelindex = (y * this.state.width + x) * 4;
		this.imagedata.data[pixelindex] = 255;//red;
		this.imagedata.data[pixelindex + 1] = 255;//green;
		this.imagedata.data[pixelindex + 2] = 255;//blue;
		this.imagedata.data[pixelindex + 3] = 255;//alpha;
	}


	render() {
		const canvasStyle = {
			height: this.state.height + 'px',
			width: this.state.width + 'px',
		};

		return (
			<div className="App">
				<header className="App-header">
					<button onClick={() => this.drawRect(100, 100, 200, 200)}>
						set pix
					</button>
					<canvas className="canvas-container" style={canvasStyle}
					        ref={(c) => this.ctx = c.getContext('2d')}/>
				</header>
			</div>
		);
	}
}

export default App;
