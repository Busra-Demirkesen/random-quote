import React from 'react';
import './QuoteCard.css';

function QuoteCard({quoteObj}){
    return(
        <div className='quote-card'>
            <p className='quote-text'>"{quoteObj}"</p>
            <p className='quote-author'>-{quoteObj.author}</p>
            <p className='quote-likes'>Likes: ❤️ {quoteObj.likeCount}</p>
        </div>
    );
}

export default QuoteCard;
