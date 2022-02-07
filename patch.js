// n1: 旧的VNodes
// n2: 新的VNodes
function patch (n1, n2) {
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
  }
}