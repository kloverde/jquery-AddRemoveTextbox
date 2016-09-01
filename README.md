AddRemoveTextbox v1.1.2
=======================

See LICENSE for this software's licensing terms.

AddRemoveTextbox is a jQuery plugin which provides for dynamic creation and removal of input fields, accomplished by clicking add/remove buttons which appear to the right of each field.


## Features

* Supports all text-based input types ('text', 'number', etc), plus the 'color' type
* Configurable CSS classes for the 'add' and 'remove' buttons
* Configurable tooltips for the 'add' and 'remove' buttons
* Configurable limit on the number of input fields
* Configurable callbacks for add and remove operations
* Able to renumber id and name attributes to keep them contiguous (enabled through a configuration option)


## jQuery Compatibility

Known to be compatible with the following versions of jQuery (other versions are untested):

* 3.1.0
* 2.2.4
* 1.12.4


## Browser Compatibility

Known to be compatible with the following browser versions (other brands/versions are untested):

* Firefox 48
* Chrome 52.0.2743.116 m
* Edge 20.10240.16384.0
* IE 11
* IE 10
* IE 9
* IE 8 (when used with an IE 8-compatible version of jQuery:  v1.12.4 was the last version for IE 8)


## Initialization

You need to provide a container for all of the input fields.  Within that container, you need to provide a container for each set of input field plus buttons.  This second container must be the input field's immediate parent.

The plugin will duplicate the input field's immediate parent when creating a new field, so you should&apos;t define an ID attribute for the container.

You should provide an `id` and `name` attribute for your field(s), and they should be the same value.

```html

      <div id="myTextBoxes">
         <div class="txtBoxRow">
            <input type="text" id="txt0" name="txt0"/>
         </div>
      </div>

```

```javascript

      $( "#txt0" ).addRemoveTextbox( {
         addButtonClass      : "addRemoveButton imgAdd",
         addButtonTooltip    : "Add",
         removeButtonClass   : "addRemoveButton imgRemove",
         removeButtonTooltip : "Remove"
      } );

```
AddRemoveTextbox also understands array notation, so you could use `id=txt[0]`.

You can also initialize AddRemoveTextbox on a large preexisting group of text boxes.

See the included HTML file for more in-depth examples.


## Configuration Options

| Property | Description | Default Value |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------- |---------------|
| `addButtonClass` | A CSS class to style the 'Add' button.  The generated HTML will be a &lt;span&gt;, so it is assumed that you will use CSS to define a background image. | addButton |
| `addButtonTooltip` | Hover text for the 'Add' button | null |
| `removeButtonClass` | A CSS class to style the 'Remove' button.  The generated HTML will be a &lt;span&gt;, so it is assumed that you will use CSS to define background image. | removeButton |
| `removeButtonTooltip` | Hover text for the 'Remove' button | null |
| `maxFields` | An optional limit on the number of fields which may exist under the applicable ID prefix.  If a value is specified, it must be an integer greater than 1. | null (no limit) |
| `contiguous` | If `true`, renumber the `id` and `name` attributes upon initialization and when a row is removed.  Renumbering is based on DOM order, not `id` or `name` values, and starts on the value specified by `startingNumber`.  This setting is disabled by default because it can break applications. | false |
| `startingNumber` | This setting is used only when `contiguous` is set to `true`. | null |


## Thanks

Do you like this library?  Want to toss a few bucks my way to say thanks?  I accept donations at https://paypal.me/KurtisLoVerde/5.  Thank you for your support!
