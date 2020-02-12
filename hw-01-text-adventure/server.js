const express = require("express");
const fs = require("fs");
const port = process.env.PORT || 5000;

const app = express();

app.use(express.static("static"));
// app.use(express.urlencoded());

const locations = [
    {
        name: "hallway",
        template: "hallway.html"
    }
];


// Game state
let inventory = [];
let health = 10; //1-10 
let date = 1;
let mask = 0;
let grocery = 0;
let ordered = 0;
let sanitized = 0;
let wind = 0;
//let lastLocation = undefined;

function makeContent(title, text, options) {
    let htmldoc = fs.readFileSync("./templates/index.html", "utf8");
    htmldoc = htmldoc.replace("%%%TITLE%%%", title);
    htmldoc = htmldoc.replace("%%%TEXT%%%", text);
    htmldoc = htmldoc.replace("%%%OPTIONS%%%", options.map(option => `<li>${option}</li>`).join(""));
    return htmldoc;
}

app.get("/", (_, res) => {
    inventory = [];
    //lastLocation = "hallway";
    res.redirect("/day");
});

app.get("/day", (_, res) => {
    let text;
    options = [
        "<a href=/mask>Buy mask online</a>",
        "<a href=/grocery>Buy grocery</a>",
        "<a href=/sanitize>Sanitize Room</a>",
        "<a href=/window>Open the window</a>",
        "<a href=/news>Check news</a>",
        "<a href=/phone>Send help through the phone</a>",
        "<a href=/internet>Send help through the internet</a>",
        "<a href=/pill>Take some pills</a>",
        "<a href=/end>Call it a day</a>",
    ];
    options.push("<a href=/inventory>Check your inventory!</a>");
    
    if (date==1){   
        text = "Outbreak of anoroc virus, the city is sealing in 6 hours. You are living on your own in H town. Do everything you need to survive!";
    }
    else {
        text = " Virus kept spreading. Do everything you need to survive! "
    }
    res.send(
        makeContent(
            "Day "+date.toString()+" in H town",
            text,
            options
        )
    );
});



app.get("/mask", (_, res) => {
    //lastLocation = "big";
   
    let returnAddress = "day";
    //let options = ["<a href=/grocery>Buy grocery</a>"];
    //options.push("<a href=/unlock>Open the door</a>");
    if(Math.random()>0.5) {
    	text = "We are sorry but the items you are looking at are currently out of stock.";
    }
    else {
    	text = "Congrats! 5 Packs left in stock, estimated delivery time is tomorrow.";
    	ordered = 1;
    }
    //options.push("<a href=/inventory>Check your inventory</a>");
    res.send(
        makeContent(
            "Buy mask online",
            text,
            [
                `<a href=/${returnAddress}>Back </a>`,
            ]
        )
    );
    res.redirect("/day");
});

app.get("/grocery", (_, res) => {
   // lastLocation = "small";
    let returnAddress = "day";

    var rand = Math.random();
    if(rand>0.7) {
    	text = "Oh no! You made it to the market but nothing is in stock at this moment. You just wasted a mask :(";

    }
    else if (rand<=0.7 && rand > 0.4) {
    	text = "Congrats! You just bought 4 days worth of food!";
    	grocery += 4;
    }	
    else {
    	text = "You made it to the market! The price has been insanely high, you only bring enough money for 2 days worth of food. But you have to buy it in any case :(."
   		grocery += 2;
    }
    if (mask>0){
    	mask -=1;
    }
    else if(mask==0){
    	health -=2;
    }

    res.send(
        makeContent(
            "Buy grocery",
            text,
            [
                `<a href=/${returnAddress}>Back</a>`,
            ]
        )
    );
});

app.get("/inventory", (_, res) => {
    let text = "There is nothing in your inventory!";
    let text1 = "You have zero mask in your inventory";
    let text2 = "You have zero day of food in your inventory";
    if (mask > 0) {
        text1 = "You have "+ mask.toString() + " mask(s) in your inventory.";
    }
    if (grocery > 0) {
        text2 = "and "+ grocery.toString() + " day(s) worth of food in your inventory.";
    }
    text = text1 + " " + text2;
    let returnAddress = "day";
    //if (!!lastLocation) returnAddress = lastLocation;
    res.send(
        makeContent(
            "Inventory",
            text,
            [
                `<a href=/${returnAddress}>Back</a>`,
            ]
        )
    )
});

app.get("/sanitize", (_, res) => {
    let text = "Sanitization is much needed after being outside! Don't forget to open the window afterwards.";
    sanitized = 1;
    let returnAddress = "day";
    //if (!!lastLocation) returnAddress = "day";
    var rand = Math.random();
    if (rand>0.9){
    	text = "OHHHHHH you didn't open the window as soon as possible and now your apartment is on fire!!";
    	health = 0;
    	res.send(
        makeContent(
            "It's all over",
            text,
            [
                `<a href=/${returnAddress}>Start over</a>`,
            ]
        )
    )
    	date = 1;
    	health = 10;
    	mask = 1;
    	sanitized = 0;

    }
    res.send(
        makeContent(
            "Sanitize!!",
            text,
            [
                `<a href=/${returnAddress}>Back </a>`,
            ]
        )
    )
});

app.get("/window", (_, res) => {
    let text;
    let returnAddress = "day";
    let options = [`<a href=/${returnAddress}>Back </a>`];
    //if (!!lastLocation) returnAddress = lastLocation;
    var rand = Math.random();
    if (sanitized == 0) {
    	if (rand > 0.5){
    		text = "Uh oh - You just opened the window at the same time as your upstair neighbor sneezed!";
    		health -=2;
    	}
    	else{
    		text = "Okay - fresh air came through";
    	}
        
        //options = [`<a href=/${returnAddress}>Back whence you came</a>`];
    } else {
    	if(rand > 0.5){
    		text = "Okay - fresh air came through";
    	}
    	else{
    		text = "Uh oh - You just opened the window at the same time as your upstair neighbor sneezed! But guess what you're sanitized.";
    		health -=1;
    	}
       // text = "You can't unlock the door without a key";
        //options = [`<a href=/${returnAddress}>Back whence you came</a>`];
    }
    res.send(
        makeContent(
           // inventory.length > 0 ? "Victory!" : "Nice try",
           "At the balcony",
            text,
            options
        )
    )
});

app.get("/news", (_, res) => {
    let text;
    let returnAddress = "day";
    //if (!!lastLocation) returnAddress = "day";
    if(date == 1){
    	text = "Whistle blower Dr. Li passed away earlier this evening, after 10 days of infection.";
    }
    else if (date ==2){
    	text = "Central hospital send help for more medical supplies.";
    }
    else if (date ==3){
    	text = "US university has found a likely cure for the anoroc virus.";
    }
    else if (date ==4){
    	text = "3000 more anoroc virus infection cases are confirmed yesterday.";
    }
    else if (date ==5){
    	text = "A girl from W town pleading for help, after death of both family members.";
    }
    else if (date ==6){
    	text = "Where has all the vegetables gone? 3 tons of fresh vegetables from Shandong went missing.";
    }
    else if (date ==7){
    	text = "Chinese girl studying in Germany got attacked for wearing mask at local bus stop.";
    }
    else if (date ==8){
    	text = "Cleaning lady donated all her savings to help the government fight the anoroc virus.";
    }
    else if (date ==9){
    	text = "The red cross society forbids reporters from visiting their factory.";
    }
     else if (date ==10){
    	text = "Expert claims: antibiotics are shown to be effective in preventing the anoroc viral infection.";
    }

    res.send(
        makeContent(
            "Daily News",
            text,
            [
                `<a href=/${returnAddress}>Back </a>`,
            ]
        )
    )
});

app.get("/phone", (_, res) => {
    //let text;
    let returnAddress = "day";
    let options = [`<a href=/${returnAddress}>Back </a>`];
    //if (!!lastLocation) returnAddress = lastLocation;
    res.send(
        makeContent(
           // inventory.length > 0 ? "Victory!" : "Nice try",
           "Calling 120...",
            "Nobody is picking up the hotline!",
            options
        )
    )
});

app.get("/internet", (_, res) => {
    let text;
    let returnAddress = "day";
    let options = [`<a href=/${returnAddress}>Back </a>`];
    //if (!!lastLocation) returnAddress = lastLocation;
    if (health > 5){
    	text = "You've got 200 views on your post, but nobody seems to care since you're not THAT sick yet.";
	} 
	else{
	    rand = Math.random();
	    if (rand>0.7){
	    	text = "Lucky you, your story touched the world and they are offering you a bed in the hospital.";
	    }
	    else if (rand>0.4 && rand<=0.7){
	    	text = "Social workers have found you! Unfortunately there's not enough test kits nor bed for you to be hospitalized";
	    }
	    else{
	    	text = "Sorry, there are too many cases like you. Nobody gets to be treated differently. :(";
	    }
	}
    res.send(
        makeContent(
           // inventory.length > 0 ? "Victory!" : "Nice try",
           "Posting your symptom on weibo",
            text,
            options
        )
    )
});


app.get("/pill", (_, res) => {
    let text;
    let returnAddress = "day";
    let options = [`<a href=/${returnAddress}>Back </a>`];
    //if (!!lastLocation) returnAddress = lastLocation;
    rand = Math.random();
    if (health < 5){
    	if (rand>0.5){
    		health += 2;
    		text = "Seems like you just had a really bad cold. Take more pills and you can survive!";
    	}
    	else{
    		text = "Oh no! Pills won't work. You are having a fever and starting to cough!";
    	}
    }
    else{
    	text = "Not sure if those pills worked or not. No reaction that you can tell!";
    	if (rand>0.5){
    		health += 1;  		
    	}
    	else{
    		health -=1;
    	}
    }

    res.send(
        makeContent(
           // inventory.length > 0 ? "Victory!" : "Nice try",
           "Taking some pills...",
            text,
            options
        )
    )
});


app.get("/end", (_, res) => {
    let text="";
    let returnAddress = "day";
    let options = [`<a href=/${returnAddress}>Back </a>`];
    

    if(sanitized ==0){
    	health -=1;
    }
    else if (sanitized == 1)
    {
    	sanitized =0;
    }

    if(grocery==0){
    	health-=2;
    	text = "You haven't ate for the entire day! Make sure you buy enough grocery tomorrow!";
    }
    else if (grocery > 0){
    	grocery -=1;
    }
    if(health<5){
    	text += " Uh oh, your health is at risk. Clean more often and get enough nutrition!"
    }
    else{
    	text += " You are doing great, keep going!"
    }

    if (ordered == 1){
    	mask+=5;
    	ordered = 0;
    }
    date += 1;
    if (date ==11){

    	res.send(
        makeContent(
           // inventory.length > 0 ? "Victory!" : "Nice try",
           "Congrats, you made it to Day 10.",
            "you may now start over.",
            [`<a href=/${returnAddress}>Start over</a>`]
        )
        )
        date = 1;
    	health = 10;
    	mask = 1;
    	sanitized = 0;
    }
    else if(date<10 && health > 2)
    {
    res.send(
        makeContent(
           // inventory.length > 0 ? "Victory!" : "Nice try",
           "Sleeping it away",
            text,
            options
        )
    )
	}
	else if (date<10 && health<=2)
	{
		res.send(
        makeContent(
           // inventory.length > 0 ? "Victory!" : "Nice try",
           "We've lost you!",
            "You are having trouble breathing, and there's nowhere to go. ",
            [`<a href=/${returnAddress}>Start over</a>`]
        )

    )
		date = 1;
    	health = 10;
    	mask = 1;
    	sanitized = 0;
	}
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
