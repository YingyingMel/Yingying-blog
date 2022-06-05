import './index.scss'
import { Carousel } from 'antd'
import welcomeGif from '@/assets/welcomeGif.gif'
import Carousel1 from '@/assets/Carousel1.jpg'
import Carousel2 from '@/assets/Carousel2.jpg'
import Carousel3 from '@/assets/Carousel3.jpg'


const Home = () => {

  //轮播图样式
  const contentStyle = {
    height: '100%',
    color: '#fff',
    lineHeight: '100%',
    textAlign: 'center',
  }

  return (
    <div className='home'>
      <Carousel autoplay>
        <div>
          <h3 style={contentStyle}><img className='carouselImg' src={welcomeGif} alt="" />Welcome to my blog</h3>
        </div>
        <div>
          <h3 style={contentStyle}><img className='carouselImg' src={Carousel1} alt="" />Werribee Park Mansion</h3>
        </div>
        <div>
          <h3 style={contentStyle}><img className='carouselImg' src={Carousel2} alt="" />Beach</h3>
        </div>
        <div>
          <h3 style={contentStyle}><img className='carouselImg' src={Carousel3} alt="" />Melbourne Museum</h3>
        </div>
      </Carousel >
      <div style={{ height: '300px' }}></div>
    </div >
  )
}

export default Home