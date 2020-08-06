import React, { Component } from 'react';
import { withRouter } from 'react-router';

import "../../assets/css/component/recursos/TabProyectos.css";

import LinearProgress from '@material-ui/core/LinearProgress';

import { TablaAdministracion } from "../general/TablaAdministracion";

import Requester from "../../communication/Requester";

const mapacheRecursosBaseUrl = "https://mapache-recursos.herokuapp.com";
//const mapacheRecursosBaseUrl = "http://0.0.0.0:8080";

const mapacheProyectosBaseUrl = 'https://mapache-proyectos.herokuapp.com/';

class TabProyectos extends Component {

    constructor(props) {
        super(props);

        this.requesterRecursos = new Requester(mapacheRecursosBaseUrl);
        this.requesterProyectos = new Requester(mapacheProyectosBaseUrl);

        this.state = {
            asignacionProyectos: [],
            proyectos: [],
            data: []
        }

        this.requestDataProyecto = this.requestDataProyecto.bind(this);
        this.requestHorasProyecto = this.requestHorasProyecto.bind(this);
        this.createData = this.createData.bind(this);
    }

    /*
    1 - Le pido al empleado todas sus asignaciones
    2 - Para cada asignación proyecto obtengo el nombre del proyecto
    3 - Para cada asignacion proyecto obtengo la cantidad de horas que trabajo
    */

    componentDidMount() {
        let legajo = this.props.match.params.legajo;
        this.setState({
            data: asignaciones
        });
        /*
        this.requesterRecursos.get(`/empleados/${legajo}/proyectos/`)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    this.props.mostrarAlerta(
                        `Error al consultar asignaciones del empleado ${this.state.empleadoSeleccionado.legajo}`,
                        "error"
                    );
                }
            })
            .then(response => {
                if (response) {
                    return response;
                }
            }).then(async (asignacionProyectos) => {
                if (asignacionProyectos) {
                    let data = await this.createData(asignacionProyectos);
                    
                    this.setState({
                        asignacionProyectos: asignacionProyectos,
                        data: data
                    });
                }
            });*/
    }

    requestDataProyecto(codigoProyecto) {
        return this.requesterProyectos.get(`/proyectos/${codigoProyecto}`)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    this.props.mostrarAlerta(
                        `Error al consultar el proyecto ${codigoProyecto}`,
                        "error"
                    );
                }
            })
            .then(response => {
                if (response) {
                    return response;
                }
            });
    }

    requestHorasProyecto(legajo, codigoProyecto) {
        return this.requesterRecursos.get(`/empleados/${legajo}/proyectos/${codigoProyecto}/horas`)
            .then(response => {
                if (response.ok){
                    return response.json();
                } else {
                    this.props.mostrarAlerta(
                        `Error al consultar horas del proyecto ${codigoProyecto}`,
                        "error"
                    );
                }
            }).then(response => {
                if (response) {
                    return response;
                }
            });
    }

    async createData(asignacionProyectos) {
        let array = await Promise.all(
            asignacionProyectos.map(async (asignacion) => {
                const proyecto = await this.requestDataProyecto(asignacion.codigoProyecto);
                const horas = await this.requestHorasProyecto(
                    this.props.legajo, 
                    asignacion.codigoProyecto
                );

                if (proyecto && horas) {
                    let aux = {
                        nombre: proyecto.nombre,
                        titulo: asignacion.rolEmpleado,
                        progreso: horas.horasTrabajadas,
                    }
                    return aux;
                } else {
                    return null;
                }
            }
        ));
        
        return array.filter((element) => element);
    }

    render() {
        return (
            <div className="tab-proyectos-div">
                <div className="tab-proyectos-body">
                    <TablaAdministracion
                        title={ title }
                        columns={ columns }
                        data={ this.state.data }
                        editable ={ null }
                        actions={ null }
                    >
                    </TablaAdministracion>
                </div>
                { this.props.alerta }
            </div>
        )
    }

}

export default withRouter(TabProyectos);

const title = "Proyectos";

const columns = [
    {
        title: "Nombre", 
        field: "nombre",
        cellStyle: {
            minWidth: '27em'
        }
    },
    {
        title: "Título", 
        field: "titulo",
        cellStyle: {
            minWidth: '10em'
        }
    },
    {
        title: "Desde", 
        field: "fechaInicio",
        cellStyle: {
            minWidth: '9em'
        }
    },
    {
        title: "Hasta", 
        field: "fechaFin",
        cellStyle: {
            minWidth: '9em'
        }
    },
    {
        title: "Progreso", 
        field: "progreso",
        render: rowData => <LinearProgress variant="buffer" value={rowData.progreso}/> ,
        cellStyle: {
            minWidth: '15em'
        }
    }
]

const asignaciones = [
    {
        nombre: "ERP Cloud",
        titulo: "UX",
        fechaInicio: "2020-07-01",
        fechaFin: "2020-08-05",
        progreso: 100
    },
    {
        nombre: "Gestión",
        titulo: "ARQUITECTO",
        fechaInicio: "2020-08-06",
        fechaFin: null,
        progreso: 30
    }
]