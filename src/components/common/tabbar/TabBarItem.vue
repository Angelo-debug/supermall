<template>
    <div class="tab-bar-item" @click="itemClick">
        <slot v-if="!isActive" name="item-icon"></slot>
        <slot v-else name="item-icon-active"></slot>
        <div :style="activeStyle">
            <slot name="item-text"></slot>
        </div>
    </div>
</template>

<script>
export default {
  name: 'TabBarItem',
  props: {
      path: String,
      activeColor:{
          type:String,
          default:'red'
      }
  },
  data () {
      return {
        //   isActive:false,
      }
  },
  computed: {
      isActive(){
          return this.$route.path.indexOf(this.path) !== -1
      },
      activeStyle(){
          return this.isActive ? {color: this.activeColor}:{}
      }
  },
  methods: {
      itemClick(){
          this.$router.replace(this.path)
        //  this.$router.replace(this.path).catch(err =>'')
      }
  }
}
</script>

<style>
  .tab-bar-item{
    flex: 1;
    text-align: center;
    height: 49px;
    font-size: 13px;    
  }

  .tab-bar-item img{
    width: 24px;
    height: 24px;
    margin-top: 3px;
    vertical-align: middle;
    margin-bottom: 2px;
  }

  /* .active{
      color: red;
  } */

</style>
