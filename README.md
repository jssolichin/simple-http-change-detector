Simple HTTP Change Detector
===========================

This is a minimal app that requests the target page's headers to get the page's `content-length` and compares it to a previously known value to see whether the page has changed. This is done in order to limit the amount of information requested and received from the server thereby hopefully decreasing stress on the server from constant pinging. 

## How to use 
1. `$ git clone https://github.com/jssolichin/simple-http-change-detector` 
2. `npm install` (to install nodemailer for notification).
3. Edit app.js and change `host`, `path`, `transporter`, and `sendOption` as appropriate.
3. Set up task scheduler (refer to next section).

## Change Detection Interval
For seperation of concerns, the app itself only runs once and requires a task scheduler. Every OS comes with their own task scheduler and there is no need to add additional bloat that will not be as robust as the built-in scheduler. Below are information on each system's task scheduling mechanism. 

* [Windows' Task Scheduler](http://windows.microsoft.com/en-us/windows/schedule-task#1TC=windows-7)
* [Mac's LaunchD](http://launchd.info/)
* [UNIX/Linux' Cron](http://www.thegeekstuff.com/2009/06/15-practical-crontab-examples/)  (My own set up at the end) (Mac users can technically use this as well, but it is discouraged in place of  launchd)

If you have your own method of task scheduling, feel free to use it!

## Notification
For notification, the app utilizes nodemailer. Nodemailer allows the app to send email. Please refer to [nodemailer](http://www.nodemailer.com/) for a more extensive documentation. A list of common services (e.g. gmail, yahoo, etc.) are available [here](https://github.com/andris9/nodemailer-wellknown#supported-services) for easy setting up.

**Note:** Email can be used to send [SMS](http://www.emailtextmessages.com/)

## Cron Example
1. `$ crontab -e`
2. Add the following line at the end for a 5 minute interval detection from 7am to 2am
	
    `*/5 0-2,7-23 * * * user /usr/bin/nodejs /home/pinger/app.js`
    
###Crude Explanation    
Cron syntax: minutes, hour, day of month, month, day of week, user, command. 

So we are saying: 

 * `*/5` means every 5 minutes (*/ means interval rather than that number)
 * `0-2,7-23` means every hour that starts with 0-2 and 7-23 (aka 7 a.m. to 2 a.m.)
 * `*` every day of the month
 * `*` every month
 * `*` every day of the week
 * `user` means run the command with the user called user
 * `/usr/bin/nodejs` is the location of nodejs
 * `/home/pinger/app.js` is the location of the app