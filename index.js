// Bron Mike Bostock 20 aug 2017 https://bl.ocks.org/mbostock/3885304


// hier wordt een variable svg gemaakt. In deze variabele roept d3 de svg in de html op en wordt de margin voor deze svg bepaald
var svg = d3.select("svg"),
    margin = {
        top: 20,
        right: 20,
        bottom: 100,
        left: 130
    },
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom;

// Hier wordt de witruimte bepaald tussen de bars van de grafieken
var x = d3.scaleBand().rangeRound([0, width]).padding(0.3),
    y = d3.scaleLinear().rangeRound([height, 0]);

var g = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


// Hier wordt de data wat in mijn TSV bestand zit aangeroepen door d3
d3.tsv("data.tsv", function (d) {
    d.speakers = +d.speakers;
    return d;
}, function (error, data) {
    if (error) throw error;
    x.domain(data.map(function (d) {
        return d.language;
    }));
    y.domain([0, d3.max(data, function (d) {
        return d.speakers;
    })]);


    // Hier krijgt de groep van de x as verschillende attributes en wordt bijv. de hoogte bepaald
    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Hier geef ik de rotatie aan van de tekst van de x as en hoeveel em zij van de x/y as moeten staan
    g.selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-2em")
        .attr("dy", "-0.4em")
        .attr("transform", "rotate(-90)");


    // Hier krijgt de groep van de y as verschillende attributes en wordt bijv. de hoogte bepaald, fill, rotatie bepaald de tekst wordt opgevraagt onder het kopje uren van de TSV
    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y).ticks(10))
        .append("text")
        .attr("y", 2)
        .attr("x", 6)
        .attr("dy", "2em")
        .attr("dx", "-2em")
        .attr("text-anchor", "end")
        .attr("fill", "black")
        .text("aantal sprekers in cijfers");

    // hier wordt een groep gemaakt om de grafiek te stijlen. Zo wordt de stijl uit de css aangeroepen en wordt er aangegeven dat deze gestijlt moet worden aan de hand van de kolom language en speakers van de TSV.
    g.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function (d) {
            return x(d.language);
        })
        .attr("y", function (d) {
            return y(d.speakers);
        })
        .attr("width", x.bandwidth())
        .attr("height", function (d) {
            return height - y(d.speakers);
        });
});
