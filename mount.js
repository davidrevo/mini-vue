export function mountEl (vnode, container) {
  const el = vnode.el = document.createElement(vnode.type)
  // 判断是否有传入属性
  if (vnode.props) {
    // 拿到所有的key
    for (const key in vnode.props) {
      // 这里需要对key进行判断，判断是否有以on开头的事件，如果有要单独处理
      if (key.startsWith('on')) {
        // 将前面两位on截掉，并且转换成小写，给el添加事件属性
        el.addEventListener(key.slice(2).toLowerCase(), vnode.props[key])
      } else {
        // 给el添加属性
        el.setAttribute(key, vnode.props[key])
      }
    }
  }

  // 判断是否有子元素
  if (vnode.children) {
    // 判断子元素类型，如果传过来的子元素类型是字符串，则直接做为el的textContent属性
    if (typeof vnode.children === 'string') {
      el.textContent = vnode.children
    } else {
      // 这里不考虑对象或者其他的类型
      // 如果有其他的子节点就进行递归调用，不对插槽和其他情况进行边界处理
      vnode.children.forEach(item => {
        // 将递归创建出来的元素挂载到 el 元素下面
        mountEl(item, el)
      })
    }
  }

  // 最后将创建出来的el元素挂载到container上
  container.appendChild(el)
}