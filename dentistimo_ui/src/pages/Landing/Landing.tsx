import '../index.css';
import Dentistries from '../Dentistries/Dentistries';
import './Landing.css';
import { useEffect } from 'react';

interface LandingProps {
  pageName: string;
}

const Landing = (props:LandingProps) => {
  useEffect(() => {document.title = `${props.pageName} ⋅ Dentistimo`});

  return (
    <>
    <main className='landing-page'>
      <div id="dentistries">
          <Dentistries />
      </div>
    </main>
    <div className='content' id="footer">
          (C) Dentistimo AB Etd. 2022
    </div>
    </>
  )
}

export default Landing;