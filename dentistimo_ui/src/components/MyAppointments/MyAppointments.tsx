/*
import React, { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BsCalendar2Check,BsClock, BsFillGeoAltFill,BsPersonFill,BsPencil,BsFillTrashFill} from "react-icons/bs";
import UpcomingAppointments from './UpcomingAppointments'
import { getAppointments, connectMQTT, publish, sub} from '../../Infrastructure/PMQTTController';
import { time } from 'console';

function MyAppointments() {
   const [data, setData] = useState<any[]>([]);  
   const [dentistId, setDentistId] = useState<string>('');
   const [date, setDate] = useState<string>('');
   const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        fetchMyAppointments('2') 
    }, []);
   
    //get all appointments of a user
    const fetchMyAppointments = async (id: string) => {
        await getAppointments(id)
        .then(response => {
            setData(response);
            console.log('Showing all appointments....');
        }).catch((e) => {
            console.log(e);
        });
    }

    //update an appointment
    const updateAppointment=({newUserId, newDentistId,newDate})=>{
        try {
            let newAppointment = {
                'userId': newUserId,
                'dentistId': newDentistId,
                'date': newDate,
            }
            publish('edit/request', JSON.stringify(newAppointment)) 
            console.log('Edit successful: ' + (newAppointment));
            onCancel();
        } catch (e) {
            console.log('Edit unsuccessful')
        }
    }

    const [inEditMode, setInEditMode] = useState({
        status: false,
        rowKey: null
    });

    //on Edit Mode
    const onEdit = ({_id,currentUserId, currentDentistId, currentDate}) => {
        setInEditMode({
            status: true,
            rowKey: _id
        })
        setDentistId(currentDentistId);
        setDate(currentDate);
        setUserId(currentUserId);
       
    }
     
    const onSave = ({_id, newDentistId, newDate, newUserId }) => {
        updateAppointment({newDentistId,newDate,newUserId})
      
     
    }

    const onCancel = () => {
        setInEditMode({
            status: false,
            rowKey: null
        })
        setUserId(null);
        setDentistId(null);
        setDate(null)
    }


    return (
        <div>
            <div>
                <UpcomingAppointments></UpcomingAppointments>
            </div>
            <h1 className="d-flex justify-content-center">All of your appointments</h1>
            <Table>
                <thead>
                    <tr>
                        <th><BsFillGeoAltFill></BsFillGeoAltFill></th>
                        <th><BsCalendar2Check></BsCalendar2Check></th>
                        <th><BsClock></BsClock></th>
                        <th><BsPersonFill></BsPersonFill></th>
                       
                    </tr>
                </thead>
                <tbody>{
                     data.map((value) => (
                        <tr key={value._id}>
                            <td>{inEditMode.status && inEditMode.rowKey === value._id ? (
                                <input value={dentistId}
                                    onChange={(event) => setDentistId(event.target.value)}
                                />
                            ) : (value.dentistId  )}
                            </td>
                            <td> { inEditMode.status && inEditMode.rowKey === value._id ? (
                                        <input type="text" value={date}
                                            onChange={(event) => setDate(event.target.value)} />
                                            
                                    ) : (value.date)}
                            </td>
                         
                            <td>  {inEditMode.status && inEditMode.rowKey === value._id ? (
                                        <input  value={userId}
                                            onChange={(event) => setUserId(event.target.value)} />
                                    ) : ( value.userId)}
                            </td>
                            <td>{  inEditMode.status && inEditMode.rowKey === value._id? (
                                        <React.Fragment>
                                            <button className={"btn-success"}
                                             onClick={() => onSave({
                                                    _id: value._id, newUserId: userId,
                                                    newDentistId: dentistId, newDate: date })}
                                            >Save</button>
                                            <button className={"btn-secondary"} style={{ marginLeft: 8 }}
                                                onClick={() => onCancel()}
                                                 >Cancel
                                             </button>
                                        </React.Fragment>
                                    ) : (
                                        <div>
                                            <button className={"btn btn-default btn-sm"}
                                                onClick={() => onEdit({
                                                    _id: value._id, currentUserId: value.userId,
                                                    currentDentistId: value.dentistId, currentDate: value.date
                                                })}>
                                                <span><BsPencil></BsPencil></span>
                                            </button>
                                            <button className={"btn btn-default btn-sm"}
                                            onClick={() => deleteAppointment({
                                                newUserId: value.userId,
                                                newDentistId: value.dentistId,newRequestId:value.requestId,
                                                issuance:value.issuance, newDate: value.date
                                                })}>
                                                <span><BsFillTrashFill></BsFillTrashFill></span>
                                            </button>
                                        </div>
                                    )
                                }
                            </td>
                        </tr>
                    ))
                  } 
                </tbody>
            </Table>
        </div>
    );
}
*/
export {} //default MyAppointments;