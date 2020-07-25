import React, {Component} from "react";
import NavBarProyecto from "../NavBarProyecto";
import ListadoFases from "./ListadoFases";

export default class EditorFasesScreen extends Component {
    render() {
        return(
            <div>
                <NavBarProyecto/>
                <ListadoFases/>
            </div>
        )
    }
}