<template>
    <div class="goods-item" @click="itemClick">
        <img :src="goodsItem.show.img" alt="" @load="imgLoad">
        <div class="goods-item-content">
            <p>{{goodsItem.title}}</p>
            <span class="price">{{goodsItem.price}}</span>
            <span class="goods-collect">
                <img src="~assets/img/common/collect.svg" alt="" class="collect">
                <span>{{goodsItem.cfav}}</span>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    name: 'GoodsListItem',
    props: {
        goodsItem:{
            type:Object,
            default(){
                return {}
            }
        }
    },
    methods: {
        imgLoad(){
            this.$bus.$emit('itemImgLoad')
        },
        itemClick(){
            this.$router.push('/detail/'+this.goodsItem.iid);
        }
    }
}
</script>

<style scoped>

    .goods-item{
        width: 48%;
        text-align: center;
    }

    .goods-item img{
        width: 100%;
        border-radius: 5px;
    }

    .goods-item-content{
        bottom: 5px;
    }

    .goods-item p{
        white-space:nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
        font-size: 12px;
        padding-left: 5px;
    }

    .goods-item .price{
        color: var(--color-tint);
        font-size: 12px;
        padding-left: 10px;
    }

    .goods-item .collect{
        width: 12px;
    }

    .goods-item span{
        font-size: 12px;
    }

    .goods-collect{
        padding-left: 10px;
    }

</style>