import React, { useEffect, useState } from 'react'
import './ProfilePage.scss'
import Navbar from '../../components/navbar/Navbar'
import ProfileMenu from '../../components/profileMenu/ProfileMenu'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../utils/firebase/firebase.utils'
import { UserApp } from '../../utils/types/user'
import ProfileInfo from '../../components/profileInfo/ProfileInfo'

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserApp | undefined>(undefined);
  const { userId } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const uid = userId as string;
        const userDocRef = doc(db, 'users', uid);
        const userSnapshot = await getDoc(userDocRef);
        if (userSnapshot.exists()) {
          setUserData(userSnapshot.data() as UserApp);
        }
      } catch (error) {
        console.error('Error during get data', error);
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div className='ProfilePage'>
      <Navbar />
      <div className='ProfilePage__content'>
        <div className='ProfilePage__content-info'>
          {userData && <ProfileInfo user={userData} />}
        </div>
        <div className='ProfilePage__content-menu'>
          <ProfileMenu />
        </div>
      </div>
    </div>
  )
}

export default ProfilePage;