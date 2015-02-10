var font = "12pt Helvetica";
var setsPerRow = 3;
var datasets = ["students", "age", "gender", "languages", "race", "ownership", "residence", "wages", "marital", "commuting"];
var colors = ["#41A8C4", "#26788E", "#458A9E", "#12353F"];

var height = "220px";
createStructure();
drawBubbles();
drawTable();

function createStructure() {
  var left = d3.select("#left");
  var middleLeft = d3.select("#middleLeft");
  var middleRight = d3.select("#middleRight");
  var right = d3.select("#right");

  for(i=0;i < setsPerRow * 2; i++) {
    var row = Math.ceil((i+ 1)/setsPerRow);
    var column = d3.select(".container-fluid")
              .selectAll(".row")
              .filter(":nth-child(" + row + ")").append("div")
              .attr("class", "col-md-4")
              .attr("id", datasets[i]);
  }


  for(i=setsPerRow*2; i < datasets.length; i++) {
    if(i%2 == 0) {
      left.append("div")
          .attr("class", "col-md-12")
          .attr("id", datasets[i]);
    }
    else {
      right.append("div")
          .attr("class", "col-md-12")
          .attr("id", datasets[i]);
    }
  }

  middleLeft.append("ul")
        .attr("id", "out-of-100-left");
    middleRight.append("ul")
        .attr("id", "out-of-100-right");
}

function drawBubbles() {
  datasets.forEach(function(set, index) {
    drawCircles(set);
  });
}

function drawTable() {
  var listLeft = d3.select("#out-of-100-left");
  var listRight = d3.select("#out-of-100-right");
  datasets.forEach(function(set, index) {
    var fileName = "json/" + set + ".json";
    d3.json(fileName, function(json) {
      json.data.forEach(function(data, index) {
        var elt = data.percent + " " + data.label;
        var addLeft = index%2 ==0;
        if(addLeft) {
          listLeft.append("li")
                  .text(elt)
        }
        else {
          listRight.append("li")
              .text(elt)
        }
      })
    })
  })
}

function drawCircles(id) {
  var fileName = "json/" + id + ".json";
  var div = d3.select("#" + id);
  var svg = div.append("svg")
               .attr("width", "100%")
               .attr("height", height);

  d3.json(fileName, function(json) {
    /* Bubble Title */
     var title = div.insert("h2", ":first-child")
              .attr("class", "bubble-title")
              .text(json.title)

    /* Define the data for the circles */
    var elem = svg.selectAll("g myCircleText")
        .data(json.data)
  
    /*Create and place the "blocks" containing the circle and the text */  
    var elemEnter = elem.enter()
      .append("g")
      .attr("transform", function(d, i){return "translate("+ calculateX(json.data, i) + ",90)"})
 
    /*Create the circle for each block */
    var circle = elemEnter.append("circle")
      .attr("r", function(d){return d.percent
} )
      .attr("fill", function(d, i) {return colors[i]})

    /* Create the text for each block */
    elemEnter.append("foreignObject")
      // .attr("x", function(d){return - (d.label.length * 3.5) } )
      .attr("x", function(d) {return - d.percent
 })
      .attr("y", function(d){return - d.percent
 } )
      .attr("width", function(d) { return d.percent
 * 2 })
      .attr("height", function(d) { return d.percent
 * 2 })
      .append("xhtml:div")// replace with html element you want
      .attr("class", "bubble-label")
      .style("font", font)
      .text(function(d){return addLabel(d.label, d.percent
)})
      .attr("title", function(d) { return d.label + "\n" + d.percent
 + "%"})

    /* Create hover text for each block */

  })
}

function calculateX(nodes, index) {
  var sum = 0;
  for( i=0; i < index; i++){
    sum += (2 * nodes[i].percent
);
  }
  return 100 + nodes[index].percent
 + sum;    
}

function addLabel(label, radius) {
  var textWidth = getTextWidth(label, font);
  var wider = textWidth > radius * 2 + 5;
  if(wider)
    return "";
  else
    return label;
}

function getTextWidth(text, font) {
    // re-use canvas object for better performance
    var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    var context = canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
};

    
