import Bar from '@/components/Bar'
import './index.scss'
//思路：
//1.看echarts官方文档，把echarts导入项目
//如何在react中获取dom ->useRef,在什么地方获取dom节点->useEffect
//2.先不抽离定制化的参数，先把最小化的demo跑起来
//3. 按照需求，哪些参数需要自定义，抽离出来


const Home = () => {

  return (
    <div>
      <Bar style={{ width: '500px', height: '400px' }}
        xData={['vue', 'angular', 'react']}
        yData={[50, 60, 70]}
        title='三大框架满意度' />
      <Bar style={{ width: '300px', height: '400px' }}
        xData={['vue', 'angular', 'react']}
        yData={[50, 60, 70]}
        title='三大框架使用度2' />
    </div>
  )
}

export default Home