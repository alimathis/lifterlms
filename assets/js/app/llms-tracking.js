/* global LLMS, $ */

/**
 * User event/interaction tracking.
 *
 * @since [version]
 */
LLMS.Tracking = function() {

	var self = this,
		store = new LLMS.Storage( 'llms-tracking' );

	/**
	 * Initialize / Bind all tracking event listeners.
	 *
	 * @since [version]
	 *
	 * @return {[type]}
	 */
	function init() {

		console.log( store.get( 'events' ) );

		// Page load event goes in here since this all loads on page load.
		self.addEvent( 'page.load' );

		// Other event listeners.
		window.addEventListener( 'beforeunload', onBeforeUnload );
		window.addEventListener( 'unload', onUnload );
		document.addEventListener( 'visibilitychange', onVisibilityChange );

	};

	/**
	 * Add an event.
	 *
	 * @since [version]
	 *
	 * @param string|obj event Event Id (type.event) as a full event object from `this.makeEventObj()`.
	 * @param int obj_id Optional object ID.
	 */
	this.addEvent = function( event, obj_id ) {

		event = 'string' === typeof event ? self.makeEventObj( event, obj_id ) : event;

		var all = store.get( 'events', [] );
		all.push( event );
		store.set( 'events', all );

	}

	/**
	 * Create an event object suitable to save as an event.
	 *
	 * @since [version]
	 *
	 * @param string event Event id (type.event) EG: `page.load`.
	 * @param int obj_id Optional object ID.
	 * @return obj
	 */
	this.makeEventObj = function( event, obj_id ) {
		return {
			obj_id: obj_id,
			url: window.location.href,
			event: event,
			time: new Date().getTime() / 1000,
		};
	}


	/**
	 * Remove the visibility change event listener on window.beforeunload
	 *
	 * Prevents actual unloading from recording a blur event from the visibility change listener
	 *
	 * @since [version]
	 *
	 * @param obj e JS event object.
	 * @return void
	 */
	function onBeforeUnload( e ) {
		document.removeEventListener( 'visibilitychange', onVisibilityChange );
	}

	/**
	 * Record a `page.exit` event on window.unload.
	 *
	 * @since [version]
	 *
	 * @param obj e JS event object.
	 * @return void
	 */
	function onUnload( e ) {
		self.addEvent( 'page.exit' );
	}

	/**
	 * Record `page.blur` and `page.focus` events via document.visilibitychange events.
	 *
	 * @since [version]
	 *
	 * @param obj e JS event object.
	 * @return void
	 */
	function onVisibilityChange( e ) {

		var event = document.hidden ? 'page.blur' : 'page.focus';
		self.addEvent( event );

	}

	// Go.
	init();

};

window.llms = window.llms || {};
llms.tracking = new LLMS.Tracking();
