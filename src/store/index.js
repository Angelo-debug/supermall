import Vue from 'vue'
import Vuex from 'vuex'

//1.安装插件
Vue.use(Vuex);

//2.创建Store对象
const store = new Vuex.Store({
    state:{
        cartList:[]
    },
    mutations:{
        //mutations唯一的目的就是修改state中的状态
        //mutations中的每个方法尽可能完成的事件比较单一
        addCounter(state, payload){
            payload.count++;
        },
        addToCart(state, payload){
            payload.checked = true;
            state.cartList.push(payload)
        }
    },
    actions:{
        addCart(context, payload){
            return new Promise((resolve,reject) => {
                //1.查找之前数组中是否有该商品
                let oldProduct = context.state.cartList.find(item => item.iid === payload.iid);

                //2.判断oldProduct
                if(oldProduct){
                    // oldProduct.count +=1;
                    context.commit('addCounter',oldProduct);
                    resolve('当前商品数量+1')
                }else{
                    payload.count = 1;
                    // state.cartList.push(payload)
                    context.commit('addToCart',payload);
                    resolve('添加了新的商品')
                }
            })
        }
    }
})

//3.挂载Vue实例上
export default store