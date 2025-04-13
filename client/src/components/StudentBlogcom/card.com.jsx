import '../../style/card.css';
import Timeform from '../../components/timeform';

// eslint-disable-next-line react/prop-types
const CardCom = ({ title, time, img, username, category }) => {
 

  return (
    <div className="maincard">
      <div className="card">
        <img src={img} className="card__image" alt={title} />
        <div className="card__content">
          <span className="card__category">{category}</span>
          <time className="card__date">on <Timeform time={time} /></time>
          <span className="card__title">{title}</span>
          {/* <p className="card__description">{descr.slice(20)}</p>   */}
          <p className='card__description'>...Read More</p>
          <span className="card__username"> by {username}</span>
          <div className="card__footer">
        
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCom;
