import React from 'react';
import { signOut } from '../../Infrastructure/PMQTTController';
import './SignOutButton.css';
 const SignOutButton: React.FC = () => {
    return (
        <div>
            <button id='signout-button' onClick={() => { signOut(); }}>Sign Out</button>
        </div>
    )
}

export default SignOutButton;