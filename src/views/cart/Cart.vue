<template>
  <div class="cart">
    <!-- 导航 -->
      <nav-bar>
        <div slot="center">购物车({{cartLength}})</div>
      </nav-bar>

    <!-- 商品列表 -->
    <cart-list></cart-list>

    <!-- 底部汇总 -->
    <cart-bottom-bar/>
  </div>
</template>

<script>
import CartList from './childComps/CartList'
import CartBottomBar from './childComps/CartBottomBar'

import NavBar from 'components/common/navbar/NavBar'


export default {
  name: 'Cart',
  components: {
    NavBar,
    CartList,
    CartBottomBar
  },
  computed: {
    cartLength(){
      return this.$store.state.cartList.length
    }
  },
}
</script>

<style scoped>
  .cart{
    height: 520px;
  }

  .nav-bar{
    background: var(--color-tint);
    color: #fff;
    font-weight: 700;
  }

  /* .cart-list{
    height: 132px;
  } */

</style>>

