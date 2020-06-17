// @TODO: YOUR CODE HERE!

// SVG container
var svgWidth = 819;
var svgHeight = 663;

// Margins
var margin = {
  top: 30,
  right: 30,
  bottom: 100,
  left: 100
};

// Calculate the chart height and width, chart area minus margins
var chartWidth = svgWidth - margin.left - margin.right;
var chartHeight = svgHeight - margin.top - margin.bottom;

// Create SVG container
var svg = d3.select("#scatter").append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);
  
// Initialize the visualizations with the next values
var updateXAxis = "poverty";
var updateYAxis = "healthcare";

// Shift everything over by the margins
var chartGroup = svg.append("g")
                    .attr("transform", `translate(${margin.left}, ${margin.top})`);


// ----------------- Markers and Labels -----------------                
// Function to update the position of the markers and make the transition, based 
function buildMarkers(markersGroup, newXScale, updateXAxis, newYScale, updateYAxis) {
  // When the event listener is triggered, make the transition
  markersGroup.transition()
              .duration(500)
              .attr("cx", d => newXScale(d[updateXAxis]))
              .attr("cy", d => newYScale(d[updateYAxis]));
  return markersGroup;
};
// Function to update the position of the labels and make the transition
function buildLabels(addLabels, newXScale, updateXAxis, newYScale, updateYAxis) {
  // When the event listener is triggered, make the transition
  addLabels.transition()
    .duration(500)
    .attr("x", d => newXScale(d[updateXAxis]))
    .attr("y", d => newYScale(d[updateYAxis]));
  return addLabels;
};

// Import data from data.csv file
d3.csv("assets/data/data.csv").then( function(journalismData) {
  
  // Parse the data
  journalismData.forEach( (data) => {
    data.poverty = parseFloat(data.poverty);
    data.age = parseFloat(data.age);
    data.income = parseFloat(data.income);
    data.healthcare = parseFloat(data.healthcare);
    data.smokes = parseFloat(data.smokes);
    data.obesity = parseFloat(data.obesity);
  });
  
  // Create all the variables needed to create the visualizations
  // Initialize the xScale with the given data and the default option "poverty"
  var xLinearScale = d3.scaleLinear()
                        .domain([d3.min(journalismData, d => d[updateXAxis]), d3.max(journalismData, d => d[updateXAxis])])
                        .range([0, chartWidth]);    
  // Initialize the yScale with the given data and the default option "poverty"
  var yLinearScale = d3.scaleLinear()
                        .domain([d3.min(journalismData, d => d[updateYAxis]), d3.max(journalismData, d => d[updateYAxis])])
                        .range([chartHeight, 0]);  
  // Create the axes
  var XbottomAxis = d3.axisBottom(xLinearScale);
  var YleftAxis = d3.axisLeft(yLinearScale);
  // Add Y-Axis
  var yAxis = chartGroup.append("g")
                        .call(YleftAxis);
  // Add Y-Axis label
  var yLabelsGroup = chartGroup.append("g")
                                .attr("transform", "rotate(-90)")
  // Add X-Axis
  var xAxis = chartGroup.append("g")
                        .attr("transform", `translate(0, ${chartHeight})`)
                        .call(XbottomAxis);
  // Add X-Axis label
  var xLabelsGroup = chartGroup.append("g")
                                .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);

  // Append "g" to chartGroup
  var gGroup = chartGroup.selectAll("g")
                          .data(journalismData)
                          .enter()
                          .append("g")
                          .classed("circles", true);
  // Append the circles an their position to the gGroup
  var markersGroup = gGroup.append("circle")
                            .data(journalismData)
                            .attr("fill", "#8abcd5")
                            .attr("r", 13)
                            .attr("cx", d => xLinearScale(d[updateXAxis]))
                            .attr("cy", d => yLinearScale(d[updateYAxis]));
  // Append the labels and their position directly to the chartGroup
  var addLabels = chartGroup.selectAll(".circles")
                            .append("text")
                            .text( d => d.abbr)
                            .attr("style","stroke:white;")
                            .attr("alignment-baseline", "middle")
                            .attr("text-anchor", "middle")
                            .attr("font-size","13px")
                            .attr("x", d => xLinearScale(d[updateXAxis]))  
                            .attr("y", d => yLinearScale(d[updateYAxis]));
// Append the "Poverty" label
  var povertyLabel = xLabelsGroup.append("text")
                                  .classed("active", true)
                                  .attr("value", "poverty")
                                  .attr("x", 0)
                                  .attr("y", 20)                                  
                                  .text("In Poverty (%)");
// Append the "Age" label
  var ageLabel = xLabelsGroup.append("text")
                              .classed("inactive", true)
                              .attr("value", "age")
                              .attr("x", 0)
                              .attr("y", 40)
                              .text("Age (Median)");
  // Append the "Income" label
  var incomeLabel = xLabelsGroup.append("text")
                                .classed("inactive", true)
                                .attr("value", "income")
                                .attr("x", 0)
                                .attr("y", 60)
                                .text("Household Income (Median)");
  // Append the "Healthcare" label
  var healthcareLabel = yLabelsGroup.append("text")
                                    .classed("active", true)
                                    .attr("value", "healthcare")
                                    .attr("x", 0 - (chartHeight/2))
                                    .attr("y", 0 - (margin.left/3))
                                    .text("Lacks Healthcare (%)"); 
  // Append the "Smokes" label                                
  var smokesLabel = yLabelsGroup.append("text")
                                  .classed("inactive", true)  
                                  .attr("value", "smokes")                              
                                  .attr("x", 0 - (chartHeight/2))
                                  .attr("y", -20 - (margin.left/3))
                                  .text("Smokers (%)");   
  // Append the "Obesity" label
  var obesityLabel = yLabelsGroup.append("text")
                                  .classed("inactive", true)
                                  .attr("value", "obesity")
                                  .attr("x", 0 - (chartHeight/2))
                                  .attr("y", -40 - (margin.left/3))
                                  .text("Obese (%)");   

  // Y Axis listener
  yLabelsGroup.selectAll("text")
  .on("click", function() {
    // Obtain the value clicked from the yLabelsGroup
    var value = d3.select(this).attr("value");
    // Start the chains of If's asking if the value selected is not the same as the default option
    if (value !== updateYAxis) {

      // If it's true, update "updateYAxis" value
      updateYAxis = value;

      // Update the Y Scale 
      yLinearScale = d3.scaleLinear()
                        .domain([d3.min(journalismData, d => d[updateYAxis]), d3.max(journalismData, d => d[updateYAxis])])
                        .range([chartHeight, 0]);  

      // Update the Y Axis base on the previous scale
      YleftAxis = d3.axisLeft(yLinearScale);
      // Call a transition
      yAxis.transition()
            .duration(500)
            // Create, again, the axis with the new data
            .call(YleftAxis);

      // Update the position of the markers based on the object, the scale, the axis in X & Y
      markersGroup = buildMarkers(markersGroup, xLinearScale, updateXAxis,  yLinearScale, updateYAxis);
      
      // Update the position of the labels based on the object, the scale, the axis in X & Y
      addLabels = buildLabels(addLabels, xLinearScale, updateXAxis, yLinearScale, updateYAxis);

      // Chain of If's to change the class of the Y Labels
      if (updateYAxis === "obesity") {
        obesityLabel.classed("active", true).classed("inactive", false);
        smokesLabel.classed("active", false).classed("inactive", true);
        healthcareLabel.classed("active", false).classed("inactive", true);
      } else if (updateYAxis === "smokes") {
        smokesLabel.classed("active", true).classed("inactive", false);
        obesityLabel.classed("active", false).classed("inactive", true);
        healthcareLabel.classed("active", false).classed("inactive", true);
      } else {
        smokesLabel.classed("active", false).classed("inactive", true);
        obesityLabel.classed("active", false).classed("inactive", true);
        healthcareLabel.classed("active", true).classed("inactive", false);
      }
    }
  });


  // X Axis listener
  xLabelsGroup.selectAll("text")
    .on("click", function() {
      // Obtain the value clicked from the xLabelsGroup
      var value = d3.select(this).attr("value");
      // Start the chains of If's asking if the value selected is not the same as the default option
      if (value !== updateXAxis) {

        // If it's true, update "updateXAxis" value
        updateXAxis = value;

        // Update the X Scale
        xLinearScale = d3.scaleLinear()
                          .domain([d3.min(journalismData, d => d[updateXAxis]), d3.max(journalismData, d => d[updateXAxis])])
                          .range([0, chartWidth]);  

        // Update the X Axis base on the previous scale
        XleftAxis = d3.axisBottom(xLinearScale);
        // Call a transition
        xAxis.transition()
              .duration(500)
              // Create, again, the axis with the new data
              .call(XleftAxis);

        // Update the position of the markers based on the object, the scale, the axis in X & Y
        markersGroup = buildMarkers(markersGroup, xLinearScale, updateXAxis,  yLinearScale, updateYAxis);

        // Update the position of the labels based on the object, the scale, the axis in X & Y
        addLabels = buildLabels(addLabels, xLinearScale, updateXAxis, yLinearScale, updateYAxis);

        // Chain of If's to change the class of the X Labels
        if (updateXAxis === "income") {
          incomeLabel.classed("active", true).classed("inactive", false);
          ageLabel.classed("active", false).classed("inactive", true);
          povertyLabel.classed("active", false).classed("inactive", true);
        } else if (updateXAxis === "age") {
          incomeLabel.classed("active", false).classed("inactive", true);
          ageLabel.classed("active", true).classed("inactive", false);
          povertyLabel.classed("active", false).classed("inactive", true);
        } else {
          incomeLabel.classed("active", false).classed("inactive", true);
          ageLabel.classed("active", false).classed("inactive", true);
          povertyLabel.classed("active", true).classed("inactive", false);
        }
      }
  });

}).catch(function(error) {
    console.log(error);
});
  

