import './index.scss'

import { Avatar, Carousel, Tag } from 'antd'
import welcomeGif from '@/assets/welcomeGif.gif'
import Carousel1 from '@/assets/Carousel1.jpg'
import Carousel2 from '@/assets/Carousel2.jpg'
import Carousel3 from '@/assets/Carousel3.jpg'
import yingying_logo from '@/assets/yingying_logo.jpg'


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
          <h3 style={contentStyle}><img className='carouselImg' src={welcomeGif} alt="" /></h3>
        </div>
        <div>
          <h3 style={contentStyle}><img className='carouselImg' src={Carousel1} alt="" /></h3>
        </div>
        <div>
          <h3 style={contentStyle}><img className='carouselImg' src={Carousel2} alt="" /></h3>
        </div>
        <div>
          <h3 style={contentStyle}><img className='carouselImg' src={Carousel3} alt="" /></h3>
        </div>
      </Carousel >
      <div className='container'>
        <div className='leftside'>
          <Avatar
            className='avatar-logo'
            src={yingying_logo}
            size={{
              xs: 70,
              sm: 90,
              md: 120,
              lg: 150,
              xl: 170,
            }}
            shape='circle' />
          <div className='name-tag'>Yingying SUN</div>
          <div className='name-tag' style={{ fontSize: '15px', fontWeight: 400 }}>Location: Melbourne</div>
          <div className='name-tag' style={{ fontSize: '15px', fontWeight: 400 }}>Email: yingying.sun7@gmail.com</div>
          <div className='skill-labels'>
            <Tag color="#f50">HTML</Tag>
            <Tag color="#2db7f5">CSS</Tag>
            <Tag color="#cb7cbe">JavaScript</Tag>
            <Tag color="#108ee9">React</Tag>
            <Tag color="#f2776c">Node.js</Tag>
            <Tag color="#f50">Express</Tag>
            <Tag color="#87d068">MySQL</Tag>
            <Tag color="#bf1b21">Git</Tag>
            <Tag color="#cb7cbe">Ant Design</Tag>
            <Tag color="#87d068">Material UI</Tag>
            <Tag color="#108ee9">JQuery</Tag>
          </div>
        </div>
        <div className='rightside'>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700 }}>Hi, I’m Yingying!</p>
            <p style={{ fontSize: '15px' }}>I come from a material engineering background where I’ve studied in the material science and engineering for over 10 years and worked as a research fellow for 1.5 years. In that time I’ve gained a lot of knowledge, as well as practical and real world skills. Working 8-10 hour days allowed me to develop a very high level of problem solving skills, and the ability in modellings, experimental designs, component manufacturing, data analysis and paper writing. </p>
            <p style={{ fontSize: '15px' }}>When I was on the rise of my career, two lovely kids came to our family. Things became quite difficult for working parents to juggle career and family, especially during the pandemic. So I decided to take a break from work and enjoyed the time being with my kids. As kids grew up and started going to childcare, I got plenty of my time. This is where I consciously decided to take up programming. I had some experience with it during my PhD studying, but I never truly grasped the power of what you can do with programming, nor had the passion for it. However, that quickly changed as I began to study and eventually created some practical programs. When things started to make more and more sense, this is where I really started becoming passionate about programing and seriously thinking about a career transition. </p>
            <p style={{ fontSize: '15px' }}>So far, I have spent 6 months in studying front-end development.  The programming languages and skills I have learned are shown at your left-hand side. I built this blog for showing my projects, which includes a login/register system, 4 apps and a backend server. More projects will be added once I finish. If you have any suggestions for me, welcome to leave a message at the diary page. Thank you very much. </p>
          </div>
        </div>
      </div>

    </div >
  )
}

export default Home