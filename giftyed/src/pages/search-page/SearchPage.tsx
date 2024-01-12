import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/navbar/Navbar';
import wavesTwo from '../../utils/wavesTwo.png';
import './SearchPage.scss';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import SearchList from '../../components/searchList/SearchList';
import { Chip, Stack } from '@mui/material';
import { db, removeGiftFromDesiredGifts, removeGiftFromWishes, updateDesiredGifts, updateUserWishes } from '../../utils/firebase/firebase.utils';
import { getDocs, collection } from 'firebase/firestore';
import { UsersContext, UsersContextType } from '../../contexts/user.context';

styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const SearchPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [availableTags, setAvailableTags] = useState<string[]>([]);
    const { currentUserContext, setCurrentUserContext } = useContext(UsersContext) as UsersContextType;

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const interestsParam = params.get('interests');
        if (interestsParam) {
            const decodedInterests = JSON.parse(decodeURIComponent(interestsParam));
            setSelectedTags(decodedInterests);
        }
    }, []);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleTagClick = (tag: string) => {
        setSelectedTags((prevTags) => [...prevTags, tag]);
        setSearchQuery('');
    };

    useEffect(() => {
        const fetchTags = async () => {
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

                setAvailableTags(Array.from(tagsSet));
            } catch (error) {
                console.error('Error fetching tags:', error);
            }
        };

        fetchTags();
    }, []);

    const handleGiftClick = async (giftId: string) => {
        if (currentUserContext) {
            if (currentUserContext.wishes && currentUserContext.wishes.includes(giftId)) {
                try {
                    await removeGiftFromWishes(currentUserContext._id, giftId);
                    const updatedUser = {
                        ...currentUserContext,
                        wishes: currentUserContext.wishes.filter((id) => id !== giftId),
                    };

                    localStorage.setItem('userData', JSON.stringify(updatedUser));
                    setCurrentUserContext(updatedUser);
                } catch (error) {
                    console.error('Error removing gift from wishes:', error);
                }
            } else {
                try {
                    await updateUserWishes(currentUserContext._id, giftId);
                    const updatedUser = {
                        ...currentUserContext,
                        wishes: [...(currentUserContext.wishes || []), giftId],
                    };

                    localStorage.setItem('userData', JSON.stringify(updatedUser));
                    setCurrentUserContext(updatedUser);
                } catch (error) {
                    console.error('Error adding gift to wishes:', error);
                }
            }
        }
    };

    const handleHeartClick = async (giftId: string) => {
        if (currentUserContext) {
            try {
                const isDesired = currentUserContext.desiredGifts
                    ? currentUserContext.desiredGifts.includes(giftId)
                    : false;
                const numberOfDesiredGifts = currentUserContext.desiredGifts
                    ? currentUserContext.desiredGifts.length
                    : 0;
                if (isDesired || numberOfDesiredGifts < 3) {
                    if (isDesired) {
                        await removeGiftFromDesiredGifts(currentUserContext._id, giftId);
                    } else {
                        await updateDesiredGifts(currentUserContext._id, giftId);
                    }
                    const updatedUser = {
                        ...currentUserContext,
                        desiredGifts: isDesired
                            ? currentUserContext.desiredGifts?.filter((id) => id !== giftId) || []
                            : [...(currentUserContext.desiredGifts || []), giftId],
                    };
                    localStorage.setItem('userData', JSON.stringify(updatedUser));
                    setCurrentUserContext(updatedUser);
                } else {
                    alert('You can only add 3 gifts.');
                }
            } catch (error) {
                console.error('Error updating desired gifts:', error);
            }
        }
    };

    return (
        <div className='SearchPage'>
            <Navbar />
            <div className='SearchPage__search'>
                <input
                    type="text"
                    placeholder='search...'
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            {selectedTags.length > 0 && (
                <div className='SearchPage__categories'>
                    <Stack direction='row' spacing={2}>
                        {selectedTags.map((tag) => (
                            <Chip key={tag} label={tag} onDelete={() => setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag))} />
                        ))}
                    </Stack>
                </div>
            )}

            {searchQuery && (
                <div className='SearchPage__categories'>
                    <Stack direction='row' spacing={2}>
                        {availableTags
                            .filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                            .map((tag) => (
                                <Chip key={tag} label={tag} onClick={() => handleTagClick(tag)} />
                            ))}
                    </Stack>
                </div>
            )}
            <div className='SearchPage__searchListContainer'>
                <SearchList
                    searchQuery={selectedTags.join(' ')}
                    onGiftClick={handleGiftClick}
                    onHeartClick={handleHeartClick}
                    userWishes={currentUserContext?.wishes || []}
                    userDesiredGifts={currentUserContext?.desiredGifts || []}
                />
            </div>
            <img className="FollowPage__wavesTwoImg" src={wavesTwo} alt="wavesTwo" />
        </div>
    );
};

export default SearchPage;
