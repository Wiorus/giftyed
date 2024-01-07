import React, { useState } from 'react';
import './WishItem.scss';
import { GiftApp } from '../../utils/types/gift';

interface WishItemProps {
  gifts: Array<GiftApp>;
  onRemoveGift: (giftId: string) => void;
}

const WishItem: React.FC<WishItemProps> = ({ gifts, onRemoveGift }) => {
  const [removedGifts, setRemovedGifts] = useState<string[]>([]);

  const handleRemoveGift = (giftId: string) => {
    onRemoveGift(giftId);
    setRemovedGifts((prev) => [...prev, giftId]);
  };

  return (
    <div className='wish-item'>
      {gifts.map((gift) => (
        <div
          key={gift.id}
          className={`wish-item__item ${removedGifts.includes(gift.id) ? 'removed' : ''}`}
          onClick={() => handleRemoveGift(gift.id)}
        >
          <div className='wish-item__item-square'>
            <img
              className='wish-item__item-square-photo'
              src={gift.photoURL || 'placeholder-url'}
              alt={gift.name}
            />
          </div>
          <p className='wish-item__item-name'>{gift.name}</p>
        </div>
      ))}
    </div>
  );
};

export default WishItem;
