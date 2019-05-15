/* global LLMS, $ */

/**
 * Store information in Local Storage by group.
 *
 * @since [version]
 *
 * @param string group Storage group id/name.
 */
LLMS.Storage = function( group, persist ) {

	var store = window.localStorage;

	/**
	 * Retrieve (and parse) all data stored for the group.
	 *
	 * @since [version]
	 *
	 * @return obj
	 */
	function getAll() {
		return JSON.parse( store.getItem( group ) ) || {};
	}

	/**
	 * Clear local storage for the group.
	 *
	 * @since [version]
	 *
	 * @return void
	 */
	this.clear = function() {
		store.removeItem( group );
	};

	/**
	 * Retrieve an item from the group by key.
	 *
	 * @since [version]
	 *
	 * @param string key Item key/name.
	 * @param mixed default_val Item default value to be returned when item not found in the group.
	 * @return mixed
	 */
	this.get = function( key, default_val ) {
		var data = getAll();
		return data[ key ] ? data[ key ] : default_val;
	}

	/**
	 * Store an item in the group by key.
	 *
	 * @since [version]
	 *
	 * @param string key Item key name.
	 * @param mixed val Item value
	 * @return void
	 */
	this.set = function( key, val ) {
		var data = getAll();
		data[ key ] = val;
		store.setItem( group, JSON.stringify( data ) );
	};

}
