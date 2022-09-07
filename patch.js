import { mountEl as mount } from './mount.js'
// n1: 旧的VNodes
// n2: 新的VNodes
export function patch (n1, n2) {
  // 如果两个类型不一样，那么就卸载n1，挂载n2
  if (n1.type !== n2.type) {
    // 拿到n1的父元素，在父元素卸载n1
    const n1ElParent = n1.el.parentElement
    // 卸载n1
    n1ElParent.removeChild(n1.el)
    // 挂载n2到n1ElParent
    mount(n2, n1ElParent)
  } else {
    // 首先，拿到n1的el对象，然后保存到n2上面，这里修改el，n2里面的el也会同时改变，因为指向同一个内存地址
    const el = n2.el = n1.el
    // 拿到n1和n2的props
    const oldProps = n1.props || {}
    const newProps = n2.props || {}
    // 判断两个对象之间属性的差异
    for (const key in newProps) {
      const oldValue = oldProps[key]
      const newValue = newProps[key]
      // 如果他们之间的属性值不一样，就进行替换
      if (newValue !== oldValue) {
        // 这里还是对事件进行判断
        if (key.startsWith('on')) {
          el.addEventListener(key.slice(2).toLowerCase(), newValue)
        } else {
          el.setAttribute(key, newValue)
        }
      }
    }

    // 删除旧VNodes上面的属性
    for (const key in oldProps) {
      const oldValue = oldProps[key]
      if (key.startsWith('on')) {
        el.removeEventListener(key.slice(2).toLowerCase(), oldValue)
      }
      if (!(key in newProps)) {
        el.removeAttribute(key)
      }
    }

    // 对两个VNodes的children进行处理
    // 如果n2.children的类型为string，那么直接替换掉n1的子元素
    const oldChildren = n1.children || []
    const newChildren = n2.children || []
    if (typeof newChildren === 'string') {
      // 也可以对n1的children进行类型判断，可以做一定程度的优化
      if (typeof oldChildren === "string") {
        // 如果都为字符串类型，那么就只有当他们之间的值不一样的时候才进行替换
        if (newChildren !== oldChildren) {
          el.textContent = newChildren
        }
      } else {
        // 如果oldChildren类型不为字符串，则直接将n1的innerHTML更换为newChildren
        el.innerHTML = newChildren
      }
    } else {
      // 如果newChildren的类型不为字符串，那么就判断oldChildren的类型是否为字符串
      // 注意：这里不会对其他类型进行考虑，例如插槽的对象类型，这里只对字符串和数组类型进行判断
      if (typeof oldChildren === 'string') {
        // 如果oldChildren的类型为字符串，就将newChildren的元素挂载到el上面
        el.innerHTML = ''
        newChildren.forEach(item => mount(item.el, el))
      } else {
        // 如果newChildren和oldChildren都为数组
        // oldChildren：[v1,v5,v6,v7,v8]
        // newChildren：[v1,v2,v3]
        // 拿两个数组之间长度最短的值
        const minLength = Math.min(newChildren.length, oldChildren.length)
        for (let i = 0; i < minLength; i++) {
          // 获取他们之间的VNode进行patch递归调用
          patch(oldChildren[i], newChildren[i])
        }

        // 如果oldChildren的长度比newChildren的长度长，那么就卸载多出来的VNode
        if (newChildren.length < oldChildren.length) {
          oldChildren.slice(newChildren.length).forEach(item => el.removeChild(item.el))
        }

        // 如果newChildren的长度比oldChildren的长度长，那么就挂载元素
        if (newChildren.length > oldChildren.length) {
          newChildren.slice(oldChildren.length).forEach(item => mount(item, el))
        }
      }
    }
  }
}