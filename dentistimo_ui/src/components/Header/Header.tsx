import {useState} from 'react'
import { Nav, NavbarContainer, LogoContainer, PagesContainer, LinkContainer } from './HeaderElements';
import { Logo } from './logo/LogoStyle';
import {Link} from 'react-scroll';
import MenuIcon from '@mui/icons-material/Menu';
import {Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, useMediaQuery} from '@mui/material';
import '../styles.css';
import SignOutButton from '../SignOutButton/SignOutButton';
import { ToastContainer } from 'react-toastify';

export interface IHeaderProps {}

const Header: React.FunctionComponent<IHeaderProps> = (props: IHeaderProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const reduced = useMediaQuery('(max-width: 690px)');
  const token = localStorage.getItem('TOKEN');

  return (
    <Nav>
      {token == null || token == undefined ?
          <LogoContainer to='/'>
            <img style={{width: 100}} src={require("./logo/image.png")} />
          </LogoContainer>
        :
        <>
          {!reduced ? 
            <>
              <LogoContainer to='/'>
              <Logo src={require("./logo/image.png")} />
            </LogoContainer>
            <PagesContainer>
            <Link to='appointments' smooth={true} offset={-110} duration={900}>
              <LinkContainer to={`/`}>
              <a>Appointments</a>
              </LinkContainer>
            </Link>
            <Link to='appointments2' smooth={true} offset={-110} duration={900}>
              <LinkContainer to={'/myslots'}>
                MyBookings
              </LinkContainer>
            </Link>
            <LinkContainer to={`/`}><ToastContainer position='bottom-center' draggable theme='colored' hideProgressBar/><SignOutButton /></LinkContainer>
            </PagesContainer>
            </>
           : 
            <NavbarContainer>
              <div id='hamburger'>
                <IconButton sx={{color: 'white'}} hidden={true} onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
                    <MenuIcon/>
                </IconButton>
              </div>
              <Drawer open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} anchor={'top'} sx={{
                backgroundColor: 'rgba(0, 100, 100, 0.5)'
              }}>
                <List>
                  <ListItemIcon>
                    <ListItemText>
                    </ListItemText>
                  </ListItemIcon>
                  <Link to='appointments' smooth={true} offset={-110} duration={900}>
                  <ListItemButton>
                    <ListItemIcon>
                      <ListItemText>
                          Appointments
                      </ListItemText>
                    </ListItemIcon>
                    </ListItemButton>
                  </Link>
                  <Link to='appointments2' smooth={true} offset={-110} duration={900}>
                  <ListItemButton>
                    <ListItemIcon>
                      <ListItemText>
                          MyBookings
                      </ListItemText>
                    </ListItemIcon>
                  </ListItemButton>
                  </Link>
                </List>
              </Drawer>
            </NavbarContainer>}
        </>
        }
        
      </Nav>    
  )
}

export default Header;
