/// <reference path="jquery-1.9.1.js" />
/// <reference path="jquery-ui-1.10.1.js" />

/// Omar Stewart
/// Tagger jQuery Plugin
/// Requires jQuery and jQuery UI

// Utility
// Object Instantiation. Legacy Browser support.
if (typeof Object.create !== 'function') {
    Object.create = function (obj) {
        function F() { };
        F.prototype = obj;
        return new F();
    }
}

(function ($, window, document, undefined) {


    // Delete Tag from ui and array
    var removeTag = function () {

        var tag = $('li.ui-selected');
        //tagVal = tag.text();

        // Remove from ui
        tag.remove();

        // Remove from tags array
        //tags.splice($.inArray(tagVal, tags), 1);
    };

    // Configure Selectable Handler
    var configSelectable =  function () {

        $('html')
            .click(function () {
                $('li.ui-selected').removeClass('ui-selected');
            })
            .keydown(function (evt) {
                if (evt.keyCode == $.ui.keyCode.DELETE || evt.keyCode == $.ui.keyCode.BACKSPACE) {
                    removeTag();
                }
            });
    };

    // Core Lib
    var Tagger = {

        init: function (options, elem) {

            var self = this;
            self.elem = elem;
            self.$elem = $(elem);

            self.tags = [];

            // setup options
            self.options = $.extend({}, $.fn.taggable.options, options);

            self.loadAutoComplete();
            self.loadSelectable();
        },

        loadAutoComplete: function () {

            var terms = this.options.terms;

            var acDelimitter = this.options.delimmiter;
            var acDelimitterExp = new RegExp(acDelimitter + "\s*");

            var tagger = this;
            var taglist = this.options.tagContainer;

            // Autocomplete Options
            this.$elem.autocomplete({

                minLength: 1,

                // Prevent changing text when hovering
                // over suggestions.
                focus: function (ui, evt) {
                    return false;
                },

                source: function (req, resp) {

                    resp($.ui.autocomplete.filter(

                        terms,

                        req.term.split(acDelimitterExp).pop() // Last Term
                        ));
                },

                // Suggestion Selected
                select:
                    function (evt, ui) {
                        evt.preventDefault();

                        var tagVal = ui.item.value;
                        if (!!$.inArray(tagVal, tagger.tags)) {

                            // Add to tag container
                            taglist.append($(tagger.options.tagWrapMarkup).append(tagVal));

                            // Add to tags array
                            tagger.tags.push(ui.item.value);
                        }
                        tagger.clearTagInput();
                    }
            });
        },

        loadSelectable: function () {
            this.options.tagContainer.selectable({
                select: function (evt, ui) {
                    evt.stopImmediatePropagation();
                }
            });
        },

        // Clears input field when a suggestion is selected
        clearTagInput: function () {
            var tagVal = this.$elem.val();
            this.$elem.val(tagVal.substring(0, (tagVal.lastIndexOf(this.options.delimmiter) + 1)));
        }
    };

    // Plugin Definition
    $.fn.taggable = function (options) {

        // config selectable
        // this only needs to run once
        configSelectable();

        // Apply to collection
        return this.each(function () {
            var tagger = Object.create(Tagger);
            tagger.init(options, this);
        });
    };

    // Defaults
    $.fn.taggable.options = {

        tagWrapMarkup: "<li class='ui-widget-content'></li>",

        terms: ["c++", "java", "php", "coldfusion", "javascript", "asp", "ruby"]

    };

})(jQuery, window, document);