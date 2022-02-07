// type 是元素的类型
// props 是传递过去的属性
// children 是元素的内容或者它的子元素
export function h (type, props, children) {
  return {
    type,
    props,
    children
  }
}