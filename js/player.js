import MultiKey from "./multi-key.js";

export default class Player {
    constructor(scene, x, y) {
        this.scene = scene;
        /*Create the animations we need from the player sprite sheet*/
        this.anims = scene.anims;
        /*get frames from atlas*/
        var runFrames = this.anims.generateFrameNames('player', {
            start: 1, end: 8,
            prefix: 'run/', suffix: '.png'
        });
        this.anims.create({
            key: "run",
            frames: runFrames,
            frameRate: 10,
            repeat: -1
        });
        /*Create the physics-based sprite that we will move around and animate*/
        this.sprite = scene.matter.add.sprite(0, 0, "player", 'walk/2.png');
        /*Add sensors to check if he intersects walls or ground*/
        const {Body, Bodies} = Phaser.Physics.Matter.Matter; // Native Matter modules
        const {width: w, height: h} = this.sprite;
        const mainBody = Bodies.rectangle(0, 0, w * 0.6, h, {chamfer: {radius: 10}});
        /*dynamically generated sensors*/
        this.sensors = {
            bottom: Bodies.rectangle(0, h * 0.5, w * 0.25, 2, {isSensor: true}),
            left: Bodies.rectangle(-w * 0.35, 0, 2, h * 0.5, {isSensor: true}),
            right: Bodies.rectangle(w * 0.35, 0, 2, h * 0.5, {isSensor: true})
        };
        /*Speed in air is lower than in ground*/
        const compoundBody = Body.create({
            parts: [mainBody, this.sensors.bottom, this.sensors.left, this.sensors.right],
            frictionStatic: 0,
            frictionAir: 0.02,
            friction: 0.1
        });
        this.sprite
            .setExistingBody(compoundBody)
            .setScale(0.5)
            /*Sets inertia to infinity so the player can't rotate*/
            .setFixedRotation()
            .setPosition(x, y);

        const { LEFT, RIGHT, UP, A, D, W } = Phaser.Input.Keyboard.KeyCodes;

        this.leftInput = new MultiKey(scene, [LEFT, A]);
        this.rightInput = new MultiKey(scene, [RIGHT, D]);
        this.jumpInput = new MultiKey(scene, [UP, W]);

        this.scene.events.on("update", this.update, this);

        // Track which sensors are touching something
        this.isTouching = { left: false, right: false, ground: false };

        // Jumping is going to have a cooldown
        this.canJump = true;
        this.jumpCooldownTimer = null;

        // Before matter's update, reset our record of what surfaces the player is touching.
        scene.matter.world.on("beforeupdate", this.resetTouching, this);

        // If a sensor just started colliding with something, or it continues to collide with something,
        // call onSensorCollide
        scene.matterCollision.addOnCollideStart({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });
        scene.matterCollision.addOnCollideActive({
            objectA: [this.sensors.bottom, this.sensors.left, this.sensors.right],
            callback: this.onSensorCollide,
            context: this
        });

        this.destroyed = false;
        this.scene.events.on("update", this.update, this);
        this.scene.events.once("shutdown", this.destroy, this);
        this.scene.events.once("destroy", this.destroy, this);
    }
    onSensorCollide({ bodyA, bodyB, pair }) {
        if (bodyB.isSensor) return; // We only care about collisions with physical objects
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

    resetTouching() {
        this.isTouching.left = false;
        this.isTouching.right = false;
        this.isTouching.ground = false;
    }

    freeze() {
        this.sprite.setStatic(true);
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

        // Adjust the movement so that the player is slower in the air
        const moveForce = isOnGround ? 0.01 : 0.005;

        if (isLeftKeyDown) {
            sprite.setFlipX(true);

            // Don't let the player push things left if they in the air
            if (!(isInAir && this.isTouching.left)) {
                sprite.applyForce({x: -moveForce, y: 0});
            }
        } else if (isRightKeyDown) {
            sprite.setFlipX(false);

            // Don't let the player push things right if they in the air
            if (!(isInAir && this.isTouching.right)) {
                sprite.applyForce({x: moveForce, y: 0});
            }
        }

        // Limit horizontal speed, without this the player's velocity would just keep increasing toabsurd speeds.
        if (velocity.x > 7) sprite.setVelocityX(7);
        else if (velocity.x < -7) sprite.setVelocityX(-7);

        if (isJumpKeyDown && this.canJump && isOnGround) {
            sprite.setVelocityY(-11);

            // Add a slight delay between jumps since the bottom sensor will still collide for a few
            // frames after a jump is initiated
            this.canJump = false;
            this.jumpCooldownTimer = this.scene.time.addEvent({
                delay: 250,
                callback: () => (this.canJump = true)
            });
        }
        if (isOnGround) {
            if (sprite.body.force.x !== 0) sprite.anims.play("run", true);
            else sprite.setTexture("player", 'walk/5.png');
        } else {
            sprite.anims.stop();
            sprite.setTexture("player", 'walk/5.png');
        }
    }
    destroy() {
        this.destroyed = true;

        // Event listeners
        this.scene.events.off("update", this.update, this);
        this.scene.events.off("shutdown", this.destroy, this);
        this.scene.events.off("destroy", this.destroy, this);
        if (this.scene.matter.world) {
            this.scene.matter.world.off("beforeupdate", this.resetTouching, this);
        }

        // Matter collision plugin
        const sensors = [this.sensors.bottom, this.sensors.left, this.sensors.right];
        this.scene.matterCollision.removeOnCollideStart({ objectA: sensors });
        this.scene.matterCollision.removeOnCollideActive({ objectA: sensors });

        // Don't want any timers triggering post-mortem
        if (this.jumpCooldownTimer) this.jumpCooldownTimer.destroy();

        this.sprite.destroy();
    }
}
