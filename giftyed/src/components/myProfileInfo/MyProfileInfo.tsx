import React, { useContext, useEffect, useState } from 'react';
import './MyProfileInfo.scss';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import photo from '../../utils/user.png';
import { UsersContext, UsersContextType } from '../../contexts/user.context';
import { useNavigate } from 'react-router-dom';
import { Timestamp } from "firebase/firestore";
import { storagePhoto, updateUserDoc } from '../../utils/firebase/firebase.utils';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Button from '@mui/material/Button';
import { getDocs, collection } from 'firebase/firestore';
import { db } from '../../utils/firebase/firebase.utils';

const MyProfileInfo: React.FC = () => {
  const { currentUserContext, setCurrentUserContext } = useContext(UsersContext) as UsersContextType;
  const [editProfile, setEditProfile] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(currentUserContext?.displayName || '');
  const [editAge, setEditAge] = useState(currentUserContext?.age || 0);
  const [editBirthday, setEditBirthday] = useState(currentUserContext?.birthday ? new Date(currentUserContext.birthday.seconds * 1000) : null);
  const [isInitialRender, setIsInitialRender] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null);
  const [realTimeURL, setRealTimeURL] = useState<string | null>(currentUserContext && currentUserContext.photoURL ? currentUserContext.photoURL : null);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>(currentUserContext?.interests || []);

  const navigate = useNavigate();
  const { age, birthday } = currentUserContext || {};
  const formattedBirthday = birthday ? new Date(birthday.seconds * 1000).toLocaleDateString() : 'Not set yet';

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

  const handleSaveEdit = async () => {
    if (currentUserContext) {
      try {
        if (selectedPhoto) {
          const fileRef = ref(storagePhoto, `usersPhotos/${selectedPhoto.name}`);
          await uploadBytes(fileRef, selectedPhoto);
          const photoURL = await getDownloadURL(fileRef);
          const updatedData = {
            displayName: editDisplayName,
            age: editAge,
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
            age: editAge,
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
    setEditAge(currentUserContext?.age || 0);
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

  return (
    <div className='my-profile-info'>
      <div className='my-profile-info__avatar'>
        <div className='my-profile-info__avatar-square'></div>
        <div className='my-profile-info__avatar-photo'>
          <img src={realTimeURL || photo} alt="User" />
        </div>
      </div>
      <div className='my-profile-info__content'>
        <div className='my-profile-info__content-info'>
          <div className='my-profile-info__content-info-name'>
            {currentUserContext ? (
              editProfile ? (
                <input type='text' value={editDisplayName} onChange={(e) => setEditDisplayName(e.target.value)} />
              ) : (
                <p>{currentUserContext.displayName}</p>
              )
            ) : null}
          </div>
          <div className='my-profile-info__content-info-name-others'>
            {editProfile ? (
              <>
                <input type='number' value={editAge} onChange={(event) => setEditAge(parseInt(event.target.value))} />
                <input
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
            <div>
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
                  <Chip key={index} label={interest} onClick={handleClick} />
                ))}
              </Stack>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileInfo;
