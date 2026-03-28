const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json());


const graph = {
  House: {
    Mall: 3,
    Park: 5,
    College: 2
  },

  Mall: {
    House: 3,
    Hospital: 4,
    Park: 2
  },

  Hospital: {
    Mall: 4,
    Park: 3
  },

  Park: {
    House: 5,
    Mall: 2,
    Hospital: 3,
    College: 3
  },

  College: {
    House: 2,
    Park: 3
  }
};

function dijkstra(graph, start, end) {

let distances = {};
let visited = {};
let previous = {};
let steps = [];

let nodes = Object.keys(graph);

nodes.forEach(node => {
    distances[node] = Infinity;
    previous[node] = null;
});

distances[start] = 0;

steps.push({
    text: "Start at " + start,
    node: start
});


while (nodes.length) {

    nodes.sort((a,b)=>distances[a]-distances[b]);

    let closest = nodes.shift();

    if(distances[closest] === Infinity) break;

    visited[closest] = true;

    steps.push({
    text: "Visiting node " + closest,
    node: closest
    });

    for(let neighbor in graph[closest]){

        if(visited[neighbor]) continue;

        let newDist = distances[closest] + graph[closest][neighbor];

        if(newDist < distances[neighbor]){

            distances[neighbor] = newDist;
            previous[neighbor] = closest;

            steps.push({
            text: "Update " + neighbor + " → " + newDist,
             node: neighbor
            });

        }
    }

}

let path = [];
let current = end;

while(current){
    path.unshift(current);
    current = previous[current];
}

steps.push({
    text: "Shortest path found",
    node: null
});

return {path, distance: distances[end], steps};

}

app.post("/shortest-path", (req, res) => {
    const { start, end } = req.body;

    const result = dijkstra(graph, start, end);

    res.json(result);
});

app.listen(port,()=>{
    console.log(`running on port ${port}`);
});

