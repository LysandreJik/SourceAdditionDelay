import Point from "../model/Point";

export default class PointsController{
    constructor(){
        this._points = [];
        this._pointAdditionMethod = "microphone";
    }

    getMethod(){
        return this._pointAdditionMethod;
    }

    setSources(){
        this._pointAdditionMethod = "source"
    }

    setMicrophones(){
        this._pointAdditionMethod = "microphone";
    }

    addPoint(x, y, type){
        this._points.push(new Point(x, y, type));
    }

    getMicrophones(){
        return this._points.filter((point) => point.getType() === "microphone")
    }

    getSource(){
        return this._points.filter((point) => point.getType() === "source")
    }

    removePoint(index){
        this._points.slice(index, 1);
    }

    getPoints(){
        return this._points;
    }
}
