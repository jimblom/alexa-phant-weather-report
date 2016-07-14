# Example Phant-Reading Alexa Skill - Weather Station Demo

Alexa skill that teaches her how to read from a Phant stream (e.g. [data.sparkfun.com](http://data.sparkfun.com) and announce the temperature, humidity, etc. 

## Contents

* _src_ - Javascript source file(s) for the app. These files are hosted and run by Amazon's Lambda service.
* _speechAssets_ - Intent Schema and Sample Utterances for the Skill. The contents of these files are pasted into the Skill's configuration console.
* _altSrc_ - Alternate, single-file source code. Can be pasted into Lambda's inline editor.
* _Firmware_ - Example weather station firmware for a [Photon](), [Photon Weather Shield](), and [Weather Meter](). Check out [this tutorial]() for more information.

## Setup
To run this example skill you need to do two things. The first is to deploy the example code in lambda, and the second is to configure the Alexa skill to use Lambda.

### [optional, example stream can be used] Phant (Data.SparkFun.Com) Setup
1. Go to [data.sparkfun.com](http://data.sparkfun.com) and click the "Create"
2. Name your Phant stream and give it a description.
3. In the fields list, add fields for temperature, humidity, pressure, rainin, winddir, and windspeed (typed exactly).
	* The source code is designed to work with these fields. You can add, remove, or change the names, but the code will need to be adjusted.
4. [optional] Add an alias, tags, or location if you.
5. Click "Save"
6. Copy the keys, and keep the public key especially handy. Email yourself the keys if you prefer.

### AWS Lambda Setup
1. Go to the AWS Console and click on the Lambda link. Note: ensure you are in us-east or you won't be able to use Alexa with Lambda.
2. Click on the Create a Lambda Function or Get Started Now button.
3. Skip the blueprint
4. Name the Lambda Function "SparkFun-Weather-Station.
5. Select the runtime as Node.js
6. Go to the the src directory, select all files and then create a zip file, make sure the zip file does not contain the src directory itself, otherwise Lambda function will not work.
7. Select Code entry type as "Upload a .ZIP file" and then upload the .zip file to the Lambda
8. Keep the Handler as index.handler (this refers to the main js file in the zip).
9. Create a basic execution role and click create.
10. Adjust the timeout in advanced settings to 30 seconds.
11. Click "Next" and review the settings then click "Create Function"
12. Click the "Event Sources" tab and select "Add event source"
13. Set the Event Source type as Alexa Skills kit and Enable it now. Click Submit.
14. Copy the ARN from the top right to be used later in the Alexa Skill Setup.

### Alexa Skill Setup
1. Go to the [Alexa Console](https://developer.amazon.com/edw/home.html) and click Add a New Skill.
2. Set "Weather Station" as the skill name and "my weather station" as the invocation name, this is what is used to activate your skill. For example you would say: "Alexa, Ask my weather station for a report."
3. Select the Lambda ARN for the skill Endpoint and paste the ARN copied from above. Click Next.
4. Copy the Intent Schema from the included IntentSchema.json.
5. Copy the Sample Utterances from the included SampleUtterances.txt. Click Next.
6. [optional] In src/index.js change `phantPubKey` to the public key of your Phant stream.
7. [optional] go back to the skill Information tab and copy the appId. Paste the `appId` into the src/index.js file for the variable `APP_ID`,
   then update the lambda source zip file with this change and upload to lambda again, this step makes sure the lambda function only serves request from authorized source.
8. You are now able to start testing your sample skill! You should be able to go to the [Echo webpage](http://echo.amazon.com/#skills) and see your skill enabled.
9. In order to test it, try to say some of the Sample Utterances from the Examples section below.
10. Your skill is now saved and once you are finished testing you can continue to publish your skill.

## Examples
### Dialog model:
    User: "Alexa, ask my weather station the temperature."
    Alexa: "The temperature is 79.5 degrees farenheit"
	
	User: "Alexa, start my weather station."
	Alexa: "Welcome to the SparkFun Weather Station reporter. Ask me the temperature, or for a report."
	User: "Give me a report."
	Alexa: "Humidity is 25.5%, pressure 888 is hectopascals, rainfall is 0.00 inches, temperature is 79.5 degrees farenheit, windspeed is 0.0 miles per hour."