# Microsoft Engage 2021


The PEERify app has been developed with the aim to solve one of the biggest problems that has arisen in the pandemic for the student community i.e., the lack of interaction among the students and the distractions online mode has caused. 

**How will we help students?**
Our solution deals with the above mentioned problems by filtering and presenting relevant content from YouTube on the basis of the subjects student have enrolled in, which they can discuss on our PEERify meeting platform.

We also provide a scheduler which pairs students on the preference of their subjects for discussion. This is done in unbiased fashion to promote interaction and useful discussions.

**What do teachers have in store?**
The pictorial representation of the daily interactions and overall figures of last 30 days are available.Teachers can view this information and plan ways to increase the interest and involvement of students in respective subjects.

***

## Tech Stack

* Frontend : React (v17.0.2)
* Backend : Express.js (v4.17.1)
* Database : MongoDB (v4.1.4)
* Platform : Node.js (v16.13.0)

***

**Please ensure the following steps first**

* Log into your google account, go to Google Cloud Platform. Create a project, configure OAuth Consent Screen and get the Client ID and Client secret for authentication.

* Enable the GMail API and YouTube Data API v3 under YouTube API in the library.

* For the YouTube Data API, collect the API key.

* Go to [Google OAuth 2.0 PlayGround](https://developers.google.com/oauthplayground/) to obtain the refresh and access token for GMail API v1 (https://mail.google.com)

* Go to backend > api > cronJob.js,
    * Add email id, password, clientID, client secret, refresh token, access token in line #109, #110, #111, #112, #113 and #114 respectively.
    
    * Also add email id in line #124.

* Go to backend > dao > peopleDAO.js
    * Add the YouTube data API key in line #6.

* The MongoDB URI is provided in .env file currently for testing purpose.

***

## Steps to run

* Go to /backend 
    * Install all the dependencies using package.json using `npm i`

* Go to /frontend
    * Install all the dependencies using package.json using `npm i`

* Ignore the package.json in the root directory

* Go to /backend, run `npm start`
* Go to /frontend, run `npm start`








