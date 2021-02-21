<template>
    <div id="detail">
        <nav-bar>
            <div slot="left" class="back" @click="backClick">
                <img src="~assets/img/common/back.svg" alt="">
            </div>
            <div slot="center" class="title">
                <div v-for="(item,index) in titles"
                     class="title-item"
                     :class="{active: index == currentIndex}"
                     @click="titleSelect(index)"
                     >{{item}}
                 </div>
            </div>
        </nav-bar>
    </div>
</template>

<script>
import NavBar from 'components/common/navbar/NavBar'

export default {
    name: 'DetailNavBar',
    components: {
        NavBar
    },
    data () {
        return {
            titles: ['商品','参数','评论','推荐'],
            currentIndex: 0
        }
    },
    methods: {
        titleSelect(index){
            this.currentIndex = index;
        },
        backClick(){
            this.$router.back();
        }
    }
}
</script>

<style scoped>
    .title{
        display: flex;
    }

    .title-item{
        flex: 1;
        font-size: 14px;
    }

    .back img{
        width: 15px;
        margin-top: 14px;
    }

    .active{
        color: var(--color-tint);
    }

</style>