import React from 'react'

import '../../theme/Loading.css';

export default class Loading extends React.Component{
    constructor(props){
        super(props);

        if(this.props.callback)
            this.props.callback();
    }
    render(){
        if(this.props.small){
            return(
                <div className="indicator indicator--small">
                    <svg width="16px" height="12px">
                        <polyline id="back" points="1 6 4 6 6 11 10 1 12 6 15 6"/>
                        <polyline id="front" points="1 6 4 6 6 11 10 1 12 6 15 6"/>
                    </svg>
                </div>
            )
        }else{
            return(
                <div className="indicator">
                    <svg width="16px" height="12px">
                        <polyline id="back" points="1 6 4 6 6 11 10 1 12 6 15 6"/>
                        <polyline id="front" points="1 6 4 6 6 11 10 1 12 6 15 6"/>
                    </svg>
                </div>
            )
        }

    }
}
