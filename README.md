simpleTemplate
==============

An extremely basic javascript/html template system. An HTML string is returned to be inserted into the DOM manually, for minimal page redrawing.

##To use:
The object `_template` is added to the `window` scope.

Call the `_template` constructor giving two arguments:
    1. The template as a string
    2. The data to fill the template with.
    
```
    var tempObj = _template(templateString, data);
```

The parameters in the template string should be surrounded by double curly brackets: `{{ExampleParam}}`.

To get the HTML as a string from the `_template` object, call `_template.getHTML();`

###Example
```
<script language="javascript">
    var data = {
            name: 'Danny Richelieu',
            site: 'Github',
            owner: false,
            date: (new Date()).toJSON().slice(0, 10)
        },
        tempString = document.getElementById('templatestring').innerHTML;
    
    var temp = _template(tempString, data);
    
    document.getElementById('fillhere').innerHTML = temp.getHTML();
</script>

<script language="template" id="templatestring">
    <div class="block">
        <h1>{{name}}</h1>
        <div>is visiting {{site}}</div>
        {{@if:Owner}}
            <div>{{name}} owns {{site}}</div>
        {{@end}}
        <div>on {{date}}</div>
    </div>
</script>
```

You can also send an array of objects as the data parameter to reuse the template.

##Additional Methods
To reuse the template with a different dataset: `_template.setData(newdata);`

To reuse the data with a different template: `_template.setTemplate(newtemplate);`
    
##Template Options
To fill the template with a key's value in the data object, surround the key's name with curly brackets in the template string: `{{ObjectKey}}`

The keys are all case **insensitive** to make this system as simple as possible for the user.

Very simple if statements can be inserted by using `{{@if:ObjectKey}}` and ending the block with `{{@end}}`. The system checks if ObjectKey exists in the data object and that the key's value is truthy. If it is, whatever is in the block is rendered in the resulting HTML string. Otherwise it is removed.
* Note: this is an extremely rudimentary addition -- nesting another if statement within an if statement will break it at this time.
