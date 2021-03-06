const express = require('express')
const bodyParser=require('body-parser')

const fs=require('fs')//file 전송
const app=express()

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended:false}));

let login_chk=[]
let login_id

app.get('/',(request,response)=>{//로그인 페이지
    fs.readFile("./js/project.html",(error,data)=>{
        response.writeHead(200,{'Content-Type':"text/html"})
        response.end(data)
    })
});
app.post('/',(request,response)=>{//로그인 확인
    let arr=[];
    arr.push(request.body);

    let objArray=[]
    objArray = fs.readFileSync("./js/user_information.txt").toString().split('\n')
    for(let i in objArray) {
        if(i==objArray.length-1) break; //마지막은 ''으로 되어있음.
        objArray[i] = JSON.parse(objArray[i].toString())//문자열을 객체로 파싱
    }
    let id_exi=0;
    let lock=0
    for(let i in objArray) {
        if(i==objArray.length-1) break;
        if(objArray[i].user_id == arr[0].user_id){//아이디 확인(있는 아이디이다)
            id_exi=1;
            if(login_chk.length!=0){
                for(let j in login_chk){
                    if(login_chk[j][0]==objArray[i].user_id && login_chk[j][1]==3){
                        let now = new Date();
                        if((now.getTime()-login_chk[j][2])/1000 >=60){///60초 로그인 제한
                            //console.log("pop이전 "+login_chk)
                            login_chk.splice(j,1)
                            //console.log(login_chk)
                            break;
                        }
                        else{
                            lock=1
                        let str = '<body>'+'<meta charset="UTF-8">'+'<meta http-equiv="X-UA-Compatible" content="IE=edge">'+'<script>'+'alert("로그인이 제한된 아이디입니다.");'+'location.replace("/");'+'</script>'+'</body>'
                        response.write(str)
                        }
                    }
                }
            }
            if(lock==0){
            if(objArray[i].user_pwd != arr[0].user_pwd){//비번 학인(다른 경우)
                if(login_chk.length==0){
                    let temp=[]
                    temp.push(objArray[i].user_id)
                    temp.push(1)
                    login_chk.push(temp)
                    let str='<body>'+'<meta charset="UTF-8">'+'<meta http-equiv="X-UA-Compatible" content="IE=edge">'+'<script>'+'alert("비밀번호가 1번 틀렸습니다.");'+'location.replace("/");'+'</script>'+'</body>'
                    response.end(str)
                }
                else{
                    let chk=0
                        for(let j in login_chk){
                            if(login_chk[j][0]==objArray[i].user_id){
                                chk=1
                                let count = login_chk[j][1]+1
                                login_chk[j].splice(1,1,count)
                                
                                if(count==3){
                                    let befo = new Date();
                                    login_chk[j].push(befo.getTime())
                                    let str='<body>'+'<meta charset="UTF-8">'+'<meta http-equiv="X-UA-Compatible" content="IE=edge">'+'<script>'+'alert("비밀번호가 '+count+'번 틀렸습니다. 로그인이 1분간 제한됩니다.");'+'location.replace("/");'+'</script>'+'</body>'
                                    response.write(str)
                                }
                                else{
                                    let str='<body>'+'<meta charset="UTF-8">'+'<meta http-equiv="X-UA-Compatible" content="IE=edge">'+'<script>'+'alert("비밀번호가 '+count+'번 틀렸습니다.");'+'location.replace("/");'+'</script>'+'</body>'
                                    response.write(str)
                                }
                            }
                    }
                    if(chk==0){
                    //처음 틀린 경우
                    let temp=[]
                    temp.push(objArray[i].user_id)
                    temp.push(1)
                    login_chk.push(temp)
                    let str='<body>'+'<meta charset="UTF-8">'+'<meta http-equiv="X-UA-Compatible" content="IE=edge">'+'<script>'+'alert("비밀번호가 1번 틀렸습니다.");'+'location.replace("/");'+'</script>'+'</body>'
                    response.write(str)
                    }
                }


            }
            else{//비번 확인(같은 경우)
                login_id=arr[0].user_id
                let tex = '<body>'+'<script>'+'location.replace("/Enrolment")'+'</script>'+'</body>'
                response.end(tex)
            }
        }
        }
    }
    if(id_exi==0){//아이디가 없는 경우
        let tex =  '<body>'+'<meta charset="UTF-8">'+'<meta http-equiv="X-UA-Compatible" content="IE=edge">'+'<script>'+'alert("해당 아이디가 없습니다."); location.replace("/");'+'</script>'+'</body>'
        response.end(tex)
    }
})

app.get('/SignUp',(request,response)=>{//회원가입 페이지
    fs.readFile("./js/SignUp.html",(error,data)=>{
        response.writeHead(200,{'Content-Type':"text/html"})
        response.end(data)
    })
})

app.post('/SignUp',(request,response)=>{//회원가입 확인
    let arr=[];
    arr.push(request.body);
    let check=0;

    let objArray=[]
    objArray = fs.readFileSync("./js/user_information.txt").toString().split('\n')
    for(let i in objArray) {
        if(i==objArray.length-1) break;
        objArray[i] = JSON.parse(objArray[i].toString())//문자열을 객체로 파싱
        
    }
    for(let i in objArray) if(objArray[i].user_id == arr[0].user_id){ check=1; break;}

    if(check==0){
        
        fs.appendFileSync("./js/user_information.txt",JSON.stringify(arr[0])+"\n")//객체를 문자로 

        let idData = {user_id:arr[0].user_id, user_enrol:[]}//수강등록을 위한 객체
        fs.appendFileSync("./js/enrolment.txt",JSON.stringify(idData)+"\n")


        let tex = '<body>'+'<meta charset="UTF-8">'+'<meta http-equiv="X-UA-Compatible" content="IE=edge">'+'<script>'+'alert("회원가입되었습니다"); window.close();'+'</script>'+'</body>'
        response.end(tex)
    }
    else{
        let tex='<body>'+'<meta charset="UTF-8">'+'<meta http-equiv="X-UA-Compatible" content="IE=edge">'+'<script>'+'alert("이미 사용중인 아이디입니다. 다른 아이디를 입력하십시오"); location.replace("/SignUp");'+'</script>'+'</body>'
        response.end(tex)
        
    }

})

app.get('/Enrolment',(request,response)=>{
    let objArray=[]
    let objArray2=[]
    let enrolArray=[]
    let sum=0
    objArray = fs.readFileSync('./js/enrolment.txt').toString().split('\n') //id별로 신청한 과목
    objArray2 = fs.readFileSync('./js/subject.txt').toString().split('\n') //전체 과목

    let output1=""
    output1 += "<h4>\<수강 신청한 교과목\></h4>"
    output1 += '<table> <tr><th>교과목명<th>담당교수<th>학점'

    //로그인된 아이디랑 같은 아이디인 걸 objArray에서 찾아서 해당 교과목에 맞는 교수와 학점을 테이블로 만든다
    for(let i in objArray) {
        if(i==objArray.length-1) break;
        objArray[i] = JSON.parse(objArray[i].toString())//문자열을 객체로 파싱
        
    }
    for(let i in objArray){
        if(objArray[i].user_id==login_id){
            enrolArray=objArray[i].user_enrol
            break;
        }
    }

    for(let i of enrolArray){
            for(let j of objArray2){
                if(j!=""){
                    if(JSON.parse(j).name==i){
                        output1 += "<tr><td>"
                        output1 += JSON.parse(j).name
                        output1 += "<td>"
                        output1 += JSON.parse(j).p
                        output1 += "<td>"
                        output1 += JSON.parse(j).credit
                        output1 += "</tr>"
                        sum+=JSON.parse(j).credit
                    }
                }
            }
    }
    output1 += "</table><p><h5> \<총 수강 신청한 학점 총점 : "
    output1 += sum
    output1 += "\></h5></p>"


    let output2 ="";
    output2 += "<h4> \<전체 교과목\> </h4>"
    output2 += `<table> <tr><th>교과목명<th>담당교수<th>학점 `
    for(let i of objArray2){
        if(i != ""){
            output2 += "<tr><td>"
            output2 += JSON.parse(i).name
            output2 += "<td>"
            output2 += JSON.parse(i).p
            output2 += "<td>"
            output2 += JSON.parse(i).credit
            output2 += "</tr>"
        }
    } 
    output2 += "</table>"

    fs.readFile("./js/Enrolment.html",(error,data)=>{
        response.writeHead(200,{'Content-Type':"text/html"})
        response.write(data)
        response.write(output1)//수강신청한 과목 테이블 보여주기
        response.write(output2)//전체 과목 테이블
        response.end()
    })
})
app.post('/Enrolment/insert',(request,response)=>{//enrolment.txt에 전송된 데이터 삽입
    //enrolment.txt파일 읽어서 해당 아이디가 신청한 교과목 살펴보기

    let enrolData = request.body.intext;//교과목명
    let objArray=[]
    let objArray2=[]
    let enrolArray=[]
    let enrolArray2=[]
    let num, chk=0;
    objArray = fs.readFileSync("./js/enrolment.txt").toString().split('\n')
    objArray2 = fs.readFileSync('./js/subject.txt').toString().split('\n') //전체 과목
    for(let i in objArray) {
        if(i==objArray.length-1) break; //마지막은 ''으로 되어있음.
        objArray[i] = JSON.parse(objArray[i].toString())//문자열을 객체로 파싱
        //console.log(objArray[i])
    }
    for(let i in objArray2) {
        if(i==objArray2.length-1) break; 
        objArray2[i] = JSON.parse(objArray2[i].toString())
        enrolArray2.push(objArray2[i].name)
    }
    for(let i in objArray){
        if(objArray[i].user_id==login_id){
            enrolArray=objArray[i].user_enrol
            num=i//파일수정을 위한 숫자
            break;
        }
    }
    for(let i of enrolArray2){
        if(i==enrolData) chk=1
    }
    //console.log(chk)
    if(chk==0) {
        response.write('<body><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><script>alert("교과목명이 잘못입력되었습니다. 다시입력하십시오.");location.replace("/Enrolment");</script>')
    }
    else{
        chk=0
    for(let i of enrolArray){
        if(i==enrolData){
            chk=1;
            response.write('<body><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><script>alert("이미 수강신청한 교과목입니다."); location.replace("/Enrolment");</script>')
        }
    }
    if(chk==0){
        objArray[num].user_enrol.push(enrolData)
        for(let i=0; i<objArray.length-1;i++){
            if(i==0) fs.writeFileSync('./js/enrolment.txt', JSON.stringify(objArray[0])+"\n")
            else fs.appendFileSync("./js/enrolment.txt",JSON.stringify(objArray[i])+"\n")
        }
        response.write('<body><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><script>alert("수강신청 되었습니다.");location.replace("/Enrolment");</script>')
    }
}
})
app.post('/Enrolment/delet',(request,response)=>{//enrolment.txt에 데이터 삭제
    let enrolData = request.body.intext;//교과목명
    let objArray=[]
    let objArray2=[]
    let enrolArray=[]
    let enrolArray2=[]
    let num, chk=0;
    objArray = fs.readFileSync("./js/enrolment.txt").toString().split('\n')
    objArray2 = fs.readFileSync('./js/subject.txt').toString().split('\n') //전체 과목
    for(let i in objArray) {
        if(i==objArray.length-1) break; //마지막은 ''으로 되어있음.
        objArray[i] = JSON.parse(objArray[i].toString())//문자열을 객체로 파싱
    }
    for(let i in objArray2) {
        if(i==objArray2.length-1) break; 
        objArray2[i] = JSON.parse(objArray2[i].toString())
        enrolArray2.push(objArray2[i].name)
    }
    //console.log(enrolArray2)

    for(let i in objArray){
        if(objArray[i].user_id==login_id){
            enrolArray=objArray[i].user_enrol
            num=i//파일수정을 위한 숫자
            break;
        }
    }
    for(let i of enrolArray2){
        if(i==enrolData) chk=1
    }
    //console.log(chk)
    if(chk==0) {
        response.write('<body><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><script>alert("교과목명이 잘못입력되었습니다. 다시입력하십시오.");location.replace("/Enrolment");</script>')
    }
    if(chk==1){
        chk=0
        for(let i in enrolArray){
            if(enrolArray[i]==enrolData){//교과목 삭제
                chk=1;
                enrolArray.splice(i,1)
                objArray[num].user_enrol=enrolArray

                for(let j=0; j<objArray.length-1;j++){
                    if(j==0) fs.writeFileSync('./js/enrolment.txt', JSON.stringify(objArray[0])+"\n")
                    else fs.appendFileSync("./js/enrolment.txt",JSON.stringify(objArray[j])+"\n")
                }

                response.write('<body><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><script>alert("삭제되었습니다."); location.replace("/Enrolment");</script>')
                break;
            }
        }
        if(chk==0){//신청안한 교과목
            response.write('<body><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><script>alert("신청하지않은 교과목입니다.");location.replace("/Enrolment");</script>')
        }
    }

})

app.listen(52273,()=>{console.log('Server Start')});//서버구동 코드