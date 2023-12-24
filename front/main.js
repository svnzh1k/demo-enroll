
var set = new Set();
function createButton(text) {
  const buttonElement = document.createElement('button');
  buttonElement.textContent = text;
  return buttonElement;
}

    fetch('http://localhost:7070/subjects')
    .then(response => response.json())
    .then(subjects => {

      subjects.forEach(subject => {
        var id = subject.id;
        var code = subject.code;
        var subject_name = subject.subject_name;

        const subjectElement = createButton(`${code} ${subject_name}`);
        subjectElement.onclick = function (){
          clearBlue();
        };
        subjectElement.addEventListener('click', function () {
          fetchAndDisplayLectures(id, code);
        });
        subjectsList.appendChild(subjectElement);
      });
    })
    .catch(error => console.error('Error fetching subjects:', error));


const subjectsList = document.getElementById('subjectsList');
const lecturesList = document.getElementById('lecturesList');
const practicesList = document.getElementById('practicesList');



function fetchAndDisplayLectures(id, code) {
  fetch(`http://localhost:7070/lectures/${id}`)
    .then(response => response.json())
    .then(lectures => {
      lecturesList.innerHTML = '';

      lectures.forEach(lecture => {
        var id = lecture.id;
        var day = lecture.day;
        var duration = lecture.duration;
        var lecturer = lecture.lecturer;
        var time = lecture.time;
        var subject_id = lecture.subject_id;
        const lectureElement = createButton(`${lecturer} | ${day} | ${time}`);
        lectureElement.addEventListener('click', function () {
          fetchAndDisplayPractices(id, code);
          setLecture(id,time, day, subject_id, duration, code, lecturer);
        });

        lecturesList.appendChild(lectureElement);
      });
    });
}

function fetchAndDisplayPractices(id, code) {
  fetch(`http://localhost:7070/practices/${id}`)
    .then(response => response.json())
    .then(practices => {
      practicesList.innerHTML = '';

      practices.forEach(practice => {
        var id = practice.id;
        var day = practice.day;
        var duration = practice.duration;
        var practice_teacher = practice.practice_teacher;
        var time = practice.time;
        var lecture_id = practice.lecture_id;

        const practiceElement = createButton(`${practice_teacher} | ${day} | ${time}`);
        practiceElement.addEventListener('click', function(){
          setPractice(id, time , day, lecture_id, duration, code, practice_teacher);
        });

        practicesList.appendChild(practiceElement);
      });
    });
}

function setLecture(id, time, day, subject_id, duration, code, lecturer) {
  clearBlue();
  content = code + " " + lecturer + " [L]";
  while (duration > 0){
    var div = document.createElement('div');
    div.textContent = content;
    div.style.color = 'blue';
    document.getElementById(day + "-" + time).appendChild(div);
    time++;
    duration--;
  }
}


function setPractice(id, time, day, lecture_id, duration, code, practice_teacher) {
  clearByCode();
  content = code + " " + practice_teacher + " [P]";
  while (duration > 0){
    var div = document.createElement('div');
    div.textContent = content;
    div.style.color = 'blue';
    document.getElementById(day + "-" + time).appendChild(div);
    time++;
    duration--;
  }
}


function clearBlue(){
  for (let day = 1; day <= 6; day++){
    for (let time = 9; time <= 22; time++){
      var td = document.getElementById(day + "-" + time);
      var divs = td.querySelectorAll('div');
      divs.forEach(div =>{
        if (div.style.color === "green"){  
        }else{
            td.removeChild(div);
        }
      })
    }
  }
}

function clearByCode(){
  for (let day = 1; day <= 6; day++){
    for (let time = 9; time <= 22; time++){
        var td = document.getElementById(day + "-" + time);
        var divs = td.querySelectorAll('div');
        divs.forEach(div =>{
            if (div.style.color === 'blue' && div.textContent.endsWith('[P]') || div.textContent === null){
                td.removeChild(div);
            }
        })
    }
  }
}


var theBlue = new Set();
function addToBasket(code){
    var intersection = false;
    
  for (let day = 1; day <= 6; day++){
    for (let time = 9; time <= 22; time++){
        var cells = document.getElementById(day + "-" + time).querySelectorAll('div');
        if (cells.length < 1){
            continue;
        }
        if (cells.length > 1){
            console.log("intersection");
            console.log(cells, "at", day + "-" + time);
            return;
        }
        if (cells[0].style.color === "blue"){
            theBlue.add(day + "-" + time);
        }
    }
  }
  theBlue.forEach(cell =>{
    document.getElementById(cell).querySelector('div').style.color = 'green';
  })
  theBlue.clear();
  fetchAndDisplayLectures();
}
