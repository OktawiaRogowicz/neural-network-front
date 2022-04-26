<h2 align="center">
  
  🖼️ <code>QUICK, HELP!</code> 🖼️
  
  Web application categorizing hand drawn pictures and shapes using neural network
  
  🧠
  
  <code>front-end</code> </h2>

<div align="center">
This is front-end respository for my thesis. <a href="https://github.com/OktawiaRogowicz/neuralNetwork">Front-end can be viewed here</a>! 

The aim of the project as a whole is an implementation of a website allowing its users to play cha-
  rades with a neural network, similarly to Google’s <b>Quick, Draw!</b>. 
  
.

<strong>Heroku</strong>: <a href="neural-network-react.herokuapp.com"><strong>LIVE SITE</strong></a>
</div>

<h1><code>Overview</code></h1>

> Front-end part of the project has been designed using JavaScript and its library React. It
allows not only to game, but also to collect all drawn pictures, categorizing each one of
them accordingly. Collected data is saved in a data base created in Cloudinary. During
the development process, about 1000 unique images drawn by individual users has been
collected, which then have been subjected to data augmentation. The neural network’s
accuracy oscillates around 81%.

> After starting the game, the exchange with neural network starts. During ten rounds,
the player has the task to draw ten drawing prompts, which neural network then tries to
categorize correctly. The user then can look into its results and errors, and eventually -
play again.



<div align="center">
  <img src="https://github.com/OktawiaRogowicz/neural-network-front/blob/main/utils/images/collecting3.png?raw=true"
    alt="Screenshot" width="500"/>
</div>



<div align="center">
  HTML <strong>||</strong> CSS <strong>||</strong> flexbox <strong>||</strong> React <strong>||</strong> Styled components <strong>||</strong> TensorFlow.js
  
   Node.js <strong>||</strong> TensorFlow <strong>||</strong> Keras <strong>||</strong> Python
  
<strong>Heroku</strong>: <a href="neural-network-react.herokuapp.com"><strong>LIVE SITE</strong></a>
</div>


To make my project possible, I needed to divide it into three parts.

<code>first part</code>

As one of the premises was training my own neural network, I needed big enough database, as anything less than one hundred images per category will not be useful. To collect my own database, I decided to create a website, on which players will be able to help me collect pictures for the neural network, <b>second part</b> of the project - thus the name of the project, back from the times when I promoted it online.

<code>second part</code>
...was creating neural network. After deciding on the architecture, I wrote few scripts - that can be viewed in the root folder - preprocessing collected images into much more accessible contect. Afterwards, using TensorFlow and Keras, I trained a neural network with a success rate oscillating around 81%. 

<code>third part</code>
Putting together neural network and a website prepared before. Using TensorFlow.js and Node.js, I let the user to exchange data with my neural network - and finished the game. Afterwards, thanks to JavaScript, I was able to put a few more details into the page.

### Summary

Each game lasts ten round, and every round takes fifteen seconds. At the start, player is given word prompt, then sees the canvas and timer, and after proceeding to the next page the gamer then can look into the judgement and mistakes of AI, with the possibility of given drawing being either category shown each in a new line.

Programmatically, this process starts a little bit earlier. When clicking the "Next" button, the image drawn by the user is processed into a tensor keeping its size and number of layers: 4 layers 400 pixels wide and 400 pixels high. After scaling the drawing down to one hundred pixels high and wide to match the neural network's input size, each pixel's value is further divided by 255 to keep them between 0 and 1. Four layers result from using HTML canvas: each image produced has an alpha channel responsible for transparency but is not needed in this case. After flattening the tensor, only each fourth variable is given to the neural network, which at the same time is the end of the process of data preparation. Besides all that, using Cloudinary Uploader, the image – that at this point has been transformed to be base 64 encoded – is also sent to the database. Thanks to custom upload presets assigned to each user, sending the image is a matter of preparing a POST request using Express.js functionality.

### What I learned

Reasons to do this project were pretty simple - it is something I wanted to learn and try out, so I did. As it turns out, the knowledge is not only practical and beneficial, but the process of learning, for me, was also simply enjoyable and amusing. I found JavaScript and React easy to use, with great possibilities, and neural networks fascinating – observation of expanding database and how the network's thought process alternates with each change was absorbing and informative.

### Continued development

In the original Google's <b>Quick, Draw!</b> game images are predicted in real-time. Making it work with the current database would be problematic; however, rebuilding the code accordingly and collecting new data would be possible. In such a case, real-time predictions could happen and using recursive neural networks to guess how player's next line could be drawn.

<h1><code>Author</code></h1>

- Website - [Add your name here](https://www.your-site.com)
- Frontend Mentor - [@yourusername](https://www.frontendmentor.io/profile/yourusername)
