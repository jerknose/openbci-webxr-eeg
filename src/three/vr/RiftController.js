/**
 * @author mrdoob / http://mrdoob.com
 * @author stewdio / http://stewd.io
 */

THREE.RiftController = function ( id ) {

	THREE.Object3D.call( this );

	var scope = this;
	var gamepad;

	var axes = [ 0, 0 ];
	var thumbpadIsPressed = false;
	var triggerIsPressed = false;
	var gripsArePressed = false;
	var menuIsPressed = false;

	function findGamepad( id ) {

		// Iterate across gamepads as Vive Controllers may not be
		// in position 0 and 1.

		var gamepads = navigator.getGamepads();

		for ( var i = 0, j = 0; i < 4; i ++ ) {

			var gamepad = gamepads[ i ];

			if ( gamepad && ( gamepad.id === 'Oculus Touch (Left)' || gamepad.id === 'Oculus Touch (Right)' ) ) {

				if ( j === id ) return gamepad;

				j ++;

			}

		}

	}

	this.matrixAutoUpdate = false;
	this.standingMatrix = new THREE.Matrix4();

	this.getGamepad = function () {

		return gamepad;

	};

	this.getButtonState = function ( button ) {

		if ( button === 'thumbpad' ) return thumbpadIsPressed;
		if ( button === 'trigger' ) return triggerIsPressed;
		if ( button === 'grips' ) return gripsArePressed;
		if ( button === 'menu' ) return menuIsPressed;

	};

	this.update = function () {

		gamepad = findGamepad( id );

		if ( gamepad !== undefined && gamepad.pose !== undefined ) {

			if ( gamepad.pose === null ) return; // No user action yet

			//  Position and orientation.

			var pose = gamepad.pose;

			if ( pose.position !== null ) scope.position.fromArray( pose.position );
			if ( pose.orientation !== null ) scope.quaternion.fromArray( pose.orientation );
			scope.matrix.compose( scope.position, scope.quaternion, scope.scale );
			scope.matrix.multiplyMatrices( scope.standingMatrix, scope.matrix );
			scope.matrixWorldNeedsUpdate = true;
			scope.visible = true;

			//  Thumbpad and Buttons.

			if ( axes[ 0 ] !== gamepad.axes[ 0 ] || axes[ 1 ] !== gamepad.axes[ 1 ] ) {

				axes[ 0 ] = gamepad.axes[ 0 ]; //  X axis: -1 = Left, +1 = Right.
				axes[ 1 ] = gamepad.axes[ 1 ]; //  Y axis: -1 = Bottom, +1 = Top.
				scope.dispatchEvent( { type: 'axischanged', axes: axes } );

			}

			if ( thumbpadIsPressed !== gamepad.buttons[ 0 ].pressed ) {

				thumbpadIsPressed = gamepad.buttons[ 0 ].pressed;
				scope.dispatchEvent( { type: thumbpadIsPressed ? 'thumbpaddown' : 'thumbpadup' } );

			}

			if ( triggerIsPressed !== gamepad.buttons[ 1 ].pressed ) {

				triggerIsPressed = gamepad.buttons[ 1 ].pressed;
				scope.dispatchEvent( { type: triggerIsPressed ? 'triggerdown' : 'triggerup' } );

			}

			if ( gripsArePressed !== gamepad.buttons[ 2 ].pressed ) {

				gripsArePressed = gamepad.buttons[ 2 ].pressed;
				scope.dispatchEvent( { type: gripsArePressed ? 'gripsdown' : 'gripsup' } );

			}

			if ( menuIsPressed !== gamepad.buttons[ 3 ].pressed ) {

				menuIsPressed = gamepad.buttons[ 3 ].pressed;
				scope.dispatchEvent( { type: menuIsPressed ? 'menudown' : 'menuup' } );

			}

		} else {

			scope.visible = false;

		}

	};

};

THREE.RiftController.prototype = Object.create( THREE.Object3D.prototype );
THREE.RiftController.prototype.constructor = THREE.RiftController;
