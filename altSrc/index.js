/**
 * index.js - Main source code for Alexa Phant Weather Station Example
 * Jim Lindblom @ SparkFun Electronics
 * July 13, 2016
 * https://github.com/jimblom/alexa-phant-weather-report
 * 
 * This file implements the intent handlers for the custom, Phant-based Weather Station Alexa Skill.
 * See the README or this blog post for more information: https://www.sparkfun.com/news/2141
 * 
 * This code is released under the [MIT Licesnse](http://opensource.org/licenses/MIT).
 * 
 * Based on Amazon's HelloWorld sample
 * 	https://github.com/amzn/alexa-skills-kit-js/blob/master/samples/helloWorld/src/index.js
 * That is licensed under the Apache License, Version 2.0 (the "License"). A copy of the License is located at
 *     http://aws.amazon.com/apache2.0/
 * 	
 * Distributed as-is; no warranty is given.
 */


/** Contents of AlexaSkill.js - DO NOT EDIT THIS SECTION!!! 
 *  (CTRL-F AlexaSkill.js to get to end)
 *
 * Copyright 2014-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 * Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
 * http://aws.amazon.com/apache2.0/
 * or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
 * See the License for the specific language governing permissions and limitations under the License.
 */
function AlexaSkill(appId) {
    this._appId = appId;
}

AlexaSkill.speechOutputType = {
    PLAIN_TEXT: 'PlainText',
    SSML: 'SSML'
}

AlexaSkill.prototype.requestHandlers = {
    LaunchRequest: function (event, context, response) {
        this.eventHandlers.onLaunch.call(this, event.request, event.session, response);
    },

    IntentRequest: function (event, context, response) {
        this.eventHandlers.onIntent.call(this, event.request, event.session, response);
    },

    SessionEndedRequest: function (event, context) {
        this.eventHandlers.onSessionEnded(event.request, event.session);
        context.succeed();
    }
};

/**
 * Override any of the eventHandlers as needed
 */
AlexaSkill.prototype.eventHandlers = {
    /**
     * Called when the session starts.
     * Subclasses could have overriden this function to open any necessary resources.
     */
    onSessionStarted: function (sessionStartedRequest, session) {
    },

    /**
     * Called when the user invokes the skill without specifying what they want.
     * The subclass must override this function and provide feedback to the user.
     */
    onLaunch: function (launchRequest, session, response) {
        throw "onLaunch should be overriden by subclass";
    },

    /**
     * Called when the user specifies an intent.
     */
    onIntent: function (intentRequest, session, response) {
        var intent = intentRequest.intent,
            intentName = intentRequest.intent.name,
            intentHandler = this.intentHandlers[intentName];
        if (intentHandler) {
            console.log('dispatch intent = ' + intentName);
            intentHandler.call(this, intent, session, response);
        } else {
            throw 'Unsupported intent = ' + intentName;
        }
    },

    /**
     * Called when the user ends the session.
     * Subclasses could have overriden this function to close any open resources.
     */
    onSessionEnded: function (sessionEndedRequest, session) {
    }
};

/**
 * Subclasses should override the intentHandlers with the functions to handle specific intents.
 */
AlexaSkill.prototype.intentHandlers = {};

AlexaSkill.prototype.execute = function (event, context) {
    try {
        console.log("session applicationId: " + event.session.application.applicationId);

        // Validate that this request originated from authorized source.
        if (this._appId && event.session.application.applicationId !== this._appId) {
            console.log("The applicationIds don't match : " + event.session.application.applicationId + " and "
                + this._appId);
            throw "Invalid applicationId";
        }

        if (!event.session.attributes) {
            event.session.attributes = {};
        }

        if (event.session.new) {
            this.eventHandlers.onSessionStarted(event.request, event.session);
        }

        // Route the request to the proper handler which may have been overriden.
        var requestHandler = this.requestHandlers[event.request.type];
        requestHandler.call(this, event, context, new Response(context, event.session));
    } catch (e) {
        console.log("Unexpected exception " + e);
        context.fail(e);
    }
};

var Response = function (context, session) {
    this._context = context;
    this._session = session;
};

function createSpeechObject(optionsParam) {
    if (optionsParam && optionsParam.type === 'SSML') {
        return {
            type: optionsParam.type,
            ssml: optionsParam.speech
        };
    } else {
        return {
            type: optionsParam.type || 'PlainText',
            text: optionsParam.speech || optionsParam
        }
    }
}

Response.prototype = (function () {
    var buildSpeechletResponse = function (options) {
        var alexaResponse = {
            outputSpeech: createSpeechObject(options.output),
            shouldEndSession: options.shouldEndSession
        };
        if (options.reprompt) {
            alexaResponse.reprompt = {
                outputSpeech: createSpeechObject(options.reprompt)
            };
        }
        if (options.cardTitle && options.cardContent) {
            alexaResponse.card = {
                type: "Simple",
                title: options.cardTitle,
                content: options.cardContent
            };
        }
        var returnResult = {
                version: '1.0',
                response: alexaResponse
        };
        if (options.session && options.session.attributes) {
            returnResult.sessionAttributes = options.session.attributes;
        }
        return returnResult;
    };

    return {
        tell: function (speechOutput) {
            this._context.succeed(buildSpeechletResponse({
                session: this._session,
                output: speechOutput,
                shouldEndSession: true
            }));
        },
        tellWithCard: function (speechOutput, cardTitle, cardContent) {
            this._context.succeed(buildSpeechletResponse({
                session: this._session,
                output: speechOutput,
                cardTitle: cardTitle,
                cardContent: cardContent,
                shouldEndSession: true
            }));
        },
        ask: function (speechOutput, repromptSpeech) {
            this._context.succeed(buildSpeechletResponse({
                session: this._session,
                output: speechOutput,
                reprompt: repromptSpeech,
                shouldEndSession: false
            }));
        },
        askWithCard: function (speechOutput, repromptSpeech, cardTitle, cardContent) {
            this._context.succeed(buildSpeechletResponse({
                session: this._session,
                output: speechOutput,
                reprompt: repromptSpeech,
                cardTitle: cardTitle,
                cardContent: cardContent,
                shouldEndSession: false
            }));
        }
    };
})();
/**
 * End of AlexaSkill.js Section -- NOW YOU CAN EDIT!
 */

/**
 * Data.sparkfun.com stream strings
 */
var phantPubKey = "mKmNLmMpzotnQM1v5lV0"; // public key
var phantServer = "http://data.sparkfun.com"; // server

/**
 * App ID for the skill
 */
var APP_ID = ""; //[optional] Your unique Alexa skill application ID

/**
 * The AlexaSkill prototype and helper functions
 */
var http = require('http');

/**
 * WeatherReport is a child of AlexaSkill.
 * To read more about inheritance in JavaScript, see the link below.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Introduction_to_Object-Oriented_JavaScript#Inheritance
 */
var WeatherReport = function () {
    AlexaSkill.call(this, APP_ID);
};

// Extend AlexaSkill
WeatherReport.prototype = Object.create(AlexaSkill.prototype);
WeatherReport.prototype.constructor = WeatherReport;

WeatherReport.prototype.eventHandlers.onSessionStarted = function (sessionStartedRequest, session) {
    console.log("WeatherReport onSessionStarted requestId: " + sessionStartedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

WeatherReport.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    console.log("WeatherReport onLaunch requestId: " + launchRequest.requestId + ", sessionId: " + session.sessionId);
    var speechOutput = "Welcome to the SparkFun Weather Station reporter. Ask me the temperature, or for a report.";
    var repromptText = "You can say report!";
	// Welcome message from Alexa when the skill starts
    response.ask(speechOutput, repromptText);
};

WeatherReport.prototype.eventHandlers.onSessionEnded = function (sessionEndedRequest, session) {
    console.log("WeatherReport onSessionEnded requestId: " + sessionEndedRequest.requestId
        + ", sessionId: " + session.sessionId);
};

WeatherReport.prototype.intentHandlers = {
    // Register custom intent handlers:
	// Full weather report
	"WeatherReportFullIntent" : function (intent, session, response) {
		getPhantReport(null, function cb(err, data) {
			var speechOutput;
			if (err) {
				speechOutput = err;
			} else {
				speechOutput = "Here is your report: " + data;
			}
			response.tellWithCard(speechOutput, "Weather Station Report", speechOutput);
		});
		
	},
	// Temperature report
	"WeatherReportTemperatureIntent": function (intent, session, response) {
		getPhantReport("temperature", function cb(err, data) {
			var speechOutput;
			if (err) {
				speechOutput = err;
			} else {
				speechOutput = "The temperature is " + data + " degrees farenheit.";
			}
			response.tellWithCard(speechOutput, "Weather Station Temperature", speechOutput);
		});
	},
	// Humidity report
	"WeatherReportHumidityIntent": function (intent, session, response) {
		getPhantReport("humidity", function cb(err, data) {
			var speechOutput;
			if (err) {
				speechOutput = err;
			} else {
				speechOutput = "The relative humidity is " + data + " percent.";
			}
			response.tellWithCard(speechOutput, "Weather Station Humidity", speechOutput);
		});
	},
	// Help report
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("Ask me for the temperature, or a report.", "Aske me for the temperature, or a report.");
    }
};

// Reads from the phantPubKey Phant stream and returns a report string.
// If field is null, the function returns a full report.
// If the field is a string, the function will look for that field-string in the Phant stream and return that value.
function getPhantReport(field, cb) {

	// Construct a Phant output URL. Just request the last data push with latest.
	var url = phantServer + "/output/" + phantPubKey + "/latest.json";
	
	http.get(url, function(rsp) {		
		var responseData = '';
		
		if (rsp.statusCode != 200) { // If response wasn't successful
			cb(new Error("Response: " + rsp.statusCode)); // Return error
		}
		rsp.on('data', function(data) {
			responseData += data; // Read in data
		});
		rsp.on('end', function() {
			if (field) { // If field is a string, look for that field and return the data
				var jsonData =  JSON.parse(responseData)[0][field];
				cb(null, jsonData);
			} else { // If field is null, return a full report
				var jsonData =  JSON.parse(responseData)[0];
				var returnResponse = '';
				for (var key in jsonData) {
					if (key != "timestamp") { // Filter out timestamp
						var dataName = '';
						var units = '';
						switch (key) {
						case "humidity":
							dataName = "humidity";
							units = "percent";
							break;
						case "pressure":
							dataName = "pressure";
							units = "hectopascals";
							break;
						case "rainin":
							dataName = "rainfall";
							units = "inches";
							break;
						case "temperature":
							dataName = "temperature";
							units = "farenheit";
							break;
						case "winddir":
							if (jsonData[key] != "No Wind")
								dataName = "wind direction";
							break;
						case "windspeed":
							dataName = "wind speed";
							units = "miles per hour";
							break;
						}
						if (dataName != '')
							returnResponse += dataName + " is " + jsonData[key] + " " + units + ". ";
					}
				}
				cb (null, returnResponse);
			}
		});
	}).on('error', function(e) {
		console.log("Communications error: " + e.message);
        cb(new Error(e.message));
		return;
	});
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    // Create an instance of the WeatherReport skill.
    var weatherReport = new WeatherReport();
    weatherReport.execute(event, context);
};

