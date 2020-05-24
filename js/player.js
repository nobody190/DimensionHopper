import MultiKey from "./multi-key.js";
import Projectile from "./projectile.js";
import Portal from "./portal.js";

export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        this.anims = scene.anims;
        /*add sprite*/
        this.sprite = scene.matter.add.sprite(0, 0, "player", 'walk/2.png');
        /*portal*/
        this.portal = {
            A: new Portal(this.scene, this.sprite),
            B: new Portal(this.scene, this.sprite),
            next: 1,
        };
        /*sprite frames*/
        this.createFrames(this.scene);
        /*setting body*/
        this.createBody(x, y);
        /*add inputs*/
        this.createInput(this.scene);
        /*add collision events*/
        this.createEvents(this.scene);
        /*aux variables*/
        this.isTouching = { left: false, right: false, ground: false };
        this.canJump = true;
        this.canShoot = true;
        this.canPortal = false;
        this.jumpTimer = null;
        this.portalTimer = null;
        this.origin = 0;
        this.destroyed = false;

    }
    /*Generate Frames from ATLAS*/
    createFrames(){
        const frames = this.anims.generateFrameNames('player', {
            start: 1, end: 8,
            prefix: 'run/', suffix: '.png'
        });
        this.anims.create({
            key: "run",
            frames: frames,
            frameRate: 10,
            repeat: -1
        });
    }
    /*Generate Body With sensors*/
    createBody(x, y){
        const {Body, Bodies} = Phaser.Physics.Matter.Matter;
        const {width: w, height: h} = this.sprite;
        const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, {chamfer: {radius: 10}});
        this.sensors = {
            bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, {isSensor: true}),
            left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, {isSensor: true}),
            right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, {isSensor: true})
        };
        const compoundBody = Body.create({
            parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.1
        });
        this.sprite
            .setExistingBody(compoundBody)
            .setScale(0.5)
            .setFixedRotation()
            .setPosition(x, y);
    }
    /*Add inputs*/
    createInput(scene){
        /*Keyboard Inputs*/
        const { LEFT, RIGHT, UP, A, D, W } = Phaser.Input.Keyboard.KeyCodes;
        this.leftInput = new MultiKey(scene, [LEFT, A]);
        this.rightInput = new MultiKey(scene, [RIGHT, D]);
        this.jumpInput = new MultiKey(scene, [UP, W]);
        /*Mouse Inputs*/
        this.scene.input.on('pointerdown', function (pointer) {
            let mouse = pointer;
            let x = this.sprite.x;
            let y = this.sprite.y;
            let angle = Phaser.Math.Angle.Between(x, y, mouse.x, mouse.y);
            this.fire(angle);
        }, this);
    }
    /*Add and redirect events*/
    createEvents(scene){
        scene.matter.world.on("beforeupdate", this.resetTouching, this);
        /*Player Sensors Collisions*/
        scene.matterCollision.addOnCollideStart({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onPlayerCollide,
            context: this
        });
        scene.matterCollision.addOnCollideActive({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onPlayerCollide,
            context: this
        });
        /*Redirect functions*/
        this.scene.events.on("update", this.update, this);
        this.scene.events.once("shutdown", this.destroy, this);
        this.scene.events.once("destroy", this.destroy, this);
    }
    /*Collisions Methods*/
    onPlayerCollide({ bodyA, bodyB, pair }) {
        if (bodyB.isSensor) return;
        if (bodyA === this.sensors.left) {
            this.isTouching.left = true;
            if (pair.separation > 0.5) this.sprite.x += pair.separation - 0.5;
        } else if (bodyA === this.sensors.right) {
            this.isTouching.right = true;
            if (pair.separation > 0.5) this.sprite.x -= pair.separation - 0.5;
        } else if (bodyA === this.sensors.bottom) {
            this.isTouching.ground = true;
        }
    }
    onBulletCollide({ gameObjectB }) {
        if(!gameObjectB){
            this.canShoot = true;
            return;
        }
        if(!(gameObjectB instanceof Phaser.Tilemaps.Tile))return;
        const tile = gameObjectB;

        if(tile.properties.portal){
            const x = this.projectile.sprite.x;
            const y = this.projectile.sprite.y;
            let angle = 0;

            if(tile.layer.name === 'ceiling') angle = Math.PI;

            this.projectile.destroy();

            if(this.portal.next === 1){
                this.portal.A = this.portal.A.trigger(x, y, angle);
                this.portal.next = 2;
                this.updatePortal(1);
            }
            else{
                this.portal.B = this.portal.B.trigger(x, y, angle);
                this.portal.next = 1;
                this.updatePortal(2);
            }
            this.canShoot = true;
        }
    }
    updatePortal(n){
        switch(n){
            case 1:
                /*Remove collisions from previous sensors*/
                this.scene.matterCollision.removeOnCollideActive({ objectA: this.portal.A.sprite });
                /*Add new collisions*/
                this.scene.matterCollision.addOnCollideActive({
                    objectA: this.portal.A.sprite,
                    callback: this.onPortalACollide,
                    context: this
                });
                break;
            case 2:
                this.scene.matterCollision.removeOnCollideActive({ objectA: this.portal.B.sprite });
                this.scene.matterCollision.addOnCollideActive({
                    objectA: this.portal.B.sprite,
                    callback: this.onPortalBCollide,
                    context: this
                });
                break;
        }
    }
    onPortalACollide(gameObjectB){
        if(!gameObjectB) return;
        if(gameObjectB.type === 'Sprite' && this.portal.B.state){
            /*Set to sensor to avoid collisions*/
            this.sprite.setSensor(true);
            /*Set origin to A*/
            this.origin = 1;
            /*Activate timer*/
            this.portalTimer = this.scene.time.addEvent({
                delay: 20,
                callback: () => (this.canPortal = true)
            });
        }
    }
    onPortalBCollide(gameObjectB){
        if(!gameObjectB) return;
        console.log(gameObjectB.type);
        if(gameObjectB.type === 'Sprite' && this.portal.A.state){
            /*Set to sensor to avoid collisions*/
            this.sprite.setSensor(true);
            /*Set origin to A*/
            this.origin = 2;
            /*Activate timer*/
            this.portalTimer = this.scene.time.addEvent({
                delay: 20,
                callback: () => (this.canPortal = true)
            });
        }
    }
    /*Reset Sensors*/
    resetTouching() {
        this.isTouching.left = false;
        this.isTouching.right = false;
        this.isTouching.ground = false;
    }
    /*Stop Player Sprite*/
    freeze() {
        this.sprite.setStatic(true);
    }
    /*Shoot Projectile*/
    fire(angle){
        if(!this.canShoot){
            /*play can't shoot sound*/
            return;
        }
        this.canShoot = false;
        /*Create New Projectile*/
        this.projectile = new Projectile(this.scene, this.sprite.x, this.sprite.y, angle);
        /*add sensor collision*/
        this.scene.matterCollision.addOnCollideActive({
            objectA: this.projectile.sprite,
            callback: this.onBulletCollide,
            context: this
        });
    }
    update() {
        if (this.destroyed) return;

        const sprite = this.sprite;
        const velocity = sprite.body.velocity;
        const isRightKeyDown = this.rightInput.isDown();
        const isLeftKeyDown = this.leftInput.isDown();
        const isJumpKeyDown = this.jumpInput.isDown();
        const isOnGround = this.isTouching.ground;
        const isInAir = !isOnGround;
        const moveForce = isOnGround ? 0.01 : 0.005;

        if (isLeftKeyDown) {
            sprite.setFlipX(true);
            if (!(isInAir && this.isTouching.left)) {
                sprite.applyForce({x: -moveForce, y: 0});
            }
        } else if (isRightKeyDown) {
            sprite.setFlipX(false);
            if (!(isInAir && this.isTouching.right)) {
                sprite.applyForce({x: moveForce, y: 0});
            }
        }
        if (velocity.x > 2) sprite.setVelocityX(2); else if (velocity.x < -2) sprite.setVelocityX(-2);

        if (isJumpKeyDown && this.canJump && isOnGround) {
            sprite.setVelocityY(-11);

            this.canJump = false;
            this.jumpTimer = this.scene.time.addEvent({
                delay: 250,
                callback: () => (this.canJump = true)
            });
        }
        if(this.canPortal){
            let x = 0; let y = 0;
            const {width: w, height: h} = this.portal.A.sprite;
            if(this.origin === 1){
                x = this.portal.A.coordinates.x;
                y = this.portal.A.coordinates.y;
            }
            else{
                x = this.portal.B.coordinates.x;
                y = this.portal.B.coordinates.y;
            }
            /*teleport player*/
            this.sprite.setX(x + w/2).setY(y+h/2);
            /*reset*/
            this.canPortal = false;
            this.origin = 0;
        }
        if (isOnGround) {
            if (sprite.body.force.x !== 0) sprite.anims.play("run", true);
            else sprite.setTexture("player", 'walk/5.png');
        } else {
            sprite.anims.stop();
            sprite.setTexture("player", 'run/0.png');
        }
    }
    destroy() {
        this.destroyed = true;
        /*remove events*/
        this.scene.events.off("update", this.update, this);
        this.scene.events.off("shutdown", this.destroy, this);
        this.scene.events.off("destroy", this.destroy, this);
        if (this.scene.matter.world) {
            this.scene.matter.world.off("beforeupdate", this.resetTouching, this);
        }
        const sensors = [this.sensors.bottom, this.sensors.left, this.sensors.right];
        this.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
        this.scene.matterCollision.removeOnCollideActive({ objectA: sensors });

        if (this.jumpTimer) this.jumpTimer.destroy();

        this.sprite.destroy();
    }
}
