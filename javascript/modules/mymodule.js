class points_{
    constructor(scale){
        this.geo=new THREE.Geometry()
        this.mat= new THREE.PointsMaterial({size:scale})
        this.obj=new THREE.Points(this.geo, this.mat)
    }
    add(x,y,z){
        let point = new THREE.Vector3(x, y, z)
        this.geo.vertices.push(point)
    }
    foreach(func){
        this.geo.vertices.forEach(func)
        this.geo.verticesNeedUpdate = true
    }
    addmap(src){
        this.mat.transparent=true
        this.mat.opacity=0.5
        this.mat.blending=THREE.AdditiveBlending
        this.map= new THREE.TextureLoader().load(src)
        this.mat.map=this.map   
    }
    
    

}
class skybox_{
    constructor(r,src){
        let geo=new THREE.BoxGeometry(r,r,r)
        let mat=new THREE.MeshBasicMaterial({map:new THREE.TextureLoader().load(src),side:THREE.DoubleSide})
        this.mesh=new THREE.Mesh(geo,mat)
        
    }
}
let mymat=new CANNON.Material()
let mymatcontact=new CANNON.ContactMaterial(mymat,mymat, {
    friction: 0,
    restitution:0.01
})


class cannonball_{
    constructor(r,m){
        let geo=new CANNON.Sphere(r)
        let mat=mymat
        this.body=new CANNON.Body({
            mass:m,
            shape:geo,
            material:mat
        })
    }
}
class cannonbox_{
    constructor(x,y,z,m){
        let geo=new CANNON.Box(new CANNON.Vec3(x/2,y/2,z/2))
        let mat=mymat
        this.body=new CANNON.Body({
            mass:m,
            shape:geo,
            material:mat
        })
    }
}
class cannoncylinder_{
    constructor(r1,r2,height,m){
        let geo=new CANNON.Cylinder (r1,r2,height,10)
        let mat=mymat
        this.body=new CANNON.Body({
            mass:m,
            shape:geo,
            material:mat
        })
    }
}
class cannonplane_{
    constructor(x,y){
        let geo=new CANNON.Plane(x,y)
        let mat=mymat
        this.body=new CANNON.Body({
            mass:0,
            shape:geo,
            material:mat
        })
    }
}
let ex=new THREE.Mesh(new THREE.BoxGeometry(1,1,1))

function cannon_rotate(body,x,y,z){
    ex.quaternion.copy(body.quaternion)
    ex.rotation.y+=y
    ex.rotation.x+=x
    ex.rotation.z+=z
    body.quaternion.copy(ex.quaternion)
}
function cannon_rotation(body,x_y_z,deg){
    ex.quaternion.copy(body.quaternion)
    if(x_y_z==='x'){ex.rotation.x=deg}
    if(x_y_z==='y'){ex.rotation.y=deg}
    if(x_y_z==='z'){ex.rotation.z=deg}
    if(x_y_z==='to0'){ex.rotation.x=ex.rotation.y=ex.rotation.z=0}
    body.quaternion.copy(ex.quaternion)
}
function cannon_rotate_axis(body,vec,deg){
    ex.quaternion.copy(body.quaternion)
    ex.rotateOnAxis(vec,deg)
    body.quaternion.copy(ex.quaternion)


}
function cannon_rotate_world_axis(body,vec,deg){
    ex.quaternion.copy(body.quaternion)
    ex.rotateOnWorldAxis(vec,deg)
    body.quaternion.copy(ex.quaternion)
}

//canvas

//drawer
function drawer(array,globel_through){
    let ctx=ctx2d

	for (var i=0;i<array.length;i++) {
		if(array[i].type==='rect'){
			ctx.globalAlpha=(100-array[i].through)/100*globel_through
			ctx.save()
			ctx.translate(array[i].translate.x,array[i].translate.y)
			ctx.rotate(array[i].deg)
			ctx.scale(array[i].scale.x,array[i].scale.y)
			if(array[i].stroke.is===true){
				ctx.lineWidth=array[i].stroke.width
				ctx.strokeStyle=array[i].stroke.color
				ctx.strokeRect(array[i].topleft.x,array[i].topleft.y,array[i].rightbottom.x-array[i].topleft.x,array[i].rightbottom.y-array[i].topleft.y)
			}
			if(array[i].fill.is===true){
				ctx.fillStyle=array[i].fill.color
				ctx.fillRect(array[i].topleft.x,array[i].topleft.y,array[i].rightbottom.x-array[i].topleft.x,array[i].rightbottom.y-array[i].topleft.y)
			}
			
			ctx.restore()
			ctx.globalAlpha=1.0
		}else if(array[i].type==='circle'){
			ctx.globalAlpha=(100-array[i].through)/100*globel_through
			ctx.save()
			ctx.translate(array[i].translate.x,array[i].translate.y)
			ctx.rotate(array[i].deg)
			ctx.scale(array[i].scale.x,array[i].scale.y)
			ctx.beginPath()
			ctx.arc(array[i].position.x,array[i].position.y,array[i].rr,array[i].startdeg,array[i].enddeg)
			if(array[i].isclose){
				ctx.closePath()
			}
			if(array[i].isrr){
				ctx.lineTo(array[i].position.x,array[i].position.y)
				ctx.closePath()
			}
			if(array[i].stroke.is===true){
				ctx.lineWidth=array[i].stroke.width
				ctx.strokeStyle=array[i].stroke.color
				ctx.stroke()
			}
			if(array[i].fill.is===true){
				ctx.fillStyle=array[i].fill.color
				ctx.fill()
			}
			
			ctx.restore()
			ctx.globalAlpha=1.0
		}else if(array[i].type==='line'){
			ctx.globalAlpha=(100-array[i].through)/100*globel_through
			ctx.save()
			ctx.translate(array[i].translate.x,array[i].translate.y)
			ctx.rotate(array[i].deg)
			ctx.scale(array[i].scale.x,array[i].scale.y)
			for(let y=0;y<array[i].pointarray.length;y++){
				let px=array[i].pointarray[y][0]
				let py=array[i].pointarray[y][1]
				if(y===0){
					ctx.beginPath()
					ctx.moveTo(px,py)
				}else{
					ctx.lineTo(px,py)
				}
			}
			if(array[i].isclose){
				ctx.closePath()
			}
			if(array[i].stroke.is===true){
				ctx.lineWidth=array[i].stroke.width
				ctx.strokeStyle=array[i].stroke.color
				ctx.stroke()
			}
			if(array[i].fill.is===true){
				ctx.fillStyle=array[i].fill.color
				ctx.fill()
			}
			
			ctx.restore()
			ctx.globalAlpha=1.0
		

		}
	}
}
//get path
function ispointinarraypath(x,y,array){
    let ctx=ctx2d
	let is=false
	for (var i=0;i<array.length;i++) {
		if(array[i].type==='rect'){
			ctx.save()
				ctx.translate(array[i].translate.x,array[i].translate.y)
				ctx.rotate(array[i].deg)
				ctx.scale(array[i].scale.x,array[i].scale.y)
				ctx.beginPath()
				ctx.rect(array[i].topleft.x,array[i].topleft.y,array[i].rightbottom.x-array[i].topleft.x,array[i].rightbottom.y-array[i].topleft.y)			
			ctx.restore()
			if(ctx.isPointInPath(x,y)){
				is=true
			}
			

		}else if(array[i].type==='circle'){
			ctx.save()
				ctx.translate(array[i].translate.x,array[i].translate.y)
				ctx.rotate(array[i].deg)
				ctx.scale(array[i].scale.x,array[i].scale.y)
				ctx.beginPath()
				ctx.arc(array[i].position.x,array[i].position.y,array[i].rr,array[i].startdeg,array[i].enddeg)
				if(array[i].isclose){
					ctx.closePath()
				}
				if(array[i].isrr){
					ctx.lineTo(array[i].position.x,array[i].position.y)
					ctx.closePath()
				}
			ctx.restore()
			if(ctx.isPointInPath(x,y)){
				is=true
			}
		}else if(array[i].type==='line'){
			ctx.save()
				ctx.translate(array[i].translate.x,array[i].translate.y)
				ctx.rotate(array[i].deg)
				ctx.scale(array[i].scale.x,array[i].scale.y)
				for(let y=0;y<array[i].pointarray.length;y++){
					let px=array[i].pointarray[y][0]
					let py=array[i].pointarray[y][1]
					if(y===0){
						ctx.beginPath()
						ctx.moveTo(px,py)
					}else{
						ctx.lineTo(px,py)
					}
				}
				if(array[i].isclose){
					ctx.closePath()
				}
			ctx.restore()
			if(ctx.isPointInPath(x,y)){
				is=true
			}
		}
	}
	ctx.restore()
	return is
}



