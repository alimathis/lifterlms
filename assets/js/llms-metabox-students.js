/**
 * LifterLMS Students Metabox Functions
 *
 * @since 3.0.0
 * @since 3.33.0 Added the logic to handle the Student's enrollment deletion.
 */
( function( $, undefined ) {

	window.llms = window.llms || {};

	var MetaboxStudents = function() {

		/**
		 * Initialize
		 * @return void
		 * @since  3.0.0
		 * @version  3.0.0
		 */
		this.init = function() {

			var screens = [ 'course', 'llms_membership' ];

			if ( window.llms.post.post_type && -1 !== screens.indexOf( window.llms.post.post_type ) ) {

				this.$metabox = $( '#lifterlms-students' );

				this.bind();
			}

		};

		/**
		 * Bind dom events
		 *
		 * @since 3.0.0
		 * @since 3.4.0 Unknown.
		 * @since 3.33.0 Added enrollment deletion handlers.
		 *
		 * @return void
		 */
		this.bind = function() {

			var self = this;

			this.$metabox.on( 'click', 'a.llms-remove-student', function( e ) {
				e.preventDefault();
				self.remove_student( $( this ) );
			} );

			this.$metabox.on( 'click', 'a.llms-delete-enrollment', function( e ) {
				e.preventDefault();
				self.delete_student_enrollment( $( this ) );
			} );

			this.$metabox.on( 'click', 'a.llms-add-student', function( e ) {
				e.preventDefault();
				self.add_student( $( this ) );
			} );

			$( '#llms-add-student-select' ).llmsStudentsSelect2( { multiple: true } );

			$( '#llms-enroll-students' ).on( 'click', function() {
				self.enroll_students( $( this ) );
			} );

		};

		/**
		 * Add a Student
		 * @param    obj  $el  jQuery selector of the add button
		 * @since    3.0.0
		 * @version  3.0.0
		 */
		this.add_student = function( $el ) {
			this.update_student_enrollment( $el.attr( 'data-id' ), 'add' );
		};

		/**
		 * Handle bulk enrollment via "Enroll New Students" area
		 * @param    obj   $el  jQuery selector for the triggering button
		 * @return   void
		 * @since    3.0.0
		 * @version  3.4.0
		 */
		this.enroll_students = function( $el ) {

			var self = this,
				$select = $( '#llms-add-student-select' ),
				ids = $select.val(),
				$container = this.$metabox.find( '.llms-metabox-students-add-new' );

			LLMS.Spinner.start( $container );

			window.LLMS.Ajax.call( {
				data: {
					action: 'bulk_enroll_students',
					student_ids: ids,
				},
				beforeSend: function( xhr ) {
					if ( ! ids ) {
						$el.before( '<span class="llms-error">' + LLMS.l10n.translate( 'Please select a student to enroll' ) + '</span>' );
						xhr.abort();
						LLMS.Spinner.stop( $container );
					}
				},
				success: function( r ) {

					$select.val( null ).trigger( 'change' );
					LLMS.Spinner.stop( $container );
					window.llms.admin_tables.reload( $( '#llms-gb-table-student-management' ) );

				},
			} );



		};

		/**
		 * Remove a Student
		 * @param    obj  $el  jQuery selector of the add button
		 * @since    3.0.0
		 * @version  3.0.0
		 */
		this.remove_student = function( $el ) {
			this.update_student_enrollment( $el.attr( 'data-id' ), 'remove' );
		};

		/**
		 * Delete a Student's enrollment.
		 *
		 * @since 3.33.0
		 *
		 * @param  obj  $el  jQuery selector of the add button.
		 * @return void
		 */
		this.delete_student_enrollment = function( $el ) {
			this.update_student_enrollment( $el.attr( 'data-id' ), 'delete' );
		};

		/**
		 * Execute AJAX call, add spinners, update html view
		 *
		 * @since 3.0.0
		 *
		 * @param int id Student id.
		 * @param string status New status [add|remove|delete].
		 * @return void
		 */
		this.update_student_enrollment = function( id, status ) {

			var $table = $( '#llms-gb-table-student-management' ),
				$container = $table.closest( '.llms-table-wrap' );

			LLMS.Spinner.start( $container );

			window.LLMS.Ajax.call( {
				data: {
					action: 'update_student_enrollment',
					status: status,
					student_id: id,
				},
				success: function() {
					// spinner doesn't stop because the table reloader will stop it
					window.llms.admin_tables.reload( $table );
				},
			} );

		};


		// go
		this.init();

	};

	// initialize the object
	window.llms.MetaboxStudents = new MetaboxStudents();

} )( jQuery );
