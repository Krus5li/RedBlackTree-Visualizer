var rbt;
var positionTree;
var posHeight = 10;

var redelems;
var blackelems;
var spacing;

let screenSize = getScreenSize();


function start() {
    rbt = new RBT();
    posTreeInitialize(posHeight);
    lineTest();
}




function posTreeInitialize(indexSize) {
    positionTree = new RBT();

    //Pre-inserts values into a 2nd redblacktree in level order insertion
    for(let i = 0; i < indexSize; i++) {
        let carryOn = 0;
        for(let j = 0; j < twosPower(i); j++) {         
            if(j == 0) {
                positionTree.insert((twosPower(indexSize - (i + 1))));
                carryOn = (twosPower(indexSize - (i + 1)));
            }
            else {
                positionTree.insert( carryOn + twosPower(indexSize - i))
                carryOn = carryOn + twosPower(indexSize - i);
            }
            
        }
    }
    positionInit();

}

function twosPower(index) {
    var total = 1;
    if(index == 0) {
        return total;
    }
    for(var i = 0; i < index; i++) {
        total = total * 2;
    }
    return total;
}

function getScreenSize() {
    var screenWidth = screen.width;
    var screenHeight = screen.height;
    var returned = [screenWidth, screenHeight];
    return returned;
} 
function logBase(x, y) {
    return Math.log(y) / Math.log(x);
}

function powerOf(base, times) {
    let returner = 1;
    if(times == 0) {
        //Runthrough
    }
    else {
        for(let i = 0; i < times; i++) {
            returner  = returner * base;
        }
    }
    return returner;
}

function scalingFunction(scale, currentLevel) { 
    return ((screenSize[0]/2)/ (currentLevel * scale * scale* scale))
    
}

//Initialize the position fields of the positionTree
function positionInitHelper(root, traverseLevel, currentLevel) {
    if(root == null) {
        return null;
    }
    if(currentLevel == 1) {
        root.position = [(screenSize[0]/2), (screenSize[1]/4.5)];
    }
    else if(traverseLevel == 1) {
        if(root.isLeftChild()) {
            root.position = [root.parent.position[0] - scalingFunction(1.2, currentLevel),  root.parent.position[1] + (50*currentLevel)];
        }
        else if(root.isRightChild()) {
            root.position = [root.parent.position[0] + scalingFunction(1.2, currentLevel),  root.parent.position[1] + (50*currentLevel)];
        }
    }
    else {
        positionInitHelper(root.left, traverseLevel - 1, currentLevel);
        positionInitHelper(root.right, traverseLevel - 1,  currentLevel);
    }
} 
function positionInit() {
    for(let i = 0; i <= posHeight; i++) {
        positionInitHelper(positionTree.root, i, i);
    }
}




function clearBoard(){
    let elem = document.getElementById('rbtzone')
    while(elem.firstChild) {
        elem.removeChild(elem.firstChild);
    }
}

function deleteBoard() {
    clearBoard();
    rbt = new RBT();
}

function addNode() {
    clearBoard();
    rbt.insert(parseInt(document.getElementById('nodevalue').value));  
    printLevelOrder();
    document.getElementById('nodevalue').value = "";
}



 
/* function to print level order traversal of tree*/
function printLevelOrder() 
{
    var h = height(rbt.root);
    var i;
    for (i=1; i<=h; i++) {
        //Extract root position
        printCurrentLevel(rbt.root, positionTree.root, i, i);           
    }
        
}
 
/* Compute the "height" of a tree -- the number of
nodes along the longest path from the root node
down to the farthest leaf node.*/
function height(root)
{
    if (root == null)
        return 0;
    else
    {
        /* compute  height of each subtree */
        var lheight = height(root.left);
        var rheight = height(root.right);
            
        /* use the larger one */
        if (lheight > rheight)
            return(lheight+1);
        else return(rheight+1);
    }
}

/*
    Prints the nodes in a level order traversal
    It first checks to see if the node that corresponds to the 
*/
function printCurrentLevel (root, postree ,traverseLevel, currentLevel )
{
    if (root == null){
        return null;
    }
    //Creates the manipulatable element
    var nodes = document.createElement('div');

    
    
    
    if (traverseLevel == 1){        
        if(root.activeNode && postree.activeNode) {
            //Just let the program run through
            if(root.isBlack) {
                nodes.setAttribute('class', 'blackNode')
            }
            else {
                nodes.setAttribute('class' ,'redNode')
            }

            nodes.style.position = "absolute";
            nodes.style.left = (postree.position[0]) + "px";
            nodes.style.top = (postree.position[1]) + "px";
            nodes.innerHTML = root.value;
            document.getElementById('rbtzone').appendChild(nodes);
            if(currentLevel == 1) {
                
            }
            else {
                drawGraphLine(postree, "black", postree.isLeftChild());
            }
            
        }
    }
    else if (traverseLevel > 1) {
        printCurrentLevel(root.left, postree.left, traverseLevel-1, currentLevel);
        printCurrentLevel(root.right, postree.right, traverseLevel-1, currentLevel);
        }
    
}
//True is left false is right
function drawGraphLine(posiTree, color, direction) {
    var x1 = posiTree.position[0];
    var x2 = posiTree.parent.position[0];
    var y1 = posiTree.position[1];
    var y2 = posiTree.parent.position[1];
    var dist = Math.ceil(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)));
    var xoffset = 20;
    var yoffset = 20;
    var div = document.createElement('div');

    if(direction) {     
       var angle = 1*Math.atan2(y2-y1, x2-x1)*180/Math.PI;
       div.style.backgroundColor = color;
       div.style.position = 'absolute';
       div.style.left = (x1) +((x2 - x1)/2) - (dist/2) + 25 + 'px';
       div.style.top = (y1) - ((y1-y2)/2) + 25 + 'px';
       div.style.width = dist+'px';
       div.style.height = '2px';
       div.style.WebkitTransform = 'rotate('+angle+'deg)';
       div.style.MozTransform = 'rotate('+angle+'deg)';
       document.getElementById('rbtzone').appendChild(div); 
    }
    else {
        var angle = 1*Math.atan2(y2-y1, x2-x1)*180/Math.PI;
        div.style.backgroundColor = color;
        div.style.position = 'absolute';
        div.style.left = (x2) + ((x1 - x2)/2 - (dist/2)) + 25 + 'px';
        div.style.top = (y2) + ((y1-y2)/2) + 25 + 'px';
        div.style.width = dist+'px';
        div.style.height = '2px';
        div.style.WebkitTransform = 'rotate'+'('+angle+'deg)'; 
        div.style.MozTransform = 'rotate'+'('+angle+'deg)';       

        document.getElementById('rbtzone').appendChild(div); 
    }
}
function testAdd(a) {
    clearBoard();
    rbt.insert(a);  
    printLevelOrder();
}
function lineTest() {
    testAdd(4)
    testAdd(2)
    testAdd(6)
    testAdd(1)
    testAdd(3)
    testAdd(5)
    testAdd(7)
}

