import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../components/navbar/Navbar';
import wavesTwo from '../../utils/wavesTwo.png';
import './SearchPage.scss';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import SearchList from '../../components/searchList/SearchList';
import { Chip } from '@mui/material';
import { db, removeGiftFromWishes, updateUserWishes } from '../../utils/firebase/firebase.utils';
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
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            {selectedTags.map((tag) => (
                                <Grid key={tag} xs={6} md={4}>
                                    <Chip label={tag} onDelete={() => setSelectedTags((prevTags) => prevTags.filter((t) => t !== tag))} />
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </div>
            )}
            {searchQuery && (
                <div className='SearchPage__categories'>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            {availableTags
                                .filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
                                .map((tag) => (
                                    <Grid key={tag} xs={6} md={4}>
                                        <Chip label={tag} onClick={() => handleTagClick(tag)} />
                                    </Grid>
                                ))}
                        </Grid>
                    </Box>
                </div>
            )}
            <div className='SearchPage__searchListContainer'>
                <SearchList searchQuery={selectedTags.join(' ')} onGiftClick={handleGiftClick} />
            </div>
            <img className="FollowPage__wavesTwoImg" src={wavesTwo} alt="wavesTwo" />
        </div>
    );
};

export default SearchPage;
