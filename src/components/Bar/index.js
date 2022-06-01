import * as echarts from 'echarts'
import { useEffect, useRef } from 'react'

const Bar = ({ title, xData, yData, style }) => {
  const domRef = useRef() //domRef的初始值为空
  const chartInit = () => {
    // 基于准备好的dom,初始化echarts实例
    const myChart = echarts.init(domRef.current)
    // 定义myChart图表结构
    myChart.setOption({
      title: {
        text: title
      },
      tooltip: {},
      xAxis: {
        data: xData
      },
      yAxis: {},
      series: [
        {
          name: '销量',
          type: 'bar',
          data: yData
        }
      ]
    })
  }

  //执行这个初始化的图表函数
  useEffect(() => {
    chartInit()
  }, [])

  return (
    <div>
      {/* 一个挂载节点, 通过ref把div与domRef关联，现在domRef.current里面存的是div的所有属性和方法 */}
      <div ref={domRef} style={style}></div>
    </div>
  )
}

export default Bar
