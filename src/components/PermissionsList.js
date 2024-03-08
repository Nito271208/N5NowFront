import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { css } from "@emotion/react";
import { RingLoader } from "react-spinners";
import Swal from 'sweetalert2';


const PermissionsList = () => {
    {/* VARIABLES */ }
    const url = 'https://localhost:7104/api/';
    const [permissionsTypes, setPermisssionsTypes] = useState([]);
    const [loading, setLoading] = useState(false);
    const override = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    `;

    useEffect(() => {
        getPermissionsTypes();
    }, []);

    {/* OBTENGO LA LISTA DE PERMISSIONS TYPE */ }
    const getPermissionsTypes = async () => {
        try {
            setLoading(true);
            const response = await axios.get(url + 'PermissionsType');
            setPermisssionsTypes(response.data.permissionsListType);
        } catch (error) {
            console.error('Error al obtener los permisos:', error);
            Swal.fire('Error', 'Error de conexión, Contacte a Soporte.', 'error');
        } finally {
            setLoading(false);
        }
    }

    return (
        // LISTO LOS PERMISSIONS TYPE
        <div style={{ position: 'relative' }}>
            {loading && (
                <div className="d-flex justify-content-center align-items-center" style={{ ...override, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, paddingTop: '400px' }}>
                    <RingLoader color="#c24514" loading={loading} size={150} />
                </div>
            )}
            {!loading && (
                <div className='col-12 col-lg-12' style={{ textAlign: 'center', paddingTop: '50px' }}>
                    <div className='table-responsive'>
                        <table className='table'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Permission Description</th>
                                </tr>
                            </thead>
                            <tbody className='table-group-divider'>
                                {permissionsTypes.map((ele) => (
                                    <tr key={ele.id}>
                                        <td>{ele.id}</td>
                                        <td>{ele.permissionDescription}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PermissionsList