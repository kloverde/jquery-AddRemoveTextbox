/*
 * AddRemoveTextbox v1.0
 * https://www.github.com/kloverde/jquery-AddRemoveTextbox
 *
 * This software is licensed under the 3-clause BSD license.
 *
 * Copyright (c) 2016 Kurtis LoVerde
 * All rights reserved
 *
 * Donations:  https://paypal.me/KurtisLoVerde/5
 */

(function( $ ) {
   "use strict";

   $.fn.addRemoveTextbox = function( options ) {

	   var settings = $.extend( {
         // A CSS class to style the 'Add' button.  The generated HTML will be a <span>, so it is
         // assumed that you will use CSS to define a background image.
         addButtonClass      : "addButton",

         // Hover text for the 'Add' button
         addButtonTooltip    : null,

         // A CSS class to style the 'Remove' button.  The generated HTML will be a <span>, so it is
         // assumed that you will use CSS to define a background image.
         removeButtonClass   : "removeButton",

         // Hover text for the 'Remove' button
         removeButtonTooltip : null,

         // A limit on the number of fields which may exist under the applicable ID prefix.  Default
         // is null (no limit).  If a value is specified, it must be an integer greater than 1.
         maxFields           : null
      }, options );

      var ID_PREFIX = this.attr( "id" ).replace( /\[?[0-9]*\]?$/, "" );
      var IS_NUMBERED_NOTATION = this.attr( "id" ).match( /[0-9]+$/ ) != null;
      var IS_ARRAY_NOTATION    = this.attr( "id" ).match( /\[[0-9]\]$/ ) != null;

      if( !IS_NUMBERED_NOTATION && !IS_ARRAY_NOTATION ) {
         throwException( "Invalid ID attribute '" + this.attr("id") + "': IDs must be nunmbered like id1, id2, or use array notation, like id[0], id[1]" );
      } else if( IS_NUMBERED_NOTATION && IS_ARRAY_NOTATION ) {
         throwException( "Invalid state: ID '" + this.attr("id") + "' notation not detected correctly" );  // should be impossible
      }

      if( settings.maxFields != null ) {
         var errMsg = "maxFields (" + settings.maxFields + ") must be an integer greater than 1";

         if( isNaN(settings.maxFields) ) {
            throwException( errMsg );
         } else {
            settings.maxField = parseInt( settings.maxField );

            if( settings.maxFields < 2 || settings.maxFields % 1 !== 0 ) {
               throwException( errMsg );
            }
         }
      }

      init( this );

      function throwException( msg ) {
         throw "AddRemoveTextbox error:  " + msg;
      }

      function init( invokedBox ) {
         var fields = $( "input[id^='" + ID_PREFIX + "']" );

         if( settings.maxFields != null && fields.length > settings.maxFields ) {
            throwException( "There are more fields in the '" + ID_PREFIX + "' set (" + fields.length +
                            ") than are allowed by maxFields (" + settings.maxFields + ")" );
         }

         fields.each( function() {
            var inputField = $( this );
            var parentRow = inputField.parent();

            makeRemoveButton().insertAfter( inputField );

            if( parentRow.is(":last-child") ) {
               makeAddButton().appendTo( parentRow );
            }
         } );
      }

      function makeButton( className, title ) {
         var btn = $( "<span></span>" );
         
         if( className != null ) {
            btn.addClass( className );
         }

         if( title != null ) {
            btn.prop( "title", title );
         }

         btn.on( "click", function() {
            
         } );

         return btn;
      }

      function makeAddButton() {
         var btn = makeButton( settings.addButtonClass, settings.addButtonTooltip );

         btn.on( "click", function() {
            var newInputId = insertRow( $(this) );
            $( escape("#" + newInputId) ).focus();
         } );

         return btn;
      }

      function makeRemoveButton() {
         var btn = makeButton( settings.removeButtonClass, settings.removeButtonTooltip );

         btn.on( "click", function() {
            removeRow( $(this) );
         } );

         return btn;
      }

      function domScan() {
         var highestNumberedBox = null;
         var physicallyLastBox = null;

         var boxes = $( "input[id^='" + ID_PREFIX + "']" );

         boxes.each( function() {
            var jqThis = $( this );

            if( highestNumberedBox == null ) highestNumberedBox = jqThis;

            physicallyLastBox = jqThis;

            if( highestNumberedBox.attr("id") > jqThis.attr("id") ) {
               return;
            }

            highestNumberedBox = jqThis;
         } );

         return {
            highestBox : highestNumberedBox,
            lastBox    : physicallyLastBox,
            numBoxes   : boxes.length
         };
      }

      function insertRow( button ) {
         var lastRow = button.parent();
         var newRow = lastRow.clone( true );  // Passing 'true' so that the button click events are cloned
         var newInput = newRow.children( "input" );
         var nextIdResults = getNextId();

         newInput.val( "" );
         newInput.attr( "id", nextIdResults.nextId );
         newInput.attr( "name", newInput.attr("id") );

         button.remove();

         if( settings.maxFields != null && nextIdResults.numBoxes + 1 >= settings.maxFields ) {
            newRow.find( "span[class='" + settings.addButtonClass + "']" ).remove();
         }

         newRow.insertAfter( lastRow );

         return nextIdResults.nextId;
      }

      function getNextId() {
         var domScanResults = domScan();

         if( settings.maxFields != null && domScanResults.numBoxes >= settings.maxFields ) {
            throwException( "Field count limit reached for " + ID_PREFIX );
         }

         var highestBox = domScanResults.highestBox;
         var highestNum = parseInt( highestBox.attr("id").replace(/.*(\d+).*$/, "$1") );
         var nextNum = highestNum + 1;

         var nextId = IS_ARRAY_NOTATION ? ID_PREFIX + "[" + nextNum + "]"
                                        : ID_PREFIX + nextNum;

         return {
            nextId   : nextId,
            numBoxes : domScanResults.numBoxes
         };
      }

      function removeRow( button ) {
         var rowToRemove = button.parent();
         var prevRow = rowToRemove.prev();
         var inputId = rowToRemove.children( "input" ).attr( "id" );

         // Don't remove the row if it's the only/last one in the group.

         var othersExist = false;

         $( "input[id^='" + ID_PREFIX + "']" ).each( function() {
            if( $(this).attr("id") !== inputId ) {
               othersExist = true;
               return;
            }
         } );

         if( othersExist ) {
            if( rowToRemove.is(":last-child") ) {
               makeAddButton().appendTo( prevRow );
            } else {
               if( !rowToRemove.parent().last().find("span[class='" + settings.addButtonClass + "']").length ) {
                  makeAddButton().appendTo( rowToRemove.siblings(":last") );
               }
            }

            rowToRemove.remove();
         } else {
            $( escape("#" + inputId) ).val( "" );
         }
      }

      function escape( selector ) {
         return selector.replace( /(\[|\])/g, "\\$1" );
      }
   };
}( jQuery ));
