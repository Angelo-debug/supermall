<template>
  <div id="home">
      <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
        <scroll class="content" ref="scroll"
                :probe-type="3"
                @scroll="contentScroll"
                :pull-up-load="true" 
                @pullingUp="loadMore"
                >
          <home-swiper :banners="banners"></home-swiper>
          <home-recommend-view :recommends="recommends"/>
          <home-feature-view/>
          <tab-control class="tab-control" :titles="['流行','新款','精选']" @tabClick="tabClick" />
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
      isShowBackTop: false
    }
  },
  created () {
    //1.请求多个数据
    this.getHomeMultidata();

    //2.请求商品数据
    this.getHomeGoods('pop');
    this.getHomeGoods('new');
    this.getHomeGoods('sell');
  },
  computed: {
    showGoods(){
      return this.goods[this.cunrrentType].list;
    }
  },
  methods: {
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
    },
    backClick(){
      this.$refs.scroll.scrollTo(0,0,1000)
    },
    contentScroll(position){
      this.isShowBackTop = (-position.y > 1000)
    },
    loadMore(){
      this.getHomeGoods(this.cunrrentType);
      this.$refs.scroll.scroll.refresh()
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
        console.log(res);
        this.goods[type].list.push.apply(this.goods[type].list,res.data.data.list);
        this.goods[type].page += 1 

        this.$refs.scroll.finishPullUp()
    })
    }

    
  }
}
</script>

<style scoped>
  #home{
    padding-top: 44px;
    height: 100vh;
    position: relative;
  }

  .home-nav{
    background-color: var(--color-tint);
    color: #fff;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    z-index: 9;
  }

  .tab-control{
    position:sticky;
    top: 44px;
    z-index: 9;
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

</style>
