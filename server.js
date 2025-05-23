/*
IMPORTAÇÕES
import { createServer } from 'http'; -> Importa a funcao createServe da biblioteca nativa do Node.js chamada http. Esssa funcao e usada para criar um servidor HTTP básico para receber requisições HTTP (GET, POST etc..).
Essa linha de codigo é importante pois e necessario criar um servidor HTTP manualmente para que seja possivel adicionar a funcionalidade de webSocket nele.

import { parse } from 'url'; -> Importa a funcao parse do módulo nativo url do Node.js (Módulo e QUASE o mesmo que biblioteca).
Parse serve para criar uma URL em partes (rota, query params, protocolo, host, etc.).
Quando chega um requisição HTTP, voce pode usar parse(req.url, true) para transformar a URL em um objeto mais fácil de manipular.

import next from 'next'; -> Importa o proprio framework Next.js.
A função next inicializa a aplicação Next, em modo dev ou build
Permite criar o handler do Next.js que cuida de: renderizar paginas, atender APIs internas do next, entregar os assets do frontend
O que é o handle ou handler? ->  é uma funcao que processa todas as requisições HTTP que não são WebSocket é responsavel por direcionar a requisição para o lugar certo dentro do Next.js.

import { Server } from 'socket.io'; -> Importa a classe "Server" da biblioteca socket.io
Essa classe e responsavel por criar o servidor WebSocket

*/
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

/*
CONFIGURACOES DO AMBIENTE E DO APP NEXT

observação, porque todas as variaveis desse bloco de codigo estao sendo declaradas com o tipo "const"? -> Se trata de uma boa prática de declaração de variável. Const signfica, obviamente, o tipo constante. Uma variavel do tipo constante nenhuma outro valor pode ser atribuido a essa variavel.
Isso nao quer dizer que se trata de uma variavel imutavel, ela pode sofrer alterações internamente com funcoes proprias.

----------------------------------------------------------
const dev = process.env.NODE_ENV !== 'production'; -> Verifica se estamos rodando em modo desenvolvimento ou produção. Se estiver em produção dev, será false. Se estiver em desenvolvimento dev será true

Modo desenvolvimento x modo produção -> Modo desenvolvimento utilizado enquanto a aplicação esta sendo criada e conta com funcionalidades como: hot reload/refresh (atualizacao automatica de pagina) etc... Enquanto o modo production é o modo que o usuario final acessa a aplicação (deixa a experiencia melhor para o usuario como por exemplo, deixando o site mais rapido e etc)

process.env.NODE_ENV -> é uma variável de ambiente que será lida

O que é uma variável de ambiente?-> É uma informação que será lida que nao pertence a esse código. Armazena dados muitas vezes sensiveis como senhas de banco e etc. Alem da seguranca tambem e possivel adiciona-la em muitos ambientes -Aplicacoes-, ou seja, é flexivel
----------------------------------------------------------

const app = next({ dev }); -> A funcao next cria um instancia do servidor next.js, essa instancia prepara tudo que o servidor precisa para rodar. 
O argumento dev é passado para indicar que o servidor ira rodar no modo desenvolvimento.
Tudo isso é atribuido a variavel app.
----------------------------------------------------------

const handle = app.getRequestHandler(); -> O handle como dito previamente cuida das requisicoes HTTP.

O metodo getRequestHandler() retorna uma funcao que sabe processar qualquer requisição HTTP comum que chega ao servidor. Faz com que o nextJS cuide de qualquer requisição nao relacionada ao web socket

repare que o getRequestHandler() é um método advindo da variavel app.


*/
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/*
PREPARACAO DO APP NEXT + CRIACAO DO SERVIDOR

app.prepare().then(() => {...} ->

O metodo .prepare prepara internamente toda a aplicação, carrega rotasm paginasm rotas de API, assets e ambiente de desenvolvimento

O bloco de codigo dentro dessa função e onde o servidor HTTP e o socket.io são configurados
----------------------------------------------------------
const server = createServer((req, res) => {

Cria um servidor HTTP básico que consegue receber requisicoes e e enviar respostas, atribui o retorno da funcao a variavel server
----------------------------------------------------------const parsedUrl = parse(req.url, true); -> pega a url da requisicao e transforma ela em um objeto estruturado
----------------------------------------------------------
handle(req, res, parsedUrl);->
processa as requisicoes HTTP

*/
app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  /*
  SOCKET.IO CONECTADO AO SERVIDOR
  
  const io = new Server(server); ->
  a keyword new cria uma instancia de um objeto a partir de uma classe ou função construtora. Agora io e um objeto da classe Server
  
  O metodo construtor Server adiciona internamente o protocolo websocket sobre o servidor HTTP. Perceba que o que esta sendo passado como parametro é a variavel em que foi armazenada o servidor HTTP
  --------------------------------------------------------
  io.on('connection', (socket) => {

  O metodo .on é utilizado para escutar eventos

  estrutura do metodo .on
  emissor.on('nomeDoEvento', (dados) => {
  // Código que será executado quando o evento acontecer
  });

  no caso aqui estamos aguardando o evento de conexão

  Quando um cliente se conecta a funcao dentro do io.on é rodada

  

  */

  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('A client connected');

    socket.on('chat message', (msg) => {
      console.log('Message received:', msg);
      io.emit('chat message', msg); 
    });

    socket.on('disconnect', () => {
      console.log('A client disconnected');
    });
  });

  /* 
  INICIANDO O SERVIDOR
  server.listen() inicia o servidor na porta 3000 e mostra uma mensagem quando o servidor estiver rodando
  */
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});