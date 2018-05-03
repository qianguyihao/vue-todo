<template>
  <div id="app">
     <!-- 单独铺一层绝对定位的 div，使背景虚化 -->
     <div class="cover"></div>  
   <Header></Header>
  <!--   <todo></todo> -->
    <Footer></Footer>
  </div>
</template>

<script>


//导入子组件。注意，Header 组件要大写，避免与默认的 header 标签冲突
import Header from './todo/header.vue'  
 import Footer from './todo/footer.jsx'
// import Todo from './todo/todo.vue'

export default {
  //【重要】要在 components 中声明子组件，才能在上面的
  components: {
    Header,
    Footer
    // Todo,
  }
}
</script>

<style lang="stylus" scoped>
// 设置与处理的语言为stylus。另外，scoped表示样式只在指定的组件中生效
#app{
  position absolute
  left 0
  right 0
  top 0
  bottom 0
}
.cover{
  position absolute
  left 0
  top 0
  right 0
  bottom 0
  background-color #999
  opacity .9
  z-index -1
}
</style>


