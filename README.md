# Apps.BadWords - Google Summer of Code 2021
<div  align="center">
	<img src="https://rocket.chat/wp-content/uploads/2021/02/Frame.png.webp" width="650" alt="google-summer-of-code">
	<br>
	<b>
		<p>
	Apps.BadWords : A Rocket.Chat App for bad words filtration for incoming messages and apply moderation policies.
		</p>
	</b>
</div>

# Abstract

Currently Rocket.Chat supports the bad words filtration of incoming messages in channels but that is not much customizable for the user. The idea for this App is to utilize the capabilities of Rocket.Chat.Apps-Engine and make a Rocket.Chat app which can provide a feature rich experience to the users and people can use the app according to their needs.

## Features

The features of the project are as follows:

* Basic App Settings and Settings handler.
  * Settings Handler called every time any settings changes or when the app restarts.
 
* Getting the final list of blocked words. 
  * Fetching words from URL.
  * Getting user defined blocked words.
  * Removing user defined allowed words from the list of blocked words.
  * Getting list of Blocked words whenever app starts or restarts.
 
* Basic Message Filtering.
  * Checking the message against the list of blocked words at the time of saving new message and removing blocked words.
  * Cheking the message against the list of blocked words whenever any message is edited and removing the blocked words.

* Applying moderation policies for offending users
  * Storing the number of times a user uses bad words in a channel.
  * Banning a user and not letting the user send message in the room if the user exceeds the threshold limit set by admin.
  * Showing warnings to the users whenever a bad word in their message is found.
  
## Steps to run

Clone the repository and install dependencies
```bash
https://github.com/RocketChat/Apps.BadWords.git
cd Apps.BadWords
npm install
```

Make sure you have globally installed [Rocket.Chat.Apps-cli](https://www.npmjs.com/package/@rocket.chat/apps-cli)
```bash
npm install -g @rocket.chat/apps-cli
```

Make Sure you have Rocket.Chat server running on your localhost and you have enabled the Apps development mode in admin settings. If not then enable by - `Administration -> Geneal -> Apps -> Enable development mode`

Now you are all set to install the app by -
```bash
rc-apps deploy --url http://localhost:PORT --username "username" --password "password"
```
