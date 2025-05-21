/*
IMPORTACOES
useState: hooks do react
io: funcao que conecta com o servidor WebSocket
socket: tipo de socket vindo do type script
*/

import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = () => {
    /*
    ESTADOS INTERNOS
    socket guarda instancia da conexao WebSocket
    isConnected: true ou false, se o usuario esta conectado ou nao no servidor
    messages: array de mensagens recebidas
    */
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  /*
  CONECTANDO AO SERVIDOR(USE EFFECT)
  Conecta ao servidor uma vez (porque o array de dependências está vazio).
    Escuta três eventos:
        'connect': define isConnected como true.
        'disconnect': define como false.
        'chat message': adiciona a nova mensagem no array messages.
    Armazena o socket na state.
    Ao desmontar o componente, desconecta do WebSocket.
  */
  useEffect(() => {
    const socketIo = io();

    socketIo.on('connect', () => {
      setIsConnected(true);
    });

    socketIo.on('disconnect', () => {
      setIsConnected(false);
    });

    socketIo.on('chat message', (msg: string) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    setSocket(socketIo);

    return () => {
      socketIo.disconnect();
    };
  }, []);

  /*
  Envia uma mensagem usando o evento 'chat message'
  */
  const sendMessage = (message: string) => {
    if (socket) {
      socket.emit('chat message', message);
    }
  };
/* 
isConnected: pode ser usado no front para mostrar "Conectado".
messages: lista de mensagens que chegaram.
sendMessage: função que envia mensagens.
*/
  return { isConnected, messages, sendMessage };
};
