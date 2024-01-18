import React, { useContext, useEffect, useState } from 'react';
import './MyProfileInfo.scss';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import photo from '../../utils/user.png';
import { UsersContext, UsersContextType } from '../../contexts/user.context';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from "firebase/firestore";
import { getAllGifts, removeGiftFromDesiredGifts, storagePhoto, updateUserDoc } from '../../utils/firebase/firebase.utils';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Button from '@mui/material/Button';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../utils/firebase/firebase.utils';
import { GiftApp } from '../../utils/types/gift';
import { UserApp } from '../../utils/types/user';

const MyProfileInfo: React.FC = () => {
  const { currentUserContext, setCurrentUserContext } = useContext(UsersContext) as UsersContextType;
  const [editProfile, setEditProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(currentUserContext?.displayName || '');
  const [editBirthday, setEditBirthday] = useState(currentUserContext?.birthday ? new Date(currentUserContext.birthday.seconds * 1000) : null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [realTimeURL, setRealTimeURL] = useState<string | null>(currentUserContext && currentUserContext.photoURL ? currentUserContext.photoURL : null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentUserContext?.interests || []);
  const [gifts, setGifts] = useState<GiftApp[]>([]);
  const navigate = useNavigate();
  const { age, birthday } = currentUserContext || {};

  const formattedBirthday = birthday ? new Date(birthday.seconds * 1000).toLocaleDateString() : 'Not set yet';

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

  useEffect(() => {
    if (isInitialRender) {
      setIsInitialRender(false);
      return;
    }
    if (!currentUserContext) {
      navigate('/');
    } else {
      setRealTimeURL(currentUserContext.photoURL || null);
    }
  }, [currentUserContext, navigate, isInitialRender]);


  const handleEditProfile = () => {
    setEditProfile(true);
    fetchAvailableTags();
  };

  const fetchAvailableTags = async () => {
    try {
      const giftsCollection = collection(db, 'gifts');
      const giftsSnapshot = await getDocs(giftsCollection);
      const tagsSet = new Set<string>();

      giftsSnapshot.forEach((doc) => {
        const gift = doc.data();
        const { tags } = gift;
        if (tags && Array.isArray(tags)) {
          tags.forEach((tag) => tagsSet.add(tag));
        }
      });

      const uniqueTags = Array.from(tagsSet);
      setAvailableTags(uniqueTags);
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  const handleAddTag = (tag: string) => {
    setSelectedInterests((prevInterests) => [...prevInterests, tag]);
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedInterests((prevInterests) => prevInterests.filter((interest) => interest !== tag));
  };

  const calculateAge = (birthdate: Date | null): number => {
    if (!birthdate) return 0;

    const today = new Date();
    const birthdateDate = new Date(birthdate);
    let age = today.getFullYear() - birthdateDate.getFullYear();

    if (
      today.getMonth() < birthdateDate.getMonth() ||
      (today.getMonth() === birthdateDate.getMonth() && today.getDate() < birthdateDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleSaveEdit = async () => {
    if (currentUserContext) {
      try {
        if (selectedPhoto) {
          const fileRef = ref(storagePhoto, `usersPhotos/${selectedPhoto.name}`);
          await uploadBytes(fileRef, selectedPhoto);
          const photoURL = await getDownloadURL(fileRef);
          const updatedData = {
            displayName: editDisplayName,
            age: calculateAge(editBirthday),
            birthday: editBirthday ? new Timestamp(editBirthday.getTime() / 1000, 0) : null,
            photoURL: photoURL,
            interests: selectedInterests,
          };
          await updateUserDoc(currentUserContext._id, updatedData);
          const updatedUser = { ...currentUserContext, ...updatedData };
          localStorage.setItem('userData', JSON.stringify(updatedUser));
          setCurrentUserContext(updatedUser);
          setRealTimeURL(photoURL);
        } else {
          const updatedData = {
            displayName: editDisplayName,
            age: calculateAge(editBirthday),
            birthday: editBirthday ? new Timestamp(editBirthday.getTime() / 1000, 0) : null,
            interests: selectedInterests,
          };
          await updateUserDoc(currentUserContext._id, updatedData);
          const updatedUser = { ...currentUserContext, ...updatedData };
          localStorage.setItem('userData', JSON.stringify(updatedUser));
          setCurrentUserContext(updatedUser);
        }
        setEditProfile(false);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditDisplayName(currentUserContext?.displayName ?? '');
    setEditBirthday(currentUserContext?.birthday ? new Date(currentUserContext.birthday.seconds * 1000) : null);
    setEditProfile(false);
  };

  const validateFile = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const maxWidth = 500;
          const maxHeight = 500;
          if (img.width > maxWidth || img.height > maxHeight) {
            alert("Image dimensions exceed the maximum allowed size");
          } else {
            setSelectedPhoto(file);
          }
        };
        img.onerror = () => {
          alert("Error loading the image");
        };
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveDesiredGift = async (giftId: string) => {
    try {
      await removeGiftFromDesiredGifts(currentUserContext?._id || '', giftId);
      const updatedDesiredGifts = (currentUserContext?.desiredGifts || []).filter(id => id !== giftId);
      const updatedUser: UserApp = { ...currentUserContext!, desiredGifts: updatedDesiredGifts };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      setCurrentUserContext(updatedUser);
    } catch (error) {
      console.error('Error removing desired gift:', error);
    }
  };

  return (
    <div className='my-profile-info'>

      <div className='my-profile-info__content'>
        <div className='my-profile-info__content-avatar'>
          <div className='my-profile-info__content-avatar-square'></div>
          <div className='my-profile-info__content-avatar-photo'>
            <img src={realTimeURL || photo} alt="User" />
          </div>
        </div>
        <div className='my-profile-info__content-info'>
          <div className='my-profile-info__content-info-name'>
            {currentUserContext ? (
              editProfile ? (
                <input type='text' value={editDisplayName} onChange={(e) => setEditDisplayName(e.target.value)} />
              ) : (
                <p>{currentUserContext.displayName} </p>
              )
            ) : null}
          </div>
          <div className='my-profile-info__content-info-name-others'>
            {editProfile ? (
              <>
                <input className='my-profile-info__content-info-name-others-date'
                  type='date'
                  value={editBirthday?.toISOString().split('T')[0]}
                  onChange={(e) => setEditBirthday(new Date(e.target.value))}
                />
                <Button className='my-profile-info__content-info-name-others-upload' component="label" variant="contained">
                  Upload file
                  <input
                    className='my-profile-info__content-info-name-others-upload-uploadHiden'
                    type="file"
                    accept="image/*"
                    onChange={(e) => validateFile(e.target.files?.[0] || null)}
                  />
                </Button>
              </>
            ) : (
              <>
                <p> Age: {age?.toString()}</p>
                <p> Birthday: {formattedBirthday}</p>
              </>
            )}
          </div>
          {editProfile ? (
            <div className='my-profile-info__content-info-edit'>
              <button onClick={handleSaveEdit}>Save</button>
              <button onClick={handleCancelEdit}>Cancel</button>
            </div>
          ) : (
            <button onClick={handleEditProfile}>Edit</button>
          )}
        </div>
        <div className='my-profile-info__content-interests'>
          <p>Interests</p>
          <div className='my-profile-info__content-interests-container'>
            {editProfile ? (
              <>
                <Stack direction='row' spacing={1}>
                  {selectedInterests.map((tag, index) => (
                    <Chip key={index} label={tag} onDelete={() => handleRemoveTag(tag)} />
                  ))}
                </Stack>
                <Stack direction='row' spacing={1}>
                  {availableTags
                    .filter((tag) => !selectedInterests.includes(tag))
                    .map((tag, index) => (
                      <Chip key={index} label={tag} onClick={() => handleAddTag(tag)} />
                    ))}
                </Stack>
              </>
            ) : (
              <Stack direction='row' spacing={1}>
                {(currentUserContext?.interests || []).map((interest, index) => (
                  <Chip key={index} label={interest} />
                ))}
              </Stack>
            )}
          </div>
        </div>
        <div className='my-profile-info__content-desiredGifts'>
          <div className='my-profile-info__content-desiredGifts-header'><p>Desired Gifts</p></div>
          <div className='my-profile-info__content-desiredGifts-box'>
            {currentUserContext?.desiredGifts?.map((giftId, index) => {
              const gift = gifts.find((g) => g.id === giftId);
              return (
                <div key={index} className='my-profile-info__content-desiredGifts-box-item' onClick={() => handleRemoveDesiredGift(giftId)}>
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

export default MyProfileInfo;
