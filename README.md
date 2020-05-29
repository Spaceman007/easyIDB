# easyIDB

to use indexedDB easily in everapi / evercraft

## usage

see how to use it in hello.js.

for example:
```js
let idb = new EasyIDB( 'Galaxy', 2 )

// create object store
idb.init([
    { name: 'parts', keyPath: 'uid', indexes: [ { name: 'name' } ] }
]).then( () => {
    console.log('indexedDB init successfully!')
}).catch( err => {
    conosle.error( err )
})

// add data
idb.openObjectStore('parts')

idb.add({ uid: 291898, name: 'Earth' }).then(() => {
    console.log('success')
}).catch(err => {
    console.error(err)
})
```

# develop
```
npm start
```
