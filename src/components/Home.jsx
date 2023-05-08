import React from 'react'
import BannerBackground from '../assets/bannerbackground.png'
import AboutImage from '../assets/about-page-image.png'
import Logo from '../assets/Logo.png'
import { FiArrowRight } from 'react-icons/fi';

const Home = () => {
  return (
    <div className='home-container'>
        <div className='nav-logo'>
            <img src={Logo} alt='logo' />
        </div>
        <div className='home-banner'>
            <div className='home-bannerImage'>
                <img src={BannerBackground} alt='banner' />
            </div>
            <div className='home-text'>
                <h1 className='primary-heading'>
                    The Ultimate Study Resource for Students!
                </h1>
                <p className='primary-text'>
                    Create and join chatrooms on any subject, 
                    and get instant help and support
                    when you need it the most.
                </p>
                <button className='secondary-button'>
                    Join Now <FiArrowRight />
                </button>
            </div>
            <div className='home-image'>
                <img src={AboutImage} alt='about' />
            </div>
        </div>
    </div>
  )
}

export default Home