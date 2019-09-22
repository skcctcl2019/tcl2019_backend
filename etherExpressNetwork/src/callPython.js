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
    pythonPath: 'C:\\Python37\\python',
    // 실제 python을 command 상에서 호출할 때 입력되는 option 동일하게 입력
    pythonOptions: ['-u'], // get print results in real-time
    // scriptPath 는 실행되기 위한 Python파일이 존재하는 위치
    // 현재는 /src/pythonAI로 폴더 지정
    scriptPath: path.join(__dirname, 'pythonAI'),
    // 입력 매개변수
    args: ['hello']
}

module.exports = {
  callPython : function() {

    console.log('run callPython')

    pythonShell.PythonShell.run('./test.py', options, function (err, results) {

      if (err) return err;

      // results is an array consisting of messages collected during execution
      console.log('results: %j', results);

      // python을 통해 전달되는 값이 tuple(like Array) 또는 dictoionary(Like Map) 의 형태를 가지는 경우
      // 전달받은 값을 그대로 사용하면, 해당 tuple 또는 dictionary의 세부 값에는 접근할 수 없음
      console.log('before parse Data`s length : ' + results[0])
      
      // 해당 List의 세부 출력값을 사용하기 위해서는 JSON 방식으로 변환 필요
      let parseData = JSON.parse(results)

      console.log('after parse Data`s length : ' + parseData.length)
      console.log(results)

      // TODO 실제 전달된 Binary 또는 Image 파일을 출력할 수 있을지 확인
      // nodejs 에서 이미지 파일 전달 mode 확인 필요


    });
  }
}