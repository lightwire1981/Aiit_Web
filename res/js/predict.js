// run the webcam image through the image model
async function predict() {
	// // predict can take in an image, video or canvas html element
	// let image = document.getElementById("face-image")
	// // const prediction = await model.predict(webcam.canvas);
	// const prediction = await model.predict(image, false);
	// testFunc();
	// for (let i = 0; i < maxPredictions; i++) {
	// 	const classPrediction =
	// 		prediction[i].className + ': ' + prediction[i].probability.toFixed(2);
	// 	// labelContainer.childNodes[i].innerHTML = classPrediction;
	// 	let cname = document.createElement('div');
	// 	cname.setAttribute("class", "cname");
	// 	cname.innerHTML = prediction[i].className;
	// 	let graph = document.createElement('div');
	// 	graph.setAttribute("class", "graph");
	// 	let result = document.createElement('span');
	// 	result.style.width = Math.round(prediction[i].probability.toFixed(2)*100)+"%";
	// 	result.innerHTML = prediction[i].probability.toFixed(2)*100+"%";
	// 	graph.appendChild(result);
	// 	labelContainer.childNodes[i].appendChild(cname);
	// 	labelContainer.childNodes[i].appendChild(graph);
	// }
}