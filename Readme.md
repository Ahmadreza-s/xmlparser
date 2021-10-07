
# @ebcom/xml-parser

Fast and Simple XML Parser for parsing xml to json objects.

## Installation

```
npm i @ebcom/xmlparser
```

## How to use


```js
const ebcomXmlParser = require('@ebcom/xmlparser');

//create an instance of parser with some options (if u want to use it globally in your project)
const parser = ebcomXmlParser({returnAttributeAsArray: true, throwErrorIfXmlNotValid: true});

const xml = `<note>
<to>Tove</to>
<from>Jani</from>
<heading>Reminder</heading>
<body>Don't forget me this weekend!</body>
</note>`

const jsonObject = parser.parse(xml); //return a json object, simple as that :) 

```
