import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Swal from 'sweetalert2';
import { validateFields } from '../functions/validateFields';
import { css } from "@emotion/react";
import { RingLoader } from "react-spinners";

const PermissionsOperations = () => {

    // Variables
    const url = 'https://localhost:7104/api/';
    const [permissions, setPermisssions] = useState([]);
    const [permissionsTypes, setPermisssionsTypes] = useState([]);
    const [id, setId] = useState('');
    const [employeeForename, setEmployeeForename] = useState('');
    const [employeeSurname, setEmployeeSurname] = useState('');
    const [permissionTypeId, setPermissionTypeId] = useState('');
    const [permissionGrantedOnDate, setPermissionGrantedOnDate] = useState('');
    const [operation, setOperation] = useState(1);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const override = css`
    display: block;
    margin: 0 auto;
    border-color: red; // Puedes personalizar el color del borde del spinner
  `;

    useEffect(() => {
        setLoading(true);
        getPermissions();
        getPermissionsTypes();
        setLoading(false);
    }, []);

    // Listo la tabla Permissions
    const getPermissions = async () => {
        try {
            setLoading(true);
            const response = await axios.get(url + 'Permissions');
            setPermisssions(response.data);
        } catch (error) {
            console.error('Error al obtener los permisos:', error);
            Swal.fire('Error', 'Error de conexión, Contacte a Soporte.', 'error');
        } finally {
            setLoading(false);
        }
    }
    // Listo la tabla Permissions Type
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

    // Cuando ocurre un cambio en el Permission Type
    const handlePermissionTypeChange = async (e) => {
        const selectedPermissionTypeId = e.target.value;
        setPermissionTypeId(selectedPermissionTypeId);
    };

    // MODAL
    const [isModalOpen, setIsModalOpen] = useState(false);
    const closeModal = async () => {
        setId('');
        setEmployeeForename('');
        setEmployeeSurname('');
        setPermissionTypeId('');
        setPermissionGrantedOnDate('');
        setOperation(1);
        setTitle('');
        setIsModalOpen(false);
        await new Promise(resolve => setTimeout(resolve, 100));
    };

    // FUNCION MODAL
    const openModal = (op, id, employeeForename,
        employeeSurname, permissionTypeId, permissionGrantedOnDate) => {
        setId('');
        setEmployeeForename('');
        setEmployeeSurname('');
        setPermissionTypeId('');
        setPermissionGrantedOnDate('');
        setOperation(op);
        if (op === 1) {
            setTitle('Request Permission');
        }
        else if (op === 2) {
            setTitle('Modify Permission');
            setId(id);
            setEmployeeForename(employeeForename);
            setEmployeeSurname(employeeSurname);
            setPermissionTypeId(permissionTypeId);
            setPermissionGrantedOnDate(permissionGrantedOnDate);
        }

        window.setTimeout(function () {
            document.getElementById('employeeForename').focus();
        }, 500);
        setIsModalOpen(true);
    }

    // FUNCION PARA GUARDAR O MODIFICAR
    const handleSave = async () => {
        const Id = id;
        const Forename = employeeForename;
        const Surname = employeeSurname;
        const TypeId = permissionTypeId;
        const GrantedOnDate = permissionGrantedOnDate;

        // Validar campos
        if (!validateFields(Forename, Surname, TypeId, GrantedOnDate)) {
            return;  // Detener ejecución si la validación falla
        }
        try {
            setLoading(true);
            let response;

            if (operation === 1) {
                const requestData = {
                    createPermission: {
                        employeeForename: Forename,
                        employeeSurname: Surname,
                        permissionTypeId: TypeId,
                        permissionGrantedOnDate: GrantedOnDate,
                    },
                };
                // Modo de creación: ENVIO DE REQUEST A LA API
                response = await axios.post(url + 'Permissions', requestData);
            } else if (operation === 2) {
                const modifyData = {
                    updatePermission: {
                        id: Id,
                        employeeForename: Forename,
                        employeeSurname: Surname,
                        permissionTypeId: TypeId,
                        permissionGrantedOnDate: GrantedOnDate,
                    },
                };
                // Modo de edición: ENVIO DE REQUEST A LA API
                response = await axios.put(url + 'Permissions/', modifyData);
            }

            // Manejamos éxito
            Swal.fire('Success', response.data.message, 'success');

            // Limpiar formulario o cerrar modal
            closeModal();

            // Refresco mi Datatable
            getPermissions();
        } catch (error) {
            // Manejo de error
            console.error('Error al guardar la solicitud de permiso', error);
            Swal.fire('Error', 'Error al guardar la solicitud de permiso', 'error');
        }
        finally {
            // Desactivo el spinner independientemente de si hay éxito o error
            setLoading(false);
        }
    };

    return (
        <div className='App'>
            {/* BOTON REQUEST PERMISSION */}
            <div className='container-fluid'>
                <div className='row mt-4'>
                    <div className='col-6'>
                        <div style={{ textAlign: 'center', paddingTop: '10px' }}>
                            <button
                                onClick={() => openModal(1)}
                                className='btn btn-dark'
                                data-bs-toggle='modal'
                                data-bs-target='#modalPermissions'
                            >
                                <i className='fa-solid fa-circle-plus'></i> Request Permission
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* DATATABLE PERMISSIONS */}
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
                                        <th>Employee Forename</th>
                                        <th>Employee Surname</th>
                                        <th>Permission Type</th>
                                        <th>Permission Granted On Date</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody className='table-group-divider'>
                                    {permissions.map((ele) => {
                                        return (
                                            <tr key={ele.id}>
                                                <td>{ele.id}</td>
                                                <td>{ele.employeeForename}</td>
                                                <td>{ele.employeeSurname}</td>
                                                <td>{ele.permissionType}</td>
                                                <td>{ele.permissionGrantedOnDate}</td>
                                                <td>
                                                    <button onClick={() => openModal(2, ele.id, ele.employeeForename, ele.employeeSurname, ele.permissionTypeId, ele.permissionGrantedOnDate)}
                                                        data-bs-toggle='modal' data-bs-target='#modalPermissions' className="btn btn-warning">
                                                        <i className='fa fa-pencil'></i>Modify
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* MODAL PARA CREACION O EDICION PERMISSION */}
            <div id='modalPermissions' className={`modal fade ${isModalOpen ? 'show' : ''}`} aria-hidden={!isModalOpen}>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <label className='h5'>{title}</label>
                            <button type='button' className='btn-close' data-bs-dismiss='modal'
                                aria-label='Close'></button>
                        </div>
                        <div className='modal-body'>
                            <input type='hidden' id='id'></input>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa fa-user'></i></span>
                                <input type='text' id='employeeForename' className='form-control' placeholder='Employee Forename' value={employeeForename}
                                    onChange={(e) => setEmployeeForename(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa fa-user'></i></span>
                                <input type='text' id='employeeSurname' className='form-control' placeholder='Employee Surname' value={employeeSurname}
                                    onChange={(e) => setEmployeeSurname(e.target.value)}></input>
                            </div>
                            <div className='input-group mb-3'>
                                <label className='input-group-text' htmlFor='permissionTypeId'>
                                    <i className='fa fa-user-secret'></i>
                                </label>
                                <select
                                    id='permissionTypeId'
                                    className='form-select'
                                    value={permissionTypeId}
                                    onChange={handlePermissionTypeChange}
                                >
                                    <option value='' disabled>Select Permission Type</option>
                                    {permissionsTypes.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.permissionDescription}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='input-group mb-3'>
                                <span className='input-group-text'><i className='fa fa-calendar'></i></span>
                                <input type='text' id='permissionGrantedOnDate' className='form-control' placeholder='Permission Date' value={permissionGrantedOnDate}
                                    onChange={(e) => setPermissionGrantedOnDate(e.target.value)}></input>
                            </div>
                            <div className='d-grid col-6 mx-auto'>
                                <button onClick={handleSave}
                                    type='button' className='btn btn-success'>
                                    <i className='fa-solid fa-floppy-disk'></i> Save
                                </button>
                                <RingLoader color="#36D7B7" loading={loading} css={override} size={150} />
                            </div>
                        </div>
                        <div className='modal-footer'>
                            <button type='button' className='btn btn-danger' data-bs-dismiss='modal'>
                                <i className='fa-solid fa-close'></i> Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PermissionsOperations