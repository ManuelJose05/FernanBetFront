import {useContext, useEffect, useState} from "react";
import {TeamContext} from "../context/TeamContext";
import {DataTable} from "primereact/datatable";
import {SortOrder} from "primereact/api";
import {Column} from "primereact/column";
import "../styles/Ranking.css"
import {showMessage,} from "../providers/MessageProvider";

function TeamsRanking() {
    const {equipos,getAllEquipos} = useContext(TeamContext);
    const [loading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        fetchEquipos();
    }, []);

    const fetchEquipos = async () => {
        try {
            setLoading(true);
            await getAllEquipos();
            setLoading(false);
        } catch (error) {
            showMessage({
                severity: "warn",
                summary: "Error",
                message: "No se ha podido obtener los equipos."
            })
        }
    }
    return (
        <div className="flex flex-column align-items-center justify-content-center">
            <h2 className="text-center">Clasificación</h2>
            <div className="p-2 w-screen xl:w-7 lg:w-7 md:w-full sm:w-full">
                <DataTable id="ranking" value={equipos} rows={equipos.length} dataKey={"id"} emptyMessage="No teams found"
                           sortField="puntos" sortOrder={SortOrder.DESC} loading={loading}
                >
                    <Column
                        header="#"
                        body={(rowData, options) => options.rowIndex + 1}
                    />
                    <Column field="nombre" header="Club" />
                    <Column field="puntos" header="Pts" />
                    <Column field="dg" header="DG" />
                    <Column field="gf" header="GF" />
                    <Column field="gc" header="GC" />
                    <Column field="victorias" header="V" />
                    <Column field="empates" header="E" />
                    <Column field="derrotas" header="D" />
                    <Column field="pj" header="PJ" />
                </DataTable>
            </div>

        </div>
    );
}

export default TeamsRanking;