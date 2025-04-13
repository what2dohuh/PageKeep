import { Link } from 'react-router-dom';
import '../style/notfound.css'
const Notfoundpage = () => {
    return (
        <>
             <div className="error-page">
      <div className="container">
        <div className="eyes">
          <div className="eye">
            <div className="eye__pupil eye__pupil--left"></div>
          </div>
          <div className="eye">
            <div className="eye__pupil eye__pupil--right"></div>
          </div>
        </div>

        <div className="error-page__heading">
          <h1 className="error-page__heading-title">Looks like you are lost</h1>
          <p className="error-page__heading-desciption">404 error</p>
        </div>

        <Link
          className="error-page__button"
          to="/"
          aria-label="Back to home"
          title="Back to home"
        >
          back to home
        </Link>
      </div>
    </div>
        </>
    );
}

export default Notfoundpage;
