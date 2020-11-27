export function testBeginTime(self, formKey, rule, value, callback) { // 第一个参数当前vue对象
  const beginKey = rule.field
  const endKey = beginKey.replace('begin', 'end')
  // console.log('开始时间',value,rule,beginKey,endKey)
  if (value === '') {
    callback()
  } else {
    if (self[formKey][endKey] !== '') {
      self.$refs[formKey].validateField(endKey)
    }
    callback()
  }
}
export function testEndTime(self, formKey, rule, value, callback) {
  const endKey = rule.field
  const beginKey = endKey.replace('end', 'begin')
  // console.log('结束时间',value,rule)
  const beginTime = self[formKey][beginKey]
  const endTime = value
  if (value === '') {
    // console.log('结束时间通过')
    callback()
  } else if (
    beginTime &&
    value &&
    new Date(beginTime).getTime() >= new Date(endTime).getTime()
  ) {
    // console.log('结束时间必须大于开始时间')
    callback(new Error('结束时间必须大于开始时间!'))
  } else {
    // console.log('结束时间通过')
    callback()
  }
}
export function testBeginNumber(self, formKey, rule, value, callback) {
  const beginKey = rule.field
  const endKey = beginKey.replace('start', 'end')
  if (value === '') {
    callback()
  } else if (value) {
    if (self[formKey][endKey] !== '') {
      self.$refs[formKey].validateField(endKey)
    }
    callback()
  } else {
    callback()
  }
}
export function testEndNumber(self, formKey, rule, value, callback) {
  const endKey = rule.field
  const beginKey = endKey.replace('end', 'start')
  const beginNumber = self[formKey][beginKey]
  if (value === '') {
    callback()
  } else {
    if (beginNumber && beginNumber >= value) {
      callback(new Error('结束数字必须大于开始数字!'))
    } else {
      callback()
    }
  }
}
