import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Nav = styled.nav`
    background: #5FC1AA;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    width: 101%;
    z-index: 10;
    font-size: 1.2rem;
`

export const NavbarContainer = styled.div`
    display: flex;
    align-items: center;
    height: 80px;
    margin-right: 3rem;
    width: 100%;
    max-width: 1100px;
    justify-content: center;
    
    @media screen and (max-width: 690px) {
        justify-content: space-between;
    }
`

export const PagesContainer = styled.div`
    display: flex;
    flex-direction: row;
    width: 400px;
    align-items: center;
    justify-content: space-between;
    margin-right: 3rem;
    color: white;
    text-decoration: none;
`

export const LinkContainer = styled(Link)`
    margin-right: 3rem;
    color: white;
    text-decoration: none;
`

export const LogoContainer = styled(Link)`
    display: flex;
    align-items: center;
    text-decoration: none;
`