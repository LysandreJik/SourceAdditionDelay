import React from 'react'
import '../../theme/Neural.css'

export default class Neural extends React.Component{
    render(){
        return(
            <div className="Neural">
                <div className="Neural__Environment"></div>
                <div className="Neural__NeuralArchitecture"></div>
                <div className="Neural__InputSignals"></div>
                <div className="Neural__NeuralInformation"></div>
            </div>
        )
    }
}
