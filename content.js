console.log("oi");

function getElemOfSubject(name) {
	let elems = document.getElementsByTagName("span");
	for(let i = 0; i < elems.length; i++) {
		if(elems[i].innerText.includes(name)) return elems[i];
	}
	return "none";
}

function processSubject(name, grades) {
	let elem = getElemOfSubject(name);
	let gradeSum = 0;
	let numGrades = 0;
	
	for(let i = 0; i < grades.length; i++) {
		if(grades[i].collection.subject.name != name) continue;
		if(isNaN(grades[i].value.charAt(0))) continue;

		if(grades[i].collection.type.toUpperCase() == "KA") grades[i].collection.weighting=2;
		gradeSum += parseInt(grades[i].value.charAt(0)) * grades[i].collection.weighting;
		numGrades += 1 * grades[i].collection.weighting;
	}
	if(numGrades == 0) return;
	console.log(`${name} , ${gradeSum}:${numGrades}`);
	elem.innerText += ` Ø ${(gradeSum / numGrades).toFixed(1)}`;
}

function waitForLoad(name) {
    return new Promise(resolve => {
        const observer = new MutationObserver(mutations => {
            if (getElemOfSubject(name) != "none") {
                resolve();
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

function commitArson(data) {
	waitForLoad(data.subjects[0].name).then(() => {
		for(let i = 0; i < data.subjects.length; i++) {
			processSubject(data.subjects[i].name, data.grades);
		}
	});
}

function doFetch() {
	let studentId = document.URL.split("/")[4];
	let grades;
	fetch(`https://beste.schule/web/students/${studentId}?include=grades,subjects,intervals,finalgrades`)
  		.then((response) => response.json())
  		.then((data) => {
  			console.log(data.data);
  			commitArson(data.data);
  		});
}

doFetch();