import {pointsController} from "../App";

export default class Template{
    static export(medium = "air", title = "template.json"){
        this.downloadObjectAsJson({
            microphones: pointsController.getMicrophones().map(point =>  {return {x: point.getX(), y: point.getY()}}),
            sources: pointsController.getSource().map(point => {return {x: point.getX(), y: point.getY()}}), medium}, "template")
    }

    static downloadObjectAsJson(exportObj, exportName){
        let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href",     dataStr);
        downloadAnchorNode.setAttribute("download", exportName + ".json");
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }
}