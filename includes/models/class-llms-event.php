<?php
/**
 * LifterLMS Event Model
 *
 * @since [version]
 * @version [version]
 */

defined( 'ABSPATH' ) || exit;

/**
 * LifterLMS Event Model
 *
 * @since [version]
 */
class LLMS_Event extends LLMS_Abstract_Database_Store {

	/**
	 * Array of table column name => format
	 *
	 * @var  array
	 */
	protected $columns = array(
		'date' => '%s',
		'actor_id' => '%d',
		'object_type' => '%s',
		'object_id' => '%d',
		'event_type' => '%s',
		'event_action' => '%s',
	);

	/**
	 * Created date key name.
	 *
	 * @var string
	 */
	protected $date_created = 'date';

	/**
	 * Updated date not supported.
	 *
	 * @var null
	 */
	protected $date_updated = null;

	/**
	 * Database Table Name
	 * @var  string
	 */
	protected $table = 'events';

}
