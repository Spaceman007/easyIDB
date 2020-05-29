
/**
 * usage:
 *     let idb = new EasyIDB( 'EverCraft', 2 )
 *     idb.init( [ { name: 'parts', keyPath: 'uid' } ], onUpgrade )
 *     idb.openObjectStore('parts')
 *     idb.add( { uid: '9329', filename, url } )
 *     idb.deleteObjectStore('storeName')
 *     idb.deleteDatabase: delete this.DB
 */

class EasyIDB {
    constructor ( name, version ) {
        this.name = name
        this.version = version
        this.DB
        this.currentObjectStore
    }

    get valid () {
        return !!this.DB
    }

    /**
     * stores ( stores that need to be created ): [ { name, keyPath, indexes: [{ name, unique }], ...others } ]
     */
    init ( stores, onUpgrade ) {
        const scope = this

        if ( !window.indexedDB ) {
            console.warn( 'It seems that your browser does not support indexedDB!' )
            return
        }

        return new Promise( ( resolve, reject ) => {

            const request = window.indexedDB.open( scope.name, scope.version )

            request.onerror = function ( ev ) {
                reject( ev.target.error )
            }

            request.onupgradeneeded = function ( ev ) {
                let db = ev.target.result
                scope.DB = request.result

                if ( stores instanceof Array && stores.length > 0 ) {
                    stores.forEach( store => {
                        let { name, indexes, ...opts } = store
                        let objStore

                        if ( !db.objectStoreNames.contains( name ) ) {
                            objStore = db.createObjectStore( name, opts )

                            if ( indexes && indexes instanceof Array ) {
                                indexes.forEach( index => {
                                    if ( index.name ) {
                                        objStore.createIndex( index.name, index.name, { unique: index.unique } )
                                    }
                                } )
                            }

                        }
                    })
                }

                if ( onUpgrade ) {
                    onUpgrade()
                }
            }

            request.onsuccess = function ( ev ) {
                scope.DB = request.result
                resolve()
            }

        } )

    }

    openObjectStore ( storeName ) {
        if ( !storeName ) return

        this.currentObjectStore = storeName
    }

    get ( data, indexName ) {
        if ( !data ) return Promise( 'missing parameter!' )
        if ( !this.DB ) return Promise.reject( 'database does not exist!' )
        if ( !this.currentObjectStore ) return Promise.reject( 'objectStore does not exist!' )

        return new Promise( ( resolve, reject ) => {

            let transaction = this.DB.transaction( this.currentObjectStore, 'readonly' )
            let objStore = transaction.objectStore( this.currentObjectStore )
            let request

            if ( indexName ) {
                let index = objStore.index( indexName )
                request = index.get( data )
            } else {
                request = objStore.get( data )
            }

            request.onerror = function ( ev ) {
                reject( ev )
            }

            request.onsuccess = function ( ev ) {
                resolve( ev.target.result )
            }


        } )
    }

    add ( data ) {
        if ( !data ) return Promise( 'missing parameter!' )
        if ( !this.DB ) return Promise.reject( 'database does not exist!' )
        if ( !this.currentObjectStore ) return Promise.reject( 'objectStore does not exist!' )

        return new Promise( ( resolve, reject ) => {
            let transaction = this.DB.transaction( this.currentObjectStore, 'readwrite' )
                .objectStore( this.currentObjectStore )
                .add( data )

            transaction.onsuccess = function () {
                resolve()
            }

            transaction.onerror = function ( err ) {
                reject( err.target.error )
            }
        } )
    }

    put ( data ) {
        if ( !data ) return Promise( 'missing parameter!' )
        if ( !this.DB ) return Promise.reject( 'database does not exist!' )
        if ( !this.currentObjectStore ) return Promise.reject( 'objectStore does not exist!' )

        return new Promise( ( resolve, reject ) => {
            let transaction = this.DB.transaction( this.currentObjectStore, 'readwrite' )
                .objectStore( this.currentObjectStore )
                .put( data )

            transaction.onsuccess = function () {
                resolve()
            }

            transaction.onerror = function ( err ) {
                reject( err.target.error )
            }
        } )
    }

    remove ( data ) {
        if ( !data ) return Promise( 'missing parameter!' )
        if ( !this.DB ) return Promise.reject( 'database does not exist!' )
        if ( !this.currentObjectStore ) return Promise.reject( 'objectStore does not exist!' )

        return new Promise( ( resolve, reject ) => {
            let transaction = this.DB.transaction( this.currentObjectStore, 'readwrite' )
                .objectStore( this.currentObjectStore )
                .delete( data )

            transaction.onsuccess = function () {
                resolve()
            }

            transaction.onerror = function ( err ) {
                reject( err )
            }
        } )
    }

    // only valid onupgradeneeded
    deleteObjectStore ( storeName ) {
        if ( !storeName ) {
            storeName = this.currentObjectStore
        }

        if ( !this.DB || !storeName ) return Promise.reject('missing store or database')

        this.DB.deleteObjectStore( storeName )  // `deleteObjectStore` has no callbacks
    }

    // clear datas in object store
    clearObjectStore ( storeName ) {
        if ( !storeName ) {
            storeName = this.currentObjectStore
        }

        if ( !this.DB || !storeName ) return Promise.reject('missing store or database')

        return new Promise( ( resolve, reject ) => {
            let transaction = this.DB.transaction( storeName, 'readwrite' )
            let objStore = transaction.objectStore( storeName )
            let request = objStore.clear()

            request.onerror = function ( err ) {
                reject( err )
            }

            request.onsuccess = function () {
                resolve()
            }
        } )
    }

    close () {
        if ( this.DB ) {
            this.DB.close()
        }
    }

    // delete this database
    deleteDatabase () {
        if ( !this.name ) return

        this.close()

        const request = window.indexedDB.deleteDatabase( this.name )

        return new Promise( ( resolve, reject ) => {

            request.onerror = function ( err ) {
                reject( err )
            }

            request.onsuccess = function () {
                resolve()
            }
        } )
    }

}

export default EasyIDB
