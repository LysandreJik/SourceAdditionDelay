import Point from "../model/Point";

export default class PointsController{
    constructor(){
        this._points = [];
        this._pointAdditionMethod = "microphone";
    }

    getMethod(){
        return this._pointAdditionMethod;
    }

    setSources(type){
        this._pointAdditionMethod = type;
    }

    setMicrophones(){
        this._pointAdditionMethod = "microphone";
    }

    addPoint(x, y, type, T0){
        this._points.push(new Point(x, y, type, T0));
    }

    getMicrophones(){
        return this._points.filter((point) => point.getType() === "microphone")
    }

    getSources(){
        return this._points.filter((point) => point.getType() !== "microphone")
    }

    removePoint(index){
        console.log(this._points);
        this._points.splice(index, 1);
        console.log(this._points);
    }

    getPoints(){
        return this._points;
    }
}
