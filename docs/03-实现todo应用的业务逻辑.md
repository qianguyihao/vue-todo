
## 前言

todo项目的业务逻辑主要集中在了`content.vue`这个文件中。


### 添加item

在`content.vue`中进行`addTodoItem()`操作。

###item左侧的对勾

已经进行了双向数据绑定。

### item右侧的xx按钮

想要删除某个 item，需要在`content.vue`中操作，不能在`item.vue`中操作。具体做法为：

在`item.vue`中，通过 emit 将删除操作传递给父组件`content.vue`，父组件监听之后，通过 数组的 splice 方法进行删除。


### tabs.vue中：xxx items left 

我们只用筛选 `completed === false`的节点即可。具体做法：

（1）在 `content.vue`组件的<tabs>标签里，通过`:todoDatas="todoDatas""`将 todoDatas传递给子组件`tabs.vue`

（2）在子组件`tabs.vue`中，通过 computed 去计算，还有多少个未完成的item。

（3）在 computed里的方法中进行 filter。filter之后，会得到一个新的数组。将新数组的长度返回，然后就可以在上方的 class="left" 标签中使用。


### all、active、completed按钮的切换

需要在`tabs.vue`中通过`@click="toggleFilter(state)"`进行绑定。

···

最后在 `content.vue`中，将 item的遍历，从` v-for="todo in todoDatas"`改为`v-for="todo in filteredTodos"`。


### clear completed

（1）在 `tabs.vue`中做清除操作clearAllCompleted()即可，不需要传递参数出去。

（2）






















