function randomRange(from, to){
	return Math.floor(Math.random() * (to - from +1) + from);
}

function sha256(ascii) {
    function rightRotate(value, amount) {
        return (value>>>amount) | (value<<(32 - amount));
    };
    var mathPow = Math.pow;
    var maxWord = mathPow(2, 32);
    var lengthProperty = 'length'
    var i, j; 
    var result = ''
    var words = [];
    var asciiBitLength = ascii[lengthProperty]*8;
    var hash = sha256.h = sha256.h || [];
    var k = sha256.k = sha256.k || [];
    var primeCounter = k[lengthProperty];
    var isComposite = {};
    for (var candidate = 2; primeCounter < 64; candidate++) {
        if (!isComposite[candidate]) {
            for (i = 0; i < 313; i += candidate) {
                isComposite[i] = candidate;
            }
            hash[primeCounter] = (mathPow(candidate, .5)*maxWord)|0;
            k[primeCounter++] = (mathPow(candidate, 1/3)*maxWord)|0;
        }
    }
    
    ascii += '\x80' 
    while (ascii[lengthProperty]%64 - 56) ascii += '\x00' 
    for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j>>8) return;
        words[i>>2] |= j << ((3 - i)%4)*8;
    }
    words[words[lengthProperty]] = ((asciiBitLength/maxWord)|0);
    words[words[lengthProperty]] = (asciiBitLength)
    
    for (j = 0; j < words[lengthProperty];) {
        var w = words.slice(j, j += 16);
        var oldHash = hash;
        hash = hash.slice(0, 8);
        
        for (i = 0; i < 64; i++) {
            var i2 = i + j;
            var w15 = w[i - 15], w2 = w[i - 2];

            var a = hash[0], e = hash[4];
            var temp1 = hash[7]
                + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) 
                + ((e&hash[5])^((~e)&hash[6]))
                + k[i]
                + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15>>>3))
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2>>>10))
                    )|0
                );
            var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                + ((a&hash[1])^(a&hash[2])^(hash[1]&hash[2]));
            
            hash = [(temp1 + temp2)|0].concat(hash);
            hash[4] = (hash[4] + temp1)|0;
        }
        
        for (i = 0; i < 8; i++) {hash[i] = (hash[i] + oldHash[i])|0;}
    }
    
    for (i = 0; i < 8; i++) { for (j = 3; j + 1; j--) {
            var b = (hash[i]>>(j*8))&255;
            result += ((b < 16) ? 0 : '') + b.toString(16);
    }}
    return result;
};


function nodebox(node_data = false){
	function createElement(tag, params = false){
		const element = document.createElement(tag);
		if (params) for (let i of Object.keys(params)) 
		if (i=='style') for (let j of Object.keys(params[i]))  element.style[j] = params[i][j]
		else element[i] = params[i];
		return element;
	}

	function dragElement(element, callback){
		let mouseDown = false
		let mouseDownPosition = []
		let mousemove = () => {}
		let mouseup   = () => {}

		let evnt = null
		element.onmousedown = function(event){ 
			evnt = event;
			const tempfuc = callback(evnt);
			if (tempfuc){
				mousemove = 'mousemove' in tempfuc?tempfuc['mousemove']:() => {}
				mouseup = 'mouseup' in tempfuc?tempfuc['mouseup']:() => {}
			}
			mouseDownPosition = [event.screenX, event.screenY]; 
			mouseDown = true
		}
		element.onmousemove = function(event){ 
			if (mouseDown){
				mousemove(event.screenX - mouseDownPosition[0], event.screenY - mouseDownPosition[1], evnt);
				mouseDownPosition = [event.screenX, event.screenY];
			}
		}
		element.onmouseup = function(){  
			mouseup(evnt);  
			mouseDown = false 
			mousemove = () => {}
			mouseup = () => {}
		}
		element.onmouseleave = function(){ mouseDown = false }
	}


	const colorHash = {}
	const paddingx = 10000;

	// -----node-------------------------------------------------------------------------------------
	// function _node(title, pos = false, outputs = false, inputs = false, dop = false){
	function _node({action = 'output', pos = [0,0], outputs = false, inputs = ['#'], dop = false}){

		let bgcolor = '#'+(sha256(action.split('').reduce((summ, itm) => summ+itm.charCodeAt(0)*2, 0)).split('').map(itm => parseInt(itm)>2?itm:'').join('') + '344472').substr(0,6); //`#${randomRange(44,99)}${randomRange(44,99)}${randomRange(44,99)}`;
		if (action in colorHash)
			bgcolor = colorHash[action]
		else
			colorHash[action] = bgcolor
		
		const _nd = createElement('div', {style: {
			userSelect: 'none',
			position: 'absolute', 
			left: '0px', 
			top: '0px', 
			fontSize: '13px', 
			border: '1px solid #777', 
			borderRadius: '3px', 
			overflow: 'hidden',
			minWidth: '150px',
			boxShadow: "0px 3px 17px #0000009c"
		}})

		if (pos){
			_nd.style.left = paddingx + pos[0] + 'px'
			_nd.style.top =  paddingx + pos[1] + 'px'
		}





		///////////////////////////////
		// TITLE //////////////////////
		///////////////////////////////


		//##############################
		//##############################
		//##############################
		//##############################
		//			#########
		//			#########
		//			#########
		//			#########
		//			#########
		//			#########
		//			#########
		//			#########
		//			#########
		//			#########
		//			#########


		const titleWrapper = createElement('div', {
			style: {
				background: bgcolor,
				pointerEvents: 'none',
				display: 'flex',
				padding: '2px',
			}
		})

		const _title = createElement('div', {
			style: {
				padding: '2px 15px 2px 6px',
				color: '#fff',
				pointerEvents: 'none',
				flex: '1'
			},
			innerHTML: action
		})

		const run = createElement('span', {
			style: {
				padding: '1px 5px',
				color: '#fff',
				margin: "0",
				background: "rgb(104 104 104 / 40%)",
				border: '1px solid #393939',
				borderRadius: '50%',
				cursor: 'pointer',
				textAlign: 'center',
				fontSize: '10px',
				lineHeight: '16px',
				cursor: 'pointer',
				pointerEvents: 'auto',

			},
			innerHTML: '▶',
			onclick: () => {
				alert('run')
			}
		})
		
		titleWrapper.appendChild(run)
		titleWrapper.appendChild(_title)


		if (dop?.dontRemove!=true){
			const remove = createElement('span', {
				style: {
					padding: '1px 5px',
					color: '#fff',
					margin: "0",
					background: "rgb(104 104 104 / 40%)",
					border: '1px solid #393939',
					borderRadius: '50%',
					cursor: 'pointer',
					textAlign: 'center',
					fontSize: '9px',
					lineHeight: '16px',
					cursor: 'pointer',
					pointerEvents: 'auto',

				},
				innerHTML: '⛌',
				onclick: () => {
					if (confirm('remove')){
						_nd.remove()
					}
				}
			})
			titleWrapper.appendChild(remove)
		}


		//////////////////////////////////
		// XX TITLE //////////////////////
		//////////////////////////////////





		const body = createElement('div', {
			style: {
				padding: '2px',
				background: '#555',
				color: '#fff'
			}
		})



		///////////////////////////////////
		// GET INPUT //////////////////////
		///////////////////////////////////


		
					//######
					//######
					//######
					//######


					//######
					//######
					//######
					//######
					//######
					//######
					//######
					//######
					//######
					//######
					//######
					//######
					//######





		function getInput(val, output = false){
			let protect = false;
			if (val[0]=='#'){
				val = val.substr(1);
				protect = true
			}

			const inputWrapper = createElement('div', {
				style: {
					position: 'relative',
					display: 'flex',
					margin: '1px 0',
				}
			})

			const connect = createElement('div', {
				style: {
					width: '5px',
					width: '5px',

				}
			})



			const input = createElement('div', {
				style: {
					padding: '5px',
					color: '#fff',
					background: output?'':"#686868",
					border: output?'':'1px solid #444',
					textAlign: output?'right':'left',
					borderRadius: '3px',
					cursor: 'pointer',
					outline: 'none',
					marginRight: '1px',
					flex: 1,
					cursor: 'inherit'
				},
				innerHTML: val,
				contentEditable: true,
				role: 'input'
			})
			


			if (!protect){
				const btn = createElement('div', {
					style: {
						padding: '2px 8px',
						color: '#fff',
						background: "#686868",
						border: '1px solid #444',
						borderRadius: '3px',
						cursor: 'pointer',
						textAlign: 'center',
						fontSize: '8px',
						lineHeight: '21px',
					},
					innerHTML: '⛌',
					onclick: function(){
						this.parentNode.remove()
					}
				})

				if (output){
					inputWrapper.appendChild(btn)
					inputWrapper.appendChild(input)
				} else {
					inputWrapper.appendChild(input)
					inputWrapper.appendChild(btn)
				}
				
			} else {
				inputWrapper.appendChild(input)
			}

			return inputWrapper
		}

		
		///////////////////////////////////
		// GET INPUT //////////////////////
		///////////////////////////////////

		const _outputs = createElement('div')
		const _inputs = createElement('div')

		if (outputs)
			outputs.map(itm => {
				_outputs.appendChild(getInput(itm, true))
			})

		if (inputs)
			inputs.map(itm => {
				_inputs.appendChild(getInput(itm))
			})

		body.appendChild(_outputs)
		body.appendChild(_inputs)


		/// Add buttons

		const buns_collection = createElement('div', {
			style: {
				display: 'flex'
			}
		})

		const btn = createElement('div', {
			style: {
				padding: '1px 10px',
				color: '#fff',
				margin: "0",
				background: "rgb(74 74 74)",
				border: '1px solid #393939',
				borderRadius: '3px',
				cursor: 'pointer',
				textAlign: 'center',
				marginTop: '5px',
				flex: '1'
			},
			innerHTML: 'in',
		})
		btn.onclick = () => _inputs.appendChild(getInput(''))

		buns_collection.appendChild(btn)
		


		if (dop?.addButtons!='in'){
			const btn2 = createElement('div', {
				style: {
					padding: '1px 10px',
					color: '#fff',
					margin: "0",
					background: "rgb(74 74 74)",
					border: '1px solid #393939',
					borderRadius: '3px',
					cursor: 'pointer',
					textAlign: 'center',
					marginTop: '5px',
					flex: '1'
				},
				innerHTML: 'out',
			})
			btn2.onclick = () => _outputs.appendChild(getInput('', true))
			buns_collection.appendChild(btn2)
		}


		body.appendChild(buns_collection)

		_nd.appendChild(titleWrapper)
		_nd.appendChild(body)
		return _nd
	}
	// ------------------------------------------------------------------------------------------



































	const nodes = createElement('div', {
		style: {
			transformOrigin: "50%",
			position: 'absolute',
			top: -paddingx + 10 + 'px',
			left: -paddingx + 10 + 'px',
			padding: paddingx+'px',
			background: `#222 url("data:image/svg+xml,%3Csvg version='1.2' baseProfile='tiny-ps' xmlns='http://www.w3.org/2000/svg' viewBox='1 1 8 8' width='10' height='10'%3E%3Ctitle%3EBackground%3C/title%3E%3Cstyle%3E tspan %7B white-space:pre %7D .shp0 %7B fill: %23333 %7D %3C/style%3E%3Cpath id='Background' class='shp0' d='M0 0L8 0L8 8L0 8L0 0Z' /%3E%3C/svg%3E")`
		},
	})

	const nodeList = []

	if (!node_data)
		nodeList.push(_node({pos: [460,240], dop: {noButtons: true, dontRemove: true}}))

	
	node_data.map(__nd => {
		nodeList.push(_node(__nd))
	})
	// nodeList.push(_node('output', [460, 180], false, false, ['#'], {staticInputs: true, dontRemove: true}))
	// nodeList.push(_node('Парсинг', [210, 0], false, false, {addButton: true}))
	// nodeList.push(_node('Позиция', [210, 70], false, false, {addButton: true}))



	// nodeList.push(_node('document', [0, 0], ['#.'],[]))

	nodeList.map(_nd => nodes.appendChild(_nd))

	let zoom = 1;
	const field = createElement('div', {
		style: {
			position: 'relative',
			color: '#000',
			padding: '10px',
			borderRadius: '3px',
			height: "300px",
			overflow: 'hidden'
		},
		onwheel: function(event){
			if (event.wheelDelta>0){
				if (zoom<2)
					zoom+=0.04
			} else {
				if (zoom>0.2)
					zoom-=0.04
			}
			nodes.style.transform = `scale(${zoom})`
		},
		oncontextmenu: () => false
	})

	/////// DRAGG
	dragElement(field, function(event){
		if (nodeList.includes(event.target)){
			nodeList.map(itm => {
				if (itm!=event.target)
					itm.style.zIndex = 1
				else
					itm.style.zIndex = 100
			})
			return {
				mousemove: (sx, sy, event) => {
					event.target.style.left = (parseInt(event.target.style.left) + sx) + 'px'
					event.target.style.top = (parseInt(event.target.style.top) + sy) + 'px'
				}
			}
		}
		// if (event.buttons==2){
		if (event.target==nodes){

			return {
				mousemove: (sx, sy, event) => {
					nodes.style.left = (parseInt(nodes.style.left) + sx) + 'px'
					nodes.style.top = (parseInt(nodes.style.top) + sy) + 'px'
				}
			}
		}
	})

	field.appendChild(nodes);

	return field
}