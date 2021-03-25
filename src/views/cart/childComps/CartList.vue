<template>
    <div class="cart-list">
        <scroll class="content" ref="scroll">
            <!-- <li v-for="item in cartList">{{item}}</li> -->
            <cart-list-item 
                v-for="(item,index) in cartList"
                :product="item"/>
        </scroll>
        
    </div>
</template>

<script>
import Scroll from 'components/common/scroll/Scroll'
import CartListItem from './CartListItem'

export default {
    name: 'CartList',
    components: {
        Scroll,
        CartListItem
    },
    computed: {
        cartList(){
            return this.$store.state.cartList
        }
    },
    activated () {
        this.$refs.scroll.refresh();
    }
}
</script>

<style scoped>
    .cart-list{
        width: 100%;
        height: calc(100% - 44px);
    }

    .content{
        position: absolute;
        overflow: hidden;
        top:44px;
        bottom: 49px;
        left: 0;
        right: 0;
    }
</style>