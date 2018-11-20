import "../../theme/Welcome.css"
import React from 'react'
import store from '../../controller/store/Store'
import {showEnvironmentCanvas} from "../../controller/actions/PageActions";

export default class Welcome extends React.Component{

    constructor(props){
        super(props);
        console.log(this.props);
        this.submit = this.submit.bind(this);
    }

    submit(){
        if(document.getElementById('name').value){
            this.props.setName(document.getElementById('name').value);
            store.dispatch(showEnvironmentCanvas())
        }
    }

    render(){
        return(
            <div className="Welcome">
                <div className="Welcome__Hi">Hi</div>
                <div className="Welcome__Name">What's your name ?</div>
                <input id="name" className="Welcome__Input" onKeyPress={(e) => e.key === 'Enter' ? this.submit() : ""}/>
            </div>
        )
    }
}