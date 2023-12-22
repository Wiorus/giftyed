import React, { useContext, useEffect, useState } from 'react';
import './ProfileInfo.scss';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import photo from '../../utils/user.png';
import { UsersContext, UsersContextType } from '../../contexts/user.context';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from "firebase/firestore";
import { updateUserDoc } from '../../utils/firebase/firebase.utils';

const ProfileInfo: React.FC = () => {
  const { currentUserContext, setCurrentUserContext } = useContext(UsersContext) as UsersContextType;
  const [editProfile, setEditProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(currentUserContext?.displayName || '');
  const [editAge, setEditAge] = useState(currentUserContext?.age || 0);
  const [editBirthday, setEditBirthday] = useState(currentUserContext?.birthday ? new Date(currentUserContext.birthday.seconds * 1000) : null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const navigate = useNavigate();

  const handleClick = () => {
    console.info('You clicked the Chip.');
  };

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    if (!currentUserContext) {
      navigate('/');
    }
  }, [currentUserContext, navigate, isInitialRender]);

  const { age, birthday, interests } = currentUserContext || {};
  const formattedBirthday = birthday ? new Date(birthday.seconds * 1000).toLocaleDateString() : 'Not set yet';

  const handleEditProfile = () => {
    setEditProfile(true);
  };

  const handleSaveEdit = async () => {
    if (currentUserContext) {
      try {
        await updateUserDoc(currentUserContext._id, {
          displayName: editDisplayName,
          age: editAge,
          birthday: editBirthday ? new Timestamp(editBirthday.getTime() / 1000, 0) : null,
        });
        const updatedUser = {
          ...currentUserContext,
          displayName: editDisplayName,
          age: editAge,
          birthday: editBirthday ? new Timestamp(editBirthday.getTime() / 1000, 0) : null,
        };
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setCurrentUserContext(updatedUser);
        setEditProfile(false);
      } catch (error) {
        console.error("Error updating user data:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditDisplayName(currentUserContext?.displayName ?? '');
    setEditAge(currentUserContext?.age || 0);
    setEditBirthday(
      currentUserContext?.birthday ? new Date(currentUserContext.birthday.seconds * 1000) : null
    );
    setEditProfile(false);
  }

  return (
    <div className='profile-info'>
      <div className='profile-info__avatar'>
        <div className='profile-info__avatar-square'></div>
        <div className='profile-info__avatar-photo'>
          <img src={photo} alt='user' />
        </div>
      </div>
      <div className='profile-info__content'>
        <div className='profile-info__content-info'>
          <div className='profile-info__content-info-name'>
            {currentUserContext ? (
              editProfile ? (
                <input type='text' value={editDisplayName} onChange={(e) => setEditDisplayName(e.target.value)} />
              ) : (
                <p>{currentUserContext.displayName}</p>
              )
            ) : null}
          </div>
          <div className='profile-info__content-info-name-others'>
            {editProfile ?
              (
                <>
                  <input type='number' value={editAge} onChange={(event) => setEditAge(parseInt(event.target.value))} />
                  <input type='date' value={editBirthday?.toISOString().split('T')[0]}
                    onChange={(e) => setEditBirthday(new Date(e.target.value))} />
                </>
              ) : (
                <>
                  <p> Age: {age?.toString()}</p>
                  <p> Birthday: {formattedBirthday}</p>
                </>
              )
            }
          </div>
          {
            editProfile ? (
              <div>
                <button onClick={handleSaveEdit}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <button onClick={handleEditProfile}>Edit</button>
            )
          }
        </div>
        <div className='profile-info__content-interests'>
          <p>Interests</p>
          <div className='profile-info__content-interests-container'>
            <Stack direction='row' spacing={1}>
              {interests?.map((interest, index) => (
                <Chip key={index} label={interest} onClick={handleClick} />
              ))}
              <Chip onClick={handleClick} label="+" />
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
