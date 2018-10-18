import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import Canvas from "./components/Canvas";
import Footer from "./components/Footer";
import PointsController from "./controller/PointsController"
import Options from "./components/Options";

import Close from './icons/ionicons_close.svg';
import Expand from './icons/ionicons_expand.svg';
import Minimize from './icons/ionicons_remove.svg';

const win = window.require('electron').remote.getCurrentWindow();
const remote = window.require('electron').remote;

console.log(remote.getGlobal('shared').backend.getData().then(data => console.log("Data : ", data)));

export const pointsController = new PointsController();

class App extends Component {
	render() {
		return (
			<div className="App">
                <TitleBar/>
                <Options/>
				<Canvas/>
				<Footer/>
			</div>
		);
	}
}


class TitleBar extends React.Component{
    render(){
        return(
            <div className="titlebar">
                <button className="titlebar__button" onClick={() => win.minimize()}><img className="titlebar__buttonImage" src={Minimize} height={15} width={15}/></button>
                <button className="titlebar__button" onClick={() => {win.isMaximized() ? win.unmaximize() : win.maximize()}}><img className="titlebar__buttonImage" src={Expand} height={15} width={15}/></button>
                <button className="titlebar__button" onClick={() => win.close()}><img className="titlebar__buttonImage" src={Close} height={15} width={15}/></button>
            </div>
        )
    }
}

export default App;
