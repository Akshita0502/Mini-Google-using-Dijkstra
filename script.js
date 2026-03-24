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

document.getElementById("findPath").onclick = function(){

let start = document.getElementById("start").value;
let end = document.getElementById("end").value;

let result = dijkstra(graph,start,end);

animateSteps(result.steps);

setTimeout(()=>{
    highlightPath(result.path);
}, result.steps.length * 800);

console.log(result);

};

function animateSteps(steps){

let stepBox = document.getElementById("steps");
stepBox.innerHTML = "";

let i = 0;

function runStep(){

    if(i >= steps.length) return;

    let step = steps[i];

    let p = document.createElement("p");
    p.textContent = step.text;
    stepBox.appendChild(p);

    if(step.node){
        highlightSingle(step.node);
    }

    i++;

    setTimeout(runStep, 800);

}

runStep();

}

function highlightPath(path){

document.querySelectorAll(".node").forEach(node=>{
    node.classList.remove("highlight");
});

console.log("Highlighting:", path);


path.forEach(name=>{
    let element = document.getElementById(name);

    if(element){
        element.classList.add("highlight");
    } else {
        console.log("Node not found:", name);
    }
});

}

function highlightSingle(node){

document.querySelectorAll(".node").forEach(n=>{
    n.classList.remove("highlight");
});

let el = document.getElementById(node);

if(el){
    el.classList.add("highlight");
}

}