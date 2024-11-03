export default {
  plugins: {
    'postcss-px-to-viewport': {
      unitToConvert: 'px', // 需要转换的单位
      viewportWidth: 375, // 设计稿的视口宽度
      unitPrecision: 5, // 单位转换后保留的精度
      propList: ['*'], // 能转化为vw的属性列表
      viewportUnit: 'vw', // 希望使用的视口单位
      fontViewportUnit: 'vw', // 字体使用的视口单位
      selectorBlackList: [], // 需要忽略的CSS选择器
      minPixelValue: 1, // 小于或等于`1px`不转换为视口单位
      mediaQuery: false, // 允许在媒体查询中转换`px`
      replace: true, // 是否直接更换属性值
      exclude: [/node_modules/], // 忽略某些文件夹下的文件
      landscape: false, // 是否添加根据 landscapeWidth 生成的媒体查询条件
      landscapeUnit: 'vw' // 横屏时使用的单位
    }
  }
} 