import { h } from './h.js'

function render () {
  // h函数接收三个参数 type、props和children
  // 执行h函数生成vnode然后返回
  return h("h2", { class: "title" }, "Hello Render")
}

console.log(render())