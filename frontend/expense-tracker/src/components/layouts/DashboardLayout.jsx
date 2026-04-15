import React, { useContext } from 'react';
import {UserContext} from '../../context/UserContext';
import Navbar from './NavBar';
import SideMenu from './SideMenu';

const DashboardLayout = ({children, activeMenu}) => {

    const {user} = useContext(UserContext)
    console.log ("user",user);

  return (
    <div className=''>
    <Navbar activeMenu = {activeMenu}/>

    {user && (
        <div className='flex'>
            <div className='max-[1080px]:hidden'>
                <SideMenu activeMenu = {activeMenu} />
            </div>

            <div className='grow mx-5'>
              {console.log("children",children)}
              {children}</div>
        </div>
    )}
    </div>
  )
}

export default DashboardLayout;