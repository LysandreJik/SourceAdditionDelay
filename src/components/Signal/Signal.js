import React from 'react'
import Loading from "../Loading/Loading";
import '../../theme/Signal.css';
import Back from '../../icons/ionicons_back.svg'
import {showLoading, showSignalCanvas} from "../../controller/actions/PageActions";
import store from "../../controller/store/Store";

const backend = window.require('electron').remote.getGlobal('shared').backend;

const AVAILABLE_DISPLAYS = {
    FILE_SELECTION: "FILE_SELECTION"
};

export default class Signal extends React.Component{

    constructor(props){
        super(props);



        this.state = {currentDisplay: AVAILABLE_DISPLAYS.FILE_SELECTION, path: this.props.path, loading: -1};

        console.log(this.props.path);
        this.listDirectory(this.props.path);
        this.selectDirectory = this.selectDirectory.bind(this);
    }

    async listDirectory(path){
        console.log('Listing directory with path', path);
        if(path){
            await backend.listDirectory(path).then(data => this.setState({dir: JSON.parse(data)}));
        }else{
            await backend.listDirectory(path).then(data => {this.setState({dir: JSON.parse(data.data), path: data.path})});
        }
    }

    selectDirectory(directory, key){
        console.log('Selecting directory', directory, key, "with current path", this.state.path);
        if(directory === "return"){
            if(this.state.split){
                this.listDirectory(this.state.path.split('/').slice(0, -1).join('/')).then(() => this.setState({path: this.state.path.split('/').slice(0, -1).join('/'), loading: -1}));
            }else{
                this.listDirectory();
            }
        }else {
            if(directory.directory){
                this.setState({loading: key});
                console.log('Lissting directory with path', this.state.path , directory.item);
                this.listDirectory(this.state.path+"/"+directory.item).then(() => this.setState({path: this.state.path+"/"+directory.item, loading: -1})).then(() => console.log(this.state.dir));
            }else{
                store.dispatch(showLoading(() => {store.dispatch(showSignalCanvas(this.state.path+"/"+directory.item))}));
            }
        }
    }

    render(){
        if(!this.state.dir)
            return <Loading/>;

        return(
            <div className="Signal">
                {this.state.dir.map((item, key) => {
                    if(this.state.loading === key){
                        return <div key={key} onClick={() => this.selectDirectory(item, key)} className={"Signal__directory" + (item.directory ? "" : "  Signal__directory--file")}><Loading small/></div>
                    }
                    return <div key={key} onClick={() => this.selectDirectory(item, key)} className={"Signal__directory" + (item.directory ? "" : "  Signal__directory--file")}>{item.item}</div>
                })}
                <div onClick={() => this.selectDirectory("return", -1)} className="Signal__directory" style={{width: "100px"}}><img src={Back} width={20}/></div>
            </div>
        )
    }
}
