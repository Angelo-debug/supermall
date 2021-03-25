<template>
    <div id="detail">
        <detail-nav-bar class="detail-nav" @titleClick="titleClick" ref="nav"/>
        
        <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
            <detail-swiper :top-images="topImages"  v-if="topImages.length"></detail-swiper>
            <detail-base-info :goods="goods"/>
            <detail-shop-info :shop="shops"/>
            <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
            <detail-param-info ref="params" :param-info="paramInfo"/>
            <detail-comment-info ref="comment" :comment-info="commentInfo" />
            <goods-list ref="recommend" :goods="recommends"/>
        </scroll>
        <detail-bottom-bar @addToCart="addCart"/>
        <back-top @click.native="backClick" v-show="isShowBackTop" />
        <toast :message="message" :show="show"/>
    </div>
</template>

<script>
import DetailNavBar from './childComps/DetailNavBar'
import DetailSwiper from './childComps/DetailSwiper'
import DetailShopInfo from './childComps/DetailShopInfo'
import DetailBaseInfo from './childComps/DetailBaseInfo'
import DetailGoodsInfo from './childComps/DetailGoodsInfo'
import DetailParamInfo from './childComps/DetailParamInfo'
import DetailCommentInfo from './childComps/DetailCommentInfo'
import DetailBottomBar from './childComps/DetailBottomBar.vue'

import Scroll from 'components/common/scroll/Scroll'
import GoodsList from 'components/content/goods/GoodsList'
import BackTop from 'components/content/backTop/BackTop'
import Toast from 'components/common/toast/Toast'


import {getDetail, Goods, Shop, GoodsParam, getRecommend} from 'network/detail'
import {itemListenerMixin} from 'common/mixin'
import {debounce} from 'common/utils'




export default {
    name: 'Detail',
    data () {
        return {
            iid: null,
            topImages: [],
            goods: {},
            shops: {},
            detailInfo:{},
            paramInfo: {},
            commentInfo:{},
            recommends:[],
            themeTopYs: [],
            getThemeTopY: null,
            currentIndex: 0,
            isShowBackTop: false,
            message: '加入购物车成功',
            show: false
        }
    },
    components: {
        DetailNavBar,
        DetailSwiper,
        DetailShopInfo,
        DetailBaseInfo,
        Scroll,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,
        GoodsList,
        DetailBottomBar,
        BackTop,
        Toast
    },
    mixins: [itemListenerMixin],
    mounted () {   
    },
    created () {
        //1.保存传入的iid
        this.iid = this.$route.params.iid,

        //2.根据iid请求详情数据
        getDetail(this.iid).then(res => {
            //1.获取顶部轮播图数据
            const data = res.data.result;
            // console.log(data);
            this.topImages = data.itemInfo.topImages;

            //2.获取商品信息
            this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services);

            //3.创建店铺信息的对象
            this.shops = new Shop(data.shopInfo);

            //4.保存商品的详情数据
            this.detailInfo = data.detailInfo;

            //5.获取参数信息
            this.paramInfo = new GoodsParam(data.itemParams.info,data.itemParams.rule);

            //6.取出评论信息
            if(data.rate.cRate !== 0){
                this.commentInfo = data.rate.list[0];
            }



        })

        //3.请求推荐数据
        getRecommend().then(res =>{
            // console.log(res);
            this.recommends = res.data.data.list;
        })

        //4.给getThemeTopY赋值
        this.getThemeTopY = debounce(()=>{
            this.themeTopYs = [];
            this.themeTopYs.push(0);
            this.themeTopYs.push(this.$refs.params.$el.offsetTop);
            this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
            this.themeTopYs.push(this.$refs.recommend.$el.offsetTop);
            // console.log(this.themeTopYs)
        },100)

    },
    methods: {
        imageLoad(){
            this.$refs.scroll.refresh();
            this.getThemeTopY();
        },
        titleClick(index){
            this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 100)
        },
        contentScroll(position){
            //1.获取y值
            const positionY = -position.y

            //2.positionY和主题中值进行对比
            //[0,7938,9120,9452]
            //positionY 在 0和7938 之间， index=0
            //positionY 在 7938和9120 之间， index=1
            //positionY 在 9120和9452 之间， index=2
            //positionY 在 超过9452时， index=3

            let length = this.themeTopYs.length;
            for(let i=0; i<length; i++){
                // if(positionY > this.themeTopYs[i] && positionY < this.themeTopYs[i+1]){
                    
                // }
                if(this.currentIndex !== i && ((i<length-1 && positionY >= this.themeTopYs[i] && positionY < this.themeTopYs[i+1])||(i===length-1) && positionY >= this.themeTopYs[i])){
                    this.currentIndex = i;
                    // console.log(i);
                    this.$refs.nav.currentIndex = this.currentIndex
                }
            }

            //是否显示回到顶部
            this.isShowBackTop = (-position.y > 1000)
        },
        backClick(){
            this.$refs.scroll.scrollTo(0,0,1000)
        },
        addCart(){
            //1.获取购物车需要展示的信息
            const product = {};
            product.image = this.topImages[0];
            product.title = this.goods.title;
            product.desc = this.goods.desc;
            product.price = this.goods.newPrice;
            product.iid = this.iid;
            // console.log(this.goods)
            product.realPrice = this.goods.realPrice;

            //2.将商品添加到购物车页面
            // this.$store.commit('addCart',product);
            this.$store.dispatch('addCart',product).then(res => {
                // this.show = true;
                // this.message = res;

                // setTimeout(() => {
                //     this.show = false;
                //     this.message = ''
                // },1500)
                this.$toast.show(res,1500);
                // console.log(this.$toast.show)
            });
            

           
            

            
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