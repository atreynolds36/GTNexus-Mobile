![] (https://github.com/atreynolds36/GTNexus-Mobile/blob/master/Mobile-App/images/GT%20Nexus%20Inbox%20Header.jpg)

GTNexus-Mobile
==============

Source for Mobile Application developed on GTNexus Platform

## About

Applications built on the GTNexus platform allow developers
to enhance and extend the core GT Nexus process and integrate 
with their existing systems in real time using an application 
platform and an open data API. This repository provides an example
of an application that is deployable to any mobile device and 
displays the power of the AppXpress API. The AppXpress API allows
flexibility and accessibility to the vast data stored on the GTNexus
platform through an easy to use RESTful service. 

## Information

This repository contains source code for an App that is designed to
be built on the open source technology framework PhoneGap. PhoneGap allows
mobile apps to be web based and then built to be deployed on specific 
devices in order to utilize the devices native features. This allows one
code base for applications that can run on IOS, Android, Blackberry, etc.

### Installation
================

To be able to deploy the web based code located in the Mobile-App folder, 
there are a couple of steps that must be followed to be able to build the 
app to deploy it on the operating system of your choice. Ultimately, free 
open source software PhoneGap will do the majority of the heavily lifting 
of converting our web based source code into platform specific code.

#### Step 0 - Set Up

Before PhoneGap can be installed, freeware Node.js must be installed. 
Node.js is an environment that allows Javascript to be run outside of 
the browser. In this case, on the Phonegap cloud. It can be found [here] (http://nodejs.org/).
Downloading and installing it is generally straight forward. 
	
#### Step 1 - Install Phonegap 

Once nodejs is installed, run the following command from your command prompt:
 
On Windows:           `npm install -g phonegap`

On Mac or Linux:      `sudo npm install -g phonegap`

This might take a few moments, while PhoneGap downloads and installs. 

#### Step 2 - Create Phone Gap App

Go to a directory where you want to maintain your source code and run the following command

`cordova create <directory-name> <reverse-style identifier> <display-title>`

Directory Name specifies the location of your project. This directory name should not
already exist.

Reverse style identifier is an optional argument

Display title specifies the applications display title

Example:

`cordova create hello com.example.helloworld HelloWorld`

Creates a project in hello with reverse style identifier com.example.helloworld and display
title HelloWorld

#### Step 3 - Pull Web-based Source Code from Git

Once the app has been created in a directory, go into that directory and look for the *www* folder.
The *www* folder should contain a subfolders js, img, and css. This is the folder where the source
code will be stored in. Before you pull it from GIT, you must clear out this folder.

Run ->     `rm -rf *`

This will completely clear the folder.

Next, initialize a new GIT repository.

Run ->     `git init`

Finally, pull down the source code in the GIT repository. Make sure not to clone the repository, as
this will create a subfolder in the www that could mess up the phone gap build.

Run->      `git pull https://atreynolds36/GTNexus-Mobile/`

You should see a new js, css, and img folder in the www folder and an index.html folder. These
folders are the source of your phone gap app.

#### Step 4 - Add Platform + Plugin

Go into back into your project directory ( 'cd ..' from your current location, the www folder). 
Now, add the specific platform you wish to deploy you app onto.

For IOS, run ->		`cordova platform add ios`

For Android, run -> `cordova platform add android`

Other options can be seen [here] (http://docs.phonegap.com/en/edge/guide_cli_index.md.html#The%20Command-Line%20Interface)

To confirm that this step worked correctly, go into platforms folder. You should see a folder indicating
the platform you have just added.

After the platform is added, any plugins used in the app must be added. This app only uses a connection
plugin. Phonegap plugins allow the web based code to access native features on a mobile devices operating
system. When building your own app, check out all of the available plugins [here](http://docs.phonegap.com/en/3.3.0/guide_hybrid_plugins_index.md.html#Plugin%20Development%20Guide)

Run this command to add the plugin for network connection.

Run->	`cordova plugin add org.apache.cordova.network-information`

You can run `cordova plugin ls` to confirm that the plugin was added correctly.
 
	
#### Step 5 - Build you app 

You are ready to build you app. For the app to be successfully built, your platform specific
SDK must be downloaded and added to your PATH.   
	
* For Android, follow download from->        [Android SDK] (http://developer.android.com/sdk/index.html)
* For IOS, follow download from ->           [IOS SDK](https://developer.apple.com/xcode/downloads/)
* For Blackberry, follow download ->         [Blackberry SDK](http://developer.blackberry.com/)

Once you have done this, build your app.

Run ->   `cordova buid`

This might take a few seconds the first time. You should see *BUILD SUCCESSFUL* message to indicate
that the app has been built. If you get errors, make sure your path is configured correctly. For android,
apache ant and your jre must be attached to your path. For any type of build, your SDK must also be 
attached to the path.

#### Step 6 - Deployment

The app now should be ready for deployment. Run it with an emulator or on a connected device. 
To edit the app or rebuild it, go to where your app has been built and replace the www folder with 
the updated www folder (www folder holds all of the source code for a web based app). Now, all 
you have to do is run  -> `cordova build` from the command prompt and the app will be rebuilt with the new changes.
	
More information on Phone Gap can be found from their [installation guide] (http://docs.phonegap.com/en/edge/index.html)


### Using the To-Do List App
============================

##### I. Purpose

The purpose of this application is to allow organizations within the GTNexus community 
to assign short and simple tasks to each other right from their mobile devices. The app 
currently allows tasks to flow in one direction; an organization designated as a **buyer** 
in the GTNexus community can assign tasks to organizations designated as sellers and the 
sellers can mark tasks as complete as they are completed.

##### II. Functionality

* **Login Page**

  To log in to the app, a user must have a valid userID for the GTNexus network. The login page will remember 
  the last username that has been typed into the app, but it will not remember the password for security purposes. 
  Every time the app is closed it will require the user to re login to the app.
	
**A – Buyer Side**


*  **Home Page**
  
    Once a buyer logins into the app, a list of different tasks will be displayed. An organization can have 
	different lists of tasks to help keep themselves organized. The first time the buyer uses the app there 
	will be no lists displayed. The buyer must add a list in order to assign tasks. In other words, a task 
	must be part of a list, even if the tasks in the list are unrelated or are assigned to different organizations. 
	To create a new list, touch the add symbol in the top right most corner of the app. This will prompt the user 
	to enter in a title for the list and then once the create list button is pressed will add a list to the home 
	screen. It is important to note that the back button if pressed while in the home page will exit the app and 
	require the user to log back into the app. 
	
*  **List Page**
  
	From the home screen, the user can press or swipe right on a list in order to view the tasks associated with 
		that specific list. This screen will show the list of all of the tasks with a blank checkbox to the left of 
		the task’s title. The buyer can press on a specific task in order to modify it or the buyer can click the 
		checkbox, indicating that the task should be discarded. Previous to the home page, in the upper right corner 
		there is an add button that when pressed will show a panel giving the user two options; to add a new task 
		or to view the completed/discarded tasks associated with this list. The menu button on the mobile device 
		if pressed will show the current organization, the current user ID, and the role that the organization 
		has in the GTNexus community. 
		
*	**Add New Task**
	
	When the Add New Task button is pressed on it will bring the user to a screen in which it can create 
	a new task. There are two fields; a task title field and a task description. Below both of these fields 
	is a dropdown menu labeled Look-up, in which the user can scan through the organizations associated with
	it in the GTNexus community and select an organization to assign this specific task to. If it is unclear
	who this task will be assigned to, the user also has the option to leave the task unassigned by either
	not selecting an organization or by clicking the ‘Leave Task Unassigned’ checkbox. If the ‘Leave Task 
	Unassigned’ checkbox is checked the task will be unassigned, regardless of whether an organization is 
	selected from the dropdown menu. Once the user is done creating a task, click ‘Create Task’ to create 
	the task and add it to the GTNexus platform. It is important to note that once a task is created it does
	not mean that the organization the task has been assigned to can access the task yet. For this to happen, 
	you have to go into the task and specifically task it to the party.
		
*	**View Task**
	
	When the buyer presses on the task title button on the list page the view task page will display.
	This page allows the buyer to edit the task or add notes to the task. Most importantly on the page 
	is the ‘Task it’ button near the bottom of the page. When the button displays the text ‘Task it’, 
	it indicates that the task has not yet been made visible to the assigned organization. To allow 		
	the organization to view the task and thus complete the task, the user must press on the button.		
	The button’s text will turn to ‘Tasked’ indicating that the task has been made visible. The 
	buyer also has the ability to mark the task as being completed by pressing the completed button 
	at the bottom of the screen. Any edits to the task will immediately be made visible to the 
	organization to which the task has been assigned to. Also note that any edits will be saved
	even if the ‘Save Changes’ button is not explicitly pressed in the edit task view. 
		
*	**History View**
	
	From the List Page, the user can also view the tasks that have been completed or discarded by clicking 
	on the plus sign in the top right corner and navigating to the View Completed Tasks Page. This page 
	will list all of the tasks associated with this specific list that have previously been assigned. 
	The tasks will be not able to be edited but can be reopened by the buyer. If the task is reopened, 
	it will reappear in the List Page and will disappear from History. It is important to note that 
	once the task has been reopened it will not be made visible to the assigned organization until 
	the task is *Tasked* again.
		
*	**Search Panel**
	
	From the home page for the buyer and the seller there is a search icon in the top left of the screen. 
	The search panel allows the user to search for a specific task or a set of tasks. There are three 
	fields in which to choose from; Task Name, Task Assignee (organization that is assigned the task),
	and Task State (unassigned, assigned, tasked, or completed). It is important to note that the 
	Task Assignee field and Task Name field will look for fields that contain the inputted search 
	string while the Task State field requires that the state be spelled out accurately. It is 
	also important to note that the fields are case sensitive. 
		
		
**B – Seller Side**
	
* **Home Page**
		
	Once the seller logs into the app a page will display that will show all of the current outstanding 
	tasks that have been assigned to it. From this page, the seller can click on a task to view the 
	description of the task or it can mark the task as complete. Similar to the buyer, once a task 
	is complete it will be relocated to the history page where all of the completed tasks will be 
	shown in a list. 
		
* **Buyer/Seller Differences**
		
	The seller, unlike the buyer, cannot edit the tasks, assign tasks, reopen tasks, or create 
	lists of tasks. The seller side is designed for simplicity; the seller will have tasks assigned 
	to it and checks them off as completed accordingly.   	
	
##### III. How it Works

The application works by making RESTful Service calls that manipulate custom objects that exist 
on the GTNexus Platform that allow the user to move these custom objects( tasks ) through a 
workflow in order to assign one to an organization and eventually mark the task as having been completed. 


### Additional Notes

- This repository contains a branch, Android App, that contains a build of the app on the **Android Platform**
- The App uses the Jquery Mobile web framework. More information on that can be found [here](http://jquerymobile.com/).


*Andrew Reynolds* <br>
*GTNexus* <br>
*August 6, 2014* <br>
 

