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
    add_shortcode('kocalculator', __NAMESPACE__ . '\\ko_calculator_shortcode');
}

function setup_scripts() : void {
    wp_register_script('knockout-js', plugins_url('knockout.min.js', __FILE__), [], '3.5.0');
}

function ko_calculator_shortcode($atts) {
    if (empty($atts['id'])) {
        return '<p>No calculator ID specified.</p>';
    }

    $id = $atts['id'];
    if (!file_exists(ROOT_DIR . "/views/$id-calculator.html")) {
        return '<p>Calculator not found.</p>';
    }

    $src = plugins_url("build/$id-calculator.js", __FILE__);
    wp_enqueue_script("ko-calculators-$id", $src, ['knockout-js'], filemtime($src), true);

    ob_start();
    $theme = ROOT_DIR . "/views/$id-calculator.html";
    include $theme; // PHP will be processed
    $output = ob_get_contents();
    @ob_end_clean();
    return $output;
}

add_action( 'plugins_loaded', __NAMESPACE__ . '\\setup' );
add_action('wp_enqueue_scripts', __NAMESPACE__ . '\\setup_scripts');
}
