// Run the action when we are sure the DOM has been loaded
function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {
        // `DOMContentLoaded` already fired
        action();
    }
}

function generate_feature_clusters(){
    //Width and height
    var parentDiv = document.getElementById('cluster-col');
    var width = parentDiv.clientWidth;
    var height = parentDiv.clientHeight;

    d3.json("data/feature_cluster_data.json").then(function (dataset){
        
        //Define drag event functions
        function dragStarted(event) {
            if (!event.active) force.alphaTarget(0.3).restart();
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragging(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragEnded(event) {
            if (!event.active) force.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
        
        //Initialize a simple force layout, using the nodes and edges in dataset        
        var force = d3.forceSimulation(dataset.nodes)
                    .force("charge", d3.forceManyBody())
                    .force("link", d3.forceLink(dataset.edges))
                    .force("center", d3.forceCenter().x(width/2).y(height/2));

        var colors = d3.scaleOrdinal(d3.schemeCategory10);

        //Create SVG element
        var svg = d3.select(parentDiv)
                .append("svg")
                .attr("width", width)
                .attr("height", height);

        //Create edges as lines
        var edges = svg.selectAll("line")
                    .data(dataset.edges)
                    .enter()
                    .append("line")
                    .style("stroke", "#ccc")
                    .style("stroke-width", 1);

        //Create nodes as circles
        var nodes = svg.selectAll("circle")
                    .data(dataset.nodes)
                    .enter()
                    .append("circle")
                    .attr("r", 10)
                    .style("fill", function(d, i) {
                    return colors(d.color);
                    }
                    )
                    .call(d3.drag()  //Define what to do on drag events
					.on("start", dragStarted)
					.on("drag", dragging)
					.on("end", dragEnded));;

        //Add a simple tooltip
        nodes.append("title")
            .text(function(d) {
                return d.name;
            });

        //Every time the simulation "ticks", this will be called
        force.on("tick", function() {

        edges.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        nodes.attr("cx", function(d) { return d.x; })
            .attr("cy", function(d) { return d.y; });

        });
    });
}

whenDocumentLoaded(() => {
    console.log('loading clusters!');
    generate_feature_clusters();
});