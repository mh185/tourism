import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const KeyName = 'Token-Key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getKey() {
  return Cookies.get(KeyName)
}

export function setKey(key) {
  return Cookies.set(KeyName, key)
}

export function removeKey() {
  return Cookies.remove(KeyName)
}
