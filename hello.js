
import EasyIDB from './src/index'

let idb
let version = 2

async function hello () {
    await idb.init([
        { name: 'parts', indexes: [ { name: 'name' } ], keyPath: 'uid' }
    ]).then(() => {
        console.log('idb init successfully!')
    }).catch(err => {
        console.error(err)
    })
}

document.addEventListener( 'DOMContentLoaded', async () => {
    idb = new EasyIDB('EverEasyIDB', version)
    window.idb = idb
    await hello()
    initDOM()
} )

function initDOM () {
    let btnAdd = document.querySelector('#add')
    let btnRemove = document.querySelector('#remove')
    let btnClear = document.querySelector('#clear')
    let btnUpdate = document.querySelector('#update')
    let btnGetFirst = document.querySelector('#getFirst')
    let btnDeleteDB = document.querySelector('#deleteDB')
    let btnDeleteObjectStore = document.querySelector('#deleteObjectStore')
    let btnCreateObjectStore = document.querySelector('#createObjectStore')

    btnAdd.onclick = add
    btnRemove.onclick = remove
    btnClear.onclick = clear
    btnUpdate.onclick = update
    btnGetFirst.onclick = getFirst
    btnDeleteDB.onclick = deleteDB
    btnDeleteObjectStore.onclick = deleteObjectStore
    btnCreateObjectStore.onclick = createObjectStore
}

function openObjectStore () {
    idb.openObjectStore('parts')
}

function add () {
    console.log('add')
    openObjectStore()

    idb.add({ uid: 291898, name: 'Earth' }).then(() => {
        console.log('success')
    }).catch(err => {
        console.error(err)
    })
}

function remove () {
    openObjectStore()
    idb.remove(291898).then(() => {
        console.log('delete successfully!')
    }).catch(err => {
        console.error( err )
    })
}

async function clear () {
    openObjectStore()
    idb.clearObjectStore().then(() => {
        console.log('clear successfully!')
    }).catch(err => {
        console.error( err )
    })
}

function update () {
    openObjectStore()
    idb.put({ uid: 291898, age: 98 }).then(() => {
        console.log('update successfully!')
    }).catch(err => {
        console.error( err )
    })
}

function getFirst () {
    openObjectStore()

    let query = 'Earth'
    // let query = 291898

    // the second argument: indexName
    idb.get(query, 'name').then(ret => {
        console.log(ret)
    }).catch(err => {
        console.error(err)
    })
}

function deleteDB () {
    idb.deleteDatabase().then( () => {
        console.log( 'delete database successfully!' )
    } ).catch( err => {
        console.error( err )
    } )
}

function deleteObjectStore () {
    console.log( 'delete object store' )

    if ( idb ) {
        idb.close()
    }

    version++

    idb = new EasyIDB( 'EverEasyIDB', version )

    idb.init( null, () => {
        idb.deleteObjectStore( 'parts' )
    } )

}

function createObjectStore () {
    console.log( 'createObjectStore' )

    if ( idb ) {
        idb.close()
    }

    version++

    idb = new EasyIDB( 'EverEasyIDB', version )

    idb.init( [
        { name: 'parts', indexes: [ { name: 'name' } ], keyPath: 'uid' }
    ] ).then( () => {
        console.log('idb init successfully!')
    } ).catch( err => {
        console.error( err )
    } )

}
