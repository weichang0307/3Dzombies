
let ww=1550
let wh=750
let scene
let scene2
let renderer
let canvas3d
let canvas2d
let ctx2d
let camera
let pointLight
let cworld
let fps=50
let fps_test
//const
const scene_width=1000
const gg=50
//obj
let ground
let skybox
let sun
let player
let wall
let enemy1s=[]
let explodes=[]
let bombs=[]
let booms=[]
let boxs=[]

let btns=[]
let booms2d=[]
let mark=[]
let home
let play
let stop_
//ray
let raycaster = new THREE.Raycaster();
//else
let mouse={x:0,y:0}
let ispress=false
let key={}
let tt=0
let time=0
let bullet_count=0
let bomb_count=0
let img1=new Image()
img1.src=gunimg
let img2=new Image()
img2.src=splashimg
let img3=new Image()
img3.src=heartimg
let img4=new Image()
img4.src=arrowimg
let img5=new Image()
img5.src=hurtimg
let audios=[]
let day=0
let mode=-1
let tt2=0
let tt3=0
let score=0
let choose=1



function world3D() {
    //scene
    scene = new THREE.Scene()
    scene2 = new THREE.Scene()
    //renderer
    renderer = new THREE.WebGLRenderer()
    renderer.setSize(ww,wh)
    renderer.setClearColor(0xffffff, 1.0)
   
    canvas3d=renderer.domElement
    canvas3d.id='canvas3d'
    document.body.appendChild(canvas3d)   
    //camera
    camera=new camera_(0,5,0,scene_width*2)
    //light
    let light = new THREE.AmbientLight( 0x404040 ); // soft white light
    scene.add( light );
    
    //tool
    let axes = new THREE.AxesHelper(20) 
    scene.add(axes)
    //let orbit=new OrbitControls(camera,canvas2d)
    fps_test = new Stats()
    fps_test.setMode(0) // FPS mode
    //document.getElementById('stats').appendChild(fps_test.domElement)
}
function world2D() { 
    canvas2d=document.createElement('canvas')
    canvas2d.id='canvas2d'
    canvas2d.style.position='absolute'
    canvas2d.style.top=0
    canvas2d.style.left=0
    
    document.body.appendChild(canvas2d)
    ctx2d=canvas2d.getContext('2d')
    
}
function worldCannon(){
    
    cworld = new CANNON.World()
    cworld.gravity.set(0, -gg, 0)
    //cworld.broadphase = new CANNON.NaiveBroadphase()

    cworld.broadphase = new CANNON.SAPBroadphase(cworld)
    cworld.broadphase.autoDetectAxis()
    cworld.solver.iterations =1
    cworld.addContactMaterial(mymatcontact)
    
    
}

function init(){ 
    world2D()
    world3D()
    worldCannon()
    mysize()
    ground=new ground_()
    sky=new sky_(scene_width,skyimg)
    scene2.add(sky.mesh)
    sun=new sun_()
    scene2.add(sun.light)
    scene.add(sun.dlight)
    player=new player_()
    wall=new wall_()
    bombs.push(new bomb_())
    booms.push(new boom_())
    
    for(let i=0;i<3;i++){
        let btn=new btn_()
        btn.position.x=10
        btn.position.y=70+i*20
        btn.through=1
        btns.push(btn)
    }
    bullet_count=100
    bomb_count=10
    home=new cbtn(homeimg)
    home.position={x:675,y:450}
    home.through=0.7
    play=new cbtn(playimg)
    play.position={x:825,y:450}
    play.through=0.7
    stop_=new cbtn(stop_img)
    stop_.scale={x:0.4,y:0.4}

    stop_.position={x:ww-40,y:25}
    stop_.through=0.7



    



    canvas2d.addEventListener('mousemove',mousemove)
    canvas2d.addEventListener('mousedown',mousedown)
    canvas2d.addEventListener('mouseup',mouseup)
    canvas2d.addEventListener('mouseout',mouseup)
    canvas2d.addEventListener('click',click)
    window.addEventListener('keydown',keydown)
    window.addEventListener('keyup',keyup)
    window.addEventListener('resize',mysize)

    
}
function update(){
    if(player.hp<=0){
        mode=2
    }
    if(mode===2){
        tt2+=1
    }
    if(mode===3){
        tt3+=1
    }
    if(mode===1){
        if(tt%300000-0<1000/fps){
            day+=1
            day_init(day)
            for(let i=0;i<10;i++){
                boxs.push(new box_((Math.random()-0.5)*500,(Math.random()-0.5)*500,4,1,0))
            }
            

        }
        
        
        tt+=1000/fps
        time=(tt+300000*6/24)%300000/300000*24
        if(key.d){
            player.body.velocity.x+=Math.cos(camera.ry)*2
            player.body.velocity.z+=-Math.sin(camera.ry)*2
        }
        if(key.a){
            player.body.velocity.x+=-Math.cos(camera.ry)*2
            player.body.velocity.z+=Math.sin(camera.ry)*2
        }
        if(key.s){
            player.body.velocity.x+=Math.sin(camera.ry)*2
            player.body.velocity.z+=Math.cos(camera.ry)*2
        }
        if(key.w){
            player.body.velocity.x+=-Math.sin(camera.ry)*2
            player.body.velocity.z+=-Math.cos(camera.ry)*2
        }
        if(key.space){
            if(player.body.position.y<=2){
                player.body.force.y+=player.body.mass*gg*30
            }
        }
        if(player.body.velocity.x**2+player.body.velocity.z**2<0.1){
            player.body.velocity.x=0
            player.body.velocity.z=0
        }else{
            player.body.velocity.x/=1.1
            player.body.velocity.z/=1.1
        }
        
        
        wall.update()
        sky.update(1/fps)
        sun.update(1/fps)
        for(let i in explodes){
            explodes[i].update()
            if(explodes[i].tt>40){
                explodes.splice(i,1)
            }
        }
        for(let i in bombs){
            if(bombs[i].tt===5){
                
                booms.push(new boom_(bombs[i].bp.x,bombs[i].bp.y,bombs[i].bp.z))
                bombs.splice(i,1)
            }
        }
        for(let i in booms){
            if(booms[i].tt>90){
                scene.remove(booms[i].mesh)
                booms.splice(i,1)

            }
        }
        for(let i in booms2d){
            booms2d[i].update()
            if(booms2d[i].through<=0){
                booms2d.splice(i,1)
            }
        }
        for(let i of enemy1s){
            i.update()
        }
        
        for(let i of bombs){
            i.update()
        }
        for(let i of booms){
            i.update()
        }
        for(let i of boxs){
            i.update()
        }
        for(let i of mark){
            i.update()
        }
        player.update()
        if(day>=12){
            tt3+=1
            sun.light.intensity=tt3*5+3
            for(let i of enemy1s){
                if(Math.random()>0.9){
                    i.kill()
                }
                
            }
            
        }

        
        
        cworld.step(1/fps)
    }
    for(let i of audios){
        if(i.ended){
            audios.splice(audios.indexOf(i),1)
        }
    }

    

}
function renderer2d() {
    ctx2d.clearRect(0,0,ww,wh)

    
    
    ctx2d.drawImage(img1,ww/2-64/2,wh/2-64/2)
    
    ctx2d.globalAlpha=0.5

    ctx2d.drawImage(img2,-50,wh-200,300,200)
    ctx2d.globalAlpha=1
    ctx2d.font='30px New Century Schoolbook'
    ctx2d.fillStyle='white'
    if(Math.floor(time)>12){
        ctx2d.fillText(Math.floor(time)-12+' PM',10,30)
    }else{
        ctx2d.fillText(Math.floor(time)+'.AM',10,30)
    }
    ctx2d.fillText('bullet '+bullet_count,10,670)
    ctx2d.fillText('bomb '+bomb_count,10,700)
    ctx2d.fillText('DAY '+day,ww/2-50,30)



    for(let i of btns){
        i.draw()
    }
    ctx2d.font='20px New Century Schoolbook'
    ctx2d.fillText('wall',20,75)
    ctx2d.fillText('map',20,95)
    ctx2d.fillText('sound',20,115)
    ctx2d.font='30px New Century Schoolbook'
    if(choose===1){
        ctx2d.fillText('EASY',ww-100,wh-10)
    }else if(choose===2){
        ctx2d.fillText('NORMAL',ww-100-60,wh-10)
    }else if(choose===3){
        ctx2d.fillText('HARD',ww-100,wh-10)
    }
    /*
    let log10
    if(score>0){
        log10=Math.floor(Math.log10(score))
    }else{
        log10=0
    }
    

    ctx2d.fillText('score '+score,ww-110-15*log10,wh-10)*/
    for(let i=0;i<player.hp;i++){
        ctx2d.drawImage(img3,i*20,40,20,20)
    }

    if(btns[1].style===1){
        ctx2d.fillStyle='rgb(50,100,50)'
        ctx2d.globalAlpha=0.8
        ctx2d.beginPath()
        ctx2d.arc(ww-130,120,100,0,Math.PI*2)
        ctx2d.closePath()
        ctx2d.fill()
        ctx2d.globalAlpha=0.2
        ctx2d.fillStyle='rgb(50,50,50)'
        ctx2d.beginPath()
        ctx2d.arc(ww-130,120,50,0,Math.PI*2)
        ctx2d.closePath()
        ctx2d.fill()
        ctx2d.globalAlpha=1
        ctx2d.save()
        ctx2d.translate(ww-130,120)
        ctx2d.scale(1/2,1/2)
        ctx2d.drawImage(img4,-20,-20)
        ctx2d.restore()

        if(player.body.position.x>50){
            ctx2d.globalAlpha=0.5
            ctx2d.save()
            ctx2d.translate(ww-130,120)
            ctx2d.rotate(camera.ry)
            ctx2d.beginPath()
            let tx=250-player.body.position.x
            ctx2d.clearRect(tx/2,-Math.sqrt(200**2-tx**2),100,Math.sqrt(200**2-tx**2)*2)
            ctx2d.arc(0,0,100,Math.atan2(-Math.sqrt(200**2-tx**2),tx),Math.atan2(Math.sqrt(200**2-tx**2),tx))
            ctx2d.closePath() 
            ctx2d.fillStyle='rgb(0,0,0)'
            ctx2d.fill()
            ctx2d.restore()
            ctx2d.globalAlpha=1
        }
        if(player.body.position.x<-50){
            ctx2d.globalAlpha=0.5
            ctx2d.save()
            ctx2d.translate(ww-130,120)
            ctx2d.rotate(camera.ry)
            ctx2d.beginPath()
            let tx=player.body.position.x+250
            ctx2d.clearRect(-tx/2,-Math.sqrt(200**2-tx**2),-100,Math.sqrt(200**2-tx**2)*2)
            ctx2d.arc(0,0,100,Math.atan2(Math.sqrt(200**2-tx**2),-tx),Math.atan2(-Math.sqrt(200**2-tx**2),-tx))
            ctx2d.closePath() 
            ctx2d.fillStyle='rgb(0,0,0)'
            ctx2d.fill()
            ctx2d.restore()
            ctx2d.globalAlpha=1
        }
        if(player.body.position.z>50){
            ctx2d.globalAlpha=0.5
            ctx2d.save()
            ctx2d.translate(ww-130,120)
            ctx2d.rotate(camera.ry)
            ctx2d.beginPath()
            let tx=player.body.position.z-250
            ctx2d.clearRect(-Math.sqrt(200**2-tx**2),-tx/2,Math.sqrt(200**2-tx**2)*2,100)
            ctx2d.arc(0,0,100,Math.atan2(-Math.sqrt(200**2-tx**2),-tx)+Math.PI/2,Math.atan2(Math.sqrt(200**2-tx**2),-tx)+Math.PI/2)
            ctx2d.closePath() 
            ctx2d.fillStyle='rgb(0,0,0)'
            ctx2d.fill()
            ctx2d.restore()
            ctx2d.globalAlpha=1
        }
        if(player.body.position.z<-50){
            ctx2d.globalAlpha=0.5
            ctx2d.save()
            ctx2d.translate(ww-130,120)
            ctx2d.rotate(camera.ry)
            ctx2d.beginPath()
            let tx=player.body.position.z+250
            ctx2d.clearRect(-Math.sqrt(200**2-tx**2),-100,Math.sqrt(200**2-tx**2)*2,100-tx/2)
            ctx2d.arc(0,0,100,Math.atan2(-Math.sqrt(200**2-tx**2),tx)-Math.PI/2,Math.atan2(Math.sqrt(200**2-tx**2),tx)-Math.PI/2)
            ctx2d.closePath() 
            ctx2d.fillStyle='rgb(0,0,0)'
            ctx2d.fill()
            ctx2d.restore()
            ctx2d.globalAlpha=1
        }
        for(let i of booms2d){
            i.draw()
        }
        for(let i of enemy1s){
            
            let xx=i.body_body.position.x-player.body.position.x
            let zz=i.body_body.position.z-player.body.position.z
            if(xx**2+zz**2<180**2){
                ctx2d.save()

                ctx2d.translate(ww-130,120)
                ctx2d.rotate(camera.ry)
                ctx2d.beginPath()
                ctx2d.scale(1/2,1/2)
                ctx2d.arc(xx,zz,Math.sqrt(i.scale)*6,0,Math.PI*2)
                ctx2d.closePath() 
                ctx2d.fillStyle='red'
                ctx2d.fill()
                ctx2d.restore()
            }
            else if(xx**2+zz**2<200**2){
                ctx2d.globalAlpha=(200-Math.sqrt(xx**2+zz**2))/20

                ctx2d.save()

                ctx2d.translate(ww-130,120)
                ctx2d.rotate(camera.ry)
                ctx2d.beginPath()
                ctx2d.scale(1/2,1/2)
                ctx2d.arc(xx,zz,Math.sqrt(i.scale)*6,0,Math.PI*2)
                ctx2d.closePath() 
                ctx2d.fillStyle='red'
                ctx2d.fill()
                ctx2d.restore()
                ctx2d.globalAlpha=1

            }    

                

        }
        stop_.draw()
    }
    for(let i of mark){
        i.draw()
    }
    
    


    if(player.tt<200){
        ctx2d.globalAlpha=(200-player.tt)/200
        ctx2d.drawImage(img5,0,0,ww,wh)
        ctx2d.globalAlpha=1


    }
    if(mode===0){
        

        ctx2d.globalAlpha=0.7
        ctx2d.fillStyle='rgb(50,50,50)'
        ctx2d.fillRect(0,0,ww,wh)
        ctx2d.globalAlpha=1
        ctx2d.fillStyle='rgb(200,200,200)'
            
        ctx2d.font='100px New Century Schoolbook'
        ctx2d.fillText('DAY'+day,ww/2-130,wh/2)
        
        ctx2d.globalAlpha=1
        home.draw()
        play.draw()
    }
    if(mode===2){
        if(tt2<200){
            ctx2d.globalAlpha=tt2/200
        }
        ctx2d.fillStyle='rgb(50,50,50)'
        ctx2d.fillRect(0,0,ww,wh)
        ctx2d.globalAlpha=1
        if(tt2>200){
            if(tt2<250){
                ctx2d.globalAlpha=(tt2-200)/50
            }
            ctx2d.fillStyle='rgb(200,200,200)'
            
            ctx2d.font='100px New Century Schoolbook'
            ctx2d.fillText('GAME OVER',ww/2-300,wh/2+50)
        }
        
        
        ctx2d.globalAlpha=1

        
    }
    if(mode===-1){
        ctx2d.fillStyle='rgb(50,50,50)'
        ctx2d.fillRect(0,0,ww,wh)
        ctx2d.fillStyle='rgb(200,200,200)'
            
        ctx2d.font='100px New Century Schoolbook'
        ctx2d.fillText('HOME',ww/2-180,wh/2-50)
        ctx2d.font='40px New Century Schoolbook'
        ctx2d.fillText('EASY',ww/2-300-80,wh/2+20)
        ctx2d.fillText('NORMAL',ww/2-120,wh/2+20)
        ctx2d.fillText('HARD',ww/2+300-80,wh/2+20)
        ctx2d.fillRect(choose*300+ww/2-680,wh/2+30,100,2)
        ctx2d.fillText('ENTER TO START',ww/2-180,wh/2+100)
        ctx2d.fillRect(choose*300+ww/2-680,wh/2+30,100,2)
        ctx2d.font='30px New Century Schoolbook'
        
        ctx2d.fillText('SHOOT  E',10,wh/2+250)
        ctx2d.fillText('BOMB   C',10,wh/2+300)
        ctx2d.fillText('MOVE   A,W,S,D',10,wh/2+350)
        
    }
    if(tt3>200){
        ctx2d.globalAlpha=0.8
        ctx2d.fillStyle='rgb(200,100,0)'
        ctx2d.fillRect(0,wh/2-100,ww,200)
        ctx2d.globalAlpha=1
        ctx2d.font='100px New Century Schoolbook'
        ctx2d.fillStyle='rgb(255,255,255)'

        ctx2d.fillText('YOU SAVE YOUR LIFE',ww/2-500,wh/2+40)


    }
    
    
    


    
    


}
function renderer3d(){
    renderer.autoClear = false
    renderer.clear()
    camera.camera.position.x=player.body.position.x
    camera.camera.position.y=player.body.position.y+2
    camera.camera.position.z=player.body.position.z
    
    renderer.render(scene2, camera.camera)
    renderer.render(scene, camera.camera)


}
function render(){    
    fps_test.update()
    renderer2d()//2d render
    renderer3d()//3d render
    requestAnimationFrame(render)
}
function keydown(e){
    let keyid=e.code
    if(keyid==='KeyD'){key.d=true}
    if(keyid==='KeyW'){key.w=true}
    if(keyid==='KeyA'){key.a=true}
    if(keyid==='KeyS'){key.s=true}
    if(keyid==='Space'){key.space=true}
    if(keyid==='KeyE'){if(bullet_count>0&&mode===1){shoot()}}
    if(keyid==='KeyC'){if(bomb_count>0&&mode===1){throw_bomb()}}
    if(keyid==='KeyP'&&mode<2&&mode>=0){mode=(mode-1)**2}
    if(keyid==='ArrowRight'&&mode===-1){
        e.preventDefault()
        choose+=1
        if(choose>3){
            choose=1
        }
    }
    if(keyid==='ArrowLeft'&&mode===-1){
        e.preventDefault()
        choose-=1
        if(choose<1){
            choose=3
        }
    }
    if(keyid==='Enter'&&mode===-1){
        mode=1
    }
    
}
function keyup(e){
    let keyid=e.code
    if(keyid==='KeyD'){key.d=false}
    if(keyid==='KeyW'){key.w=false}
    if(keyid==='KeyA'){key.a=false}
    if(keyid==='KeyS'){key.s=false}
    if(keyid==='Space'){key.space=false}
}

function mousemove(e){
    if(ispress&&mode===1){
        let xx=e.pageX-mouse.x
        let yy=e.pageY-mouse.y
        camera.ry-=xx/500
        camera.rx-=yy/500
        camera.update()
        mouse={x:e.pageX,y:e.pageY}
    }
    

}
function mousedown(e){
    if(ispress===false){
        ispress=true
        mouse={x:e.pageX,y:e.pageY}
    }
}
function mouseup(e){
    if(ispress){
        ispress=false
    }
}
function click(e){
    if(home.ispointinpath(e.pageX,e.pageY)&&mode===0){
        for(let i of enemy1s){
            for(let y of i.all_body){
                cworld.remove(y)
            }
            for(let k of i.all_mesh){
                scene.remove(k)
            }
        }
        for(let i of explodes){
            scene.remove(i.points.obj)
        }
        for(let i of bombs){
            cworld.remove(i.body)
            scene.remove(i.mesh)
            scene.remove(i.points.obj)
        }
        for(let i of booms){
            scene.remove(i.points.obj)
        }
        for(let i of boxs){
            scene.remove(i.mesh)
        }
        enemy1s=[]
        explodes=[]
        bombs=[]
        booms=[]
        boxs=[]
        booms2d=[]
        player.body.position.x=0
        player.body.position.z=0
        player.body.position.y=300
        tt=0
        day=0
        mode=-1
    }
    if(play.ispointinpath(e.pageX,e.pageY)&&mode===0){
        mode=1
    }
    if(stop_.ispointinpath(e.pageX,e.pageY)&&mode===1){
        mode=0
    }
    for(let i of btns){
        if(i.ispointinpath(e.pageX,e.pageY)){
            i.style=(i.style-1)**2
            if(btns.indexOf(i)===2){
                for(let y of audios){
                    
                    if(i.style===1){
                        y.muted=false
                    }else{
                        y.muted=true
                    }
                    
                }
            }
            
        }
    }
}
function shoot(){
    let audio=new Audio('./music/gun.mp3')
    if(btns[2].style===1){
        audio.muted=false
    }else{
        audio.muted=true
    }
    audio.play()
    audios.push(audio)
    let fy=Math.sin(camera.rx)*1000
    let fz=Math.cos(camera.rx)*-Math.cos(camera.ry)*5000
    let fx=Math.cos(camera.rx)*-Math.sin(camera.ry)*5000
    player.body.force.x+=-fx
    player.body.force.z+=-fz
    bullet_count-=1
    raycaster.setFromCamera( {x:0,y:0}, camera.camera );
    let intersects = raycaster.intersectObjects( scene.children )
    for(let i of enemy1s){
        for(let y of i.all_mesh){
            if(y.id===intersects[0].object.id){
                console.log('hit')
                i.hp-=1
                if(i.hp>0){
                    i.update_color(i.hp)
                }else{
                    i.kill()

                }
            }
        }
    }
}
function throw_bomb(){
    let audio=new Audio('./music/throw.mp3')
    if(btns[2].style===1){
        audio.muted=false
    }else{
        audio.muted=true
    }
    audio.play()
    audios.push(audio)
    bomb_count-=1
    
    let y=camera.camera.position.y+Math.sin(camera.rx)*10
    let z=camera.camera.position.z+Math.cos(camera.rx)*-Math.cos(camera.ry)*10
    let x=camera.camera.position.x+Math.cos(camera.rx)*-Math.sin(camera.ry)*10
    let bb=new bomb_(x,y,z)
    bb.body.velocity.y=Math.sin(camera.rx)*100
    bb.body.velocity.z=Math.cos(camera.rx)*-Math.cos(camera.ry)*100
    bb.body.velocity.x=Math.cos(camera.rx)*-Math.sin(camera.ry)*100
    bombs.push(bb)
    
}
function day_init(i){
    let ss=choose*20
    if(day===1){
        let kk=20
        for(let i=0;i<kk/2+1;i++){
            for(let y=0;y<kk/2+1;y++){
                let xx=(i-kk/4)*225/(kk/4)
                let yy=(y-kk/4)*225/(kk/4)
                if(xx**2===225**2||yy**2===225**2){
                    let ee=new enemy1_(xx,1,yy,ss,2**0,2)
                    ee.rotatey=Math.random()*Math.PI*2
                    enemy1s.push(ee)
                }
                
            }
            
        }
    }
    if(day===2){
        let kk=20
        for(let i=0;i<kk/2+1;i++){
            for(let y=0;y<kk/2+1;y++){
                let xx=(i-kk/4)*225/(kk/4)
                let yy=(y-kk/4)*225/(kk/4)
                if(xx**2===225**2||yy**2===225**2){
                    let ee=new enemy1_(xx,1,yy,ss,2**1,2)
                    ee.rotatey=Math.random()*Math.PI*2
                    enemy1s.push(ee)
                }
                
            }
            
        }
    }
    if(day===3){
        let kk=20
        for(let i=0;i<kk/2+1;i++){
            for(let y=0;y<kk/2+1;y++){
                let xx=(i-kk/4)*225/(kk/4)
                let yy=(y-kk/4)*225/(kk/4)
                if(xx**2===225**2||yy**2===225**2){
                    let ee=new enemy1_(xx,1,yy,ss,2**0,3)
                    ee.rotatey=Math.random()*Math.PI*2
                    enemy1s.push(ee)
                }
                
            }
            
        }
    }
    if(day===4){
        let kk=20
        for(let i=0;i<kk/2+1;i++){
            for(let y=0;y<kk/2+1;y++){
                let xx=(i-kk/4)*225/(kk/4)
                let yy=(y-kk/4)*225/(kk/4)
                if(xx**2===225**2||yy**2===225**2){
                    let ee=new enemy1_(xx,1,yy,ss,2**1,3)
                    ee.rotatey=Math.random()*Math.PI*2
                    enemy1s.push(ee)
                }
                
            }
            
        }
    }
    if(day===5){
        let kk=20
        for(let i=0;i<kk/2+1;i++){
            for(let y=0;y<kk/2+1;y++){
                let xx=(i-kk/4)*225/(kk/4)
                let yy=(y-kk/4)*225/(kk/4)
                if(xx**2===225**2||yy**2===225**2){
                    let ee=new enemy1_(xx,1,yy,ss,2**0,4)
                    ee.rotatey=Math.random()*Math.PI*2
                    enemy1s.push(ee)
                }
                
            }
            
        }
    }
    if(day===6){
        let kk=20
        for(let i=0;i<kk/2+1;i++){
            for(let y=0;y<kk/2+1;y++){
                let xx=(i-kk/4)*225/(kk/4)
                let yy=(y-kk/4)*225/(kk/4)
                if(xx**2===225**2||yy**2===225**2){
                    let ee=new enemy1_(xx,1,yy,ss,2**1,4)
                    ee.rotatey=Math.random()*Math.PI*2
                    enemy1s.push(ee)
                }
                
            }
            
        }
    }
    if(day===7){
        let kk=20
        for(let i=0;i<kk/2+1;i++){
            for(let y=0;y<kk/2+1;y++){
                let xx=(i-kk/4)*225/(kk/4)
                let yy=(y-kk/4)*225/(kk/4)
                if(xx**2===225**2||yy**2===225**2){
                    let ee=new enemy1_(xx,1,yy,ss,2**0,5)
                    ee.rotatey=Math.random()*Math.PI*2
                    enemy1s.push(ee)
                }
                
            }
            
        }
    }
    if(day===8){
        let kk=40
        for(let i=0;i<kk/2+1;i++){
            for(let y=0;y<kk/2+1;y++){
                let xx=(i-kk/4)*225/(kk/4)
                let yy=(y-kk/4)*225/(kk/4)
                if(xx**2===225**2||yy**2===225**2){
                    let ee=new enemy1_(xx,1,yy,ss,2**1,5)
                    ee.rotatey=Math.random()*Math.PI*2
                    enemy1s.push(ee)
                }
                
            }
            
        }
    }
    if(day===9){
        let kk=10
        for(let i=0;i<kk/2+1;i++){
            for(let y=0;y<kk/2+1;y++){
                let xx=(i-kk/4)*225/(kk/4)
                let yy=(y-kk/4)*225/(kk/4)
                if(xx**2===225**2||yy**2===225**2){
                    let ee=new enemy1_(xx,1,yy,ss,2**3,5)
                    ee.rotatey=Math.random()*Math.PI*2
                    enemy1s.push(ee)
                }
                
            }
            
        }
    }
    if(day===10){
        let kk=5
        for(let i=0;i<kk/2+1;i++){
            for(let y=0;y<kk/2+1;y++){
                let xx=(i-kk/4)*225/(kk/4)
                let yy=(y-kk/4)*225/(kk/4)
                if(xx**2===225**2||yy**2===225**2){
                    let ee=new enemy1_(xx,1,yy,ss,2**4,5)
                    ee.rotatey=Math.random()*Math.PI*2
                    enemy1s.push(ee)
                }
                
            }
            
        }
    }
    if(day===11){
        let ee=new enemy1_(200,1,200,ss,2**5,5)
        ee.rotatey=Math.random()*Math.PI*2
        enemy1s.push(ee)
        ee=new enemy1_(200,1,-200,ss,2**5,5)
        ee.rotatey=Math.random()*Math.PI*2
        enemy1s.push(ee)
        ee=new enemy1_(-200,1,200,ss,2**5,5)
        ee.rotatey=Math.random()*Math.PI*2
        enemy1s.push(ee)
        ee=new enemy1_(-200,1,-200,ss,2**5,5)
        ee.rotatey=Math.random()*Math.PI*2
        enemy1s.push(ee)
    }
    
                
    
}
function mysize(){
    if(window.innerHeight/window.innerWidth>=wh/ww){
        canvas2d.style.width=window.innerWidth+'px'
        canvas2d.style.height=wh*window.innerWidth/ww+'px'
        canvas2d.width=window.innerWidth
        canvas2d.height=wh*window.innerWidth/ww
    }else{
        canvas2d.style.width=ww*window.innerHeight/wh+'px'
        canvas2d.style.height=window.innerHeight+'px'
        canvas2d.width=ww*window.innerHeight/wh
        canvas2d.height=window.innerHeight
    }
    ctx2d.restore()
    ctx2d.save()
    if(window.innerHeight/window.innerWidth>=wh/ww){
        ctx2d.scale(window.innerWidth/ww,window.innerWidth/ww)
    }else{
        ctx2d.scale(window.innerHeight/wh,window.innerHeight/wh)
    }
    let canvas3d=document.getElementById('canvas3d')
    if(window.innerHeight/window.innerWidth>=wh/ww){
        canvas3d.style.width=window.innerWidth+'px'
        canvas3d.style.height=wh*window.innerWidth/ww+'px'
        canvas3d.width=window.innerWidth
        canvas3d.height=wh*window.innerWidth/ww
    }else{
        canvas3d.style.width=ww*window.innerHeight/wh+'px'
        canvas3d.style.height=window.innerHeight+'px'
        canvas3d.width=ww*window.innerHeight/wh
        canvas3d.height=window.innerHeight
    }
    camera.camera.aspect =ww/wh
    camera.camera.updateProjectionMatrix()
    renderer.setSize(canvas3d.width,canvas3d.height)
    
}



init()
render()
setInterval(update,1000/fps)
