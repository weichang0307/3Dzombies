//3D

class ground_{
    constructor(){
        this.body=new cannonplane_(2000,2000).body
        cannon_rotate(this.body,-Math.PI/2,0,0)
        cworld.add(this.body)
        let geo=new THREE.PlaneGeometry(2000,2000)
        let mat=new THREE.MeshPhongMaterial({color:0x00ff00})
        let map=new THREE.TextureLoader().load(groundimg)
        map.wrapS = map.wrapT = THREE.RepeatWrapping
        map.repeat.set(100, 100)
        mat.map=map
        this.mesh=new THREE.Mesh(geo,mat)
        this.mesh.rotation.x=-Math.PI/2
        scene.add(this.mesh)
    }
}
class camera_{
    constructor(x,y,z,far,rx=0,ry=0,rz=0){
        this.camera = new THREE.PerspectiveCamera(60,ww/wh,0.1,far)
        this.camera.position.set(x,y,z)
        
        this.rx=rx
        this.ry=ry
        this.rz=rz
        this.ry=Math.PI/2
        this.camera.rotation.y=Math.PI/2
    }
    update(){
        if(this.rx>Math.PI/2){
            this.rx=Math.PI/2
        }
        if(this.rx<-Math.PI/2){
            this.rx=-Math.PI/2
        }
        this.camera.rotation.x=0
        this.camera.rotation.y=0
        this.camera.rotation.z=0
        this.camera.rotateOnWorldAxis(new THREE.Vector3(0,1,0),this.ry)
        this.camera.rotateOnAxis(new THREE.Vector3(0,0,1),this.rz)
        this.camera.rotateOnAxis(new THREE.Vector3(1,0,0),this.rx)
    }

}
class sky_{
    constructor(r,src){
        let geo=new THREE.SphereGeometry(r,100,100)
        let mat=new THREE.MeshPhongMaterial({map:new THREE.TextureLoader().load(src),side:THREE.DoubleSide})
        this.mesh=new THREE.Mesh(geo,mat)
        
        
    }
    update(time){
        this.mesh.rotation.y+=time/50
        this.mesh.position.z=player.body.position.z
        this.mesh.position.x=player.body.position.x
    }
    
}
class sun_{
    constructor(){
        this.light = new THREE.PointLight(0xffffff,3,2000)
        this.deg=0
        this.dlight=new THREE.DirectionalLight(0xffffff,1.5,2000)
        this.lookat= new THREE.Object3D();
        scene.add(this.lookat);
        this.dlight.target=this.lookat
        
    }
    update(time_s){
        this.deg+=Math.PI*2*time_s/300
        this.light.position.x=900*Math.cos(sun.deg)
        this.light.position.y=900*Math.sin(sun.deg)
        this.dlight.position.x=900*Math.cos(sun.deg)
        this.dlight.position.y=900*Math.sin(sun.deg)
        this.lookat.position.z=player.body.position.z
        this.lookat.position.x=player.body.position.x
        this.dlight.position.z=player.body.position.z
        this.dlight.position.x+=player.body.position.x
        this.light.position.z=player.body.position.z
        this.light.position.x+=player.body.position.x

        
        if(this.light.position.y<200&&this.light.position.y>-200&&tt3===0){
            this.light.intensity=3*((this.light.position.y+200)/400)
            this.dlight.intensity=1.5*((this.light.position.y+200)/400)
        }
    }
}
class enemy1_{
    constructor(x,y,z,speed,scale,maxhp){

        this.rotatey=0
        this.speed=speed
        this.all_body=[]
        this.all_mesh=[]
        
        this.maxhp=maxhp
        this.hp=this.maxhp
        this.scale=scale
        //head
        this.head_body=new cannonbox_(2*scale,2*scale,2*scale,0.001).body 
        this.head_body.position.y=(6+y)*scale
        this.head_body.position.x=x
        this.head_body.position.z=z
        this.head_body.collisionResponse=false

        this.all_body.push(this.head_body)
        cworld.add(this.head_body)
        let geo=new THREE.BoxGeometry(2*scale,2*scale,2*scale)
        let mat=new THREE.MeshPhongMaterial()
        this.head_mesh=new THREE.Mesh(geo,mat)
        this.all_mesh.push(this.head_mesh)
        scene.add(this.head_mesh)
        //body
        this.body_body=new CANNON.Body({
            mass:20,
            material:mymat
        })
        //this.body_body.collisionResponse=false
        let body_shape=new CANNON.Box(new CANNON.Vec3(1*scale/2,4*scale/2,1*scale/2))
        let feet_shape=new CANNON.Cylinder(this.scale*Math.sqrt(2),this.scale*Math.sqrt(2),this.scale*2,10)
        let feet_qua=new CANNON.Quaternion()
        feet_qua.setFromAxisAngle(new CANNON.Vec3(0,0,1),-Math.PI/2)
        this.body_body.addShape(feet_shape,new CANNON.Vec3(0,-1*scale,0),feet_qua)
        this.body_body.addShape(body_shape,new CANNON.Vec3(0,0,0),new CANNON.Quaternion())
        this.body_body.position.y=y+3*scale
        this.body_body.position.x=x
        this.body_body.position.z=z
        this.all_body.push(this.body_body)
        cworld.add(this.body_body)
        geo=new THREE.BoxGeometry(1*scale,4*scale,1*scale)
        mat=new THREE.MeshPhongMaterial()
        this.body_mesh=new THREE.Mesh(geo,mat)
        this.all_mesh.push(this.body_mesh)
        scene.add(this.body_mesh)
        this.feets_mesh=[]
        this.feets_deg=0
        for(let i=0;i<4;i++){
            geo=new THREE.BoxGeometry(1*scale,2*scale,1*scale)
            mat=new THREE.MeshPhongMaterial()
            let fm=new THREE.Mesh(geo,mat)
            scene.add(fm)
            this.all_mesh.push(fm)
            this.feets_mesh.push(fm)
        }
        
        this.update_color(this.hp)


        

    }
    update(){
        let dx=this.body_body.position.x-player.body.position.x
        let dy=this.body_body.position.z-player.body.position.z
        if(this.body_body.position.y<this.scale*3){
            this.body_body.position.y=this.scale*3
            this.body_body.force.y=20000*Math.random()
        }
        if(this.body_body.position.y>this.scale*3.5){
            this.body_body.force.y=-2000
        }
        
        if(dx**2+dy**2<100**2){
            if(time>6&&time<18){
                this.rotatey=Math.atan2(-dx,-dy)+Math.PI
            }else{
                this.rotatey=Math.atan2(-dx,-dy)
            }   
        }else if(tt%3000===0){
            this.rotatey=Math.random()*Math.PI*2
            

        }
        this.rotateY(this.rotatey)
        
        for(let i of this.all_body){
            if(i!==this.head_body){
                i.velocity.x=this.speed*Math.sin(this.rotatey)
                i.velocity.z=this.speed*Math.cos(this.rotatey)
            }
        }
        let vax=this.body_body.position.x+this.body_body.velocity.x
        let vaz=this.body_body.position.z+this.body_body.velocity.z
        /*
        if(vax**2>=(250-this.scale*2)**2){
            if(vax>0){
                this.body_body.velocity.x=250-this.scale*Math.sqrt(2)-this.body_body.position.x  
            }
            else{
                this.body_body.velocity.x=-250+this.scale*Math.sqrt(2)-this.body_body.position.x  
            }
            
        }
        if(vaz**2>=(250-this.scale*2)**2){
            this.body_body.velocity.z=0
            if(vaz>0){
                this.body_body.velocity.z=250-this.scale*Math.sqrt(2)-this.body_body.position.z  
            }
            else{
                this.body_body.velocity.z=-250+this.scale*Math.sqrt(2)-this.body_body.position.z  
            }
        }*/
        

        this.feets_deg+=0.4
        for(let i=0;i<4;i++){            
            
            this.feets_mesh[i].rotateOnAxis(new THREE.Vector3(1,0,0),Math.sin(this.feets_deg))
        }
        this.head_body.position.x=this.body_body.position.x
        this.head_body.position.z=this.body_body.position.z
        this.head_body.position.y=this.body_body.position.y+3*this.scale
        
        this.head_mesh.rotation.x+=0.2
        this.head_mesh.rotation.y+=0.2
        
        this.head_mesh.position.copy(this.head_body.position)
        this.body_mesh.position.copy(this.body_body.position)
        this.body_mesh.quaternion.copy(this.body_body.quaternion)

    }
    rotateY(deg){
        cannon_rotation(this.body_body,'to0')
        cannon_rotation(this.body_body,'y',deg)
        
        for(let i=0;i<4;i++){
            let yy=(i*90+45)*Math.PI*2/360
            let fb=this.feets_mesh[i]
            yy-=deg
            
            fb.rotation.x=fb.rotation.y=fb.rotation.z=0
            fb.rotation.y=deg
            
            fb.position.x=Math.cos(yy)*Math.sqrt(2)*this.scale+this.body_body.position.x
            fb.position.z=Math.sin(yy)*Math.sqrt(2)*this.scale+this.body_body.position.z
            fb.position.y=this.body_body.position.y-this.scale*2
            
            
        }
        
        
    }
    kill(){
        score+=this.maxhp
        let bu=Math.floor(Math.random()*this.maxhp+1)
        let bo=Math.floor(Math.random()+0.3)
        let li=Math.floor(Math.random()+0.1)
        boxs.push(new box_(this.body_body.position.x,this.body_body.position.z,bu,bo,li))
        for(let t of this.all_mesh){
            scene.remove(t)
        }
        explodes.push(new explode_(this.body_body.position.x,this.body_body.position.y,this.head_body.position.z))
        for(let t of this.all_body){
            cworld.remove(t)
        }
        if(this.scale>1){
            for(let k=-1;k<=1;k+=2){
                let ee1=new enemy1_(this.body_body.position.x+k*1.5*Math.cos(this.rotatey)*this.scale,1,this.body_body.position.z+k*1.5*-Math.sin(this.rotatey)*this.scale,this.speed,this.scale/2,this.maxhp)
                ee1.rotatey=this.rotatey
                enemy1s.push(ee1)
            }
            
        }
        enemy1s.splice(enemy1s.indexOf(this),1)
    }
    update_color(hp){
        if(hp===1){
            for(let t of this.all_mesh){
                t.material.color.set(0x000000)
                t.material.emissive.set(0xff1515)
                t.material.emissiveIntensity=5
                t.material.needUpdate=true
            }
        }
        if(hp===2){
            for(let t of this.all_mesh){
                t.material.color.set(0xffffff)
                t.material.needUpdate=true
            }
        }
        if(hp===3){
            for(let t of this.all_mesh){
                t.material.color.set(0x00ff00)
                t.material.needUpdate=true
            }
        }
        if(hp===4){
            for(let t of this.all_mesh){
                t.material.color.set(0x0000ff)
                t.material.needUpdate=true
            }
        }
        if(hp===5){
            for(let t of this.all_mesh){
                t.material.color.set(0x000000)
                t.material.needUpdate=true
            }
        }
    }
    
    
    
}
class player_{
    constructor(){
        this.tt=1000
        this.hp=5
        this.body=new cannoncylinder_(2,2,4,3).body
        cannon_rotation(this.body,'x',Math.PI/2)
        this.body.position.y=300
        this.body.fixedRotation =1
        this.body.updateMassProperties()
        this.body.addEventListener('collide',(e)=>{
            for(let y of enemy1s){
                let kk=0
                for(let i of y.all_body){
                    if(e.body.id===i.id){
                        if(this.tt>=200){
                            console.log('hit2')
                            let dd=Math.atan2(this.body.position.x-y.body_body.position.x,this.body.position.x-y.body_body.position.z)
                            this.body.velocity.x=Math.cos(dd)*500
                            this.body.velocity.y=100
                            this.body.velocity.z=Math.sin(dd)*500
                            this.tt=0
                            this.hp-=1
                            kk=1
                            break;
                        }
                        
                    }
                }
                if(kk===1){
                    break
                }
                
            }

            
            
            
        })
        cworld.add(this.body)
    }
    update(){
        this.tt+=1000/fps
    }

}
class wall_{
    constructor(){
        this.w1=new cannonplane_(500,500).body
        this.w1.position.z=-250
        cworld.add(this.w1)
        this.w2=new cannonplane_(500,500).body
        cannon_rotate(this.w2,0,Math.PI,0)
        this.w2.position.z=250
        cworld.add(this.w2)
        this.w3=new cannonplane_(500,500).body
        cannon_rotate(this.w3,0,-Math.PI/2,0)
        this.w3.position.x=250
        cworld.add(this.w3)
        this.w4=new cannonplane_(500,500).body
        cannon_rotate(this.w4,0,Math.PI/2,0)
        this.w4.position.x=-250
        cworld.add(this.w4)
        this.mesh=[]
        let geo=new THREE.PlaneGeometry(500,30)    
        let map=new THREE.TextureLoader().load(wallimg)
        for(let i=0;i<4;i++){
            let mat=new THREE.MeshBasicMaterial()
            mat.transparent=true
            mat.opacity=1
            mat.map=map
            this.mesh.push(new THREE.Mesh(geo,mat))
            this.mesh[i].position.y=10

            scene.add(this.mesh[i])
        }
        this.mesh[0].position.z=-250
        this.mesh[1].rotation.y=Math.PI
        this.mesh[1].position.z=250
        this.mesh[2].rotation.y=Math.PI/2
        this.mesh[2].position.x=-250
        this.mesh[3].rotation.y=-Math.PI/2
        this.mesh[3].position.x=250


        
        

    }
    update(){
        if(btns[0].style===0){
            this.mesh[0].material.opacity=(-200-player.body.position.z)/60
            this.mesh[1].material.opacity=(player.body.position.z-200)/60
            this.mesh[3].material.opacity=(player.body.position.x-200)/60
            this.mesh[2].material.opacity=(-200-player.body.position.x)/60
        }else{
            this.mesh[0].material.opacity=1
            this.mesh[1].material.opacity=1
            this.mesh[3].material.opacity=1
            this.mesh[2].material.opacity=1
        }
        

    }
    
}
class explode_{
    
    constructor(x,y,z){
        this.tt=0
        this.v=[]
        this.points=new points_(10)
        scene.add(this.points.obj)
        this.points.obj.position.set(x,y,z)
        this.points.obj.material.depthWrite=false

        for(let i=0;i<100;i++){
            let dx=Math.random()*Math.PI*2
            let dy=Math.random()*Math.PI
            let vx=Math.sin(dx)*Math.cos(dy)*Math.random()
            let vy=Math.sin(dx)*Math.sin(dy)*Math.random()
            let vz=Math.cos(dx)*Math.random()
            this.v.push({x:vx,y:vy,z:vz})

            this.points.add(0,0,0)
        }

        this.points.addmap(explodeimg)        
    }
    update(){
        if(this.tt>39){
            scene.remove(this.points.obj)
        }
        this.tt+=1
        this.points.obj.material.opacity*=0.9
        for(let i in this.points.obj.geometry.vertices){
            this.points.obj.geometry.vertices[i].x+=this.v[i].x
            this.points.obj.geometry.vertices[i].y+=this.v[i].y
            this.points.obj.geometry.vertices[i].z+=this.v[i].z
            
        }
        
        this.points.obj.geometry.verticesNeedUpdate=true
        
    }
}
class bomb_{
    constructor(x,y,z){
        
        this.body=new cannonball_(1,1).body
        this.body.position.set(x,y,z)
        this.body.collisionResponse = 0
        this.isboom=false
        this.tt=0
        this.bp=new THREE.Vector3(0,0,0)
        
        cworld.add(this.body)
        this.body.addEventListener('collide',(e)=>{
            let audio=new Audio('./music/boom.mp3')
            

            let xxx=player.body.position.x-this.body.position.x
            let zzz=player.body.position.z-this.body.position.z
            if(Math.sqrt(xxx**2+zzz**2)>50){
                audio.volume=50/Math.sqrt(xxx**2+zzz**2)
            }

            if(btns[2].style===1){
                audio.muted=false
            }else{
                audio.muted=true
            }
            audio.play(audio)
            audios.push(audio)
            this.isboom=true
            this.bp.copy(e.target.position)
        })
        this.mesh=new THREE.Mesh(new THREE.SphereGeometry(1,10),new THREE.MeshPhongMaterial({color:0x050505}))
        scene.add(this.mesh)
        this.points=new points_(1)
        scene.add(this.points.obj)
        for(let i=0;i<50;i++){
            this.points.add(0,1,0)
            
        }
        this.points.addmap('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2P4n8ZwGwAGDgJBHjk05AAAAABJRU5ErkJggg==')
        
        
    }
    update(){
        if(this.isboom===false){
            this.mesh.quaternion.copy(this.body.quaternion)
            this.mesh.position.copy(this.body.position)
            this.points.obj.position.copy(this.body.position)
            this.points.obj.quaternion.copy(this.body.quaternion)
            for(let i of this.points.obj.geometry.vertices){
                i.y+=(Math.random())*2
                i.z+=(Math.random()-0.5)/2
                i.x+=(Math.random()-0.5)/2
                if(i.y>5){
                    i.z=0
                    i.x=0
                    i.y=1+Math.random()
                }
            }
            this.points.obj.geometry.verticesNeedUpdate=true
        }else{
            if(this.tt===0){

                cworld.remove(this.body)
                scene.remove(this.mesh)
                scene.remove(this.points.obj)
                booms.push(new boom_(this.bp.x,this.bp.y,this.bp.z))
                booms2d.push(new boom2d_((this.bp.x-player.body.position.x)/2,(this.bp.z-player.body.position.z)/2,20))
                let ic=enemy1s.length
                for(let i=0;i<ic;i++){
                    let dx=enemy1s[i].all_body[0].position.x-this.bp.x
                    let dz=enemy1s[i].all_body[0].position.z-this.bp.z
                    let dy=enemy1s[i].all_body[0].position.y-this.bp.y
                    if(Math.sqrt(dx**2+dz**2+dy**2)<40){
                        enemy1s[i].kill()
                        i-=1
                        ic-=1
                    }
                        
                    
                    
                }
            }
            this.tt+=1
            
        }
        
    }
}
class boom_{

    constructor(x,y,z){
        this.tt=0
        this.v=[]
        this.points=new points_(4)
        scene.add(this.points.obj)
        this.points.obj.material.depthWrite=false
        this.points.obj.position.set(x,y,z)
        for(let i=0;i<1000;i++){
            let dx=Math.random()*Math.PI*2
            let dy=Math.random()*Math.PI
            let vx=Math.sin(dx)*Math.cos(dy)*Math.random()
            let vy=Math.sin(dx)*Math.sin(dy)*Math.random()
            let vz=Math.cos(dx)*Math.random()
            this.v.push({x:vx,y:vy,z:vz})

            this.points.add(0,0,0)
        }

        this.points.addmap('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQYV2P4n8ZwGwAGDgJBHjk05AAAAABJRU5ErkJggg==')        
    }
    update(){
        if(this.tt>39){
            scene.remove(this.points.obj)
        }
        this.tt+=1
        this.points.obj.material.opacity*=0.9
        for(let i in this.points.obj.geometry.vertices){
            this.points.obj.geometry.vertices[i].x+=this.v[i].x
            this.points.obj.geometry.vertices[i].y+=this.v[i].y
            this.points.obj.geometry.vertices[i].z+=this.v[i].z
            
        }
        this.points.obj.geometry.verticesNeedUpdate=true
        
    }
}
class box_{
    constructor(x,z,bullet,bomb,life){
        this.mesh=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:0xff0000}))
        this.mesh.position.set(x,1,z)
        this.mesh.material.transparent=true
        this.mesh.material.opacity=0.8
        scene.add(this.mesh)
        this.bullet=bullet
        this.bomb=bomb
        this.life=life
    }
    update(){
        this.mesh.rotation.y+=0.1
        this.mesh.rotation.z+=0.1
        let xx=this.mesh.position.x-player.body.position.x
        let zz=this.mesh.position.z-player.body.position.z
        if(xx**2+zz**2<9){
            let audio=new Audio('./music/get.mp3')
            if(btns[2].style===1){
                audio.muted=false
            }else{
                audio.muted=true
            }
            audio.play()
            audios.push(audio)
            if(this.bullet>0){
                bullet_count+=this.bullet
                mark.push(new point({position:{x:170,y:665},write:'+'+this.bullet}))
            }
            if(this.bomb>0){
                bomb_count+=this.bomb
                mark.push(new point({position:{x:170,y:695},write:'+'+this.bomb}))
            }
            
            if(player.hp<5&&this.life>0){
                player.hp+=this.life
                mark.push(new point({position:{x:150,y:55},write:'+'+this.life,color:'rgb(225,0,0)'}))
            }
            scene.remove(this.mesh)
            boxs.splice(boxs.indexOf(this),1)
        }
    }
}
//2D
class cbtn{
	constructor(src){
		let element={
			position:{x:0,y:0},
			rotation:0,
			scale:{x:1,y:1},
			through:1,
			visible:true,
			style:0,
            src:''
		}
		this.styles=[]
		this.group=[]
        let img=new Image()
        img.src=src
		this.styles.push({method:'img',img:img,middle:{x:50,y:50},path:[{x:-27,y:-43},{x:-1,y:-45},{x:41,y:-40},{x:49,y:-19},{x:52,y:6},{x:44,y:40},{x:29,y:52},{x:7,y:50},{x:-23,y:49},{x:-40,y:25},{x:-40,y:-2},{x:-37,y:-19},]})

		Object.assign(this,element)
	}
	draw(){
        let ctx=ctx2d
		if(this.visible){
			if(this.styles[this.style].method==='img'){
				ctx.save()
				ctx.translate(this.position.x,this.position.y)
				ctx.rotate(this.rotation)
				ctx.scale(this.scale.x,this.scale.y)
				ctx.globalAlpha=this.through
				ctx.drawImage(this.styles[this.style].img,-this.styles[this.style].middle.x,-this.styles[this.style].middle.y)
				ctx.globalAlpha=1.0
				ctx.restore()
			}else{
				ctx.save()
					ctx.translate(this.position.x,this.position.y)
					ctx.rotate(this.rotation)
					ctx.scale(this.scale.x,this.scale.y)
					drawer(this.styles[this.style].array,this.through)
				ctx.restore()
			}
			
		}
	}
	ispointinpath(x,y){
        let ctx=ctx2d

		if(this.styles[this.style].method==='img'){
			ctx.save()
			ctx.translate(this.position.x,this.position.y)
			ctx.rotate(this.rotation)
			ctx.scale(this.scale.x,this.scale.y)
			ctx.beginPath()
			for(let i=0;i<this.styles[this.style].path.length;i++){
				if(i===0){
					ctx.moveTo(this.styles[this.style].path[i].x,this.styles[this.style].path[i].y)
				}else{
					ctx.lineTo(this.styles[this.style].path[i].x,this.styles[this.style].path[i].y)
				}
			}
			ctx.closePath()
			ctx.restore()
			return ctx.isPointInPath(x,y)
		}else{
			ctx.save()
			ctx.translate(this.position.x,this.position.y)
			ctx.rotate(this.rotation)
			ctx.scale(this.scale.x,this.scale.y)
			return ispointinarraypath(x,y,this.styles[this.style].array)
		}
		
	}
}
class btn_{
	constructor(aa){
		let element={
			position:{x:0,y:0},
			rotation:0,
			scale:{x:0.3,y:0.3},
			through:1,
			visible:true,
			style:1,
		}
		this.styles=[]
		this.group=[]
		this.styles.push({method:'drawer',array:[{type:'circle',p:{x:0,y:0},position:{x:0,y:0},rr:20,startdeg:0,enddeg:6.283185307179586,isclose:true,isrr:false,stroke:{is:true,color:'rgb(255,255,255)',width:5},fill:{is:false,color:'rgb(255,255,255)'},translate:{x:0,y:0},deg:0,scale:{x:1,y:1},through:0}]})
		this.styles.push({method:'drawer',array:[{type:'circle',p:{x:0,y:0},position:{x:0,y:0},rr:20,startdeg:0,enddeg:6.283185307179586,isclose:true,isrr:false,stroke:{is:true,color:'rgb(255,255,255)',width:5},fill:{is:false,color:'rgb(255,255,255)'},translate:{x:0,y:0},deg:0,scale:{x:1,y:1},through:0},{type:'circle',p:{x:0,y:0},position:{x:0,y:0},rr:10,startdeg:0,enddeg:6.283185307179586,isclose:true,isrr:false,stroke:{is:true,color:'rgb(255,255,255)',width:2},fill:{is:true,color:'rgb(255,255,255)'},translate:{x:0,y:0},deg:0,scale:{x:1,y:1},through:0}]})

		Object.assign(element,aa)
		Object.assign(this,element)
	}
	draw(){
        let ctx=ctx2d
		if(this.visible){
			if(this.styles[this.style].method==='img'){
				ctx.save()
				ctx.translate(this.position.x,this.position.y)
				ctx.rotate(this.rotation)
				ctx.scale(this.scale.x,this.scale.y)
				ctx.globalAlpha=this.through
				ctx.drawImage(this.styles[this.style].img,-this.styles[this.style].middle.x,-this.styles[this.style].middle.y)
				ctx.globalAlpha=1.0
				ctx.restore()
			}else{
				ctx.save()
					ctx.translate(this.position.x,this.position.y)
					ctx.rotate(this.rotation)
					ctx.scale(this.scale.x,this.scale.y)
					drawer(this.styles[this.style].array,this.through)
				ctx.restore()
			}
			
		}
	}
	ispointinpath(x,y){
        let ctx=ctx2d

		if(this.styles[this.style].method==='img'){
			ctx.save()
			ctx.translate(this.position.x,this.position.y)
			ctx.rotate(this.rotation)
			ctx.scale(this.scale.x,this.scale.y)
			ctx.beginPath()
			for(let i=0;i<this.styles[this.style].path.length;i++){
				if(i===0){
					ctx.moveTo(this.styles[this.style].path[i].x,this.styles[this.style].path[i].y)
				}else{
					ctx.lineTo(this.styles[this.style].path[i].x,this.styles[this.style].path[i].y)
				}
			}
			ctx.closePath()
			ctx.restore()
			return ctx.isPointInPath(x,y)
		}else{
			ctx.save()
			ctx.translate(this.position.x,this.position.y)
			ctx.rotate(this.rotation)
			ctx.scale(this.scale.x,this.scale.y)
			return ispointinarraypath(x,y,this.styles[this.style].array)
		}
		
	}
}
class boom2d_{
    constructor(x,y,rr){
        this.position={x:x,y:y}
        this.through=1
        this.rr=rr
    }
    draw(){
        ctx2d.globalAlpha=this.through
        ctx2d.save()
        ctx2d.translate(ww-130,120)
        ctx2d.rotate(camera.ry)
        ctx2d.beginPath()
        ctx2d.arc(this.position.x,this.position.y,this.rr,0,Math.PI*2)
        ctx2d.closePath()
        ctx2d.fillStyle='rgb(200,100,50)'
        ctx2d.fill()
        ctx2d.restore()
        ctx2d.globalAlpha=1

    }
    update(){
        this.through*=0.95
    }
}
class point{
	constructor(aa){
		let element={
			position:{x:0,y:0},
			rotation:0,
			scale:{x:1,y:1},
			visible:true,
			through:0,
			write:'',
			color:'white',
			font:20
		}
		this.group=[]

		Object.assign(element,aa)
		Object.assign(this,element)
	}
    update(){
        this.through+=0.01
        if(this.through>1){
            mark.splice(mark.indexOf(this),1)
        }
    }
	draw(){
        let ctx=ctx2d
		if(this.visible){
			ctx.save()
				ctx.translate(this.position.x-40,this.position.y)
				ctx.rotate(this.rotation)
				ctx.scale(this.scale.x,this.scale.y)
				ctx.globalAlpha=1-this.through
				ctx.fillStyle=this.color
				ctx.font=this.font+'px Verdana'
				ctx.fillText(this.write,0,0)
				ctx.globalAlpha=1
			ctx.restore()
		}
	}
}
