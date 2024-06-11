const fs = require('fs')
const inquirer = require("inquirer");
const {Circle, Square, Triangle} = require("./lib/shapes");

// Defines a Svg class that has a constructor with three methods for rendering and setting the text and shape elements in the SVG string.
class Svg{
    constructor(){
        this.textElement = ''
        this.shapeElement = ''
    }
    render(){
        return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="300" height="200">${this.shapeElement}${this.textElement}</svg>`
    }
    setTextElement(text,color){
        this.textElement = `<text x="150" y="125" font-size="60" text-anchor="middle" fill="${color}">${text}</text>`
    }
    setShapeElement(shape){
        this.shapeElement = shape.render()
    }
    
}

// Each question is an object that specifies the properties of TEXT, TEXT COLOR, SHAPE COLOR, and Pixel Image.
const questions = [
    {
        type: "input",
        name: "text",
        message: "TEXT: Enter up to (3) Characters:",
    },
    {
        type: "input",
        name: "text-color",
        message: "TEXT COLOR: Enter a color keyword (OR a hexadecimal number):",
    },
    {
        type: "input",
        name: "shape-color",
        message: "SHAPE COLOR: Enter a color keyword (OR a hexadecimal number):",
    },
    {
        type: "list",
        name: "shape-type",
        message: "Choose which Pixel Image you would like?",
        choices: ["Circle", "Square", "Triangle"],
    },
];

// Function to write data to file
function writeToFile(fileName, data) {
	console.log("Writing [" + data + "] to file [" + fileName + "]")
    fs.writeFile(fileName, data, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log("Generated a logo.svg!");
    });
}

async function init() {
    console.log("Starting init");
	let svgString = "";
	let svg_file = "logo.svg";

    // Prompt the user for answers
    const answers = await inquirer.prompt(questions);

	//user text
	let user_text = "";
	if (answers.text.length > 0 && answers.text.length < 4) {
		// 1-3 chars, valid entry
		user_text = answers.text;
	} else {
		// 0 or 4+ chars, invalid entry
		console.log("Please enter 1-3 Characters!");
        return;
	}
	console.log("User text: [" + user_text + "]");
	//user font color
	user_font_color = answers["text-color"];
	console.log("User font color: [" + user_font_color + "]");
	//user shape color
	user_shape_color = answers["shape-color"];
	console.log("User shape color: [" + user_shape_color + "]");
	//user shape type
	user_shape_type = answers["shape-type"];
	console.log("User entered shape = [" + user_shape_type + "]");
	
	//user shape
	let user_shape;
	if (user_shape_type === "Square" || user_shape_type === "square") {
		user_shape = new Square();
		console.log("User selected Square shape");
	}
	else if (user_shape_type === "Circle" || user_shape_type === "circle") {
		user_shape = new Circle();
		console.log("User selected Circle shape");
	}
	else if (user_shape_type === "Triangle" || user_shape_type === "triangle") {
		user_shape = new Triangle();
		console.log("User selected Triangle shape");
	}
	else {
		console.log("Invalid shape!");
	}
	user_shape.setColor(user_shape_color);

	// Create a new Svg instance and add the shape and text elements to it
	let svg = new Svg();
	svg.setTextElement(user_text, user_font_color);
	svg.setShapeElement(user_shape);
	svgString = svg.render();
	
	//Print shape to log
	console.log("Displaying shape:\n\n" + svgString);
	//document.getElementById("svg_image").innerHTML = svgString;

	console.log("Shape generation complete!");
	console.log("Writing shape to file...");
	writeToFile(svg_file, svgString); 
}
init()