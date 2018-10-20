import React from 'react'
import Loading from "../Loading/Loading";
import '../../theme/Signal.css';
import Back from '../../icons/ionicons_back.svg'
import SignalCanvas from "./SignalCanvas";

const backend = window.require('electron').remote.getGlobal('shared').backend;

const AVAILABLE_DISPLAYS = {
    FILE_SELECTION: "FILE_SELECTION"
};

export default class Signal extends React.Component{

    constructor(props){
        super(props);

        this.state = {currentDisplay: AVAILABLE_DISPLAYS.FILE_SELECTION, path: './python/recordings', loading: -1};

        this.listDirectory(this.state.path);
        this.selectDirectory = this.selectDirectory.bind(this);
    }

    async listDirectory(path){
        await backend.listDirectory(path).then(dir => {this.setState({dir: JSON.parse(dir)})});
    }

    selectDirectory(directory, key){
        if(directory === "return"){
            this.listDirectory(this.state.path.split('/').slice(0, -1).join('/')).then(() => this.setState({path: this.state.path.split('/').slice(0, -1).join('/'), loading: -1}));
        }else {
            if(directory.directory){
                this.setState({loading: key});
                this.listDirectory(this.state.path+"/"+directory.item).then(() => this.setState({path: this.state.path+"/"+directory.item, loading: -1}));
            }else{
                this.setState({currentDisplay: this.state.path+"/"+directory.item});
            }
        }
    }

    render(){
        if(this.state.currentDisplay === AVAILABLE_DISPLAYS.FILE_SELECTION){
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
                    {this.state.path !== './python/recordings' ? <div onClick={() => this.selectDirectory("return", -1)} className="Signal__directory" style={{width: "100px"}}><img src={Back} width={20}/></div> : ""}
                </div>
            )
        }else{
            return <SignalCanvas signal={this.state.currentDisplay}/>
        }

    }
}
