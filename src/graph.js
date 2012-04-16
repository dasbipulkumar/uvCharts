var cv = {};

cv.graph = function () {

	this.dimension = {
		height: 400,
		width: 400
	};

	this.margin = {
		left: 60,		//x
		right: 20,		//dx
		top: 20,		//y
		bottom: 60		//dy
	};

	this.graphDef = undefined;
	this.position = undefined;
	this.caption = undefined;

	this.frame = undefined;
	this.panel = undefined;
	this.bg = undefined;

	this.axes = {
		hor : { group: undefined, scale : undefined, func: undefined, axis : undefined, line : undefined },
		ver : { group: undefined, scale : undefined, func: undefined, axis : undefined, line : undefined }
	};
};

cv.graph.prototype.init = function(graphDef) {

	this.dimension.height = graphDef.dimension.height || 400;
	this.dimension.width = graphDef.dimension.width || 400;
	this.margin.left = graphDef.margin.left || 60;
	this.margin.right = graphDef.margin.right || 20;
	this.margin.top = graphDef.margin.top || 60;
	this.margin.bottom = graphDef.margin.bottom || 60;
	this.position = graphDef.pos || '#chart3rdiv';
	this.graphdef = graphDef;
	
	this.setChart3rFrame();
	this.setChart3rPanel();
	this.setChart3rBackground('lavender');
};

cv.graph.prototype.setChart3rFrame = function (className, width, height){
	if(this.frame === undefined) {
		this.frame = d3.select(this.pos || "body").append("svg");
	}

	this.frame.attr("class", className || "chart3rframe")
			.attr("width", width || (this.dimension.width+this.margin.left+this.margin.right))
			.attr("height", height || (this.dimension.height+this.margin.top+this.margin.bottom));
}

cv.graph.prototype.setChart3rPanel = function (className) {
	if (this.panel === undefined) {
		this.panel = this.frame.append("g");
	}

	this.panel.attr("class", className || "chart3rpanel")
		.attr("transform", 'translate(' + this.margin.left + ',' + this.margin.right + ')');
}

cv.graph.prototype.setChart3rBackground = function (color) {
	if (this.bg === undefined) {
		this.bg = this.panel.append("rect").attr("class", 'chart3rbg').attr("height", this.dimension.height).attr("width", this.dimension.width);
	}
	
	this.bg.style('fill',color);
}

cv.graph.prototype.setHorAxis = function () {
	var graphdef = this.graphdef;
	this.axes.hor.group = this.panel.append('g').attr('class','x axis');

	if(graphdef.orientation === 'horizontal'){
		this.axes.hor.scale	= d3.scale.linear().domain([0,cv.utility.max(graphdef)+10]).range([0, this.dimension.width]);
		this.axes.hor.func = d3.svg.axis().scale(this.axes.hor.scale).ticks(2).tickSize(this.dimension.height, -10).tickPadding(10).tickSubdivide(4).orient("bottom");
		this.axes.hor.axis = this.axes.hor.group.append('g').call(this.axes.hor.func);

	} else {
		this.axes.hor.scale = d3.scale.ordinal().rangeRoundBands( [0, this.dimension.width], 0.4);
		this.axes.hor.func = undefined;
	}

	this.axes.hor.line = this.axes.hor.group.append('line').attr('y1', this.dimension.height).attr('y2', this.dimension.height).attr('x1','100%');
}

cv.graph.prototype.setVerAxis = function () {
	var graphdef = this.graphdef;
	this.axes.ver.group = this.panel.append('g').attr('class','y axis');

	if(graphdef.orientation === 'vertical'){
		this.axes.ver.scale	= d3.scale.linear().domain([0,cv.utility.max(graphdef)]).range([0, this.dimension.height]);
		this.axes.ver.func = d3.svg.axis().scale(this.axes.ver.scale).ticks(2).tickSize(this.dimension.height, -10).tickPadding(10).tickSubdivide(4).orient("bottom");
		this.axes.ver.axis = this.axes.ver.group.append('g').call(this.axes.ver.func);

	} else {
		this.axes.ver.scale = d3.scale.ordinal().rangeRoundBands( [0, this.dimension.height], 0.4);
		this.axes.ver.func = undefined;
	}

	this.axes.ver.line = this.axes.ver.group.append('line').attr('y1', 0).attr('y2', this.dimension.height);
}