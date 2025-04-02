let classifier;
let video;
let resultMessage = "";
let processing = false;
let analyzeButton;
let spinnerAngle = 0;

// A list of keywords that we consider inflammatory (adjust as needed)
const inflammatoryItems = [
  "fried", 
  "sugar", 
  "soda", 
  "candy", 
  "pizza", 
  "hamburger", 
  "ice cream"
];

function preload() {
  // Load the MobileNet model from ml5.js
  classifier = ml5.imageClassifier('MobileNet');
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();
  
  // Create a button to trigger the classification
  analyzeButton = createButton('Capture & Analyze');
  analyzeButton.position(10, height + 10);
  analyzeButton.mousePressed(classifyImage);
}

function draw() {
  background(220);
  image(video, 0, 0, width, height);
  
  // If processing, show a rotating spinner
  if (processing) {
    drawSpinner();
  }
  
  // Display the result message
  fill(255, 0, 0);
  textSize(32);
  textAlign(LEFT, TOP);
  text(resultMessage, 10, 10);
}

function classifyImage() {
  if (processing) return; // Prevent duplicate calls
  processing = true;
  resultMessage = "";
  
  // Classify the current video frame
  classifier.classify(video, gotResult);
}

function gotResult(error, results) {
  processing = false;
  if (error) {
    console.error(error);
    resultMessage = "Error in classification";
    return;
  }
  
  // Get the top label from the results
  let label = results[0].label.toLowerCase();
  console.log("Classification Results:", results);
  
  // Check if any inflammatory keywords are found in the label
  let isInflammatory = inflammatoryItems.some(item => label.includes(item));
  
  resultMessage = isInflammatory ? "INFLAMMATORY" : "Not Inflammatory";
}

function drawSpinner() {
  push();
  translate(width / 2, height / 2);
  stroke(0);
  strokeWeight(4);
  noFill();
  ellipse(0, 0, 50, 50);
  push();
  rotate(spinnerAngle);
  line(0, 0, 0, -25);
  pop();
  pop();
  spinnerAngle += 0.1;
}
