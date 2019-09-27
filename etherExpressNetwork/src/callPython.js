const pythonShell = require('python-shell')
const path = require('path')

let options = {

    // 사진을 입력값으로 사용하기 위해서는 text mode 이외의 JSON 또는 Binary mode를 사용해야 함.
    // -> 사진파일을 직접 전달하는 방식에 대해 확인필요
    // 현재 연계방식이 정의되지는 않았으나, 이미지파일전달 -> 특장점(LIST)를 OUTPUT으로 전달하고
    // 해당 값에 대한 비교로직 추가 필요함
    mode: 'text',
    // pythonPath 는 실제 사용하기 위한 Python.exe가 존재하는 경로
    // 입력하지 않으면 PATH 기준으로 존재하는 python.exe 위치를 자동인식
    // 실제 구동을 위해서는 로컬PC기준 경로수정 필요
    // pytorch 의 경우 Anaconda 에 종속(또는 conda를 통한 설치가 진행되어야 할 수 있으므로)
    // 일단은 pip기준으로 수행하도록 로직 설정 필요 -> 하여 주석 처리
    // 아니면 venv 기준으로 수행가능한지 확인 -> venv 사용 방법 확인
    //pythonPath: 'C:\\Python37\\python',
    pythonPath: path.join(__dirname, 'pythonAI', 'myvenv', 'Scripts', 'Python'),
    // 실제 python을 command 상에서 호출할 때 입력되는 option 동일하게 입력
    pythonOptions: ['-u'], // get print results in real-time
    // scriptPath 는 실행되기 위한 Python파일이 존재하는 위치
    // 현재는 /src/pythonAI로 폴더 지정
    scriptPath: path.join(__dirname, 'pythonAI'),
    // 입력 매개변수 -> 일단은 강제로 매개변수 입력해서 수행할 것 정상적으로 구동여부 확인
    args: [path.join(__dirname, 'pythonAI', '000010.jpg')]
}

module.exports = {
  callPython : function() {

    console.log('run callPython')

    //pythonShell.PythonShell.run('./test.py', options, function (err, results) {
      pythonShell.PythonShell.run('./main.py', options, function (err, results) {

      if (err) return err;

      // results is an array consisting of messages collected during execution
      // %j : JSON %O : Object
      //console.log('results: %j', results);
      console.log(results)

      // python을 통해 전달되는 값이 tuple(like Array) 또는 dictoionary(Like Map) 의 형태를 가지는 경우
      // 전달받은 값을 그대로 사용하면, 해당 tuple 또는 dictionary의 세부 값에는 접근할 수 없음
      //console.log('before parse Data`s length : ' + results[0])
      

      // 해당 List의 세부 출력값을 사용하기 위해서는 JSON 방식으로 변환 필요
      //let parseData = JSON.parse(results)

      //console.log('after parse Data`s length : ' + parseData.length)
      //console.log(results)

      // TODO 실제 전달된 Binary 또는 Image 파일을 출력할 수 있을지 확인
      // nodejs 에서 이미지 파일 전달 mode 확인 필요
      // 전달되는 값이 tensor 로 넘어오므로, 해당 값을 어떻게 저장할 것인지 확인 필요
      // JSON 방식으로 호출하는 것은 정상적으로 처리되지 못함 -> ERROR 발생

      // 실제로 입력받은 tensor를 object 그대로 저장하고, 이 값을 기준으로 유사도를 비교하는 방식으로
      // 진행해야 하는지 확인 필요함.


    });
  }
}