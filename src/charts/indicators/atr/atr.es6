/**
 * Created by arnab on 3/1/15.
 */

import $ from "jquery";
import _ from "lodash";
import rv from 'common/rivetsExtra';
import 'jquery-ui';
import 'color-picker';
import 'ddslick';
import 'colorpicker';

let before_add_callback = null;

function closeDialog() {
    $(this).dialog("close");
    $(this).find("*").removeClass('ui-state-error');
}

async function init( containerIDWithHash, callback ) {

    require(['css!charts/indicators/atr/atr.css']);

    var Level = function (level, stroke, strokeWidth, dashStyle) {
        this.level = level;
        this.stroke = stroke;
        this.strokeWidth = strokeWidth;
        this.dashStyle = dashStyle;
    };
    var defaultLevels = [new Level(30, 'red', 1, 'Dash'), new Level(70, 'red', 1, 'Dash')];

    let [$html, data] = await require(['text!charts/indicators/atr/atr.html', 'text!charts/indicators/indicators.json']);

    var defaultStrokeColor = '#cd0a0a';

    data = JSON.parse(data).atr;

    const state = {
      fields: data.fields
    }

    $html = $($html);
    const view = rv.bind($html[0], state);

    window.ss = state


    /*
    $html.attr('title', current_indicator_data.long_display_name);
    $html.find('.atr-description').html(current_indicator_data.description);

    $html.find("input[type='button']").button();

    $html.find("#atr_stroke").colorpicker({
    		showOn: 'click',
        position: {
            at: "right+100 bottom",
            of: "element",
            collision: "fit"
        },
        part:	{
            map:		{ size: 128 },
            bar:		{ size: 128 }
        },
        select:	function(event, color) {
            $("#atr_stroke").css({
                background: '#' + color.formatted
            }).val('');
            defaultStrokeColor = '#' + color.formatted;
        },
        ok: function(event, color) {
            $("#atr_stroke").css({
                background: '#' + color.formatted
            }).val('');
            defaultStrokeColor = '#' + color.formatted;
        }
    });

    var selectedDashStyle = "Solid";
    $('#atr_dashStyle').ddslick({
        imagePosition: "left",
        width: 150,
        background: "white",
        onSelected: function (data) {
            $('#atr_dashStyle .dd-selected-image').css('max-height','5px').css('max-width', '85px');
            selectedDashStyle = data.selectedData.value
        }
    });
    $('#atr_dashStyle .dd-option-image').css('max-height','5px').css('max-width', '85px');


    var table = $html.find('#atr_levels').DataTable({
        paging: false,
        scrollY: 100,
        autoWidth: true,
        searching: false,
        info: false,
        "columnDefs": [
           { className: "dt-center", "targets": [0,1,2,3] },
        ],
        "aoColumnDefs": [{ "bSortable": false, "aTargets": [1, 3] }]

    });

    $.each(defaultLevels, function (index, value) {
        $(table.row.add([value.level, '<div style="background-color: ' + value.stroke + ';width:100%;height:20px;"></div>', value.strokeWidth,
            '<div style="width:50px;overflow:hidden;"><img src="images/dashstyle/' + value.dashStyle + '.svg" /></div>']).draw().node())
            .data("level", value)
            .on('click', function () {
                $(this).toggleClass('selected');
            });
    });
    $html.find('#atr_level_delete').click(function () {
        if (table.rows('.selected').indexes().length <= 0) {
            require(["jquery", "jquery-growl"], function($) {
                $.growl.error({ message: "Select level(s) to delete!" });
            });
        } else {
            table.rows('.selected').remove().draw();
        }
    });
    $html.find('#atr_level_add').click(function () {
        require(["indicator_levels"], function(atr_level) {
            atr_level.open(containerIDWithHash, function (levels) {
                $.each(levels, function (ind, value) {
                    $(table.row.add([value.level, '<div style="background-color: ' + value.stroke + ';width:100%;height:20px;"></div>', value.strokeWidth,
                        '<div style="width:50px;overflow:hidden;"><img src="images/dashstyle/' + value.dashStyle + '.svg" /></div>']).draw().node())
                        .data("level", value)
                        .on('click', function () {
                            $(this).toggleClass('selected');
                        } );
                });
            });
        });
    });
    */

    var options = {
        autoOpen: false,
        resizable: false,
        width: 350,
        height:400,
        modal: true,
        my: 'center',
        at: 'center',
        of: window,
        dialogClass:'atr-ui-dialog',
        buttons: [
            {
                text: "OK",
                click: function() {
                    var $elem = $(".atr_input_width_for_period");
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

                    var levels = [];
                    $.each(table.rows().nodes(), function () {
                        var data = $(this).data('level');
                        if (data) {
                            levels.push({
                                color: data.stroke,
                                dashStyle: data.dashStyle,
                                width: data.strokeWidth,
                                value: data.level,
                                label: {
                                    text: data.level
                                }
                            });
                        }
                    });

                    var options = {
                        period: parseInt($html.find(".atr_input_width_for_period").val()),
                        stroke: defaultStrokeColor,
                        strokeWidth: parseInt($html.find("#atr_strokeWidth").val()),
                        dashStyle: selectedDashStyle,
                        appliedTo: parseInt($html.find("#atr_appliedTo").val()),
                        levels: levels
                    };
                    before_add_callback && before_add_callback();
                    //Add ATR for the main series
                    $($(".atr").data('refererChartID')).highcharts().series[0].addIndicator('atr', options);

                    closeDialog.call($html);

                }
            },
            {
                text: "Cancel",
                click: function() {
                    closeDialog.call(this);
                }
            }
        ],
        icons: {
            close: 'custom-icon-close',
            minimize: 'custom-icon-minimize',
            maximize: 'custom-icon-maximize'
        }
    };
    $html.dialog(options)
      .dialogExtend(_.extend(options, {maximizable:false, minimizable:false, collapsable:false}));

    /*
    $html.find('select').each(function(index, value){
        $(value).selectmenu({
            width : 150
        }).selectmenu("menuWidget").css("max-height","85px");
    });
    */

    callback && callback();
}

/**
 * @param containerIDWithHash - containerId where indicator needs to be added
 * @param before_add_cb - callback that will be called just before adding the indicator
 */
export const open = function (containerIDWithHash, before_add_cb) {
    before_add_callback = before_add_cb || before_add_callback;
    var open = function() {
      $(".atr").data('refererChartID', containerIDWithHash).dialog( "open" );
    };

    if ($(".atr").length == 0)
      init(containerIDWithHash, open);
    else
      open();
}
export default { open, };
