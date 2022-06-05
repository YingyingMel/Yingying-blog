import './index.scss'
import { Card, Carousel } from 'antd'
import logo from '@/assets/logo.png'
import Carousel1 from '@/assets/Carousel1.jpg'
import Carousel2 from '@/assets/Carousel2.jpg'
import Carousel3 from '@/assets/Carousel3.jpg'


const Home = () => {

  //轮播图样式
  const contentStyle = {
    height: '400px',
    color: 'black',
    lineHeight: '300px',
    textAlign: 'center',
  }

  return (
    <div>
      <Carousel autoplay>
        <div>
          <h3 style={contentStyle}><img className='carouselImg' src={logo} alt="" />1</h3>
        </div>
        <div>
          <h3 style={contentStyle}><img className='carouselImg' src={Carousel1} alt="" />1</h3>
        </div>
        <div>
          <h3 style={contentStyle}><img className='carouselImg' src={Carousel2} alt="" />1</h3>
        </div>
        <div>
          <h3 style={contentStyle}><img className='carouselImg' src={Carousel3} alt="" />1</h3>
        </div>
      </Carousel>
    </div>
  )
}

export default Home