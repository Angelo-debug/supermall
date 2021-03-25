<template>
    <div class="bottom-bar">
        <div class="check-content">
            <check-button :is-checked="isSelectAll"
                           class="check-button"
                           @click.native = "checkClick" 
                           />
            <span>全选</span>
        </div>
        <div class="price">
            合计: {{totalPrice}}
        </div>
        <div class="calculate" @click="calcClick">
            去计算({{checkLength}})
        </div>
    </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'


export default {
    name: 'CartBottomBar',
    components: {
        CheckButton
    },
    computed: {
        totalPrice(){
            return '￥'+this.$store.state.cartList.filter(item => {
                return item.checked
            }).reduce((preValue,item) => {
                return preValue + item.realPrice * item.count
            },0).toFixed(2)
        },
        checkLength(){
            return this.$store.state.cartList.filter(item => item.checked).length;
        },
        isSelectAll(){
            // return !(this.$store.state.cartList.filter(item => !item.checked).length)
            if(this.$store.state.cartList.length === 0) return false;
            return !this.$store.state.cartList.find(item => !item.checked)
        }
    },
    methods: {
        checkClick(){
            if(this.isSelectAll){     //全部选中
                this.$store.state.cartList.forEach(item => item.checked = false)
            }else{                    //部分或全部不选中
                this.$store.state.cartList.forEach(item => item.checked = true)
            }
        },
        calcClick(){
            if(!this.isSelectAll){
                this.$toast.show('请选择购买的商品',1500)
            }
        }
    }
}
</script>

<style scoped>
    .bottom-bar{
        height: 40px;
        background: #eee;
        position: relative;
        bottom: 40px;
        display: flex;
    }

    .check-content{
        /* height: 40px;
        width: 60px; */
        display: flex;
        /* justify-content: center; */
        align-items: center;
        margin-left: 10px;
       
    }

    .check-button{
        width: 20px;
        height: 20px;
        margin-right: 5px;
    }

    .price{
        display: flex;
        align-items: center;
        margin-left: 10px;
        flex: 1;
    }

    .calculate{
        display: flex;
        align-items: center;
        justify-content: center;
        width:90px;
        background: red;
        color: #eee;
        font-size: 15px;
    }

</style>