import './style/home.css';
import { auth } from './config/config_fire';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Home = () => {
  const [user, setUser] = useState(null);
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user && location.pathname === "/") {
        nav('/home');
      }
    });

    return () => unsubscribe();
  }, [nav, location.pathname]);

  return (
    <>
    {!user && location.pathname === "/" && (
              <div className="landing-wrapper">
          <section className="hero-section">
            <div className="hero-content">
              <h1 className="hero-heading">Grow smarter together</h1>
              <p className="hero-subtext">
                Find top-rated study notes from students taking the same courses as you.
              </p>
              <div className="search-bar">
                <input type="text" placeholder="Search for courses, books or documents" />
              </div>
              <div className="gif-space">
                <img src="/assets/study-animation.gif" alt="Study Animation" className="landing-gif" />
              </div>
              <div className="cta-button">
                <Link to="/signup" className="create-account-btn">Create Account Now</Link>
              </div>
            </div>
            <div className="scroll-down">
              <i className="fa fa-chevron-down"></i>
            </div>
          </section>

          <section className="stats-section">
            <h2>700M students saved, and counting</h2>
            <p>
              50K new study notes added every day, from the world’s most active student communities
            </p>
          </section>

          <footer className="landing-footer">
            <div className="footer-content">
              <div className="footer-brand">
                <h3>StudyChain</h3>
                <p>Empowering students to learn, share, and grow together.</p>
              </div>
              <div className="footer-links">
                <a href="/about">About</a>
                <a href="/contact">Contact</a>
                <a href="/terms">Terms</a>
                <a href="/privacy">Privacy</a>
              </div>
            </div>
            <div className="footer-bottom">
              <p>&copy; {new Date().getFullYear()} StudyChain. All rights reserved.</p>
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default Home;
