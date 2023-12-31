import React, { useEffect, useState } from 'react';
import './SearchList.scss';
import { db } from '../../utils/firebase/firebase.utils';
import { GiftApp } from '../../utils/types/gift';
import { getDocs, collection, query, where } from 'firebase/firestore';

interface SearchListProps {
  searchQuery: string;
  onGiftClick: (giftId: string) => void;
}

const SearchList: React.FC<SearchListProps> = ({ searchQuery,onGiftClick }) => {
  const [gifts, setGifts] = useState<GiftApp[]>([]);

  useEffect(() => {
    const fetchGifts = async () => {
      try {
        const giftsCollection = collection(db, 'gifts');
        let giftsQuery = query(giftsCollection);

        if (searchQuery) {
          const tagsArray = searchQuery.split(/,|\s+/).filter(tag => tag.trim() !== '');
          giftsQuery = query(giftsCollection, where('tags', 'array-contains-any', tagsArray));
        }

        const giftsSnapshot = await getDocs(giftsQuery);
        const giftsData = giftsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as GiftApp));
        setGifts(giftsData);
      } catch (error) {
        console.error('Error fetching gifts:', error);
      }
    };

    fetchGifts();
  }, [searchQuery]);
  
  const handleGiftClick = (giftId: string) => {
    onGiftClick(giftId);
  };
  return (
    <div className='SearchList'>
      {gifts.map((gift) => (
        <div key={gift.id} className='SearchList__item' onClick={() => handleGiftClick(gift.id)}>
          <img className='SearchList__item-photo' src={gift.photoURL || 'placeholder-url'} alt={gift.name} />
          <p className='SearchList__item-name'>{gift.name}</p>
          {/* <p>Tags: {gift.tags?.join(', ')}</p> */}
        </div>
      ))}
    </div>
  );
};

export default SearchList;
