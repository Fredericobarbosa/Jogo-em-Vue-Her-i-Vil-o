const { createApp } = Vue
const API_URL = 'https://jogo-em-vue-her-i-vil-o.onrender.com/'; //'http://localhost:3000';

createApp({
    data() {
        return {
            heroi: { vida: 100 },
            vilao: { vida: 100 },
            registroAcoes: [],
            acao_do_heroi: '',
            acao_do_vilao: ''
        }
    },
    methods: {
        atacar(isHeroi) {
            if (isHeroi) {
                this.vilao.vida -= 10;
                this.acao_do_heroi = 'Atacou';
                this.acaoVilao();
                // this.registroAcoes.push("Herói atacou. Vida do vilão: " + this.vilao.vida);
            } else {
                this.acao_do_vilao = 'Atacou';
                this.heroi.vida -= 15;
                // this.registroAcoes.push("Vilão atacou. Vida do herói: " + this.heroi.vida);
            }
            this.atualizarVidaNoBancoDeDados(this.heroi.vida, this.vilao.vida, this.acao_do_heroi, this.acao_do_vilao);
            this.verificarVitoria();
        },
        acaoVilao() {
            const acoes = ['atacar', 'defender', 'usarPocao', 'correr'];
            const acaoAleatoria = acoes[Math.floor(Math.random() * acoes.length)];        
            this[acaoAleatoria](false);                       
        },
        defender(isHeroi) {
            if (isHeroi){
                this.heroi.vida += 5
                this.acao_do_heroi = 'Defendeu';
                this.acaoVilao();
            }else{
                this.vilao.vida += 5
                this.acao_do_vilao = 'Defendeu';
            }
            this.atualizarVidaNoBancoDeDados(this.heroi.vida, this.vilao.vida, this.acao_do_heroi, this.acao_do_vilao);
            this.verificarVitoria();
        },
        usarPocao(isHeroi) {
            if (isHeroi) {
                if (this.heroi.vida <= 90) {
                    this.heroi.vida += 10;
                }
                this.acao_do_heroi = 'Usou Poção';
                this.acaoVilao();
            }else{
                if (this.vilao.vida <= 90) {
                    this.acao_do_vilao = 'Usou Poção'
                    this.vilao.vida += 10;
                }
            }
            this.atualizarVidaNoBancoDeDados(this.heroi.vida, this.vilao.vida, this.acao_do_heroi, this.acao_do_vilao);
            this.verificarVitoria();
        },
        correr(isHeroi) {
            if (isHeroi){
                this.acao_do_heroi = 'Correu';
                this.acaoVilao();
            }else{
                this.acao_do_vilao = 'Correu';
            }
            this.atualizarVidaNoBancoDeDados(this.heroi.vida, this.vilao.vida, this.acao_do_heroi, this.acao_do_vilao);
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
                    button.disabled = true;
                });
            }
        },
        async atualizarVidaNoBancoDeDados(vidaHeroi, vidaVilao, acaoHeroi, acaoVilao) {
            try {
                const response = await fetch(`${API_URL}atualizar_vida`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ vidaHeroi, vidaVilao, acaoHeroi, acaoVilao })
                });
                if (!response.ok) {
                    throw new Error('Erro ao atualizar a vida no banco de dados.');
                }
                console.log('Vida do herói e do vilão atualizada com sucesso.');
            } catch (error) {
                console.error('Erro ao atualizar a vida no banco de dados:', error);
            }
        },
        dashboard(){
            window.open('/dashboard', '_blank');
        }
    }
}).mount("#app");