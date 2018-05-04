<template>
  <section class="content">
    <!-- 输入框标签-->
    <!-- autofocus属性：页面进来后，自动选中 -->
    <!-- placeholder属性：hint提示文字 -->
    <!-- @keyup事件的写法等价于 v-on:keyup。enter是事件的修饰符 -->
    <input
      type="text"
      class="input-add"
      autofocus="autofocus"   
      placeholder="接下来要做什么？"
      @keyup.enter="addTodo"
    >
    <Item :todo="todo">    </Item>   
    <Tabs :filter="filter"> </Tabs>

  </section>
</template>

<script>
import Item from "./item.vue";
import Tabs from "./tabs.vue";
export default {
  data() {
    return {
      todo: {
        id: 0,
        content: "this is todo item",
        completed: false
      },
      filter:'all'
    };
  },
  components: {
    Item, //自定义的子组件 Item
    Tabs //自定义的子组件 tabs
  },

  methods: {}
};
</script>

<style lang="stylus" scoped>
.content {
  width: 600px;
  margin: 0 auto;
  box-shadow: 0 0 5px #666;
}

// 输入框的样式
.input-add {
  position: relative;
  margin: 0;
  width: 100%;
  font-size: 24px;
  font-family: inherit;
  font-weight: inherit;
  line-height: 1.4em;
  border: 0;
  outline: none;
  color: inherit;
  padding: 6px;
  border: 1px solid #999;
  box-shadow: inset 0 -1px 5px 0 rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  font-smoothing: antialiased;
  padding: 16px 16px 16px 60px;
  border: none;
  box-shadow: inset 0 -2px 1px rgba(0, 0, 0, 0.03);
}
</style>


