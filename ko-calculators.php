<?php
/**
 * Plugin Name:       KO Calculators
 * Description:       Mini, dynamic calculators for your WordPress site.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Zeb Fross
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       popup-blocks
 *
 * @package           ko-calculators
 */


namespace KoCalculators {

const PLUGIN_SLUG     = 'ko-calculators';
const ROOT_DIR        = __DIR__;
const ROOT_FILE       = __FILE__;

function setup() : void {
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\setup' );
}
