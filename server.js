/*
IMPORTAÇÕES
CreateServer: cria um servidor HTTP básico
Parse: Converte a URL da requisição em um objeto
Next: Framework React para renderização SSR e rotas dinâmicas
Server(de socket.io): Permite comunicacao em tempo real com WebSockets
*/
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server } from 'socket.io';

/*
CONFIGURACOES DO AMBIENTE E DO APP NEXT
Dev: Verifica se estamos em ambiente de desenvolvimento
App: Inicializa a aplicação Next.js com a configuração de ambiente
Handle: Responsável por lidar com requisições HTTP do Next 
*/
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

/*
PREPARACAO DO APP NEXT + CRIACAO DO SERVIDOR
app.prepare(): Espera o Next.js se preparar antes de iniciar o servidor
CreateServer: Cria um servidor HTTP e define como lidar com as requisições
parsedUrl: Transforma a URL de requisição em um objeto para que o Next possa processa-la corretamente
*/
app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  /*
  SOCKET.IO CONECTADO AO SERVIDOR
    io: Cria uma isntância do Socket.io ligada ao servidor HTTP
    io.on(connection): Escuta conexoes de clientes via webSocket
    socket.on: Escuta os eventos enviados pelo cliente
    io.emit: Manda a mensagem para todos os clientes concetados
    socket.on(disconnect): Escuta o momento em que o cliente se disconecta
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