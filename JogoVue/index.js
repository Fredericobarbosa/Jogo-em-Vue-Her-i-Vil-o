const ComponenteLogin ={
    template: `
        <div class="container">
            <div class="componente1">
                <h1>LOGIN</h1>
                <label>Email</label>
                <input placeholder="Email" type="email"></input><br><br>
                <label>Senha</label>
                <input placeholder="Senha" type="password"></input><br><br>
                <button @click="login" class="botaoLogin">Entrar</button><br><br>
                <button @click="$emit('cadastro')">Cadastre-se</button>
            </div>
        </div>
    `
}
const ComponenteCadastro ={
    template: `
        <div class="componente2">
            <h1>Cadastre-se</h1>
            <label>Nome*</label>
            <input placeholder="Nome" type="text"></input><br><br>
            <label>Email*</label>
            <input placeholder="Email" type="email"></input><br><br>
            <label>Senha*</label>
            <input placeholder="Senha" type="password"></input><br><br>
            <button @click="$emit('cadastro')">Cadastrar</button>
        </div>
    `
}


const { createApp } = Vue

createApp({
    data() {
        return {
            heroi: { vida: 100 },
            vilao: { vida: 100 },
            registroAcoes: [],
            aviso: '',
            componenteAtual: "ComponenteLogin"
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
                this.heroi.vida -= 15;
                this.registroAcoes.push("Vilão atacou. Vida do herói: " + this.heroi.vida);
            }
            this.verificarVitoria();
        },
        async atualizarVidaNoBancoDeDados(vidaHeroi, vidaVilao) {
            try {
                const response = await fetch(`${API_URL}/atualizarVida`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ vidaHeroi, vidaVilao })
                });
                if (!response.ok) {
                    throw new Error('Erro ao atualizar a vida no banco de dados.');
                }
                console.log('Vida do herói e do vilão atualizada com sucesso.');
            } catch (error) {
                console.error('Erro ao atualizar a vida no banco de dados:', error);
            }
        },
        defender(isHeroi) {
            this.acaoVilao();
        },
        usarPocao(isHeroi) {
            if (isHeroi) {
                this.heroi.vida += 10;
                this.atualizarVidaNoBancoDeDados(this.heroi.vida, this.vilao.vida);
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
        },
        alterarComponentes() {
            this.componenteAtual = (this.componenteAtual === "ComponenteLogin") ? "ComponenteCadastro" : "ComponenteLogin"
        }
    },
     components: {
        ComponenteLogin,
        ComponenteCadastro
    }    
}).mount("#app");
