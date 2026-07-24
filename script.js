// =============================
// TJSP Verticalizado
// script.js
// Parte 1
// =============================

// Recupera progresso salvo
let progresso = JSON.parse(localStorage.getItem("progressoTJSP")) || {};
let filtroDisciplina = localStorage.getItem("filtroDisciplina") || "";

const gruposDisciplina = {
    portugues: ["Língua Portuguesa"],
    direito: [
        "Direito Penal",
        "Direito Processual Penal",
        "Direito Processual Civil",
        "Direito Constitucional",
        "Direito Administrativo",
        "Legislação Interna do TJSP"
    ],
    atualidades: ["Atualidades", "Estatuto da Pessoa com Deficiência"],
    matematica: ["Matemática"],
    informatica: ["Informática"],
    "raciocinio-logico": ["Raciocínio Lógico"]
};

// Elementos da página
const tabela = document.getElementById("tabelaEdital");
const pesquisa = document.getElementById("pesquisar");
const botoesDisciplina = document.querySelectorAll(".menu-btn");
const botaoLimparFiltros = document.getElementById("limparFiltros");

const barra = document.getElementById("barraGeral");
const texto = document.getElementById("textoProgresso");

const teoriaTotal = document.getElementById("totalTeoria");
const revisaoTotal = document.getElementById("totalRevisao");
const questoesTotal = document.getElementById("totalQuestoes");

// =======================
// Cria a tabela
// =======================

function carregarTabela(){

    tabela.innerHTML="";
    const exibidos = filtroDisciplina === ""
        ? edital
        : edital.filter(item => gruposDisciplina[filtroDisciplina]?.includes(item.disciplina));

    if(exibidos.length === 0){
        tabela.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:28px; color:var(--muted);">
                    Selecione uma disciplina para ver o edital.
                </td>
            </tr>
        `;
        restaurarDados();
        return;
    }

    exibidos.forEach((item)=>{

        const linha=document.createElement("tr");

        linha.innerHTML=`

        <td>${item.disciplina}</td>

        <td>${item.assunto}</td>

        <td align="center">

            <input
            type="checkbox"
            class="teoria"
            data-id="${item.id}">

        </td>

        <td align="center">

            <input
            type="checkbox"
            class="revisao"
            data-id="${item.id}">

        </td>

        <td align="center">

            <input
            type="checkbox"
            class="questao"
            data-id="${item.id}">

        </td>

        `;

        tabela.appendChild(linha);

    });

    restaurarDados();

}

// =======================
// Restaura os dados salvos
// =======================

function restaurarDados(){

    document.querySelectorAll(".teoria").forEach(check=>{

        const id=check.dataset.id;

        if(progresso[id]?.teoria){

            check.checked=true;

        }

        check.addEventListener("change",salvar);

    });

    document.querySelectorAll(".revisao").forEach(check=>{

        const id=check.dataset.id;

        if(progresso[id]?.revisao){

            check.checked=true;

        }

        check.addEventListener("change",salvar);

    });

    document.querySelectorAll(".questao").forEach(check=>{

        const id=check.dataset.id;

        if(progresso[id]?.questao){

            check.checked=true;

        }

        check.addEventListener("change",salvar);

    });

    atualizarPainel();

}

// =======================
// Salva tudo
// =======================

function salvar(){

    progresso={};

    document.querySelectorAll(".teoria").forEach(check=>{

        const id=check.dataset.id;

        if(!progresso[id]) progresso[id]={};

        progresso[id].teoria=check.checked;

    });

    document.querySelectorAll(".revisao").forEach(check=>{

        const id=check.dataset.id;

        if(!progresso[id]) progresso[id]={};

        progresso[id].revisao=check.checked;

    });

    document.querySelectorAll(".questao").forEach(check=>{

        const id=check.dataset.id;

        if(!progresso[id]) progresso[id]={};

        progresso[id].questao=check.checked;

    });

    localStorage.setItem(
        "progressoTJSP",
        JSON.stringify(progresso)
    );

    atualizarPainel();

}

// =======================
// Atualiza o painel
// =======================

function atualizarPainel(){

    let teoria=0;
    let revisao=0;
    let questoes=0;

    document.querySelectorAll(".teoria").forEach(check=>{

        if(check.checked){

            teoria++;

        }

    });

    document.querySelectorAll(".revisao").forEach(check=>{

        if(check.checked){

            revisao++;

        }

    });

    document.querySelectorAll(".questao").forEach(check=>{

        if(check.checked){

            questoes++;

        }

    });

    teoriaTotal.innerHTML=teoria;
    revisaoTotal.innerHTML=revisao;
    questoesTotal.innerHTML=questoes;

    const totalChecks=

        document.querySelectorAll(".teoria").length*3;

    const concluidos=

        teoria+
        revisao+
        questoes;

    const porcentagem=

        totalChecks===0
        ?0
        :Math.round((concluidos/totalChecks)*100);

    barra.style.width=porcentagem+"%";

    texto.innerHTML=porcentagem+"%";

}



// =======================
// Pesquisa
// =======================

pesquisa.addEventListener("keyup",()=>{

    const textoPesquisa=

    pesquisa.value.toLowerCase();

    const linhas=

    tabela.querySelectorAll("tr");

    linhas.forEach(linha=>{

        const textoLinha=

        linha.innerText.toLowerCase();

        if(textoLinha.includes(textoPesquisa)){

            linha.style.display="";

        }

        else{

            linha.style.display="none";

        }

    });

});


// =======================
// Marcar tudo
// =======================

document.getElementById("marcarTudo").addEventListener("click",()=>{

    document.querySelectorAll("input[type='checkbox']").forEach(check=>{

        check.checked=true;

    });

    salvar();

});


// =======================
// Limpar tudo
// =======================

document.getElementById("desmarcarTudo").addEventListener("click",()=>{

    if(!confirm("Deseja realmente limpar todo o progresso?")){

        return;

    }

    document.querySelectorAll("input[type='checkbox']").forEach(check=>{

        check.checked=false;

    });

    salvar();

});


// =======================
// Exportar progresso
// =======================

document.getElementById("exportar").addEventListener("click",()=>{

    const dados=JSON.stringify(progresso,null,4);

    const blob=new Blob([dados],{

        type:"application/json"

    });

    const url=URL.createObjectURL(blob);

    const link=document.createElement("a");

    link.href=url;

    link.download="progressoTJSP.json";

    link.click();

    URL.revokeObjectURL(url);

});


// =======================
// Modo Escuro
// =======================

const botaoModo=document.getElementById("modoEscuro");

function aplicarTema(){
    const tema=localStorage.getItem("tema") || "escuro";

    if(tema==="escuro"){
        document.body.classList.add("dark");
        document.body.classList.remove("light");
        botaoModo.innerHTML="☀ Modo Claro";
    } else {
        document.body.classList.add("light");
        document.body.classList.remove("dark");
        botaoModo.innerHTML="🌙 Modo Escuro";
    }
}

function atualizarBotoesDisciplina(){
    botoesDisciplina.forEach(botao => {
        const filtro = botao.dataset.filtro;
        botao.classList.toggle("selected", filtro === filtroDisciplina);
    });
    if(filtroDisciplina === ""){
        botaoLimparFiltros.textContent = "✨ Limpar filtros";
    } else {
        botaoLimparFiltros.textContent = "🔄 Mostrar todas";
    }
}

function alternarFiltroDisciplina(filtro){
    if(filtroDisciplina === filtro){
        filtroDisciplina = "";
    } else {
        filtroDisciplina = filtro;
    }
    localStorage.setItem("filtroDisciplina", filtroDisciplina);
    atualizarBotoesDisciplina();
    carregarTabela();
}

botoesDisciplina.forEach(botao => {
    botao.addEventListener("click", () => {
        alternarFiltroDisciplina(botao.dataset.filtro);
    });
});

document.getElementById("limparFiltros").addEventListener("click",()=>{
    filtroDisciplina = "";
    localStorage.setItem("filtroDisciplina", "");
    atualizarBotoesDisciplina();
    carregarTabela();
});

atualizarBotoesDisciplina();

aplicarTema();

botaoModo.addEventListener("click",()=>{
    const estaEscuro=document.body.classList.toggle("dark");
    document.body.classList.toggle("light", !estaEscuro);
    localStorage.setItem("tema", estaEscuro ? "escuro" : "claro");
    aplicarTema();
});


// =======================
// Inicialização
// =======================

window.onload=function(){

    carregarTabela();

};
