import './css/main/base.css'


document.getElementById('btn').onclick = function () {
  import('./handle').then(fn => fn.default())
}


export default function A (){
  console.log('a.js')
}