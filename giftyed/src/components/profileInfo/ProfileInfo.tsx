import React, { useContext, useState, useEffect } from 'react';
import './ProfileInfo.scss';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import photo from '../../utils/user.png';
import { UserApp } from '../../utils/types/user';
import { UsersContext, UsersContextType } from '../../contexts/user.context';
import { db, removeDesiredGiftFromUser, updateUserDoc } from '../../utils/firebase/firebase.utils';
import { useNavigate } from 'react-router-dom';
import { GiftApp } from '../../utils/types/gift';
import { getAllGifts } from '../../utils/firebase/firebase.utils';
import { collection, doc, updateDoc } from 'firebase/firestore';

interface ProfileInfoProps {
  user: UserApp;
  onRemoveDesiredGift: (giftId: string) => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ user, onRemoveDesiredGift }) => {
  const { currentUserContext, setCurrentUserContext } = useContext(UsersContext) as UsersContextType;
  const formattedBirthday = user.birthday ? new Date(user.birthday.seconds * 1000).toLocaleDateString() : 'Not set yet';
  const [isFollowed, setIsFollowed] = useState(currentUserContext?.followed?.includes(user._id) || false);
  const [gifts, setGifts] = useState<GiftApp[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const allGifts = await getAllGifts();
        setGifts(allGifts);
      } catch (error) {
        console.error('Error fetching gifts:', error);
      }
    };

    fetchGifts();
  }, []);


  const handleInterestsButtonClick = () => {
    navigate(`/search?interests=${encodeURIComponent(JSON.stringify(user.interests || []))}`);
  };



  const handleFollowClick = async () => {
    if (currentUserContext) {
      try {
        const updatedFollowed = isFollowed
          ? currentUserContext.followed?.filter((id) => id !== user._id) || []
          : [...(currentUserContext.followed || []), user._id];
        await updateUserDoc(currentUserContext._id, { followed: updatedFollowed });
        const updatedUser = { ...currentUserContext, followed: updatedFollowed };
        setCurrentUserContext(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));
        setIsFollowed(!isFollowed);
      } catch (error) {
        console.error('Error updating user:', error);
      }
    }
  };

  const handleRemoveDesiredGift = async (giftId: string) => {
    try {
      if (currentUserContext && currentUserContext._id) {
        const userId = currentUserContext._id;
        const targetUserUid = user._id;
        const updatedUser: UserApp = {
          ...currentUserContext,
          desiredGifts: (currentUserContext?.desiredGifts || []).filter((id) => id !== giftId),
          wishes: [...(currentUserContext?.wishes || []), giftId],
        };

        setCurrentUserContext(updatedUser);
        localStorage.setItem('userData', JSON.stringify(updatedUser));

        const userRef = doc(collection(db, 'users'), userId);
        await updateDoc(userRef, { desiredGifts: updatedUser.desiredGifts, wishes: updatedUser.wishes });
        await removeDesiredGiftFromUser(userId, targetUserUid, giftId);
        onRemoveDesiredGift(giftId);
      }
    } catch (error) {
      console.error('Error removing desired gift:', error);
    }
  };

  return (
    <div className='profile-info'>
      <div className='profile-info__content'>
        <div className='my-profile-info__content-avatar'>
          <div className='my-profile-info__content-avatar-square'></div>
          <div className='my-profile-info__content-avatar-photo'>
            <img src={user.photoURL || photo} alt="User" />
          </div>
        </div>
        <div className='profile-info__content-info'>
          <div className='profile-info__content-info-name'>
            <p>{user.displayName}</p>
          </div>
          <div className='profile-info__content-info-name-others'>
            <p> Age:{user.age} </p>
            <p> Birthday: {formattedBirthday}</p>
          </div>
          <div className='profile-info__content-info-follow'>
            <button onClick={handleFollowClick}>
              {isFollowed ? 'Unfollow' : 'Follow'}
            </button>
          </div>
        </div>
        <div className='profile-info__content-interests'>
          <p>Interests</p>
          <div className='profile-info__content-interests-container'>
            <Stack direction='row' spacing={1}>
              {user.interests?.map((interest, index) => (
                <Chip key={index} label={interest} />
              ))}
            </Stack>
            <button onClick={handleInterestsButtonClick}>Match Gift</button>
          </div>
        </div>
        <div className='profile-info__content-desiredGifts'>
          <div className='profile-info__content-desiredGifts-header'>Desired Gifts</div>
          <div className='profile-info__content-desiredGifts-box'>
            {user.desiredGifts?.map((giftId, index) => {
              const gift = gifts.find((g) => g.id === giftId);
              return (
                <div
                  key={index}
                  className='profile-info__content-desiredGifts-box-item'
                  onClick={() => handleRemoveDesiredGift(giftId)}
                >
                  <img src={gift?.photoURL || 'placeholder-url'} alt={gift?.name || 'Unknown Gift'} />
                  <p>{gift?.name || 'Unknown Gift'}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
