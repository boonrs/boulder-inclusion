var font = "12pt Helvetica";
var setsPerRow = 3;
var datasets = ["students", "age", "gender", "languages", "race", "ownership", "residence", "wages", "marital"];
var colors = ["#41A8C4", "#26788E", "#458A9E", "#12353F"];

var height = "220px";

for(i=0; i < Math.round(datasets.length/setsPerRow); i++ ) {
  var div = d3.select(".container-fluid").append("div")
              .attr("class", "row");
}

datasets.forEach(function(set, index) {
  addColumn(set, index);
  drawCircles(set);
});
drawTable();

function addColumn(set, index) {
  var row = Math.ceil((index+ 1)/setsPerRow);
  var column = d3.select(".container-fluid")
              .selectAll(".row")
              .filter(":nth-child(" + row + ")").append("div")
              .attr("class", "col-md-4")
              .attr("id", set);
}

function drawTable() {
  var of100 = [];
  datasets.forEach(function(set, index) {
    var fileName = "json/" + set + ".json";
    d3.json(fileName, function(json) {
      d3.json(fileName, function(json) {
        json.nodes.forEach(function(data) {
          var elt = data.r + " " + data.label;
          of100.push (elt)
          console.log(elt)
        })
      })
    })
  })
}

function drawCircles(id) {
  var fileName = "json/" + id + ".json";
  var div = d3.select("#" + id);
  var title = div.append("h2")
              .attr("class", "bubble-title")
              .text(id)
  var svg = div.append("svg")
               .attr("width", "100%")
               .attr("height", height);

  d3.json(fileName, function(json) {
    /* Define the data for the circles */
    var elem = svg.selectAll("g myCircleText")
        .data(json.nodes)
  
    /*Create and place the "blocks" containing the circle and the text */  
    var elemEnter = elem.enter()
      .append("g")
      .attr("transform", function(d, i){return "translate("+ calculateX(json.nodes, i) + ",90)"})
 
    /*Create the circle for each block */
    var circle = elemEnter.append("circle")
      .attr("r", function(d){return d.r} )
      .attr("fill", function(d, i) {return colors[i]})

    /* Create the text for each block */
    elemEnter.append("foreignObject")
      // .attr("x", function(d){return - (d.label.length * 3.5) } )
      .attr("x", function(d) {return - d.r })
      .attr("y", function(d){return - d.r } )
      .attr("width", function(d) { return d.r * 2 })
      .attr("height", function(d) { return d.r * 2 })
      .append("xhtml:div")// replace with html element you want
      .attr("class", "bubble-label")
      .style("font", font)
      .text(function(d){return addLabel(d.label, d.r)})
      .attr("title", function(d) { return d.label + "\n" + d.r + "%"})

    /* Create hover text for each block */

  })
}

function calculateX(nodes, index) {
  var sum = 0;
  for( i=0; i < index; i++){
    sum += (2 * nodes[i].r);
  }
  return 100 + nodes[index].r + sum;    
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

    
