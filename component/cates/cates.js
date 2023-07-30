// component/cates/cates.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        cates: {
            type: Array,
            value: []
        }
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        handlecateitem(e) {
            /*const {index}=e.currentTarget.dataset;
            let {tabs}=this.data;
            tabs.forEach((v,i)=>i===index?v.isactive=true:v.isactive=false);
            this.setData(
              {
                tabs
              }
            )*/
            const { index } = e.currentTarget.dataset;
            this.triggerEvent("itemchange", { index });
        }
    }
})