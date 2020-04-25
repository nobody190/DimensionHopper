//Aqui vai estar como deviamos criar os estados do jogo(menu, níveis, etc)

class StateName extends Phaser.State {
    //vai buscar as imagens e sons que vão ser usados
	preload() {
		this.load.image('sky','../sources/sky.png');

	}

    //cria os objectos (plataformas, jogador,etc)
	create() {
        //...
	}

    //corre ciclicamente
	update() {
        //...
	}

}