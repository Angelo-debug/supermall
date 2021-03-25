<template>
  <div id="home">
      <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
       <tab-control :titles="['流行','新款','精选']" 
                       @tabClick="tabClick" 
                       ref="tabControl1"
                       class="tab-control"
                       v-show="isTabFixed"/>
        <scroll class="content" ref="scroll"
                :probe-type="3"
                @scroll="contentScroll"
                :pull-up-load="true" 
                @pullingUp="loadMore"
                >
          <home-swiper :banners="banners" v-if="banners.length"
                       @swiperImgLoad="swiperImgLoad"
          ></home-swiper>
          <home-recommend-view :recommends="recommends"/>
          <home-feature-view/>
          <tab-control :titles="['流行','新款','精选']" 
                       @tabClick="tabClick" 
                       ref="tabControl2"/>
          <goods-list :goods="showGoods"/>
        </scroll>
        <back-top @click.native="backClick" v-show="isShowBackTop" />
  </div>
</template>

<script>

import NavBar from 'components/common/navbar/NavBar'
import HomeSwiper from 'views/home/childComps/HomeSwiper'
import HomeRecommendView from './childComps/HomeRecommendView'
import HomeFeatureView from './childComps/HomeFeatureView'


import {getHomeMultidata,getHomeGoods} from "network/home"
import TabControl from 'components/content/tabControl/TabControl'
import GoodsList from 'components/content/goods/GoodsList'
import Scroll from 'components/common/scroll/Scroll'
import BackTop from 'components/content/backTop/BackTop'

import {itemListenerMixin} from 'common/mixin'


export default {
  name: 'Home',
  components: {
    NavBar,
    HomeSwiper,
    HomeRecommendView,
    HomeFeatureView,
    TabControl,
    GoodsList,
    Scroll,
    BackTop
  },
  data () {
    return {
      banners:[],
      recommends:[],
      goods:{
        'pop':  {page: 0, list: []},
        'new': {page: 0, list: []},
        'sell': {page: 0, list: []}
      },
      cunrrentType : 'pop',
      isShowBackTop: false,
      tabOffsetTop: 0,
      isTabFixed:false,
      saveY: 0,
      itemImgListener: null
    }
  },
  mixins: [itemListenerMixin],
  created () {
    //1.请求多个数据
    this.getHomeMultidata();

    //2.请求商品数据
    this.getHomeGoods('pop');
    this.getHomeGoods('new');
    this.getHomeGoods('sell');

  },
  mounted () {
    
  },
  computed: {
    showGoods(){
      return this.goods[this.cunrrentType].list;
    }
  },
  methods: {
    debounce(func,delay){
      let timer = null;
      return function (...args){
        if(timer) clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this,args)
        },delay)
      }
    },

  
    //事件监听相关的方法
    tabClick(index){
      switch(index){
        case 0:
          this.cunrrentType = 'pop';
          break;
        case 1:
          this.cunrrentType = 'new';
          break;
        case 2:
          this.cunrrentType = 'sell';
          break
      }
      this.$refs.tabControl1.currentIndex = index
      this.$refs.tabControl2.currentIndex = index
    },
    backClick(){
      this.$refs.scroll.scrollTo(0,0,1000)
    },
    contentScroll(position){
      //1.判断BackTop是否显示
      this.isShowBackTop = (-position.y > 1000)

      //2.决定tabControl是否吸顶(position: fixed)
      this.isTabFixed = (-position.y) > this.tabOffsetTop
    },
    loadMore(){
      // console.log('上拉加载更多')
      this.getHomeGoods(this.cunrrentType);
      this.$refs.scroll.scroll.refresh()
    },
    swiperImgLoad(){
      // console.log(this.$refs.tabControl.$el.offsetTop)
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop;
    },
    
    // 网络请求相关得方法
    getHomeMultidata(){
      getHomeMultidata().then(res => {
      this.banners = res.data.data.banner.list;
      this.recommends = res.data.data.recommend.list;
      })
    },
    getHomeGoods(type){
      const page = this.goods[type].page+1;
      getHomeGoods(type,page).then(res =>{
        // console.log(res);
        this.goods[type].list.push.apply(this.goods[type].list,res.data.data.list);
        this.goods[type].page += 1 

        this.$refs.scroll.finishPullUp()
    })
    }

    
  },
  activated () {
    this.$refs.scroll.scrollTo(0,this.saveY,0);
    this.$refs.scroll.refresh();
  },
  deactivated () {
    //1.保存Y值
    this.saveY = this.$refs.scroll.scroll.y;

    //2.取消全局事件的监听
    this.$bus.$off('itemImgLoad',this.itemImgListener)
  }
}
</script>

<style scoped>
  #home{
    /* padding-top: 44px; */
    height: 100vh;
    position: relative;
  }

  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    /* position: fixed; */
    /* left: 0;
    right: 0;
    top: 0;
    z-index: 9;  */
  }

  .content{
    /* height: calc(100% - 93px); */
    position: absolute;
    overflow: hidden;
    top:44px;
    bottom: 49px;
    left: 0;
    right: 0;
  }

  .tab-control{
    position: relative;
    z-index: 9;
  }


</style>
