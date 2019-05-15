<?php
/**
 * LifterLMS Event management.
 *
 * @package  LifterLMS/Classes
 *
 * @since [version]
 * @version [version]
 */

defined( 'ABSPATH' ) || exit;

/**
 * LLMS_Events class..
 *
 * @since [version]
 */
class LLMS_Events {

	/**
	 * Singleton instance
	 *
	 * @var  null
	 */
	protected static $_instance = null;

	/**
	 * Get Main Singleton Instance.
	 *
	 * @since [version]
	 *
	 * @return LLMS_Events
	 */
	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	/**
	 * Private Constructor.
	 *
	 * @since [version]
	 *
	 * @return void
	 */
	private function __construct() {

		add_action( 'wp_login', array( $this, 'on_signon' ), 10, 2 );
		add_action( 'clear_auth_cookie', array( $this, 'on_signout' ) );

	}

	/**
	 * Record account.signon event via `wp_login` hook.
	 *
	 * @since [version]
	 *
	 * @param string $username WP_Users's user_login.
	 * @param WP_User $user User object.
	 * @return void
	 */
	public function on_signon( $username, $user ) {

		$this->record( array(
			'actor_id' => $user->ID,
			'object_type' => 'user',
			'object_id' => $user->ID,
			'event_type' => 'account',
			'event_action' => 'signon',
		) );

	}

	/**
	 * Record an account.signout event via `wp_logout()`
	 *
	 * @since [version]
	 *
	 * @return void
	 */
	public function on_signout() {

		$uid = get_current_user_id();

		$this->record( array(
			'actor_id' => $uid,
			'object_type' => 'user',
			'object_id' => $uid,
			'event_type' => 'account',
			'event_action' => 'signout',
		) );

	}

	/**
	 * Store an event in the database.
	 *
	 * @since [version]
	 *
	 * @param array $args {
	 *     Event data
	 *
	 *     @type int $actor_id WP_User ID.
	 *     @type string $object_type Type of object being acted upon (post,user,comment,etc...).
	 *     @type int $object_id WP_Post ID, WP_User ID, WP_Comment ID, etc...
	 *     @type string $event_type Type of event (account, page, course, etc...).
	 *     @type string $event_action The event action or verb (signon,viewed,launched,etc...).
	 * }
	 * @return [type]
	 */
	public function record( $args = array() ) {

		$err = new WP_Error();

		foreach ( array( 'actor_id', 'object_type', 'object_id', 'event_type', 'event_action' ) as $key ) {
			if ( ! in_array( $key, array_keys( $args ), true ) ) {
				// Translators: %s = key name of the missing field.
				$err->add( 'missing-field', sprintf( __( 'Missing required field: "%s"', 'lifterlms' ), $key ) );
			}
		}

		if ( $err->get_error_codes() ) {
			return $err;
		}

		$event = new LLMS_Event();
		if ( ! $event->setup( $args )->save() ) {
			$err->add( 'error', __( 'An unknown error occurred during event creation.', 'lifterlms' ) );
			return $err;
		}

		return $event;

	}

}
