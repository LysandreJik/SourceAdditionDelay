import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Canvas from "./components/Canvas";
import Footer from "./components/Footer";
import PointsController from "./controller/PointsController"
import Options from "./components/Options";

export const pointsController = new PointsController();

class App extends Component {
	render() {
		return (
			<div className="App">
                <Options/>
				<Canvas/>
				<Footer/>
			</div>
		);
	}
}

export default App;
