<template>
<!-- content中的按钮部分：all、active、completed、clear completed 这些按钮 -->
  <div class="helper">
    <span class="left">{{unFinishedTodoLength}} items left</span>
    <!-- 【重要】all、active、completed这三个tab，我们只用一个span标签即可，通过 v-for的形式将数组展现出来 -->
    <span class="tabs">
      <!-- （1）通过 v-for 的形式展现三个tab-->
      <!-- （2）加上 :key 属性，去复用节点 -->
      <!-- （3）因为有选中和未选中的状态，所以要加上 :class 属性。首先有一个 state 属性，然后根据传进来的 filter判断是否跟当前 state一致 -->
      <!-- （4）最后，加上 click 事件，将 state传给组件 -->
      <span
        v-for="state in states"
        :key="state"   
        :class="[state, filter === state ? 'actived' : '']"
        @click="toggleFilter(state)"
      >
        {{state}}
      </span>
    </span>
    <!-- 标签：clear completed 这个按钮 -->
    <span class="clear" @click="clearAllCompleted">Clear Completed</span>
  </div>
</template>

<script>
export default {
  props: {
    // filter属性是上层组件传递进来的
    filter: {
      type: String,
      required: true
    },
    todoDatas:{
      type:Array,
      required:true
    }
  },
  data() {
    return {
      states: ["all", "active", "completed"]
    };
  },
  computed:{
    unFinishedTodoLength(){
      // filter之后，会得到一个新的数组。将新数组的长度返回，然后就可以在上方的 class="left" 标签中使用
      return this.todoDatas.filter(todo => !todo.computed).length
    }
  },
  methods: {
    clearAllCompleted() {
      this.$emit('clearAllCompleted');

    },
    toggleFilter(state) {
      this.$emit('toggle',state);  //传递出去的值，就是下一个 filter 的状态
    }
  }
};
</script>

<style lang="stylus" scoped>
.helper {
  font-weight: 100;
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
  line-height: 30px;
  background-color: #fff;
  font-size: 14px;
  font-smoothing: antialiased;
}

.left, .clear, .tabs {
  padding: 0 10px;
  box-sizing: border-box;
}

.left, .clear {
  width: 150px;
}

.left {
  text-align: left;
}

.clear {
  text-align: right;
  cursor: pointer;
}

.tabs {
  width: 200px;
  display: flex;
  justify-content: space-around;

  * {
    display: inline-block;
    padding: 0 10px;
    cursor: pointer;
    border: 1px solid rgba(175, 47, 47, 0);

    &.actived {
      border-color: rgba(175, 47, 47, 0.4);
      border-radius: 5px;
    }
  }
}
</style>


