jsPlumb.bind("ready", function() {

	var Aqueduct = {
	
		init: function() {
			// setup some defaults for jsPlumb.	
			jsPlumb.importDefaults({
				DragOptions : { cursor: 'pointer', zIndex:2000 },
				Endpoint : ["Dot", {radius:1}],
				PaintStyle : { strokeStyle:'#666' },
				HoverPaintStyle : {strokeStyle:"#42a62c", lineWidth:2 },
				ConnectionOverlays : [
					[ "Arrow", { 
						location: .95,
						id: "arrow",
	                    length: 14,
	                    foldback: 0
					} ]
				]
			});

			this.defineEndpoints();
			this.bindEvents();
		},

		defineEndpoints: function() {
			// configure some drop options for use by all endpoints.
			this.exampleDropOptions = {
				tolerance: "touch",
				hoverClass: "dropHover",
				activeClass: "dragActive"
			};

			// default plug endpoint (connects into things)
			this.plugEndpointColor = "rgba(22,45,212,0.5)";
			this.plugEndpoint = {
				endpoint: ["Dot", {radius:10} ],
				anchor: "BottomLeft",
				paintStyle: { fillStyle: this.plugEndpointColor, opacity: 0.5 },
				isSource: true,
				connectorStyle: { strokeStyle: this.plugEndpointColor, lineWidth: 4 },
				connector: "Straight",
				isTarget: false,
				dropOptions: this.exampleDropOptions,
				maxConnections: -1,
				beforeDetach: function(conn) { 
					return confirm("Detach connection?"); 
				}
			};

			// default single socket endpoint (accepts a single plug)
			this.singleSocketEndpointColor = "rgba(229,219,61,0.5)";
			this.singleSocketEndpoint = {
				endpoint: ["Dot", {radius:10} ],
				anchor: "BottomLeft",
				paintStyle: { fillStyle: this.singleSocketEndpointColor, opacity: 0.5 },
				isSource: false,
				connectorStyle: { strokeStyle: this.ingleSocketEndpointColor, lineWidth: 4 },
				connector: "Straight",
				isTarget: true,
				dropOptions: this.exampleDropOptions,
				onMaxConnections: function(info) {
					alert("Cannot drop connection " + info.connection.id + " : maxConnections has been reached on Endpoint " + info.endpoint.id);
				}
			};

			// default multi socket endpoint (accepts unlimited plugs)
			this.multiSocketEndpointColor = "rgba(32,188,36,0.5)";
			this.multiSocketEndpoint = {
				endpoint: ["Dot", {radius:10} ],
				anchor: "BottomLeft",
				paintStyle: { fillStyle: this.multiSocketEndpointColor, opacity: 0.5 },
				isSource: false,
				connectorStyle: { strokeStyle: this.multiSocketEndpointColor, lineWidth: 4 },
				connector: "Straight",
				isTarget: true,
				dropOptions: this.exampleDropOptions,
				maxConnections: -1
			};

			// adds the endpoints appropriately
			jsPlumb.addEndpoint($(".node"), { anchor: [1, 0.5, 0, -1] }, this.plugEndpoint);
			jsPlumb.addEndpoint($(".node.singleSocket"), { anchor: [0, 0.5, 0, 0] }, this.singleSocketEndpoint);
			jsPlumb.addEndpoint($(".node.multiSocket"), { anchor: [0, 0.5, 0, 0] }, this.multiSocketEndpoint);
		},

		bindEvents: function() {
			jsPlumb.draggable($(".node"), { containment: '.workspace-container' });
			jsPlumb.bind("click", jsPlumb.detach);

			$('.data-drawer li').draggable({
				containment: '#content',
				appendTo: '#content',
				helper: 'clone'
			});
			$('.workspace-container').droppable({
				accept: '.data-drawer li',
				drop: function(event, ui) {
					Aqueduct.addNode(ui.draggable);
				}
			});

			$('.node').bind('click', this.selectNode);
			$('.node-tool-delete').bind('click', this.deleteNode);
			$('.node-tool-options').bind('click', this.showPopover);
		},

		addNode: function(ui) {
			var nodeClass = $(ui).attr('data-node-class'),
				nodeText  = $(ui).text(),
				workspace = $('.workspace-container'),
				// For now, just assign a random number for a unique ID for new nodes
				rand	  = Math.floor(Math.random()*1001),
				// Since we're dragging the item to the workspace, we want to position
				// the node at the mouse pointer's drop location
				xPos	  =	event.pageX,
				yPos	  =	event.pageY - 40,
				// HTML template for a default node, with classes and text from the button
				node 	  = '<div class="node ' + nodeClass + '" id="' + rand + '" style="left: ' + xPos + 'px; top: ' + yPos + 'px;">' + nodeText + 
							'    <div class="node-tools">' + 
							'        <div class="node-tool-options"><i class="icon-cog"></i></div>' +
							'        <div class="node-tool-delete"><i class="icon-trash"></i></div>' + 
							'    </div>' + 
							'</div>';

			workspace.append(node);
			$('#' + rand + ' .node-tool-delete').bind('click', Aqueduct.deleteNode);
			$('#' + rand + ' .node-tool-options').bind('click', this.showPopover);
			$('#' + rand).bind('click', this.selectNode);

			jsPlumb.draggable($('#' + rand), { containment: '.workspace-container' });
			jsPlumb.addEndpoint($('#' + rand), { anchor: [1, 0.5, 0, -1] }, Aqueduct.plugEndpoint);
			jsPlumb.addEndpoint($('#' + rand), { anchor: [0, 0.5, 0, 0] }, Aqueduct.singleSocketEndpoint);
		},

		deleteNode: function() {
			var nodeId = $(this).parent().parent().attr('id');
   				jsPlumb.remove(nodeId);
		},

		selectNode: function() {
			$('.node').not(this).removeClass('activeNode');
			$(this).toggleClass('activeNode');
		},

		showPopover: function() {
			console.log('Show popover');
		}
	};

	Aqueduct.init();
});