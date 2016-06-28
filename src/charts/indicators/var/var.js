﻿/**
 * Created by Mahboob.M on 2/3/16.
 */

define(["jquery", 'common/rivetsExtra', "jquery-ui", 'color-picker', 'ddslick'], function ($, rv) {

    function closeDialog() {
        $(this).dialog("close");
        $(this).find("*").removeClass('ui-state-error');
    }

    function init( containerIDWithHash, _callback ) {

        require(['css!charts/indicators/var/var.css']);

        require(['text!charts/indicators/var/var.html', 'text!charts/indicators/indicators.json'], function ( $html, data ) {

            var defaultStrokeColor = '#cd0a0a';

            $html = $($html);
            //$html.hide();
            $html.appendTo("body");

            data = JSON.parse(data);
            var current_indicator_data = data.var;
            var state = {
                "title": current_indicator_data.long_display_name,
                "description": current_indicator_data.description
            }
            rv.bind($html[0], state);

            $html.find("input[type='button']").button();

            $html.find("#var_stroke").colorpicker({
                position: {
                    at: "right+100 bottom",
                    of: "element",
                    collision: "fit"
                },
                part:	{
                    map:		{ size: 128 },
                    bar:		{ size: 128 }
                },
                select:			function(event, color) {
                    $("#var_stroke").css({
                        background: '#' + color.formatted
                    }).val('');
                    defaultStrokeColor = '#' + color.formatted;
                },
                ok:             			function(event, color) {
                    $("#var_stroke").css({
                        background: '#' + color.formatted
                    }).val('');
                    defaultStrokeColor = '#' + color.formatted;
                }
            });

            var selectedDashStyle = "Solid";
            $('#var_dashStyle').ddslick({
                imagePosition: "left",
                width: 118,
                background: "white",
                onSelected: function (data) {
                    $('#var_dashStyle .dd-selected-image').css('max-width', '85px');
                    selectedDashStyle = data.selectedData.value
                }
            });
            $('#var_dashStyle .dd-option-image').css('max-width', '85px');

            $html.dialog({
                autoOpen: false,
                resizable: false,
                width: 350,
                height: 400,
                modal: true,
                my: 'center',
                at: 'center',
                of: window,
                dialogClass: 'var-ui-dialog',
                buttons: [
                    {
                        text: "OK",
                        click: function() {
                            var $elem = $(".var_input_width_for_period");
                            if (!_.isInteger(_.toNumber($elem.val())) || !_.inRange($elem.val(),
                                            parseInt($elem.attr("min")),
                                            parseInt($elem.attr("max")) + 1)) {
                                require(["jquery", "jquery-growl"], function ($) {
                                    $.growl.error({
                                        message: "Only numbers between " + $elem.attr("min")
                                                + " to " + $elem.attr("max")
                                                + " is allowed for " + $elem.closest('tr').find('td:first').text() + "!"
                                    });
                                });
                                $elem.val($elem.prop("defaultValue"));
                                return;
                            };

                            var options = {
                                period: parseInt($html.find(".var_input_width_for_period").val()),
                                stroke: defaultStrokeColor,
                                strokeWidth: parseInt($html.find("#var_strokeWidth").val()),
                                dashStyle: selectedDashStyle,
                                levels: []
                            };
                            //Add var for the main series
                            $($(".var").data('refererChartID')).highcharts().series[0].addIndicator('var', options);

                            closeDialog.call($html);

                        }
                    },
                    {
                        text: "Cancel",
                        click: function() {
                            closeDialog.call(this);
                        }
                    }
                ]
            });

            $html.find('select').selectmenu({
                width : 120
            });
            if (typeof _callback == "function")
            {
                _callback( containerIDWithHash );
            }

        });

    }

    return {

        open : function ( containerIDWithHash ) {

            if ($(".var").length == 0)
            {
                init( containerIDWithHash, this.open );
                return;
            }

            $(".var").data('refererChartID', containerIDWithHash).dialog( "open" );

        }

    };

});
