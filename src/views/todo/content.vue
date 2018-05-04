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
      @keyup.enter="addTodoItem"
    >

    <!-- 通过循环，将底部的 各个 item 遍历出来。疑问：第一个属性的含义是？ -->
    <!-- 如果要删除某个item，可以通过 v-on:delItem 来监听子组件的删除操作，并传入id -->
    <Item 
      :todo="todo"   
      v-for="todo in filteredTodos"
      :key="todo.id"
      @delItem="delTodoItem" 
    >    
    </Item>  


    <Tabs 
      :filter="filter" 
      :todoDatas="todoDatas"
      @toggle="toggleFilter"
      @clearAllCompleted="clearAllCompleted"
    >    
      
    </Tabs>

  </section>
</template>

<script>
import Item from "./item.vue";
import Tabs from "./tabs.vue";

let id = 0;
export default {
  data() {
    return {
      todoDatas: [],
      filter: "all"
    };
  },
  components: {
    Item, //自定义的子组件 Item
    Tabs //自定义的子组件 tabs
  },
  computed: {
    //已经被过滤过的todos
    filteredTodos() {
      //情况一：显示全部的items
      if (this.filter === "all") {
        return this.todoDatas;
      }
      //情况二：
      const completed = this.filter === "completed";
      return this.todoDatas.filter(todo => completed === todo.completed);
    }
  },
  methods: {
    addTodoItem(e) {
      //e 指的是 event 对象
      this.todoDatas.unshift({
        //unshift()：在在数组的最前面插入一个item
        id: id++, //每个item都有一个id。最开始的时候，id为0，新来的item，让id加一
        content: e.target.value.trim(), //获取输入框中的内容
        completed: false //新的item，默认都是未完成的状态
      });
      e.target.value = ""; //item添加完成后，清空输入框
    },
    delTodoItem(id) {
      this.todoDatas.splice(
        this.todoDatas.findIndex(todo => todo.id === id),
        1
      ); //通过数组的 splice方法，删除item
    },
    toggleFilter(state) {
      this.filter = state;
    },
    clearAllCompleted() {
      this.todoDatas = this.todoDatas.filter(todo => !todo.completed); //给todoDatas赋一个过滤之后的新的值
    }
  }
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


