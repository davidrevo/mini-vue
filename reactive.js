class Depend {
  constructor() {
    this.reactive = []
  }
  addDep (fn) {
    this.reactive.push(fn)
  }
  notify () {
    this.reactive.forEach(fn => fn())
  }
}

const dep = new Depend()

function watchFn (fn) {
  dep.addDep(fn)
}

const person = {
  name: '小红',
  sex: '女'
}

// 对person对象进行数据劫持
Object.keys(person).map(key => {
  let value = person[key]
  Object.defineProperty(person, key, {
    get () {
      return value
    },
    set (newValue) {
      value = newValue
      // 将我们的值设置完之后就执行我们上面的dep的notify方法重新执行响应式函数
      dep.notify()
    }
  })
})

// 注册监听
watchFn(function () {
  console.log(person.name);
})

watchFn(function () {
  console.log(person.name);
})

watchFn(function () {
  console.log(person.sex);
})

person.sex = '男'