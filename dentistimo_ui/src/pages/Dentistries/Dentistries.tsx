import React, {useEffect, useState} from 'react';
import './Dentistries.css';
import Map from '../../components/GoogleMapsApi/Map';
import { dentistries } from '../../data/dentistries';
import SearchBar from '../../components/SearchBar/SearchBar';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FullCalendar, { DateSelectArg, EventClickArg } from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';
import {getAppointments, deleteAppointment, publish, rawUserId} from '../../Infrastructure/PMQTTController';

interface IFetchedSlot {
    id?: string | undefined;
    title?: string;
    start: Date | string;
    end: Date | string;
    display: string;
    color: string;
}

interface IAppInfo {
    slot: DateSelectArg | undefined;
    id: string | undefined;
}

const Dentistries: React.FC = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [bookingConfirmed, setBookingConfirmed] = useState(true);
    const [appointmentInfo, setAppointmentInfo] = useState<IAppInfo>({slot: undefined, id: undefined});
    const [eventTitle, setEventTitle] = useState<string>('');
    const [id, setId] = useState<string>('');
    
    useEffect(() => {
        try {
            console.log(Math.ceil(Math.random()*10000000));
        } catch (e) {
            console.log('---');
        }
    }, []);

    const createAppointment = (selectInfo: IAppInfo) => {
        if (selectInfo.slot !== undefined && selectInfo.id !== undefined) {
            const onSlotSelect = selectInfo.slot.view.calendar
            if (bookingConfirmed) {
                let desiredEvent = {
                    userId: rawUserId().toString(), //authentication should add it in 
                    requestId: '10',   //to be replaced by guid
                    dentistId: selectInfo.id,    //to be replaced by fetching dentistry info
                    issuance: Math.floor((Math.random() * 100) + 1).toString(),
                    date: selectInfo.slot.startStr
                };
                publish('authentication/appointment/request', JSON.stringify(desiredEvent));
                setTimeout(() => onSlotSelect.refetchEvents(), 500);
            } else {
                console.log('Nothing selected.')
            }
            setTimeout(() => onSlotSelect.refetchEvents(), 500);
        }
    }

    const fetchSlots = async (id: string) : Promise<any[]> => {
            let list : IFetchedSlot[] = [];
            await getAppointments(id)
            .then((val) => {
                list = val.map((value) => {
                    const startDate = new Date(value.date.toString());
                    const endDate = new Date(startDate.getTime() + 30*60000);
                    return {
                        title: value.userId === rawUserId() ? 'Your Appointment' : 'Appointment',
                        start: startDate.toISOString(),
                        end: endDate.toISOString(),
                        display: 'background',
                        color: value.userId === rawUserId() ? 'rgba(0,0,220,0.5)' : 'grey',
                    }
                });
                console.log(list);
            }).catch((e) => {
                console.log(e);
            })
            //console.log(list);
            return list;
    }

    const currentDentistry = (id: string) => {
        setId(id);
    }
    
    return (
            <div className='card'>
                <div className='title'>
                    Our Dentistries
                </div>
                    <Map currentView={currentDentistry}/>
                    <div className='dentistry_container'>
                        <Modal show={modalOpen} onHide={() => setModalOpen(false)}>
                            <form onSubmit={(e) => {
                                        e.preventDefault()
                                        console.log(bookingConfirmed)
                                        setBookingConfirmed(true)
                                        createAppointment(appointmentInfo)
                                        setEventTitle('')
                                        setTimeout(() => {
                                            setModalOpen(false);
                                        }, 300);
                                    }}>
                            <Modal.Header closeButton>
                                <Modal.Title>
                                    Book Appointment
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                {/*Please mention the times. 
                                (Need to add input boxes, one is disabled, that is 30mins + start).*/}
                                Start Time: <strong>{appointmentInfo.slot?.startStr.substring(0, 16).replace('T', ' ')}</strong>
                                <br></br>
                                End Time: <strong>{appointmentInfo.slot?.endStr.substring(0, 16).replace('T', ' ')}</strong>
                                <br></br><br/>
                                <Form.Check
                                    required 
                                    type={'checkbox'}
                                    id={`default-check`}
                                    label={'I agree to book the above date and time selected.'}
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                <div id="button" style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center'
                                }}>
                                    <Button type='submit' variant='success' size='sm' style={{textAlign: 'center', height: 'auto', marginTop: '0px'}}>Confirm Appointment</Button>
                                </div>
                            </Modal.Footer>
                            </form>
                        </Modal>
                        {
                            dentistries.map((dentistry: any, index: number) => (
                                <Accordion id='accordion' key={dentistry.id} hidden={id !== dentistry.id} TransitionProps={{ 
                                    unmountOnExit: true, 
                                }} onChange={() => {
                                    setId(dentistry.id);
                                }}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1a-content"
                                        id="panel1a-header">
                                    <p className='name'> Name: {dentistry.name}</p>
                                    <p className='address'> Address: {dentistry.address}</p>
                                    <p className='dentists'> Dentists: {dentistry.dentists} <br/></p>
                                    <p>
                                    <table>
                                        <tr>
                                        <th style={{paddingLeft: '150px', paddingRight: '25px'}}>Opening hours: &nbsp;&nbsp;</th>
                                        {
                                        Object.keys(dentistry.openinghours).map((day, index) => (
                                            <>{day?.charAt(0).toUpperCase()}{day?.slice(1)}: {Object.values(dentistry.openinghours).at(index)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</>
                                        ))
                                        }
                                        </tr>
                                    </table> 
                                    </p>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                    <Typography>
                                            
                                    <FullCalendar
                                        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                        rerenderDelay={900}
                                        headerToolbar={{
                                            left: 'prev,next today',
                                            center: 'title',
                                            right: 'timeGridWeek,timeGridDay'
                                        }}
                                        dateClick={() => createAppointment}
                                        initialEvents={[]}
                                        loading={(isLoading) => {
                                            if (isLoading) {
                                                console.log('Loading .........')
                                            } else {
                                                console.log('Done!');
                                            }
                                        }}
                                        initialView='timeGridWeek'
                                        selectable={true}
                                        selectMirror={false}
                                        editable={true}
                                        eventClick={async (eventInfo) => {
                                            eventInfo.view.calendar.unselect();
                                            //more info about event maybe...
                                        }}
                                        dayMaxEvents={true}
                                        select={(info) => {
                                            setAppointmentInfo({...appointmentInfo, slot: info, id: dentistry.id})
                                            setModalOpen(true)
                                            info.view.calendar.refetchEvents();
                                        }}
                                        selectConstraint={'businessHours'}
                                        eventOverlap={false}
                                        allDaySlot={false}
                                        slotMinTime={'06:00:00'}
                                        weekends={false}
                                        defaultTimedEventDuration={'00:30'}
                                        selectAllow={(info) => {
                                            if ((info.start > new Date()) && (info.end.getTime() - info.start.getTime() <= (30 * 60 * 1000))) {
                                                return true
                                            } else {
                                                return false
                                            }
                                        }}
                                        forceEventDuration={true}
                                        lazyFetching={false}
                                        events={async () => await fetchSlots(id)}
                                        selectOverlap={(event) => {
                                            return event.display === 'inverse-background';
                                        }}
                                        businessHours={
                                            Object.keys(dentistry.openinghours).map((day, index) => (
                                            {
                                                daysOfWeek: [index+1],
                                                startTime: (dentistry.openinghours[day].split('-'))[0],
                                                endTime: (dentistry.openinghours[day].split('-'))[1],
                                                display: 'inverse-background'
                                            }
                                        ))}
                                    /> 
                                    </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            ))} 
                    </div>
            </div>
    )

}



export default Dentistries;