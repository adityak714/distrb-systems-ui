import Paho from 'paho-mqtt';
import { decrypt, encrypt } from '../utils/encryptionUtils';
import { User } from '../pages/Authentication/UserType';
import { toast } from 'react-toastify';
// Create a client instance
const client = new Paho.Client('cb9fe4f292fe4099ae5eeb9f230c8346.s2.eu.hivemq.cloud', Number(8884), `${Math.ceil(Math.random()*10000000)}`);

var appointments : any[];
var deleteRes : any;
var editRes : any;

var login_response: string = '';
var signup_response: string = '';
var signout_response: string = '';
var error_response: string = '';

interface ApptToBeDeleted {
    userId: string;
    dentistId: string;
    date: string;   
}

interface ModifiedAppt {
    userId: string,
    dentistId: string,
    requestId: string,
    issuance: string,
    date: string,
    editDate: string
}

// called when the client connects
export function onConnect() {
    // Once a connection has been made, make a subscription and send a message.
    console.log(`Connected successfully.`);
    client.subscribe("appointment/request");
    client.subscribe("appointment/response");
}

export function rawUserId() : string {
    return decrypt(String(localStorage.getItem('ID'))).toString();
}

export function sub(topic: string, qos: any) {
    client.subscribe(topic, {qos: qos});
}

export function publish(topic: any, message: any) {
    const payload = new Paho.Message(message);
    payload.destinationName = topic;
    client.send(topic, message, 1);
}

export function getAppointments(id: string) : Promise<any[]> {
    return new Promise((resolve, reject) => {
        client.subscribe("get/appointments/response", {qos: 1});
        publish('get/appointments/request', `{"dentistId": "${id}"}`);
        setTimeout(() => {
            console.log(appointments);
            resolve(appointments);
        }, 400);
    })
}

export function getUserAppointments(userId: string) : Promise<any[]> {
    return new Promise((resolve, reject) => {
        client.subscribe("user/appointments/response", {qos: 1});
        publish('user/appointments/request', `{"userId": "${userId}"}`);
        setTimeout(() => {
            console.log(appointments);
            resolve(appointments);
        }, 400);
    })
}

export function deleteAppointment(slot: ApptToBeDeleted) : Promise<any> {
    return new Promise((resolve, reject) => {
        client.subscribe('delete/appointment/response');
        publish('delete/appointment/request', JSON.stringify(slot));
        setTimeout(() => {
            if (deleteRes.response === 'yes') {
                resolve(deleteRes);
            } else {
                reject('The deletion was unsuccessful.');
            }
        }, 300);
    })
}

export function editAppointment(slot: ModifiedAppt) : Promise<any> {
    return new Promise((resolve, reject) => {
        client.subscribe('edit/response');
        publish('edit/request', JSON.stringify(slot));
        setTimeout(() => {
            if (editRes.date !== 'none') {
                resolve(editRes.status);
            } else {
                reject('The edit was unsuccessful.');
            }
        }, 300);
    })
}

// called when the client loses its connection
export function onConnectionLost(responseObject: any) {
    if (responseObject.errorCode !== 0) {
        console.log("Connection Lost: " + responseObject.errorMessage);
    }
}

// called when a message arrives
export function onMessageArrived(message: any) {

    const message_topic = message.destinationName;

    switch (message_topic) {
        case 'appointment/response':
            console.log("appointment/response " + message.payloadString);
            break;
        case 'appointment/request':
            console.log("appointment/request " + message.payloadString);
            break;
        case 'get/appointments/response':
            appointments = JSON.parse(message.payloadString);
            break;
        case 'delete/appointment/response':
            deleteRes = JSON.parse(message.payloadString);
            break;
        case 'user/appointments/response':
            appointments = JSON.parse(message.payloadString);
            break;
        case 'edit/response':
            editRes = JSON.parse(message.payloadString);
            break;
        case 'authentication/signIn/response':
            login_response = message.payloadString;
            break;
        case 'authentication/signOut/response':
            signout_response = message.payloadString;
            break;
        case 'error/response':
            error_response = message.payloadString;
            break;
        case 'authentication/signUp/response':
            signup_response = message.payloadString;
            break;
        default:
            return;
    }   
}

// method for getting jwt and id of a user
export const getJWT = async () => {
    return new Promise(() => {
        client.subscribe('authentication/signIn/response', { qos: 1 });
        try {
            setTimeout(() => {
                try {

                    const object = JSON.parse(login_response)
                if (object.isSuccess === true) {
                    if (object.data.jwtToken === 'null') {
                        alert('could not log in');
                        window.location.reload();
                    } else {
                        toast.success("Log in successful!");
                        const encryptId = encrypt(object.data._id); // encrypting id in order to mae it harder to steal credentials
                        window.localStorage.setItem('ID', encryptId);
                        window.localStorage.setItem('TOKEN', object.data.jwtToken);
                        client.unsubscribe('authentication/signIn/response')
                        window.location.replace("/");
                    }
                     
                } else if (object.isSuccess === false) {
                    const error_message = String(object.errors[0].detail); 
                    toast.error(error_message);
                } 
                } catch (error) {
                    toast.error("There are difficulties on our side, please try again later!")
                }
                
            }, 500)

        } catch (error) {
            toast.error('something went wrong, please try again later!');
        }
      
    })
}

// the signOut method signs user out by decrypting their id from localstorage,
// then encrypting that id in an object form and publishing to sign out request topic
// and then on successful response clears the localstorage completely and sign user out
// or displays an error in toast error message.
export const signOut = async () => {
    try {
        return new Promise(() => {
                const user_id = String(localStorage.getItem('ID'));
                client.subscribe('authentication/signOut/response', { qos: 1 });
                const decryptedId = decrypt(user_id);
                const userId = { id: decryptedId }
                const encrypted = encrypt(userId);
                publish('authentication/signOut/request', encrypted.toString());
                try {
                    setTimeout(() => {
                        const object = JSON.parse(signout_response);
                        if (object.isSuccess === true) {
                            toast.success("You have been logged out!");
                            client.unsubscribe('authentication/signOut/response');
                            localStorage.clear();
                            window.location.reload();
                        } else if (object.isSuccess === false) {
                            const error_message = String(object.errors[0].detail);
                            toast.error(error_message);
                        }
                    }, 400)
                } catch (error) {
                    toast.error("Something went wrong, please try again later!");
                }
            })
    } catch (error) {
        toast.error("Something went wrong, please try again later!");
    }
}

// the method createUser takes in credentials that are entered in sign up form
// encryptes them, and sends to sign up request topic
// then waits 0.5 seconds and either returns an error message from the backend, or returns success and
// a successful toast message.
export const createUser = async (user: User) => {
    try {
        return await new Promise(() => {
            client.subscribe('authentication/signUp/response', { qos: 1 });
            const encrypted_user = encrypt(user);
            publish('authentication/signUp/request', encrypted_user.toString());
            
            setTimeout(() => {
                try {
                    const object = JSON.parse(signup_response);
                    const onSuccess = object.isSuccess;
                    
                    if (onSuccess === false) {
                        const error_message = String(object.errors[0].detail);
                        toast.error(error_message);
                    } else if(onSuccess === true) {
                        toast.success('User created sucessfully');
                        window.location.assign('/');
                        client.unsubscribe('authentication/signUp/response');
                    } 
                } catch (error) {
                    toast.error("There are difficulties on our side, please try again later!");
                }

            }, 500)
        })

    } catch (error) {
        toast.error("Something went wrong, please try again!");
    }
}

// The login method encrypts the user credentials that are entered in the login form,
// publishes that encrypted hash to sign in request, clears localstorage and receives the jwt token from
// the backend.
export const logIn = async (user: User) => {
    try {
      const encrypted_user = encrypt(user);
      publish('authentication/signIn/request', encrypted_user.toString());
      localStorage.clear();
      getJWT();

    } catch (error) {
        toast.error("Something went wrong, please try again!");
    }
  }

  

/**
 * Reference from PAHO DOCS -->
 * client.subscribe("World");
    message = new Paho.MQTT.Message("Hello");
    message.destinationName = "World";
    client.send(message);
*/

// connect the client
export function connectMQTT() {
    client.onConnectionLost = onConnectionLost;
    client.onMessageArrived = onMessageArrived;
    client.connect({
        useSSL: true,
        onSuccess: onConnect,
        userName: 'T2Project',
        password: 'Mamamia1234.' 
    });
}