# MMM-MyDutchWeather v2.0.0
This a module for [Magic Mirror²](https://github.com/MichMich/MagicMirror) smart mirror project.</br>
This modules is ONLY for use in the Netherlands and it presents the actual weather information for your dutch city from the KNMI directly from the 10-minutes network.

To use this module, an API Key is required. This API Key [you can get here](https://weerlive.nl/api/toegang/account.php) for free. </br> The key and the use of the key is FREE and as-is. The number of data-requests is limited to 300 requests per day. 

## Installation
Clone this repository in your modules folder, and install dependencies:

```
cd ~/MagicMirror/modules 
git clone https://github.com/htilburgs/MMM-MyDutchWeather.git
cd MMM-MyDutchWeather
npm install 
```
## Update
When you need to update this module:

```
cd ~/MagicMirror/modules/MMM-MyDutchWeather
git pull
```

## Configuration
Go to the MagicMirror/config directory and edit the config.js file.
Add the module to your modules array in your config.js.

```
{
  module: 'MMM-MyDutchWeather',
  position: 'top_left',
  header: 'My Dutch Weather',
  config: {
	  latitude: "0.000000",			// Latitude of your city between ""
	  longitude: "0.00000",			// Longitude of your city between ""
	  apiKey: "0123456789",			// API Key between "" - Get for free at https://weerlive.nl/delen.php#tab1
	  showIcons: true,			// Display Icons or Text
	  showExtra: false,			// Display additional weather information
	  maxWidth: "500px"			// Max width wrapper
  }
},
```
## Free API Key
Get your Free API Key at https://weerlive.nl/api/toegang/account.php

## Latitude & Longitude
To get your latitude and longitude, you can go to https://latitudelongitude.org

## Module configuration
Here is the documentation of options for the modules configuration

| Option                | Description
|:----------------------|:-------------
| `latitude`            | **REQUIRED** - The latitude of your location for a correct calculation <br /><br />**Number** <br />Default: `null`
| `longitude`           | **REQUIRED** - The longitude of your location for a correct calculation <br /><br />**Number** <br />Default: `null`
| `apiKey`		| **REQUIRED** - The API Key needed for MyDutchWeather <br />Get for free at [Weerlive.nl](http://weerlive.nl/api/toegang/index.php)
| `showIcons`		| Choose if you like to see Icons or Plain Text <br /><br />**True/False**<br />Default: `true`
| `showExtra`		| Choose if you like to see additional weather information <br /><br />**True/False**<br />Default: `false`
| `maxWidth`		| The maximum width of the module <br /><br />Default: `500px`

## Version
v1.2.0 - 01-07-2024	: update node_helper.js from request (deprecated) to fetch </br>
v1.3.0 - 12-11-2024	: language support
v2.0.0 - xx-xx-xxxx	: API 2.0 support and new design

## License
### The MIT License (MIT)

Copyright © 2019 Harm Tilburgs

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

The software is provided “as is”, without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability, whether in an action of contract, tort or otherwise, arising from, out of or in connection with the software or the use or other dealings in the software.
