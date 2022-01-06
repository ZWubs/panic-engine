/**
 *	@author zwubs
 */

import { MouseButtonCodes, MouseButtonMap } from './mouse-consts.js';

import { EventManager } from '../../events/event-manager.js'

import * as Console from '../../../debug/debug-console.js';

class Mouse {

	constructor() {

		this.eventManager = new EventManager();

		this.eventManager.registerNativeEvent( "mousedown" );

		this.eventManager.on( "mousedown", this.handleButtonDown.bind(this) );

		this.eventManager.registerNativeEvent( "mouseup" );

		this.eventManager.on( "mouseup", this.handleButtonUp.bind(this) );

		this.eventManager.registerNativeEvent( "click" );

		this.eventManager.on( "click", this.handleClick.bind(this) );

		this.registerMouseEvents();

	}

	/**
	 * 	@description Registers all events for the
	 * 	@todo Optimize to only use necessary events
	 */
	registerMouseEvents() {

		for ( let btn in MouseButtonCodes ) {

			this.eventManager.registerEvent( `down_${btn}` );
			this.eventManager.registerEvent( `up_${btn}` );
			this.eventManager.registerEvent( `click_${btn}` );
			this.eventManager.registerEvent( `held_${btn}` );

		}

	}

	/**
	 *	@HEADER {} BUTTONS
	 */

	/**
	 * 	@param {Event} e - Event from "mouseup" event listener
	 */
	handleButtonUp( e ) {

		this.eventManager.emit( `up_${MouseButtonMap[ e.button ]}`, {} );

		this.eventManager.breakLoop( `held_${MouseButtonMap[ e.button ]}` );

	}

	/**
	 * 	@param {Event} e - Event from "mousedown" event listener
	 */
	handleButtonDown( e ) {

		this.eventManager.emit( `down_${MouseButtonMap[ e.button ]}`, {} );

		this.eventManager.emit( `held_${MouseButtonMap[ e.button ]}`, {}, true );

	}

	/**
	 * 	@param {Event} e - Event from "mousedown" event listener
	 */
	handleClick( e ) {

		this.eventManager.emit( `click_${MouseButtonMap[ e.button ]}`, {} );

	}


	/**
	 * @description Event is fired as long as the button is held down
	 * @param {String} btn ID used is signify the button, values available in MouseButtonCodes
	 * @param {Function} func Function to be executed when event is recieved
	 */
	onButton( btn, func ) {

		if( !this.checkValidButton( btn, "onButton" ) ) { return; }

		this.eventManager.on( `held_${ btn }`, func );

	}

	/**
	 * @description Event is fired only on the first instance of the button being pressed
	 * @param {String} btn ID used is signify the button, values available in MouseButtonCodes
	 * @param {Function} func Function to be executed when event is recieved
	 */
	onButtonDown( btn, func ) {

		if( !this.checkValidButton( btn, "onButtonDown" ) ) { return; }

		this.eventManager.on( `down_${ btn }`, func );

	}

	/**
	 * @description Event is fired only on the first instance of the button being unpressed
	 * @param {String} btn ID used is signify the button, values available in MouseButtonCodes
	 * @param {Function} func Function to be executed when event is recieved
	 */
	onButtonUp( btn, func ) {

		if( !this.checkValidButton( btn, "onButtonUp" ) ) { return; }

		this.eventManager.on( `up_${ btn }`, func );

	}

	/**
	 * @description Event is fired when the button is pressed and released successfully
	 * @param {String} btn ID used is signify the button, values available in MouseButtonCodes
	 * @param {Function} func Function to be executed when event is recieved
	 */
	onClick( btn, func ) {

		if( !this.checkValidButton( btn, "onClick" ) ) { return; }

		this.eventManager.on( `click_${ btn }`, func );

	}

	/**
	 * @description Returns a Boolean based on wether the button is being held down
	 * @param {String} btn ID used is signify the button, values available in MouseButtonCodes
	 * @return {Boolean}
	 */
	getButton( btn ) {

		if( !this.checkValidButton( btn, "getButton" ) ) { return; }

		return this.eventManager.eventActive( `held_${ btn }` );

	}

	/**
	 * @description Returns a Boolean based on the first instance of a button being pressed
	 * @param {String} btn ID used is signify the button, values available in MouseButtonCodes
	 * @return {Boolean}
	 */
	getButtonDown( btn ) {

		if( !this.checkValidButton( btn, "getButtonDown" ) ) { return; }

		return this.eventManager.eventActive( `down_${ btn }` );

	}

	/**
	 * @description Returns a Boolean based on the first instance of a button being unpressed
	 * @param {String} btn ID used is signify the button, values available in MouseButtonCodes
	 * @return {Boolean}
	 */
	getButtonUp( btn ) {

		if( !this.checkValidButton( btn, "getButtonUp" ) ) { return; }

		return this.eventManager.eventActive( `up_${ btn }` );

	}

	/**
	 * @description Returns a Boolean based on wether a successful down and up event occured
	 * @param {String} btn ID used is signify the button, values available in MouseButtonCodes
	 * @return {Boolean}
	 */
	getClick( btn ) {

		if( !this.checkValidButton( btn, "getClick" ) ) { return; }

		return this.eventManager.eventActive( `click_${ btn }` );

	}

	/**
	 * @description Checks that a given buttonID is valid
	 * @param  {String} btn ID used is signify the button, values available in MouseButtonCodes
	 * @param  {String} functionName Function name to be logged is something goes wrong
	 * @return {Boolean}
	 */
	checkValidButton( btn, functionName ) {

		if( btn in MouseButtonCodes ) return true;

		Console.warn(`Mouse.${functionName}(): '${ btn }' is not a valid button`);

		return false;

	}

}

const instance = new Mouse();
export { instance as Mouse };