const https = require('https');
const fs = require('fs');

const args = process.argv.slice(2)
const strapiAPIURL = args[0];
const pathOfJSONFileBeingWritten = args[1];
const nameOfFile = args[2] ? args[2] : 'ui-cms-content.json'; 

https
  .get(strapiAPIURL, (resp) => {
    try
    {
      if (resp.statusCode != 200) {
	    throw new Error("Request did not succeed.");
      }	
		
      let data = '';

      // A chunk of data has been received.
      resp.on('data', (chunk) => {
        data += chunk;
      });

      // The whole response has been received. Print out the result.
      resp.on('end', () => {
        console.log(JSON.parse(data));
        if (!fs.existsSync(pathOfJSONFileBeingWritten)){
          fs.mkdirSync(pathOfJSONFileBeingWritten, { recursive: true });
	    }	  
        fs.writeFile(pathOfJSONFileBeingWritten+nameOfFile, data, (err) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log('\nSuccessfully wrote JSON file.');
        });
      });
    } catch (e) {
      console.error(e.message);
    }	
  })
  .on('error', (err) => {
    console.log('Error: ' + err.message);
  });