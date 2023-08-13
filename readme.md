# Web Codecs Encode and Decode


## Description
Welcome to **Web Codecs Encode and Decode**! This is a simple web application designed to use the WebCodecs standard, This app encodes a set of frames from users web cam. while changing web apps background color according to the provided pattern. then shows back the captured frames.

### Go to [https://webcodecs-encode-decode.web.app/](https://webcodecs-encode-decode.web.app/) to view the hosted app. 

## Features
- [Choose Camera]: Choose the best resolution camara which faces the user
- [Toggles the background color]: Toggles the background color according to the pattern
- [Capture and encode frames]: capture single frame per one item in the provided pattern
- [Display the frames]: display the captured frames 

## How to Run
To run **Web Codecs Encode and Decodee**, follow these steps:

1. Clone this repository to your local machine:
```
git clone https://github.com/chamupathi/webcodecs-encode-decode.git
```


2. Navigate to the project directory:
```
cd webcodecs-encode-decode
```


3. Install the required dependencies using [package manager, e.g., npm or yarn]:
```
npm install
```


4. Start the development server:
```
npm start
```


5. Open your web browser and go to [http://localhost:3000/](http://localhost:3000/) to view the app. Use chrome browser as Webcodecs is not yet supported in other browsers.

## How to change the pattern 
go to `index.js` and update the `COLOR_STREAM` array.

## How to change the frames per second 
go to `index.j`s and update the `NUM_OF_FRAMES_PER_SEC` field.

## How to change the colors
go to `color-config.js` and update the colors.


## Contact
For inquiries, feel free to contact me at [chamupathi.mendis.cs@gmail.com](mailto:chamupathi.mendis.cs@gmail.com).
