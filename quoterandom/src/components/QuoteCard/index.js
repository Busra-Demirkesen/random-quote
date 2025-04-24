import './styles.css';

export const QuoteCard = ({quote,author}) => {
    return(
        <section className='QuoteCard'>
            <p>{quote}</p>
            <p>{author}</p>
        </section>
    );
};