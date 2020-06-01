/** A lista de nomes será um vetor de acesso global devido à simplicidade da aplicação.
 *  NÃO É UMA BOA PRÁTICA
 * */

window.addEventListener('load', start);

var globalNames = ['Um', 'Dois', 'Três', 'Quatro']; // não é uma boa prática
var inputName = null;
var isEditing = false;
var currentIndex = null;

function start() {
  // evento DOM - <input id="inputName" />
  inputName = document.querySelector('#inputName');

  preventFormSubmit();
  activateInput();
  render();
}

// Função que ativa o input() - foco, limpa o campo, pega digitação
function activateInput() {
  function insertName(newName) {
    globalNames.push(newName);
    render();
  }

  function updateName(newName) {
    globalNames[currentIndex] = newName;
    render();
  }

  // função que recebe o evento de digitação (keyup)
  function handleTyping(event) {
    // se a key pressionada for ENTER e não tiver espaço em branco (trim - remove espaços vazios)
    if (event.key === 'Enter' && event.target.value.trim() != '') {
      if (isEditing) {
        updateName(event.target.value);
        console.log('editing...');
      } else {
        insertName(event.target.value);
        console.log('inserting...');
      }
      isEditing = false;
      clearInput();
    }
  }

  // escutar/pegar o evento de digitação (keyup) no input e passar para a função handleTyping
  inputName.addEventListener('keyup', handleTyping);

  // sempre focar no inputName ao iniciar a página
  inputName.focus();
  inputName.textContent = ''; // limpar o input ao carregá-lo
}

// preventFormSubmit - Ao pressionar ENTER no <input> a página não irá mais ter um reload
function preventFormSubmit() {
  //  handleFormSubmit será executado apenas no escopo desta função (preventFormSubmit)
  function handleFormSubmit(event) {
    event.preventDefault(); // preventDefault - evita o comportamento padrão (recarregamento da página)
  }

  // pega a referencia do form (que está fazendo o reload)
  var form = document.querySelector('form'); // como temos apenas um form não é necessário informar a classe ou id
  form.addEventListener('submit', handleFormSubmit); // passa para o handleFormSubmit o evento de 'submit' - poderia haver outro evento além do submit
}

/** RENDERIZANDO OS NOMES NA TELA */

// Pegar os nomes que foram digitados e carregar na página, dentro do <span>
function render() {
  function createDeleteButton(index) {
    // conceito de closure do React - usar o parametro index da função externa
    function deleteName() {
      globalNames.splice(index, 1);
      render();
    }

    var button = document.createElement('button');
    button.classList.add('deleteButton');
    button.textContent = '-';

    button.addEventListener('click', deleteName);

    return button;
  }

  function createSpan(name, index) {
    function editItem() {
      inputName.value = name;
      inputName.focus();
      isEditing = true;
      currentIndex = index;
    }

    var span = document.createElement('span');
    span.textContent = name;
    span.classList.add('clickable');
    span.addEventListener('click', editItem);

    return span;
  }

  var divNames = document.querySelector('#names');
  divNames.innerHTML = '';

  var ul = document.createElement('ul');

  for (var i = 0; i < globalNames.length; i++) {
    var currentName = globalNames[i];

    var li = document.createElement('li');
    var button = createDeleteButton(i);
    var span = createSpan(currentName, i);

    li.appendChild(button);
    li.appendChild(span);
    ul.appendChild(li);
  }
  divNames.appendChild(ul); // divNames passa a ter <ul> como filho, que por sua vez já tem a <li> pronta
}

// limpar o texto do <input>
function clearInput() {
  inputName.value = '';
  inputName.focus();
}
