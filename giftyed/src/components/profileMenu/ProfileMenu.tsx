import React, { useContext, useEffect, useState } from 'react';
import './ProfileMenu.scss';
import FollowedUser from '../followedUser/FollowedUser';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import WishItem from '../wishItem/WishItem';
import { UsersContext, UsersContextType } from '../../contexts/user.context';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../utils/firebase/firebase.utils';
import { UserApp } from '../../utils/types/user';
import Dialog from '@mui/material/Dialog/Dialog';
import DialogContent from '@mui/material/DialogContent/DialogContent';
import DialogActions from '@mui/material/DialogActions/DialogActions';
import Button from '@mui/material/Button/Button';
import { GiftApp } from '../../utils/types/gift';

const ProfileMenu: React.FC = () => {
  const { currentUserContext, setCurrentUserContext } = useContext(UsersContext) as UsersContextType;
  const [wishGifts, setWishGifts] = useState<GiftApp[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [observedUsers, setObservedUsers] = useState<UserApp[]>([]);
  const [selectedGift, setSelectedGift] = useState<string>('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedNote, setSelectedNote] = useState<string>('');
  const [notesForSelectedDate, setNotesForSelectedDate] = useState<string[]>([]);


  useEffect(() => {
    const fetchObservedUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => ({ _id: doc.id, ...doc.data() } as UserApp));

        const observedUsersData = usersData.filter((user) =>
          currentUserContext?.followed?.includes(user._id)
        );

        const sortedUsers = observedUsersData
          .filter((user) => user._id !== currentUserContext?._id)
          .sort((a, b) => {
            if (a.birthday && b.birthday) {
              return a.birthday.seconds - b.birthday.seconds;
            }
            return 0;
          });

        setObservedUsers(sortedUsers);
      } catch (error) {
        console.error('Error fetching observed users:', error);
      }
    };

    fetchObservedUsers();
  }, [currentUserContext?.followed, currentUserContext?._id]);

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
  }, [currentUserContext, selectedDate]);

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

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    setOpenModal(!!date);
    const selectedDateString = date?.toISOString() || '';
    const matchingNote = currentUserContext?.calendarNote?.find((note) => note.includes(selectedDateString));
    setSelectedNote(matchingNote || '');
    const notesForDate = currentUserContext?.calendarNote?.filter((note) => note.includes(selectedDateString)) || [];
    setNotesForSelectedDate(notesForDate);
  };

  useEffect(() => {
    const updateCalendarColors = () => {
      const calendarDays = document.querySelectorAll('.MuiPickersDay-dayWithMargin');
      calendarDays.forEach((day) => {
        const timestamp = parseInt(day.getAttribute('data-timestamp') || '0', 10);
        const date = new Date(timestamp);
        const formattedDate = date.toISOString().split('T')[0];
        if (currentUserContext?.calendarNote?.some((note) => note.includes(formattedDate))) {
          day.classList.add('dayMarker');
        } else {
          day.classList.remove('dayMarker');
        }
      });
    };
    updateCalendarColors();
    const observer = new MutationObserver(updateCalendarColors);
    observer.observe(document.body, { subtree: true, childList: true });

    return () => {
      observer.disconnect();
    };
  }, [currentUserContext?.calendarNote]);

  const handleSaveNotes = async () => {
    try {
      if (currentUserContext && currentUserContext._id && selectedDate && selectedGift && selectedUser) {
        const userId = currentUserContext._id;

        const updatedUser: UserApp = {
          ...currentUserContext,
          calendarNote: [
            ...(currentUserContext?.calendarNote || []),
            `Date: ${selectedDate.toISOString()}, Gift: ${selectedGift}, User: ${selectedUser}`
          ],
        };

        setCurrentUserContext(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));

        const userRef = doc(collection(db, 'users'), userId);
        await updateDoc(userRef, { calendarNote: updatedUser.calendarNote });

        setOpenModal(false);
      }
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const handleRemoveNote = async (noteToRemove: string) => {
    try {
      if (currentUserContext && currentUserContext._id) {
        const userId = currentUserContext._id;

        const updatedUser: UserApp = {
          ...currentUserContext,
          calendarNote: (currentUserContext?.calendarNote || []).filter((note) => note !== noteToRemove),
        };

        setCurrentUserContext(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));

        const userRef = doc(collection(db, 'users'), userId);
        await updateDoc(userRef, { calendarNote: updatedUser.calendarNote });
        setOpenModal(false);
      }
    } catch (error) {
      console.error('Error removing note:', error);
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
          <DateCalendar
            value={selectedDate}
            onChange={handleDateChange}
          />
          {selectedDate && (
            <Dialog className='profile-menu__calendar-popup' open={openModal} onClose={() => setOpenModal(false)}>
              <DialogContent className='profile-menu__calendar-popup-content'>

                <div className='profile-menu__calendar-popup-content-user'>
                  <select className='profile-menu__calendar-popup-content-user-element'
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option value="" >Select User</option>
                    {observedUsers.map((user) => (
                      <option className='profile-menu__calendar-popup-content-user-element-dropdown' key={user._id} value={user._id}>
                        {user.displayName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className='profile-menu__calendar-popup-content-gift'>
                  <select className='profile-menu__calendar-popup-content-gift-element'
                    value={selectedGift}
                    onChange={(e) => setSelectedGift(e.target.value)}
                  >
                    <option value="">Select Gift</option>
                    {wishGifts.map((gift) => (
                      <option key={gift.id} value={gift.id}>
                        {gift.name}
                      </option>
                    ))}
                  </select>
                </div>
                {notesForSelectedDate.length > 0 && (
                  <div className='profile-menu__calendar-popup-content-notes'>
                    <p className='profile-menu__calendar-popup-content-notes-header'>NOTES:</p>
                    <p>
                      {notesForSelectedDate.map((note, index) => {
                        const [, giftId, userId] = /Gift: (.+), User: (.+)/.exec(note) || [];
                        const selectedGift = wishGifts.find((gift) => gift.id === giftId);
                        const selectedUser = observedUsers.find((user) => user._id === userId);

                        return (
                          <li className='profile-menu__calendar-popup-content-notes-element' key={index}>
                            {<span>{selectedUser?.displayName || 'Unknown User'} <span>: {selectedGift?.name || 'Unknown Gift'}</span></span>}
                            <Button className='profile-menu__calendar-popup-content-notes-element-remove' onClick={() => handleRemoveNote(note)} >Remove</Button>
                          </li>
                        );
                      })}
                    </p>
                  </div>
                )}
              </DialogContent>
              <DialogActions className='profile-menu__calendar-popup-action'>
                <Button className='profile-menu__calendar-popup-action-cancel' onClick={() => setOpenModal(false)}>Cancel</Button>
                <Button className='profile-menu__calendar-popup-action-save' onClick={handleSaveNotes}>Save</Button>
              </DialogActions>
            </Dialog>
          )}
        </LocalizationProvider>
      </div>
      <div className='profile-menu__wishList'>
        <p className='profile-menu__wishList-header'>Wish List</p>
        <div className='profile-menu__wishList-items'>
          <WishItem gifts={wishGifts} onRemoveGift={removeGiftFromWishes} />
        </div>
      </div>
    </div>
  );
};

export default ProfileMenu;
