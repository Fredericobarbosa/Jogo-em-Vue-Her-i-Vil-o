const { createApp } = Vue

createApp({
    data() {
        return {
            heroi: { vida: 100 },
            vilao: { vida: 100 },
            registroAcoes: [],
            aviso: ''
        }
    },
    methods: {
        atacar(isHeroi) {
            if (isHeroi) {
                console.log("Herói atacou");
                this.vilao.vida -= 10;
                this.registroAcoes.push("Herói atacou. Vida do vilão: " + this.vilao.vida);
                this.acaoVilao();
            } else {
                console.log("Vilão atacou");
                this.heroi.vida -= 10;
                this.registroAcoes.push("Vilão atacou. Vida do herói: " + this.heroi.vida);
            }
            this.verificarVitoria();
        },
        defender(isHeroi) {
            this.acaoVilao();
        },
        usarPocao(isHeroi) {
            if (isHeroi) {
                this.heroi.vida += 10;
                if (this.heroi.vida > 100) this.heroi.vida = 100;
                this.registroAcoes.push("Herói usou poção. Vida do herói: " + this.heroi.vida);
                this.acaoVilao();
            }
        },
        correr(isHeroi) {
            this.acaoVilao();
        },
        acaoVilao() {
            const acoes = ['atacar', 'defender', 'usarPocao', 'correr'];
            const acaoAleatoria = acoes[Math.floor(Math.random() * acoes.length)];
            this[acaoAleatoria](false);
            this.verificarVitoria();
        },
        verificarVitoria() {
            if (this.heroi.vida <= 0) {
                this.aviso = 'O VILÃO VENCEU!';
            } else if (this.vilao.vida <= 0) {
                this.aviso = 'O HERÓI VENCEU!';
            }
            if (this.aviso) {
                // Desativar todos os botões de ação
                document.querySelectorAll('.acoes button').forEach(button => {
                    button.disabled = true;});
            }
        }
    }    
}).mount("#app");
