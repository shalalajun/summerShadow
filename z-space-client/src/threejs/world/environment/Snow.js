import * as THREE from 'three' 
import Project from '../../Project'

export default class Snow
{
    constructor()
    {

      
        // this.time = this.trainTown.time
        this.particles
        this.positions = []
        this.velocities = []
        this.initSnow()
        
    }

    initSnow()
    {

        const project = Project.getInst()
        this.resource = project.assetLoader.items.snowTex

        this.numSnowflakes = 15000
        this.maxRange = 80
        this.minRange = this.maxRange * 0.5 // z축으로 보여지는 값
     
  
        this.minHeight = 25; // 10 에서 500사이 y값
        this.geometry = new THREE.BufferGeometry()

        for(let i=0; i < this.numSnowflakes; i++)
        {
            this.positions.push(
                Math.floor(Math.random() * this.maxRange - this.minRange),
                Math.floor(Math.random() * (this.maxRange + this.minHeight)),
                Math.floor(Math.random() * this.maxRange - this.minRange)
            )

            this.velocities.push(
                Math.floor(Math.random() * 0.4 - 0.2 ) * 0.002,
                Math.floor(Math.random() * 2.5 + 1.5 ) * 0.015,
                Math.floor(Math.random() * 0.4 - 0.2 ) * 0.002
            )
        }

        this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(this.positions,3))
        this.geometry.setAttribute('velocity', new THREE.Float32BufferAttribute(this.velocities,3))

        this.snowMaterial = new THREE.PointsMaterial({
            size: 0.25,
            map: this.resource,
            blending: THREE.AdditiveBlending,
            depthTest: true,
            transparent: true,
            opacity: 1.0
        })

        this.particles = new THREE.Points(this.geometry, this.snowMaterial)
        project.add(this.particles)
    }

    onUpdate()
    {
        for(let i=0; i < this.numSnowflakes * 3; i += 3)
        {
            this.particles.geometry.attributes.position.array[i] -= this.particles.geometry.attributes.velocity.array[i]

            this.particles.geometry.attributes.position.array[i+1] -= this.particles.geometry.attributes.velocity.array[i+1]

            this.particles.geometry.attributes.position.array[i+2] -= this.particles.geometry.attributes.velocity.array[i+2]

        

        if(this.particles.geometry.attributes.position.array[i+1] < 1 )
        {
            this.particles.geometry.attributes.position.array[i] =  Math.floor(Math.random() * this.maxRange - this.minRange)

            this.particles.geometry.attributes.position.array[i+1] =  Math.floor(Math.random() * this.minRange + this.minHeight * 2)

            this.particles.geometry.attributes.position.array[i+2] =  Math.floor(Math.random() * this.maxRange - this.minRange)
        }
    }

        this.particles.geometry.attributes.position.needsUpdate = true
    }
}