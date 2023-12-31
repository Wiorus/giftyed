import React, { useContext, useEffect, useState } from 'react'
import './ProfileMenu.scss'
import FollowedUser from '../followedUser/FollowedUser';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import WishItem from '../wishItem/WishItem';
import { UsersContext, UsersContextType } from '../../contexts/user.context';
import { GiftApp } from '../../utils/types/gift';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../utils/firebase/firebase.utils';
import { UserApp } from '../../utils/types/user';

const ProfileMenu: React.FC = () => {
  const { currentUserContext, setCurrentUserContext } = useContext(UsersContext) as UsersContextType;
  const [wishGifts, setWishGifts] = useState<GiftApp[]>([]);

  useEffect(() => {
    const fetchWishGifts = async () => {
      if (currentUserContext && currentUserContext.wishes && currentUserContext.wishes.length > 0) {
        const giftsCollection = collection(db, 'gifts');
        const wishesQuery = query(giftsCollection, where('id', 'in', currentUserContext.wishes));

        try {
          const wishesSnapshot = await getDocs(wishesQuery);
          const wishesData = wishesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GiftApp));
          setWishGifts(wishesData);
        } catch (error) {
          console.error('Error fetching wish gifts:', error);
        }
      } else {
        setWishGifts([]);
      }
    };

    fetchWishGifts();
  }, [currentUserContext]);

  const removeGiftFromWishes = async (giftId: string) => {
    try {
      if (currentUserContext && currentUserContext._id) {
        const userId = currentUserContext._id;

        const updatedUser: UserApp = {
          ...currentUserContext,
          wishes: (currentUserContext?.wishes || []).filter((id) => id !== giftId),
        };

        setCurrentUserContext(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        const userWishesRef = doc(collection(db, 'users'), userId);
        await updateDoc(userWishesRef, { wishes: updatedUser.wishes });
        setWishGifts((prevWishGifts) => prevWishGifts.filter((gift) => gift.id !== giftId));
      }
    } catch (error) {
      console.error('Error removing gift from wishes:', error);
    }
  };



  return (
    <div className='profile-menu'>
      <div className='profile-menu__upcomingBirthday'>
        <p className='profile-menu__upcomingBirthday-header'>Upcoming Birthday</p>
        <div className='profile-menu__upcomingBirthday-followedUsers'>
          <FollowedUser />
        </div>
      </div>
      <div className='profile-menu__calendar'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar />
        </LocalizationProvider>
      </div>
      <div className='profile-menu__wishList'>
        <p className='profile-menu__wishList-header'>Wish List</p>
        <div className='profile-menu__wishList-items'>
          <WishItem gifts={wishGifts} onRemoveGift={removeGiftFromWishes} />
        </div>
      </div>
    </div>
  )
}

export default ProfileMenu
