import { debounce } from "./utils"

export const itemListenerMixin = {
    mounted () {
        let newRefresh = debounce(this.$refs.scroll.refresh,100);
        this.itemImgListener = () => {
            newRefresh()
        };
        this.$bus.$on('itemImgLoad',this.itemImgListener);
        // console.log('我是混入中的内容')
    }
}