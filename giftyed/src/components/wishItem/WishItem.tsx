import React from 'react';
import './WishItem.scss';
import { GiftApp } from '../../utils/types/gift';

interface WishItemProps {
  gifts: Array<GiftApp>;
}

const WishItem: React.FC<WishItemProps> = ({ gifts }) => {
  return (
    <div className='wish-item'>
      {gifts.map((gift) => (
        <div key={gift.id} className='wish-item__square'>
          <div className='wish-item__square-photo'>
            <img src={gift.photoURL || 'placeholder-url'} alt={gift.name} />
            <p>{gift.name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WishItem;
