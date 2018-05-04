<template>
  <!-- 已经在输入框下方列出来的list/item。  -->
  <!-- class 通过 v-bind 的写法。里面可以传数组。数组里的第二个参数表示，要么加 class = completed，那么不加-->
  <div :class="['todo-item', todo.completed ? 'completed' : '']">
    <!-- item 左侧的checkbox标签。代表的是 todo.completed 里的值 -->
    <input 
      type="checkbox"
      class="toggle"
      v-model="todo.completed" 
    >

    <!-- item 的文字部分 --> 
    <label>{{todo.content}}</label>

    <!-- item 右侧的 叉叉 -->
    <button class="destory" @click="deleteTodo"></button>
  </div>
</template>

<script>
export default {
  props: {
    todo: {
      type: Object,
      required: true // required 表示这个参数一定要传入
    }
  },
  methods: {
    deleteTodo() {}
  }
};
</script>


// item的样式比较多，要详细看看
<style lang="stylus" scoped>
.todo-item {
  position: relative;
  background-color: #fff;
  font-size: 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);

  &:hover {
    .destory:after {
      content: '×';
    }
  }

  // item 的文字部分的样式
  label {
    white-space: pre-line;
    word-break: break-all;
    padding: 15px 60px 15px 15px;
    margin-left: 45px;
    display: block;
    line-height: 1.2;
    transition: color 0.4s;
  }

  &.completed {
    label {
      color: #d9d9d9;
      text-decoration: line-through;
    }
  }
}

.toggle {
  text-align: center;
  width: 40px;
  height: 40px;
  position: absolute;
  top: 0;
  bottom: 0;
  margin: auto 0;
  border: none;
  appearance: none;
  outline: none;

  &:after {
    content: url('../assets/images/round.svg'); // item左侧图标的圆圈
  }

  &:checked:after {
    content: url('../assets/images/done.svg'); // item左侧图标的对勾
  }
}

.destory {
  position: absolute;
  top: 0;
  right: 10px;
  bottom: 0;
  width: 40px;
  height: 40px;
  margin: auto 0;
  font-size: 30px;
  color: #cc9a9a;
  margin-bottom: 11px;
  transition: color 0.2s ease-out;
  background-color: transparent;
  appearance: none;
  border-width: 0;
  cursor: pointer;
  outline: none;
}
</style>


