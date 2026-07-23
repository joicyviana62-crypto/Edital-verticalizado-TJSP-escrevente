// =============================
// TJSP Verticalizado
// script.js
// Parte 1
// =============================

// Recupera progresso salvo
let progresso = JSON.parse(localStorage.getItem("progressoTJSP")) || {};

// Elementos da página
const tabela = document.getElementById("tabelaEdital");
const pesquisa = document.getElementById("pesquisar");

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

    edital.forEach((item)=>{

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

if(localStorage.getItem("tema")=="escuro"){

    document.body.classList.add("dark");

    botaoModo.innerHTML="☀ Modo Claro";

}

botaoModo.addEventListener("click",()=>{

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){

        localStorage.setItem("tema","escuro");

        botaoModo.innerHTML="☀ Modo Claro";

    }

    else{

        localStorage.setItem("tema","claro");

        botaoModo.innerHTML="🌙 Modo Escuro";

    }

});


// =======================
// Inicialização
// =======================

window.onload=function(){

    carregarTabela();

};