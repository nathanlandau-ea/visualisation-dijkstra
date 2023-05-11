function bouton(couleur, text, event){
  temp = createDiv(text);
  temp.style("width", "max-content")
  temp.style("height", "min-content")
  temp.style("border-radius", "10px")
  temp.style("padding", "5px");
  temp.style("background-color", couleur);
  temp.style("cursor", "pointer");
  temp.parent("bar")
  temp.attribute("onclick", event)
  return temp;
}

function cell(x,y){
  var couleur = grid[x][y];
  fill(couleur)
  temp = square(x*cellSize+1, y*cellSize+1+topBar, cellSize-2);
  return temp
}

function Queue() {
  this.data = [];
}

Queue.prototype.put = function(record) {
  this.data.unshift(record);
}

Queue.prototype.take = function() {
  return this.data.pop();
}

Queue.prototype.size = function() {
  return this.data.length;
}

function tuple(a,b){
    this.x = a;
    this.y = b;
}

function setup() {
  cellSize = 20;
  topBar = 50;
  nbCellsVertical = floor((windowHeight-topBar)/cellSize);
  nbCellsHorizontal = floor(windowWidth/cellSize)
  createCanvas(nbCellsHorizontal*cellSize, nbCellsVertical*cellSize+topBar);
  background(68);
  noStroke();
  fill(68);
  selected = 255
  rect(0,topBar, nbCellsHorizontal*cellSize, nbCellsVertical*cellSize+topBar)
  grid = new Array(nbCellsHorizontal);
  for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(nbCellsVertical).fill(255);
  }
  bar = createDiv();
  bar.style("width", "100%");
  bar.style("height", String(topBar)+"px");
  bar.position(0,0)
  bar.id("bar")
  bar.style("display", "flex")
  bar.style("justify-content", "space-around")
  bar.style("align-items", "center")
  bar.style("flex-wrap", "wrap")
  backArrow = bouton("#ffffff", "↩ retour", "history.back()")
  source = bouton("#6AE6DF", "source", "selected = \"#6AE6DF\"");
  mur = bouton("#E67A75", "mur", "selected = \"#E67A75\"");
  sortie = bouton("#98E681", "sortie", "selected = \"#98E681\"");
  effacer = bouton("#FFFFFF", "effacer", "selected = 255");
  resetB = bouton("#B35C54", "reset", "HardReset()");
  searchB = bouton("#BF7DF0", "chercher", "bfs()")
  unsearchB = bouton("#BF7DF0", "arrêter", "stopBFS()")
  unsearchB.style("display", "none")
  starts = new Queue()
  speed = 50
  changement = 10
}

function reset(){
  for(let i = 0;i < nbCellsHorizontal; i++){
    for(let j = 0;j < nbCellsVertical; j++){
      if(typeof grid[i][j] == "number" || grid[i][j] === "#F7D354"){
        grid[i][j] = 255
      }
    }
  }
}

function HardReset(){
  grid = new Array(nbCellsHorizontal);
  for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(nbCellsVertical).fill(255);
  }
}

function mouseClicked(){
  if(mouseY > topBar){
    reset()
    current = "#6AE6DF"
  }
}

function draw() {
  if(mouseIsPressed){
    var x = floor(mouseX/cellSize)
    var y = floor((mouseY-topBar)/cellSize)
    try{grid[x][y] = selected}catch(err){}
  }
  for(let i = 0;i < nbCellsHorizontal; i++){
    for(let j = 0;j < nbCellsVertical; j++){
      cell(i,j)
    }
  }
}

function bfs(){
  starts = new Queue()
  noLoop()
  searchB.style("display", "none")
  unsearchB.style("display", "block")
  for(let i = 0;i < nbCellsHorizontal; i++){
    for(let j = 0;j < nbCellsVertical; j++){
      cell(i,j)
      if (grid[i][j] === "#6AE6DF"){
        starts.put([i,j])
      }
    }
  }
  iteration = 0
  found = false
  intvlID = setInterval(
  function(){
    currEnd = starts.size()
    for(var index = 0; index < currEnd; index++){
      item = starts.take()
      x = item[0]
      y = item[1]
      lx = [x+1,x-1,x,x]
      ly = [y,y,y+1,y-1]
      for(var delta = 0; delta < 4; delta++){
        dx = lx[delta]
        dy = ly[delta]
        if(!grid[dx]){continue}
        if(grid[dx][dy] === 255){
          starts.put([dx,dy])
          grid[dx][dy] = iteration
        } else if(grid[dx][dy] === "#98E681"){
          console.log(dx,dy)
          found = [x,y]
        }
      }
    }
    for(let i = 0;i < nbCellsHorizontal; i++){
      for(let j = 0;j < nbCellsVertical; j++){
        cell(i,j)
      }
    }
    
    iteration += changement
    if(found){
      clearInterval(intvlID)
      backtrack(found)
    }
  },speed);
}

function backtrack(pos){
  x = pos[0]
  y = pos[1]
  intvlID2 = setInterval(
  function(){
    good = false
    lx = [x+1,x-1,x,x]
    ly = [y,y,y+1,y-1]
    for(var delta = 0; delta < 4; delta++){
      dx = lx[delta]
      dy = ly[delta]
      if(!grid[dx]){continue}
      if(grid[dx][dy] === grid[x][y]-changement){
        grid[x][y] = "#F7D354"
        cell(x,y)
        x = dx
        y = dy
        good = true
      }
    }
    
    
    if(!good){
      grid[x][y] = "#F7D354"
      cell(x,y)
      clearInterval(intvlID2)
      stopBFS()
    }
  },speed)
}

function stopBFS(){
  clearInterval(intvlID)
  loop()
  unsearchB.style("display", "none")
  searchB.style("display", "block")
}