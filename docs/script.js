const width = document.getElementById('graph-container').clientWidth;
const height = document.getElementById('graph-container').clientHeight;

const svg = d3.select("#graph-container").append("svg")
    .attr("width", width)
    .attr("height", height);

// Load data dynamically
d3.json("data.json").then(data => {

    const simulation = d3.forceSimulation(data.nodes)
        .force("link", d3.forceLink(data.links).id(d => d.id).distance(150))
        .force("charge", d3.forceManyBody().strength(-500))
        .force("center", d3.forceCenter(width / 2, height / 2));

    const link = svg.append("g")
        .attr("stroke", "#475569")
        .attr("stroke-opacity", 0.6)
        .selectAll("line")
        .data(data.links)
        .join("line")
        .attr("stroke-width", 2);

    const node = svg.append("g")
        .attr("stroke", "#fff")
        .attr("stroke-width", 1.5)
        .selectAll("circle")
        .data(data.nodes)
        .join("circle")
        .attr("r", 15)
        .attr("fill", d => {
            if (d.group === 0) return "#94a3b8"; // Gray
            if (d.group === 1) return "#f43f5e"; // Red (Kemalizm)
            if (d.group === 2) return "#fbbf24"; // Yellow (Left)
            if (d.group === 3) return "#38bdf8"; // Blue (Right)
            if (d.group === 4) return "#4ade80"; // Green (Islam)
            return "#ccc";
        })
        .call(drag(simulation));

    const label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(data.nodes)
        .join("text")
        .attr("dx", 20)
        .attr("dy", 5)
        .text(d => d.label)
        .attr("fill", "#e2e8f0")
        .style("font-size", "12px")
        .style("pointer-events", "none");

    node.on("click", (event, d) => {
        document.getElementById("node-title").innerText = d.label;
        document.getElementById("node-desc").innerText = d.desc;

        const linkElem = document.getElementById("node-link");
        if (d.link) {
            linkElem.href = d.link;
            linkElem.style.display = "inline-block";
        } else {
            linkElem.style.display = "none";
        }
    });

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y);
    });

    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }

        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }

        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
});
