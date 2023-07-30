// component/tabs/Tab.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs:{ 
      type:Array,
      value:[]
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    /*tabs:[
      {
        id:0,
        name:"最近浏览",
        isactive:false
      },
      {
        id:1,
        name:"猜你喜欢",
        isactive:false
      }
    ]*/

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handletitleitem(e){
      /*const {index}=e.currentTarget.dataset;
      let {tabs}=this.data;
      tabs.forEach((v,i)=>i===index?v.isactive=true:v.isactive=false);
      this.setData(
        {
          tabs
        }
      )*/
      const {index}=e.currentTarget.dataset;
      this.triggerEvent("itemchange",{index});
    }
  }
})
