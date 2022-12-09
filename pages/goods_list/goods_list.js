// pages/goods_list/goods_list.js
let userdata = [];
let user=null;
const DB = wx.cloud.database().collection("USER")
var app = getApp()


Page({

    /**
     * 页面的初始数据
     */
    data: {
        users: [],
        user:null,
        index: null,
        defaultimg: "/icon/LOGO.jpg",
        my_likes:[],
        my_collects:[],
        current_index:null
    },
    my_likes(e){
        //console.log(e.currentTarget.dataset.index)
        let index=e.currentTarget.dataset.index;
        //console.log(index)
        let flag=this.data.my_likes[index];
        let mylikes=this.data.my_likes;
        flag=!flag;
        mylikes[index]=flag
        let user=this.data.users;
        let id=user[index]._id;
        let likes_now=user[index].likes;
        if(flag)likes_now++;
        else likes_now--;
        user[index].likes=likes_now;
        let username=this.data.user;
        //console.log(username)
        let likelist=user[index].like_list;
        if(flag)likelist.push(username);
        else{
            likelist.pop(username);
        }
        DB.doc(id).update({
            data: {
                likes: likes_now,
                like_list:likelist
            },
            success(res) {
                console.log("更新成功", res)
            },
            fail(res) {
                console.log("更新失败", res)
            }
        })
        //console.log(id);
        this.setData({
            current_index:index,
            my_likes:mylikes,
            users:user
        })
        console.log(this.data.users)
    },
    my_collects(e){
        //console.log(e.currentTarget.dataset.index)
        let index=e.currentTarget.dataset.index;
        //console.log(index)
        let flag=this.data.my_collects[index];
        let mycollects=this.data.my_collects;
        flag=!flag;
        mycollects[index]=flag
        let user=this.data.users;
        let id=user[index]._id;
        let collects_now=user[index].collects;
        if(flag)collects_now++;
        else collects_now--;
        user[index].collects=collects_now;
        let username=this.data.user;
        //console.log(username)
        let collectlist=user[index].collect_list;
        if(flag)collectlist.push(username);
        else{
            collectlist.pop(username);
        }
        // let username=app.globalData.userInfo.open_ID;
        // //console.log(username)
        // let collectlist=[];
        // collectlist.push(username);
        DB.doc(id).update({
            data: {
                collects: collects_now,
                collect_list:collectlist
            },
            success(res) {
                console.log("更新成功", res)
            },
            fail(res) {
                console.log("更新失败", res)
            }
        })
        //console.log(id);
        this.setData({
            current_index:index,
            my_collects:mycollects,
            users:user
        })
        console.log(this.data.users)
    },
    cloudgetdata() {
        var _this = this;
        wx.cloud.callFunction({
            name: "get_from_database",
            data: {
                index: _this.data.index
            },
            success: function(res) {
                userdata = res.result.data;
                let mylikes=[];
                let mycollects=[];
                let user=_this.data.user
                console.log(userdata.length)
                for(var i=0;i<userdata.length;i++){
                    if(userdata[i].hasOwnProperty("likes"))
                    {
                        //console.log("yes")
                        let likelist=userdata[i].like_list
                        console.log("user",user)
                        if(userdata[i].hasOwnProperty("like_list"))
                        {
                        if(likelist.includes(user)){
                            //mylikes[i]=true
                            userdata[i].my_likes=true
                        }
                    }
                    else{
                        userdata[i]["like_list"]=[]
                    }
                    }
                    else{
                        userdata[i]["likes"]=0;
                        userdata[i]["like_list"]=[]
                        console.log("no")
                    }
                    if(userdata[i].hasOwnProperty("collects"))
                    {
                        console.log("yes")
                        let collectlist=userdata[i].collect_list
                        console.log("user",user)
                        if(userdata[i].hasOwnProperty("collect_list"))
                        {
                        if(collectlist.includes(user)){
                           // mycollects[i]=true
                            userdata[i].my_collects=true
                        }
                    }
                    else{
                        userdata[i]["collect_list"]=[]
                    }
                    }
                    else{
                        userdata[i]["collects"]=0;
                        userdata[i]["collect_list"]=[]
                        console.log("no")
                    }
                    if(userdata[i].hasOwnProperty("comments"))
                    {
                        console.log("yes")
                    }
                    else{
                        userdata[i]["comments"]=0;
                        console.log("no")
                    }
                    if(userdata[i].hasOwnProperty("my_likes"))
                    {
                        console.log("yes")
                        mylikes.push(userdata[i].my_likes);
                       // continue;
                    }
                    else{
                        userdata[i]["my_likes"]=false;
                        mylikes.push(false);
                        console.log("no")
                    }
                    if(userdata[i].hasOwnProperty("my_collects"))
                    {
                        console.log("yes")
                        mycollects.push(userdata[i].my_collects);
                       // continue;
                    }
                    else{
                        userdata[i]["my_collects"]=false;
                        mycollects.push(false);
                        console.log("no")
                    }
                }
                _this.setData({
                    users: userdata,
                    my_likes:mylikes,
                    my_collects:mycollects
                })
                console.log("success", userdata,mycollects)
            },
            fail(res) {
                console.log("fail", res)
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            index: options.cid
        })
        let _this=this;
        //console.log("trans:", options)
        wx.cloud.callFunction({
            name: "getopenid",
            success: res => {
                console.log("success111111111111111111111111", res.result.openid)
                //_this.data.user= res.result.openid;
                _this.setData({
                    user:res.result.openid
                })
                console.log("success1", res.result.openid)
                if (_this.data.index != null) {
                    _this.cloudgetdata();
                }
            },
            fail(res) {
                console.log("fail", res)
            }
        })
        // if (this.data.index != null) {
        //     this.cloudgetdata();
        // }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})