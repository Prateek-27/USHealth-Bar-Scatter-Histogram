// Variable to store X and Y axis attributes
var updates = {};

// Gets the X and Y axis attributes and calls the main UpdateScatter function
function toUpdate(){
    
    var toggle_value = document.getElementsByName("toggle_x_y");
    var selected_toggle;
    for(let i=0; i<toggle_value.length; i++) {
        if(toggle_value[i].checked){
            selected_toggle = toggle_value[i].value;
        }
    }
{
    if(selected_toggle == 'X'){
        var attribute = document.getElementById("list").value;
        updates['X'] = attribute;
    }
    else if(selected_toggle == 'Y'){
        var attribute = document.getElementById("list").value;
        updates['Y'] = attribute;
    }
    
if (Object.keys(updates).length >= 2){
    UpdateScatter()

}

}}

// Function to Update Scatter graph
function UpdateScatter(){

    // Remove Exisiting Plot on Canvas
    d3.select('#plot').selectAll("*").remove();

    // List of all available attributes
    const cols = ['state','county','total_population',
    'percent_homeowners','percent_below_poverty',
    'percent_fair_or_poor_health','percent_frequent_physical_distress',
    'percent_adults_with_obesity','percent_frequent_mental_distress',
    'percent_minorities','percent_insufficient_sleep','per_capita_income',
    'percent_below_poverty','percent_unemployed_CDC',
    'percent_excessive_drinking_cat','population_density_per_sqmi_cat'];

    // List of all categorical attributes
    const cat = ['state', 'county', 'percent_excessive_drinking_cat',
     'population_density_per_sqmi_cat'];

    // List of all numerical attributes
    const num = ['total_population',
    'percent_homeowners','percent_below_poverty',
    'percent_fair_or_poor_health','percent_frequent_physical_distress',
    'percent_adults_with_obesity','percent_frequent_mental_distress',
    'percent_minorities','percent_insufficient_sleep','per_capita_income',
    'percent_below_poverty','percent_unemployed_CDC'];

    // Labels corresponding to attributies in csv
    var lables = {
        'state': 'State','county':'County','total_population':'Total Population',
    'percent_homeowners':'Percent Homeowners',
    'percent_below_poverty':'Percent Below Poverty',
    'percent_fair_or_poor_health':'Percent Poor Health',
    'percent_frequent_physical_distress':'Percent Frequent Physical Distress',
    'percent_adults_with_obesity':'Percent Adults With Obesity',
    'percent_frequent_mental_distress':'Percent Frequent Mental Distress',
    'percent_minorities':'Percent Minorities',
    'percent_insufficient_sleep':'Percent Insufficient Sleep',
    'per_capita_income':'Per Capita Income',
    'percent_below_poverty':'Percent Below Poverty Line',
    'percent_unemployed_CDC':'Percent Unemployed',
    'percent_excessive_drinking_cat':'Excessive Drinking in Adults',
    'population_density_per_sqmi_cat':'Population Density'
    }


    // Initializations
    var width = 1000;
    var height = 700;
    var left_padding = 250;
    var top_padding = 75;
    var graphName = 'Scatter'
    var attribute = document.getElementById("list").value;
    var toggle_value = document.getElementsByName("toggle_x_y");
    var selected_toggle;
    for(let i=0; i<toggle_value.length; i++) {
        if(toggle_value[i].checked){
            selected_toggle = toggle_value[i].value;
        }
    }
    //console.log(selected_toggle)
     if (graphName == "Scatter")
{

// Cases:
// 1. x:num, y:num
// 2. x:cat, y:cat
// 3. x:num, y:cat
// 4. x:cat, y:num

//Read the data
d3.csv("Final.csv", function(data) {

// Get the x and y attribute values 
var attri1 = updates['X'];
var attri2 = updates['Y'];

// Preparing the canvas to plot data 
var canvas = d3.select("#plot")
            .append("svg")
            .attr("width", width + left_padding)
            .attr("height", height + top_padding)
            .append("g")
            .attr('transform', 'translate('+left_padding+','+20+')');
            
var t_x = lables[attri1];
var t_y = lables[attri2];

canvas.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0)
        .attr("text-anchor", "middle")  
        .style("font-size", "18px") 
        .style("text-decoration", "underline")  
        .text(t_x + " "+ " v/s "+ t_y+ " " + " Scatter Plot");

if (num.includes(attri1) && num.includes(attri2)){

// When both axis have numerical attributes
var vals_x = data.map(function(d) { return d[attri1] });
var vals_y = data.map(function(d) { return d[attri2] });


const x_max_val = Math.max.apply(Math, vals_x);
const y_max_val = Math.max.apply(Math, vals_y);

var color = d3.scaleLinear()
               .domain([0, x_max_val])
               .range(['red', 'blue']);

//console.log(x_max_val)
//console.log(y_max_val)

// Scaling
var widthScale = d3.scaleLinear()
    .domain([0, x_max_val])
    .range([ 0, width]);
canvas.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(widthScale));
canvas.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", height + 45 )
    .text(lables[attri1]);

  // Add Y axis
  var heightScale = d3.scaleLinear()
    .domain([0, y_max_val])
    .range([ height, 0]);

canvas.append("g")
    .call(d3.axisLeft(heightScale));
canvas.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -height/2)
    .attr("y", -60)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text(lables[attri2]);

  // Add dots
  canvas.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function (d) { return widthScale(d[attri1]); } )
      .attr("cy", function (d) { return heightScale(d[attri2]); } )
      .attr("r", 2)
      .attr("fill", function(d){return color(d[attri1]);})

} 
else if (cat.includes(attri1) && cat.includes(attri2)){

// Both attributes are categotical 
var domain_x = data.map(function(d) { return d[attri1] });
var domain_y = data.map(function(d) { return d[attri2] });

// Storing unique values for both attributes
var x_uniqueItems = [...new Set(domain_x)]
var y_uniqueItems = [...new Set(domain_y)]


// Scaling and X axis
var widthScale = d3.scaleBand()
    .domain(x_uniqueItems)
    .range([0, width]);
canvas.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(widthScale))
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-35)");

canvas.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width/4)
    .attr("y", height + 50)
    .text(lables[attri1]);

  // Y axis
var heightScale = d3.scaleBand()
    .domain(y_uniqueItems)
    .range([height, 0]);

canvas.append("g")
    .call(d3.axisLeft(heightScale));

canvas.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -height/2)
    .attr("y", -80)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text(lables[attri2]);

  // Add dots
  canvas.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return Math.random()*30 +widthScale(d[attri1]); } )
      .attr("cy", function (d) { return Math.random()*30 + height - 1.5*top_padding - heightScale(d[attri2]); } )
      .attr("r", 2)
      .style("fill", "red")

} 
else if (num.includes(attri1) && cat.includes(attri2)){

// X axis is numerical and y axis is categorical
var domain_x = data.map(function(d) { return d[attri1] });
var domain_y = data.map(function(d) { return d[attri2] });

var vals_x = data.map(function(d) { return d[attri1] });
const x_max_val = Math.max.apply(Math, vals_x);


// Scaling and X axis
var widthScale = d3.scaleLinear()
    .domain([0, x_max_val+10])
    .range([ 0, width]);
canvas.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(widthScale));

var color = d3.scaleLinear()
               .domain([0, 10])
               .range(['red', 'blue']);

canvas.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", height + 45 )
    .text(lables[attri1]);

var uniqueItems = [...new Set(domain_y)]

// Add Y axis
var heightScale = d3.scaleBand()
    .domain(uniqueItems)
    .range([height, 0]);

canvas.append("g")
    .call(d3.axisLeft(heightScale));

canvas.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -height/2)
    .attr("y", -60)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text(lables[attri2]);

//console.log(uniqueItems)
  // Add dots
  canvas.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return widthScale(d[attri1]); } )
    .attr("cy", function (d) { return height - top_padding - heightScale(d[attri2]); } )
    .attr("r", 2)
    .attr("fill", function(d){return color(d[attri1]);})

}
else if (cat.includes(attri1) && num.includes(attri2)){

// X axis is categorical and Y axis is numerical
var domain_x = data.map(function(d) { return d[attri1] });
var domain_y = data.map(function(d) { return d[attri2] });

var vals_y = data.map(function(d) { return d[attri2] });
const y_max_val = Math.max.apply(Math, vals_y);


// Scaling and X axis
var heightScale = d3.scaleLinear()
    .domain([0, y_max_val+10])
    .range([ height, 0]);
canvas.append("g")
    .call(d3.axisLeft(heightScale));

canvas.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "middle")
    .attr("x", width/2)
    .attr("y", height + 45 )
    .text(lables[attri2]);

var uniqueItems = [...new Set(domain_x)]

// Add Y axis
var widthScale = d3.scaleBand()
    .domain(uniqueItems)
    .range([0, width]);

canvas.append("g")
    .call(d3.axisBottom(widthScale))
    .attr("transform", "translate(0," + height + ")")
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-35)");;

canvas.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "middle")
    .attr("x", -height/2)
    .attr("y", -60)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text(lables[attri1]);


//console.log(uniqueItems)
  // Add dots
  canvas.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return left_padding/2 + widthScale(d[attri1]); } )
    .attr("cy", function (d) { return heightScale(d[attri2]); } )
      .attr("r", 2)
      .style("fill", "red")

}

}
)
}
}