import React, { useEffect, useState } from 'react';
import './SearchList.scss';
import { db } from '../../utils/firebase/firebase.utils';
import { GiftApp } from '../../utils/types/gift';
import { getDocs, collection, query, where } from 'firebase/firestore';

interface SearchListProps {
  searchQuery: string;
}

const SearchList: React.FC<SearchListProps> = ({ searchQuery }) => {
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

  return (
    <div className='SearchList'>
      {gifts.map((gift) => (
        <div key={gift.id} className='SearchList__item'>
          <img src={gift.photoURL || 'placeholder-url'} alt={gift.name} />
          <p>{gift.name}</p>
          <p>Tags: {gift.tags?.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchList;
