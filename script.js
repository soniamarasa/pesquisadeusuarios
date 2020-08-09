//variaveis

let resultadoPesquisa = null;
let campoPesquisa = null;
let inputValue = null;
let button = null;
let allUsers = [];
let estatistica = null;
let countUser = 0;
let numberFormat = null;
let usuariosLista = null;

window.addEventListener('load', () => {
  resultadoPesquisa = document.querySelector('#resultadopesquisa');
  campoPesquisa = document.querySelector('#pesquisa');
  button = document.querySelector('#busca');
  estatistica = document.querySelector('#estatistica');
  countFeminino = document.querySelector('#sexofeminino');
  countMasculino = document.querySelector('sexomasculino');
  countIdade = document.querySelector('#somaidades');
  mediaIdade = document.querySelector('#mediaidades');

  numberFormat = Intl.NumberFormat('pt-BR');

  campoPesquisa.disabled = true;
  button.disabled = true;

  fetchUsuarios();
  hideSpinner();
  cleanfilter();
});

function formatNumber(number) {
  return numberFormat.format(number);
}

function hideSpinner() {
  const spinner = document.querySelector('#preloader');

  setTimeout(() => {
    spinner.classList.add('hide');
    campoPesquisa.disabled = false; //disable é atributo
    campoPesquisa.focus();
  }, 1000);
}

function cleanfilter() {
  const usuarios = document.querySelector('#usuarios');
  const usuariosest = document.querySelector('#usuariosest');

  usuarios.textContent = 'Nenhum usuário Filtrado';
  usuariosest.textContent = 'Nada a ser exibido';
}

async function fetchUsuarios() {
  const dados = await fetch(
    'https://randomuser.me/api/?seed=javascript&results=100&nat=BR&noinfo'
  );
  const json = await dados.json();

  console.log(json);

  allUsers = json.results.map((person) => {
    const { name, gender, dob, picture } = person;

    return {
      nome: name.first + ' ' + name.last,
      idade: dob.age,
      genero: gender,
      foto: picture.thumbnail,
    };
  });
}

window.addEventListener('keyup', (event) => {
  inputValue = event.target.value;
  if (inputValue.length > 0) {
    button.disabled = false;
    if (event.key === 'Enter') {
      render(inputValue);
    }
  } else {
    button.disabled = true;
    usuariosLista = ' ';
    resultadoPesquisa.innerHTML = usuariosLista;
    cleanfilter();
  }
});

window.addEventListener('click', (event) => {
  if (event.target.id === 'busca' && inputValue.length > 0) {
    render(inputValue);
  }
});

window.addEventListener('submit', (event) => {
  event.preventDefault();
});

function render(inputValue) {
  renderUsuarios(inputValue);
  renderEstatisticas(inputValue);
}

function renderUsuarios(inputValue) {
  countUser = 0;
  let peoplesHTML = '<div>';
  const auxArray = [];

  allUsers.forEach((person) => {
    const { nome } = person;
    if (nome.toLowerCase().includes(inputValue.toLowerCase())) {
      auxArray.push(person);
      countUser++;
    }
  });

  auxArray
    .sort((a, b) => {
      return a.nome.localeCompare(b.nome);
    })
    .forEach((person) => {
      const { nome, idade, foto } = person;
      const userHTML = `
        
      <div> 
        <div class="usuarios">
            <img src="${foto}" alt="${nome}">
            <span id="userdados"> ${nome},  ${idade} anos</span>
          </div>
    </div>
      `;

      peoplesHTML += userHTML;
    });

  peoplesHTML += '</div>';
  resultadoPesquisa.innerHTML = peoplesHTML;
  usuarios.textContent = countUser + ' ' + 'usuário(os) encontrado(s)';
}

function renderEstatisticas(inputValue) {
  let countFeminino = 0;
  let countMasculino = 0;
  let countIdade = 0;
  let mediaIdade = 0;

  let estatisticasHTML = '<div>';

  usuariosest.textContent = 'Estatísticas';

  allUsers.forEach((person) => {
    const { nome, genero, idade } = person;
    if (nome.toLowerCase().includes(inputValue.toLowerCase())) {
      if (genero === 'female') {
        countFeminino++;
      } else if (genero === 'male') {
        countMasculino++;
      }
      countIdade += idade;
    }
  });

  mediaIdade = countIdade/countUser;

  const dadosEstatisticaHTML = `
                
      <ul >
          <li> Sexo Feminino: <span id="sexofeminino" class="dadosformat"> ${countFeminino}</span> </li>
          <li> Sexo Masculino: <span id="sexomasculino" class="dadosformat"> ${countMasculino}</span> </li>
          <li> Soma das Idades: <span id="somaidades" class="dadosformat">${countIdade}  </span> </li>
          <li> Média das idades: <span id="mediaidades" class="dadosformat">${formatNumber(
            mediaIdade
          )} </span> </li>
      </ul> 
      `;

  estatisticasHTML += dadosEstatisticaHTML;

  estatisticasHTML += '</div>';
  estatistica.innerHTML = estatisticasHTML;
}