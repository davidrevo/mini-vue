const person = {
  name: '小红',
  age: 20,
  sex: '女'
}

Object.keys(person).map(key => {
  let value = person[key]
  Object.defineProperty(person, key, {
    get () {
      console.log('执行了取值方法', key);
      return value
    },
    set (newValue) {
      console.log('执行了赋值方法', newValue);
      value = newValue
    }
  })
})

person.sex = '男'
console.log(person.name);