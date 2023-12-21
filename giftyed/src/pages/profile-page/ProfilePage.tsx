import React from 'react'
import './ProfilePage.scss'
import Navbar from '../../components/navbar/Navbar'
import ProfileInfo from '../../components/profileInfo/ProfileInfo'
import ProfileMenu from '../../components/profileMenu/ProfileMenu'

const ProfilePage: React.FC = () => {
    return (
        <div className='ProfilePage'>
                <Navbar />
            <div className='ProfilePage__content'>
                <div className='ProfilePage__content-info'>
                    <ProfileInfo />
                </div>
                <div className='ProfilePage__content-menu'>
                    <ProfileMenu />
                </div>
            </div>
        </div>
    )
}

export default ProfilePage;