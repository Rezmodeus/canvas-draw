import React, {Component} from 'react';
import lib from './lib'
import testLib from './testLib'
import './App.css';

class App extends Component {

	constructor(props) {
		super(props);
		// Don't call this.setState() here!
		this.state = {
			height: 200,
			width: 200,
			counter: 0,
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
		// this.setState({counter: this.state.counter + 1});
	};

	drawRect(x0, y0, x1, y1) {
		for (let x = x0; x < x1; x++) {
			for (let y = y0; y < y1; y++) {
				// this.setPixel(x, y);
			}
		}
		// testLib.testDraw(this.ctx);
		lib.test(this.imagedata);
		this.updateImage();

	}

	setPixel(x, y) {
		const pixelindex = (y * this.state.width + x) * 4;
		this.imagedata.data[pixelindex] = 100;//red;
		this.imagedata.data[pixelindex + 1] = 0;//green;
		this.imagedata.data[pixelindex + 2] = 0;//blue;
		this.imagedata.data[pixelindex + 3] = 255;//alpha;
	}


	render() {
		const canvasStyle = {
			height: '800px',
			width: '800px',
		};

		return (
			<div className="App">
				<header className="App-header">
					<button onClick={() => this.drawRect(10, 10, 100, 100)}>
						set pix
					</button>
					<canvas width={this.state.width} height={this.state.height} className="canvas-container"
					        style={canvasStyle}
					        ref={(c) => this.ctx = c.getContext('2d')}/>
				</header>
			</div>
		);
	}
}

export default App;
