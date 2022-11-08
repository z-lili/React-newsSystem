import Zrequest from "./request/request"
import { BASE_URL } from './request/config'
// import useUtiles from './useUtiles.js'

// const { turnSpin } = useUtiles()`

const zrequest = new Zrequest({
  baseURL: BASE_URL
}, (config) => {
  // turnSpin()
  return config
}, (config) => {
  // turnSpin()
  return config
})


export default zrequest