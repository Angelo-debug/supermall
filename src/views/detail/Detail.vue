<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav"/>
        <scroll class="content" ref="scroll">
            <detail-swiper :top-images="topImages"  v-if="topImages.length"></detail-swiper>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop="shops"/>
            <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
            <detail-param-info :param-info="paramInfo"/>
        </scroll>
        
    </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'

import Scroll from 'components/common/scroll/Scroll'


import {getDetail, Goods, Shop, GoodsParam} from 'network/detail'




export default {
    name: 'Detail',
    data () {
        return {
            iid: null,
            topImages: [],
            goods: {},
            shops: {},
            detailInfo:{},
            paramInfo: {}
        }
    },
    created () {
        //1.保存传入的iid
        this.iid = this.$route.params.iid,

        //2.根据iid请求详情数据
        getDetail(this.iid).then(res => {
            //1.获取顶部轮播图数据
            const data = res.data.result;
            this.topImages = data.itemInfo.topImages;

            //2.获取商品信息
            this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

            //3.创建店铺信息的对象
            this.shops = new Shop(data.shopInfo);

            //4.保存商品的详情数据
            this.detailInfo = data.detailInfo;

            //5.获取参数信息
            this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule)
        })
    },
    components: {
        DetailNavBar,
        DetailSwiper,
        DetailShopInfo,
        DetailBaseInfo,
        Scroll,
        DetailGoodsInfo,
        DetailParamInfo
    },
    methods: {
        imageLoad(){
            this.$refs.scroll.refresh();
        }
    }
}
     
</script>

<style scoped>
    #detail{
       position: relative; 
       z-index: 10;  
       background: #fff;
       height: 100%;
    }
    .content{
        height: calc(100vh - 44px); 
        background: #fff;
    }

</style>