(function(){
	//cache all items for reuse
	var getById=function(id){
		return document.getElementById(id)||document.querySelector('#'+id+'');
	}
	
	var start=getById('start');
	var selectorBox=getById('selector-box');
	//var gamebox1=getById('gamebox1');
	var gamebox2=getById('gamebox2');
	
	var gridSelect=getById('gridsize');
	for(var i=6;i<13;i++){
			gridSelect.innerHTML+="<option value='"+i+"'>"+i+"x"+i+"</option>";
		}
	
	addEvent(start,'click',gameInit,false);
	
	function gameInit(){
	var gridSize=gridSelect.value;
	var gridSize2=gridSize*gridSize;
	addClass(selectorBox,'hidden');	
	//init(gamebox1,gridSize);
	View.init(gamebox2,gridSize);
	}
	
	var View={
	init: function(gamebox,gridSize){
			labelForGamebox=document.querySelector('label[for='+gamebox.id+']');
			removeClass(gamebox,'hidden');
			removeClass(labelForGamebox,'hidden');
			var k=1;
			for(var i=1;i<=gridSize;i++){
				for(var j=1;j<=gridSize;j++){
				var smallDiv=document.createElement('div');
				addClass(smallDiv,'smallgrid');
				smallDiv.setAttribute('data-contains',0);
				smallDiv.setAttribute('data-limit',Model.checkPos(k,gridSize));
				smallDiv.id=gamebox.id+'-'+k;
				smallDiv.innerHTML='&nbsp;';
				addEvent(smallDiv,'click',Model.checkHit,false);
				gamebox.appendChild(smallDiv);
				k++;	
				}
			}
		labelForGamebox.style.width=	gamebox.style.width=	(gridSize*40)+2+"px";
		gamebox.style.height=(gridSize*40)+2+"px";
		View.placeShips();
		},
	placeShips:function(){
		var x=1;
		for(var i=0;i<Model.ships.length;i++){
			for(var j=0;j<Model.ships[i].locations.length;j++){
				//console.log('found'+Model.ships[i].locations[j]);
				var loc=Model.ships[i].locations[j];
				addClass(getById(loc),'ship');
				//console.log('found'+Model.ships[i].locations[j]);
				}
				//console.log('found'+x++);
				//console.log(Model.ships[i]);
			}
		}
	};
	
	var Model={
	gridSize:0,
	numShips:0,
	shipsSunk:0,
	ships:[
			{
			locations:['gamebox2-1','gamebox2-2','gamebox2-3'],
			size:this,
			hits:0
			},
			{
			locations:['gamebox2-22','gamebox2-23','gamebox2-24'],
			size:this,
			hits:0
			}
		],
	isEmpty: function(obj){
			 if(obj.length===0)
			 return 1;		
		 	 },
	isGameOver:function(){
		// change logic for win condition to be easier
		if(this.shipsSunk===this.ships.length)
		return 1;
		else
		return 0;
		},
	isSunk:function(ship){
		if(ship.locations.length===0)
		return true;
		else
		return false;	
	},
	//Get hit details 
	checkHit:function(event){
		var event=event||Window.event;
		var grid=event.target;
		var gridId=event.target.id;
		for(var i=0;i<Model.ships.length;i++){
			var ship=Model.ships[i];
			var index=ship.locations.indexOf(gridId);
			if(index>=0&&index<ship.locations.length){
			ship.locations.splice(index,1);
			removeEvent(grid,'click',Model.checkHit,false);
			addClass(grid,'noclick');
			if(Model.isSunk(ship)){
				console.log("ship sunk");
			}
			console.log('hit');
			return true;
			}
			
		}
		console.log('miss');
		return false;
			
		
			if(Model.isGameOver()){
			console.log('Game Over . Player '+currPlayer+' wins');
			window.location='';
			return;
			}
			else{
			console.log('game goes on');
			}		
	},
	checkPos:function(x,size){
		size=parseInt(size);
		var size2=size*size;
		//If corners return 1
		switch(x){
			case 1:
			case size:
			case size2:
			case size2+1-size:
			return 1;
		}
		//If edges return 2, might be easier way.
		//first row? || last row? || left column? || right column?
		if( (x<size) || (x>(size2+1-size)&&x<size2) || (x%size==1) || (x%size==0) )
			return 2;
		
		//for all other cells , 3 is limit
			return 3;	
		}
	 };
	 //var Model={x:5}
	 var x=8;
	
})();

/*Lib Helper functions, move out if the game gets bigger, added here to reduce page time */
function addEvent(elt,evt,listenerfunc,capture){
	if(elt.addEventListener){
		elt.addEventListener(evt,listenerfunc,capture);
	}
	else if(elt.attachEvent){
		elt.attachEvent('on'+evt,listenerfunc);
	}
}

function removeEvent(elt,evt,listenerfunc,capture){
	if(elt.removeEventListener){
		elt.removeEventListener(evt,listenerfunc,capture);
	}
	else if(elt.detachEvent){
		elt.detachEvent('on'+evt,listenerfunc);
	}
	
}

function addClass(elt,newClass){
	if(elt.classList){
		elt.classList.add(newClass);
	}
	else{
		if(elt.className==="")
			elt.className=newClass;
		else if(elt.className.indexOf(newClass)==-1){
			elt.className=newClass;
		}
		else
			elt.className+=" "+newClass;
	}
}

function removeClass(elt,oldClass){
	if(elt.classList){
		elt.classList.remove(oldClass);
	}
	else{
		if(elt.className==="")
			return;
		if(elt.className.indexOf(oldClass)!==-1){
			elt.className.replace(oldClass,' ');
			}
		}
}

function sibling(elt,n){
	if(n===undefined) n=1;
	if(n==0) return elt;
	if(n<0)
	{
		if(elt.previousElementSibling)
		{
			while(n++ && elt)
			elt=elt.previousElementSibling;
			return elt;
		}
		else{
			while(n++ && elt)
			{
				for(elt=elt.previousSibling;elt&&elt.nodeType!==1;elt=elt.previousSibling)
				/*Empty*/;
				elt=elt.previousSibling;
			}
			}
	
	}
	else{
		if(elt.nextElementSibling)
		{
			while(n-- && elt)
			elt=elt.nextElementSibling;
			return elt;
		}
		else{
		while(n-- && elt)
			{
				for(elt=elt.nextSibling;elt&&elt.nodeType!==1;elt=elt.nextSibling)
				/*Empty*/;
				elt=elt.nextSibling;
			}
		}
	}
	return elt;
}